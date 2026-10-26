/**
 * ClinikAPI Error Types
 *
 * Structured error handling with FHIR OperationOutcome awareness.
 *
 * SECURITY: The `diagnostics` field from FHIR OperationOutcome may contain PHI
 * (patient names, IDs, clinical data). The `sanitizeDiagnostics` function strips
 * common PHI patterns before they reach application logs or error tracking.
 */

/** Patterns that commonly appear in FHIR diagnostics containing PHI */
const PHI_PATTERNS = [
  // Email addresses
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  // Phone numbers (various formats)
  /(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  // SSN patterns
  /\b\d{3}-\d{2}-\d{4}\b/g,
  // Date of birth patterns (YYYY-MM-DD)
  /\b(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/g,
];

/**
 * Strip potential PHI from FHIR OperationOutcome diagnostics strings.
 * Replaces detected patterns with [REDACTED] to prevent PHI leaking into logs.
 */
function sanitizeDiagnostics(text: string | undefined): string | undefined {
  if (!text) return text;
  let sanitized = text;
  for (const pattern of PHI_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }
  // Truncate excessively long diagnostics that might contain embedded clinical data
  if (sanitized.length > 500) {
    sanitized = sanitized.slice(0, 500) + '... [truncated]';
  }
  return sanitized;
}

export interface ClinikErrorDetails {
  status: number;
  code: string;
  message: string;
  /** FHIR OperationOutcome issues — diagnostics are sanitized to strip potential PHI */
  issues?: Array<{
    severity: 'fatal' | 'error' | 'warning' | 'information';
    code: string;
    diagnostics?: string;
    location?: string[];
  }>;
}

export class ClinikApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly issues: ClinikErrorDetails['issues'];
  /** Server request ID for tracing — include this in support tickets */
  public readonly requestId?: string;

  constructor(details: ClinikErrorDetails & { requestId?: string }) {
    super(details.message);
    this.name = 'ClinikApiError';
    this.status = details.status;
    this.code = details.code;
    this.issues = details.issues;
    this.requestId = details.requestId;
  }
}

export class ClinikAuthError extends ClinikApiError {
  constructor(message = 'Unauthorized: Invalid or missing API key') {
    super({ status: 401, code: 'UNAUTHORIZED', message });
    this.name = 'ClinikAuthError';
  }
}

export class ClinikNotFoundError extends ClinikApiError {
  constructor(resourceType: string, id: string) {
    super({
      status: 404,
      code: 'NOT_FOUND',
      message: `${resourceType}/${id} not found`,
    });
    this.name = 'ClinikNotFoundError';
  }
}

export class ClinikValidationError extends ClinikApiError {
  constructor(message: string, issues?: ClinikErrorDetails['issues']) {
    super({ status: 422, code: 'VALIDATION_ERROR', message, issues });
    this.name = 'ClinikValidationError';
  }
}

export class ClinikRateLimitError extends ClinikApiError {
  /** Seconds the server asked us to wait (the Retry-After header), when it sent one. */
  public readonly retryAfter?: number;

  constructor(retryAfter?: number, details?: { message?: string; code?: string; requestId?: string }) {
    super({
      status: 429,
      code: details?.code || 'RATE_LIMITED',
      message: details?.message || 'Rate limit exceeded. Please retry later.',
      requestId: details?.requestId,
    });
    this.name = 'ClinikRateLimitError';
    this.retryAfter = retryAfter;
  }
}

/** 413 PAYLOAD_TOO_LARGE: the request body is over the gateway's 5 MB limit. Split it and send it in parts. */
export class ClinikPayloadTooLargeError extends ClinikApiError {
  constructor(message = 'Request body exceeds the size limit for this endpoint.', requestId?: string) {
    super({ status: 413, code: 'PAYLOAD_TOO_LARGE', message, requestId });
    this.name = 'ClinikPayloadTooLargeError';
  }
}

/** 402 PAYMENT_REQUIRED: billing for the project this key belongs to has stopped. Settle billing in the dashboard; retrying does not help. */
export class ClinikPaymentRequiredError extends ClinikApiError {
  constructor(message = 'Billing for this project has stopped', requestId?: string) {
    super({ status: 402, code: 'PAYMENT_REQUIRED', message, requestId });
    this.name = 'ClinikPaymentRequiredError';
  }
}

/** 503 PROJECT_PAUSED: the project is paused. Resume it in the dashboard; retrying does not help. */
export class ClinikProjectPausedError extends ClinikApiError {
  constructor(message = 'This project is paused', requestId?: string) {
    super({ status: 503, code: 'PROJECT_PAUSED', message, requestId });
    this.name = 'ClinikProjectPausedError';
  }
}

/** 503 PROJECT_NOT_READY: the project is still being set up or resized. Retry shortly. */
export class ClinikProjectNotReadyError extends ClinikApiError {
  constructor(message = 'This project is not ready yet', requestId?: string) {
    super({ status: 503, code: 'PROJECT_NOT_READY', message, requestId });
    this.name = 'ClinikProjectNotReadyError';
  }
}

/** Retry-After as seconds: a number of seconds, or an HTTP date. Undefined when absent or unreadable. */
export function parseRetryAfter(value: string | null | undefined, now: number = Date.now()): number | undefined {
  if (value === null || value === undefined) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  const at = Date.parse(trimmed);
  if (Number.isNaN(at)) return undefined;
  return Math.max(0, Math.ceil((at - now) / 1000));
}

/**
 * Parse an HTTP response into the appropriate ClinikApiError subclass.
 * SECURITY: Sanitizes FHIR OperationOutcome diagnostics to strip potential PHI.
 */
export async function parseErrorResponse(response: Response): Promise<ClinikApiError> {
  let body: any;
  try {
    body = await response.json();
  } catch {
    body = { message: response.statusText };
  }

  const message = body?.message || body?.error || response.statusText;
  const requestId = response.headers.get('x-request-id') || (typeof body?.requestId === 'string' ? body.requestId : undefined);

  // Sanitize FHIR OperationOutcome issues to prevent PHI leakage
  // The gateway's own validation answer uses `issues`; a FHIR passthrough OperationOutcome uses `issue`.
  const rawIssues = body?.issue ?? body?.issues;
  const issues = Array.isArray(rawIssues)
    ? rawIssues.map((issue: any) => ({
        ...issue,
        diagnostics: sanitizeDiagnostics(issue.diagnostics),
      }))
    : undefined;

  switch (response.status) {
    case 401:
      return new ClinikAuthError(message);
    case 404:
      return new ClinikApiError({ status: 404, code: 'NOT_FOUND', message, issues, requestId });
    case 422:
      return new ClinikValidationError(message, issues);
    case 413:
      return new ClinikPayloadTooLargeError(message || undefined, requestId);
    case 429:
      return new ClinikRateLimitError(parseRetryAfter(response.headers.get('Retry-After')), {
        message: typeof body?.message === 'string' ? body.message : undefined,
        code: typeof body?.code === 'string' ? body.code : undefined,
        requestId,
      });
    case 402:
      if (body?.code === 'PAYMENT_REQUIRED') return new ClinikPaymentRequiredError(message || undefined, requestId);
      break;
    case 503:
      if (body?.code === 'PROJECT_PAUSED') return new ClinikProjectPausedError(message || undefined, requestId);
      if (body?.code === 'PROJECT_NOT_READY') return new ClinikProjectNotReadyError(message || undefined, requestId);
      break;
  }
  switch (response.status) {
    default:
      return new ClinikApiError({
        status: response.status,
        code: body?.code || 'API_ERROR',
        message,
        issues,
        requestId,
      });
  }
}
