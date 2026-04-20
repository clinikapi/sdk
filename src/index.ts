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
    this.apiKey = apiKey;
    this.baseUrl = (options?.baseUrl || 'https://api.clinikehr.com').replace(/\/+$/, '');
    this.timeout = options?.timeout ?? 30_000;
    this.maxRetries = options?.retries ?? 2;
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

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);

        const headers: Record<string, string> = {
          'x-api-key': this.apiKey,
          'Accept': 'application/fhir+json',
        };

        if (body) {
          headers['Content-Type'] = method === 'PATCH'
            ? 'application/json-patch+json'
            : 'application/fhir+json';
        }

        const response = await fetch(`${this.baseUrl}${path}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (!response.ok) {
          const error = await parseErrorResponse(response);
          if (attempt < this.maxRetries && (response.status >= 500 || response.status === 429)) {
            lastError = error;
            const backoff = Math.min(1000 * 2 ** attempt, 10_000);
            await new Promise(r => setTimeout(r, backoff));
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
        if (err.name === 'AbortError') {
          lastError = new Error(`ClinikAPI: Request timed out after ${this.timeout}ms`);
        } else if (err.name?.startsWith('Clinik')) {
          throw err;
        } else {
          lastError = err;
        }
        if (attempt < this.maxRetries) {
          const backoff = Math.min(1000 * 2 ** attempt, 10_000);
          await new Promise(r => setTimeout(r, backoff));
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

  // -------------------------------------------------------------------------
  // patients
  // -------------------------------------------------------------------------

  public patients = {
    create: async (data: PatientCreateRequest): Promise<ApiResponse<Patient>> => {
      return this.request<Patient>('POST', '/v1/patients', data);
    },

    read: async (id: string, options?: ReadOptions): Promise<ApiResponse<PatientReadResponse>> => {
      const params = new URLSearchParams();
      if (options?.include) {
        options.include.forEach(inc => {
          params.append('_revinclude', `${inc}:subject`);
          params.append('_revinclude', `${inc}:patient`);
        });
      }
      const qs = params.toString() ? `?${params.toString()}` : '';
      const response = await this.request<any>('GET', `/v1/patients/${id}${qs}`);
      return { data: this.destructurePatientBundle(response.data), meta: response.meta };
    },

    update: async (id: string, data: PatientUpdateRequest): Promise<ApiResponse<Patient>> => {
      return this.request<Patient>('PATCH', `/v1/patients/${id}`, data);
    },

    search: async (params?: PatientSearchParams): Promise<ApiResponse<PaginatedResponse<Patient>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Patient>>('GET', `/v1/patients${qs}`);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/patients/${id}`);
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
        ? this.buildQuery(Object.fromEntries(options.include.map(i => [`_include`, `Encounter:${i}`])))
        : '';
      return this.request<Encounter>('GET', `/v1/encounters/${id}${qs}`);
    },
    update: async (id: string, data: EncounterUpdateRequest): Promise<ApiResponse<Encounter>> => {
      return this.request<Encounter>('PATCH', `/v1/encounters/${id}`, data);
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
        ? this.buildQuery(Object.fromEntries(options.include.map(i => [`_include`, `Observation:${i}`])))
        : '';
      return this.request<Observation>('GET', `/v1/observations/${id}${qs}`);
    },
    update: async (id: string, data: ObservationUpdateRequest): Promise<ApiResponse<Observation>> => {
      return this.request<Observation>('PATCH', `/v1/observations/${id}`, data);
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
      return this.request<Medication>('GET', `/v1/medications/${id}`);
    },
    update: async (id: string, data: MedicationUpdateRequest): Promise<ApiResponse<Medication>> => {
      return this.request<Medication>('PATCH', `/v1/medications/${id}`, data);
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
        ? this.buildQuery(Object.fromEntries(options.include.map(i => [`_include`, `Appointment:${i}`])))
        : '';
      return this.request<Appointment>('GET', `/v1/appointments/${id}${qs}`);
    },
    update: async (id: string, data: AppointmentUpdateRequest): Promise<ApiResponse<Appointment>> => {
      return this.request<Appointment>('PATCH', `/v1/appointments/${id}`, data);
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
      return this.request<QuestionnaireResponse>('GET', `/v1/intakes/${id}`);
    },
    update: async (id: string, data: IntakeUpdateRequest): Promise<ApiResponse<QuestionnaireResponse>> => {
      return this.request<QuestionnaireResponse>('PATCH', `/v1/intakes/${id}`, data);
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
      return this.request<Consent>('GET', `/v1/consents/${id}`);
    },
    update: async (id: string, data: ConsentUpdateRequest): Promise<ApiResponse<Consent>> => {
      return this.request<Consent>('PATCH', `/v1/consents/${id}`, data);
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
        ? this.buildQuery(Object.fromEntries(options.include.map(i => [`_include`, `DiagnosticReport:${i}`])))
        : '';
      return this.request<DiagnosticReport>('GET', `/v1/labs/${id}${qs}`);
    },
    update: async (id: string, data: LabUpdateRequest): Promise<ApiResponse<DiagnosticReport>> => {
      return this.request<DiagnosticReport>('PATCH', `/v1/labs/${id}`, data);
    },
  };
}
