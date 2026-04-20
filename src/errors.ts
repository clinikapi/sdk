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
  public readonly retryAfter?: number;

  constructor(retryAfter?: number) {
    super({
      status: 429,
      code: 'RATE_LIMITED',
      message: 'Rate limit exceeded. Please retry later.',
    });
    this.name = 'ClinikRateLimitError';
    this.retryAfter = retryAfter;
  }
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
  const requestId = response.headers.get('x-request-id') || undefined;

  // Sanitize FHIR OperationOutcome issues to prevent PHI leakage
  const rawIssues = body?.issue;
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
    case 429: {
      const retryAfter = response.headers.get('Retry-After');
      return new ClinikRateLimitError(retryAfter ? parseInt(retryAfter, 10) : undefined);
    }
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
