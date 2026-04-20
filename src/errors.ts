/**
 * ClinikAPI Error Types
 *
 * Structured error handling with FHIR OperationOutcome awareness.
 */

export interface ClinikErrorDetails {
  status: number;
  code: string;
  message: string;
  /** FHIR OperationOutcome issues, if the server returned them */
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
 */
export async function parseErrorResponse(response: Response): Promise<ClinikApiError> {
  let body: any;
  try {
    body = await response.json();
  } catch {
    body = { message: response.statusText };
  }

  const message = body?.message || body?.error || response.statusText;
  const issues = body?.issue; // FHIR OperationOutcome shape
  const requestId = response.headers.get('x-request-id') || undefined;

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
