/**
 * @clinikapi/sdk — Server-Side Only
 *
 * Type-safe TypeScript client for the ClinikAPI healthcare infrastructure platform.
 * Wraps the REST API with developer-friendly abstractions over FHIR R4 resources.
 *
 * This SDK is designed for server-side use only (Node.js, Edge runtimes, server actions).
 * It authenticates with your secret API key — never expose it in client-side code.
 *
 * For client-side UI, use @clinikapi/react which communicates through your own backend proxy.
 */

// Re-export all types for consumers
export * from './types/base';
export * from './types/resources';
export * from './types/requests';
export * from './errors';

import type {
  Appointment,
  Consent,
  DiagnosticReport,
  Encounter,
  Medication,
  Observation,
  Patient,
  QuestionnaireResponse,
} from './types/resources';

import type {
  ApiResponse,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  ConsentSignRequest,
  ConsentUpdateRequest,
  EncounterCreateRequest,
  EncounterUpdateRequest,
  IntakeSubmitRequest,
  IntakeUpdateRequest,
  LabCreateRequest,
  LabUpdateRequest,
  MedicationCreateRequest,
  MedicationUpdateRequest,
  ObservationCreateRequest,
  ObservationUpdateRequest,
  PatientCreateRequest,
  PatientReadResponse,
  PatientSearchParams,
  PatientUpdateRequest,
  PaginatedResponse,
  ReadOptions,
  ResponseMeta,
} from './types/requests';

import { parseErrorResponse } from './errors';

// ---------------------------------------------------------------------------
// Client Options
// ---------------------------------------------------------------------------

export interface ClinikOptions {
  /** Override the API base URL (defaults to https://api.clinikehr.com) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Number of automatic retries on 5xx / network errors (default: 2) */
  retries?: number;
}

// ---------------------------------------------------------------------------
// Clinik Client (Server-Side Only)
// ---------------------------------------------------------------------------

export class Clinik {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  /**
   * Initialize the ClinikAPI client with your secret API key.
   *
   * Use this in server-side code only — API routes, server actions, backend services.
   * Never expose your API key in client-side bundles.
   *
   * @example
   * ```ts
   * import { Clinik } from '@clinikapi/sdk';
   * const clinik = new Clinik(process.env.CLINIKAPI_SECRET_KEY!);
   * ```
   */
  constructor(apiKey: string, options?: ClinikOptions) {
    if (!apiKey) throw new Error('ClinikAPI: apiKey is required');

    // SECURITY: Warn if SDK is being used in a browser environment
    if (typeof window !== 'undefined' && typeof process === 'undefined') {
      console.warn(
        '[ClinikAPI] WARNING: The SDK is being used in a browser environment. ' +
        'This will expose your secret API key. Use @clinikapi/react for client-side code.'
      );
    }

    this.apiKey = apiKey;
    this.baseUrl = (options?.baseUrl || 'https://api.clinikehr.com').replace(/\/+$/, '');
    this.timeout = options?.timeout ?? 30_000;
    this.maxRetries = options?.retries ?? 2;

    // SECURITY: Validate baseUrl is HTTPS in production
    if (!this.baseUrl.startsWith('https://') && !this.baseUrl.startsWith('http://localhost')) {
      console.warn(
        '[ClinikAPI] WARNING: baseUrl is not using HTTPS. ' +
        'API keys and PHI will be transmitted in plaintext.'
      );
    }
  }

  // -------------------------------------------------------------------------
  // Internal HTTP helpers
  // -------------------------------------------------------------------------

  private extractMeta(response: Response): ResponseMeta {
    return {
      requestId: response.headers.get('x-request-id') || '',
      timestamp: response.headers.get('x-timestamp') || new Date().toISOString(),
      status: response.status,
      rateLimitTotal: this.parseIntHeader(response, 'x-ratelimit-limit'),
      rateLimitRemaining: this.parseIntHeader(response, 'x-ratelimit-remaining'),
      rateLimitReset: this.parseIntHeader(response, 'x-ratelimit-reset'),
    };
  }

  private parseIntHeader(response: Response, name: string): number | undefined {
    const val = response.headers.get(name);
    return val ? parseInt(val, 10) : undefined;
  }

  /** Max request body size in bytes (1MB). Prevents accidental OOM from circular or massive objects. */
  private static readonly MAX_BODY_SIZE = 1_048_576;

  /**
   * Compute retry backoff with jitter to prevent thundering herd.
   * Uses "full jitter" strategy: random value between 0 and the exponential cap.
   */
  private computeBackoff(attempt: number): number {
    const exponentialCap = Math.min(1000 * 2 ** attempt, 10_000);
    return Math.floor(Math.random() * exponentialCap);
  }

  /**
   * Safely serialize a request body with size validation.
   * Catches circular references and enforces a max payload size.
   */
  private serializeBody(body: unknown): string {
    let serialized: string;
    try {
      serialized = JSON.stringify(body);
    } catch (err) {
      throw new Error(
        'ClinikAPI: Failed to serialize request body. ' +
        'Ensure the payload is a plain JSON-serializable object with no circular references.'
      );
    }
    if (serialized.length > Clinik.MAX_BODY_SIZE) {
      throw new Error(
        `ClinikAPI: Request body exceeds maximum size of ${Clinik.MAX_BODY_SIZE} bytes ` +
        `(got ${serialized.length} bytes). Reduce the payload size.`
      );
    }
    return serialized;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    // Pre-serialize body once (validates size + catches circular refs before any network call)
    const serializedBody = body !== undefined ? this.serializeBody(body) : undefined;

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);

      try {
        const headers: Record<string, string> = {
          'x-api-key': this.apiKey,
          'Accept': 'application/fhir+json',
        };

        if (serializedBody) {
          headers['Content-Type'] = method === 'PATCH'
            ? 'application/json-patch+json'
            : 'application/fhir+json';
        }

        const response = await fetch(`${this.baseUrl}${path}`, {
          method,
          headers,
          body: serializedBody,
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (!response.ok) {
          const error = await parseErrorResponse(response);
          if (attempt < this.maxRetries && (response.status >= 500 || response.status === 429)) {
            lastError = error;
            await new Promise(r => setTimeout(r, this.computeBackoff(attempt)));
            continue;
          }
          throw error;
        }

        const meta = this.extractMeta(response);
        if (response.status === 204) {
          return { data: undefined as T, meta };
        }
        const data = await response.json() as T;
        return { data, meta };
      } catch (err: any) {
        // Always clear the timer to prevent leaks, even on error paths
        clearTimeout(timer);

        if (err.name === 'AbortError') {
          lastError = new Error(`ClinikAPI: Request timed out after ${this.timeout}ms`);
        } else if (err.name?.startsWith('Clinik')) {
          throw err;
        } else {
          lastError = err;
        }
        if (attempt < this.maxRetries) {
          await new Promise(r => setTimeout(r, this.computeBackoff(attempt)));
          continue;
        }
      }
    }
    throw lastError ?? new Error('ClinikAPI: Unknown error');
  }

  private buildQuery(params: Record<string, unknown>): string {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        qs.append(key, String(value));
      }
    }
    const str = qs.toString();
    return str ? `?${str}` : '';
  }

  /**
   * SECURITY: Sanitize resource IDs to prevent path traversal and injection.
   * IDs must be alphanumeric with hyphens, underscores, and dots only.
   */
  private sanitizeId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new Error('ClinikAPI: Resource ID is required and must be a string');
    }
    // Strip any path traversal attempts and restrict to safe characters
    const sanitized = id.replace(/[^a-zA-Z0-9\-_.]/g, '');
    if (sanitized !== id) {
      throw new Error(`ClinikAPI: Invalid resource ID "${id}" — IDs may only contain alphanumeric characters, hyphens, underscores, and dots`);
    }
    if (sanitized.length === 0 || sanitized.length > 128) {
      throw new Error('ClinikAPI: Resource ID must be between 1 and 128 characters');
    }
    return sanitized;
  }

  /**
   * SECURITY: Sanitize FHIR _include / _revinclude values to prevent injection.
   * Include values must match the pattern "ResourceType:field".
   */
  private sanitizeInclude(value: string): string {
    if (!/^[A-Za-z]+(?::[A-Za-z]+)?$/.test(value)) {
      throw new Error(`ClinikAPI: Invalid include value "${value}" — must be a FHIR resource type or ResourceType:field`);
    }
    return value;
  }

  // -------------------------------------------------------------------------
  // patients
  // -------------------------------------------------------------------------

  public patients = {
    create: async (data: PatientCreateRequest): Promise<ApiResponse<Patient>> => {
      return this.request<Patient>('POST', '/v1/patients', data);
    },

    read: async (id: string, options?: ReadOptions): Promise<ApiResponse<PatientReadResponse>> => {
      const safeId = this.sanitizeId(id);
      const params = new URLSearchParams();
      if (options?.include) {
        options.include.forEach(inc => {
          const safeInc = this.sanitizeInclude(inc);
          params.append('_revinclude', `${safeInc}:subject`);
          params.append('_revinclude', `${safeInc}:patient`);
        });
      }
      const qs = params.toString() ? `?${params.toString()}` : '';
      const response = await this.request<any>('GET', `/v1/patients/${safeId}${qs}`);
      return { data: this.destructurePatientBundle(response.data), meta: response.meta };
    },

    update: async (id: string, data: PatientUpdateRequest): Promise<ApiResponse<Patient>> => {
      return this.request<Patient>('PATCH', `/v1/patients/${this.sanitizeId(id)}`, data);
    },

    search: async (params?: PatientSearchParams): Promise<ApiResponse<PaginatedResponse<Patient>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Patient>>('GET', `/v1/patients${qs}`);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/patients/${this.sanitizeId(id)}`);
    },
  };

  private destructurePatientBundle(raw: any): PatientReadResponse {
    const result: PatientReadResponse = {
      patient: undefined as unknown as Patient,
      encounters: [],
      observations: [],
      medications: [],
      appointments: [],
      intakes: [],
      consents: [],
      labs: [],
    };

    if (raw.resourceType === 'Bundle' && raw.entry) {
      for (const entry of raw.entry) {
        const resource = entry.resource;
        if (!resource) continue;
        switch (resource.resourceType) {
          case 'Patient': result.patient = resource; break;
          case 'Encounter': result.encounters.push(resource); break;
          case 'Observation': result.observations.push(resource); break;
          case 'Medication': result.medications.push(resource); break;
          case 'Appointment': result.appointments.push(resource); break;
          case 'QuestionnaireResponse': result.intakes.push(resource); break;
          case 'Consent': result.consents.push(resource); break;
          case 'DiagnosticReport': result.labs.push(resource); break;
        }
      }
    } else if (raw.resourceType === 'Patient') {
      result.patient = raw;
    }
    return result;
  }

  // -------------------------------------------------------------------------
  // encounters
  // -------------------------------------------------------------------------

  public encounters = {
    create: async (data: EncounterCreateRequest): Promise<ApiResponse<Encounter>> => {
      return this.request<Encounter>('POST', '/v1/encounters', data);
    },
    read: async (id: string, options?: ReadOptions): Promise<ApiResponse<Encounter>> => {
      const qs = options?.include
        ? this.buildQuery(Object.fromEntries(options.include.map(i => [`_include`, `Encounter:${this.sanitizeInclude(i)}`])))
        : '';
      return this.request<Encounter>('GET', `/v1/encounters/${this.sanitizeId(id)}${qs}`);
    },
    update: async (id: string, data: EncounterUpdateRequest): Promise<ApiResponse<Encounter>> => {
      return this.request<Encounter>('PATCH', `/v1/encounters/${this.sanitizeId(id)}`, data);
    },
  };

  // -------------------------------------------------------------------------
  // observations
  // -------------------------------------------------------------------------

  public observations = {
    create: async (data: ObservationCreateRequest): Promise<ApiResponse<Observation>> => {
      return this.request<Observation>('POST', '/v1/observations', data);
    },
    read: async (id: string, options?: ReadOptions): Promise<ApiResponse<Observation>> => {
      const qs = options?.include
        ? this.buildQuery(Object.fromEntries(options.include.map(i => [`_include`, `Observation:${this.sanitizeInclude(i)}`])))
        : '';
      return this.request<Observation>('GET', `/v1/observations/${this.sanitizeId(id)}${qs}`);
    },
    update: async (id: string, data: ObservationUpdateRequest): Promise<ApiResponse<Observation>> => {
      return this.request<Observation>('PATCH', `/v1/observations/${this.sanitizeId(id)}`, data);
    },
  };

  // -------------------------------------------------------------------------
  // medications
  // -------------------------------------------------------------------------

  public medications = {
    create: async (data: MedicationCreateRequest): Promise<ApiResponse<Medication>> => {
      return this.request<Medication>('POST', '/v1/medications', data);
    },
    read: async (id: string): Promise<ApiResponse<Medication>> => {
      return this.request<Medication>('GET', `/v1/medications/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: MedicationUpdateRequest): Promise<ApiResponse<Medication>> => {
      return this.request<Medication>('PATCH', `/v1/medications/${this.sanitizeId(id)}`, data);
    },
  };

  // -------------------------------------------------------------------------
  // appointments
  // -------------------------------------------------------------------------

  public appointments = {
    create: async (data: AppointmentCreateRequest): Promise<ApiResponse<Appointment>> => {
      return this.request<Appointment>('POST', '/v1/appointments', data);
    },
    read: async (id: string, options?: ReadOptions): Promise<ApiResponse<Appointment>> => {
      const qs = options?.include
        ? this.buildQuery(Object.fromEntries(options.include.map(i => [`_include`, `Appointment:${this.sanitizeInclude(i)}`])))
        : '';
      return this.request<Appointment>('GET', `/v1/appointments/${this.sanitizeId(id)}${qs}`);
    },
    update: async (id: string, data: AppointmentUpdateRequest): Promise<ApiResponse<Appointment>> => {
      return this.request<Appointment>('PATCH', `/v1/appointments/${this.sanitizeId(id)}`, data);
    },
  };

  // -------------------------------------------------------------------------
  // intakes (QuestionnaireResponse)
  // -------------------------------------------------------------------------

  public intakes = {
    submit: async (data: IntakeSubmitRequest): Promise<ApiResponse<QuestionnaireResponse>> => {
      return this.request<QuestionnaireResponse>('POST', '/v1/intakes', data);
    },
    read: async (id: string): Promise<ApiResponse<QuestionnaireResponse>> => {
      return this.request<QuestionnaireResponse>('GET', `/v1/intakes/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: IntakeUpdateRequest): Promise<ApiResponse<QuestionnaireResponse>> => {
      return this.request<QuestionnaireResponse>('PATCH', `/v1/intakes/${this.sanitizeId(id)}`, data);
    },
  };

  // -------------------------------------------------------------------------
  // consents
  // -------------------------------------------------------------------------

  public consents = {
    sign: async (data: ConsentSignRequest): Promise<ApiResponse<Consent>> => {
      return this.request<Consent>('POST', '/v1/consents', data);
    },
    read: async (id: string): Promise<ApiResponse<Consent>> => {
      return this.request<Consent>('GET', `/v1/consents/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ConsentUpdateRequest): Promise<ApiResponse<Consent>> => {
      return this.request<Consent>('PATCH', `/v1/consents/${this.sanitizeId(id)}`, data);
    },
  };

  // -------------------------------------------------------------------------
  // labs (DiagnosticReport)
  // -------------------------------------------------------------------------

  public labs = {
    create: async (data: LabCreateRequest): Promise<ApiResponse<DiagnosticReport>> => {
      return this.request<DiagnosticReport>('POST', '/v1/labs', data);
    },
    read: async (id: string, options?: ReadOptions): Promise<ApiResponse<DiagnosticReport>> => {
      const qs = options?.include
        ? this.buildQuery(Object.fromEntries(options.include.map(i => [`_include`, `DiagnosticReport:${this.sanitizeInclude(i)}`])))
        : '';
      return this.request<DiagnosticReport>('GET', `/v1/labs/${this.sanitizeId(id)}${qs}`);
    },
    update: async (id: string, data: LabUpdateRequest): Promise<ApiResponse<DiagnosticReport>> => {
      return this.request<DiagnosticReport>('PATCH', `/v1/labs/${this.sanitizeId(id)}`, data);
    },
  };
}
