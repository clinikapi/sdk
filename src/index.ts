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
  ClinicalImpression,
  Composition,
  Consent,
  DiagnosticReport,
  DocumentReference,
  Encounter,
  Medication,
  MedicationRequest,
  Observation,
  Patient,
  Practitioner,
  PractitionerRole,
  QuestionnaireResponse,
  AppointmentResponse,
  Task,
  Slot,
  Organization,
  Account,
  HealthcareService,
  ServiceRequest,
  Location,
  Schedule,
  Person,
  FamilyMemberHistory,
  CarePlan,
  Immunization,
  Claim,
  ClaimResponse,
  AllergyIntolerance,
  CareTeam,
  Condition,
  ChargeItem,
  Coverage,
  CoverageEligibilityRequest,
  CoverageEligibilityResponse,
  ExplanationOfBenefit,
  Device,
  DeviceRequest,
  DeviceUseStatement,
  Goal,
  Invoice,
  MedicationDispense,
  MedicationKnowledge,
  MedicationStatement,
  PaymentNotice,
  PaymentReconciliation,
  Specimen,
  ImagingStudy,
  EnrollmentRequest,
  EnrollmentResponse,
  ImmunizationEvaluation,
  Media,
  ActivityDefinition,
  NutritionOrder,
  PlanDefinition,
  VisionPrescription,
  RiskAssessment,
  AuditEvent,
  Measure,
  MeasureReport,
  ImmunizationRecommendation,
} from './types/resources';

import type {
  ApiResponse,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  AssessmentCreateRequest,
  AssessmentUpdateRequest,
  AssessmentSearchParams,
  ConsentSignRequest,
  ConsentUpdateRequest,
  DocumentCreateRequest,
  DocumentUpdateRequest,
  DocumentSearchParams,
  EncounterCreateRequest,
  EncounterUpdateRequest,
  IntakeSubmitRequest,
  IntakeUpdateRequest,
  LabCreateRequest,
  LabUpdateRequest,
  MedicationCreateRequest,
  MedicationUpdateRequest,
  NoteCreateRequest,
  NoteUpdateRequest,
  NoteSearchParams,
  ObservationCreateRequest,
  ObservationUpdateRequest,
  PatientCreateRequest,
  PatientReadResponse,
  PatientSummary,
  PatientSearchParams,
  PatientUpdateRequest,
  PaginatedResponse,
  PractitionerCreateRequest,
  PractitionerUpdateRequest,
  PractitionerSearchParams,
  PractitionerRoleCreateRequest,
  PractitionerRoleUpdateRequest,
  PrescriptionCreateRequest,
  PrescriptionUpdateRequest,
  PrescriptionSearchParams,
  ReadOptions,
  ResourceSearchParams,
  ResponseMeta,
  AppointmentResponseCreateRequest,
  AppointmentResponseUpdateRequest,
  AppointmentResponseSearchParams,
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskSearchParams,
  SlotCreateRequest,
  SlotUpdateRequest,
  SlotSearchParams,
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
  OrganizationSearchParams,
  AccountCreateRequest,
  AccountUpdateRequest,
  AccountSearchParams,
  HealthcareServiceCreateRequest,
  HealthcareServiceUpdateRequest,
  HealthcareServiceSearchParams,
  ServiceRequestCreateRequest,
  ServiceRequestUpdateRequest,
  ServiceRequestSearchParams,
  LocationCreateRequest,
  LocationUpdateRequest,
  LocationSearchParams,
  ScheduleCreateRequest,
  ScheduleUpdateRequest,
  ScheduleSearchParams,
  PersonCreateRequest,
  PersonUpdateRequest,
  PersonSearchParams,
  FamilyMemberHistoryCreateRequest,
  FamilyMemberHistoryUpdateRequest,
  FamilyMemberHistorySearchParams,
  CarePlanCreateRequest,
  CarePlanUpdateRequest,
  CarePlanSearchParams,
  ImmunizationCreateRequest,
  ImmunizationUpdateRequest,
  ImmunizationSearchParams,
  ClaimCreateRequest,
  ClaimUpdateRequest,
  ClaimSearchParams,
  ClaimResponseCreateRequest,
  ClaimResponseUpdateRequest,
  ClaimResponseSearchParams,
  AllergyIntoleranceCreateRequest,
  AllergyIntoleranceUpdateRequest,
  AllergyIntoleranceSearchParams,
  CareTeamCreateRequest,
  CareTeamUpdateRequest,
  CareTeamSearchParams,
  ConditionCreateRequest,
  ConditionUpdateRequest,
  ConditionSearchParams,
  ChargeItemCreateRequest,
  ChargeItemUpdateRequest,
  ChargeItemSearchParams,
  CoverageCreateRequest,
  CoverageUpdateRequest,
  CoverageSearchParams,
  EligibilityRequestCreateRequest,
  EligibilityRequestUpdateRequest,
  EligibilityRequestSearchParams,
  EligibilityResponseCreateRequest,
  EligibilityResponseUpdateRequest,
  EligibilityResponseSearchParams,
  EOBCreateRequest,
  EOBUpdateRequest,
  EOBSearchParams,
  DeviceCreateRequest,
  DeviceUpdateRequest,
  DeviceSearchParams,
  DeviceRequestCreateRequest,
  DeviceRequestUpdateRequest,
  DeviceRequestSearchParams,
  DeviceUseStatementCreateRequest,
  DeviceUseStatementUpdateRequest,
  DeviceUseStatementSearchParams,
  GoalCreateRequest,
  GoalUpdateRequest,
  GoalSearchParams,
  InvoiceCreateRequest,
  InvoiceUpdateRequest,
  InvoiceSearchParams,
  MedicationDispenseCreateRequest,
  MedicationDispenseUpdateRequest,
  MedicationDispenseSearchParams,
  MedicationKnowledgeCreateRequest,
  MedicationKnowledgeUpdateRequest,
  MedicationKnowledgeSearchParams,
  MedicationStatementCreateRequest,
  MedicationStatementUpdateRequest,
  MedicationStatementSearchParams,
  PaymentNoticeCreateRequest,
  PaymentNoticeUpdateRequest,
  PaymentNoticeSearchParams,
  PaymentReconciliationCreateRequest,
  PaymentReconciliationUpdateRequest,
  PaymentReconciliationSearchParams,
  SpecimenCreateRequest,
  SpecimenUpdateRequest,
  SpecimenSearchParams,
  ImagingStudyCreateRequest,
  ImagingStudyUpdateRequest,
  ImagingStudySearchParams,
  EnrollmentRequestCreateRequest,
  EnrollmentRequestUpdateRequest,
  EnrollmentRequestSearchParams,
  EnrollmentResponseCreateRequest,
  EnrollmentResponseUpdateRequest,
  EnrollmentResponseSearchParams,
  ImmunizationEvaluationCreateRequest,
  ImmunizationEvaluationUpdateRequest,
  ImmunizationEvaluationSearchParams,
  MediaCreateRequest,
  MediaUpdateRequest,
  MediaSearchParams,
  ActivityDefinitionCreateRequest,
  ActivityDefinitionUpdateRequest,
  ActivityDefinitionSearchParams,
  NutritionOrderCreateRequest,
  NutritionOrderUpdateRequest,
  NutritionOrderSearchParams,
  PlanDefinitionCreateRequest,
  PlanDefinitionUpdateRequest,
  PlanDefinitionSearchParams,
  VisionPrescriptionCreateRequest,
  VisionPrescriptionUpdateRequest,
  VisionPrescriptionSearchParams,
  RiskAssessmentCreateRequest,
  RiskAssessmentUpdateRequest,
  RiskAssessmentSearchParams,
  AuditEventCreateRequest,
  AuditEventUpdateRequest,
  AuditEventSearchParams,
  MeasureCreateRequest,
  MeasureUpdateRequest,
  MeasureSearchParams,
  MeasureReportCreateRequest,
  MeasureReportUpdateRequest,
  MeasureReportSearchParams,
  ImmunizationRecommendationCreateRequest,
  ImmunizationRecommendationUpdateRequest,
  ImmunizationRecommendationSearchParams,
} from './types/requests';

import { parseErrorResponse } from './errors';

// ---------------------------------------------------------------------------
// Client Options
// ---------------------------------------------------------------------------

export interface ClinikOptions {
  /** Override the API base URL (defaults to https://api.clinikapi.com) */
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
    this.baseUrl = (options?.baseUrl || 'https://api.clinikapi.com').replace(/\/+$/, '');
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
        const body = await response.json() as unknown;
        // Every /v1 REST response wraps its payload in an envelope:
        //   { "data": <resource | { data: [...], hasMore, total? }> }
        // Unwrap it so ApiResponse.data IS the typed payload (patient objects,
        // PaginatedResponse lists, read-bundles). The raw FHIR passthrough
        // (/v1/fhir/*) returns bare FHIR resources — those carry a
        // resourceType and are passed through untouched, which also protects
        // FHIR types with a literal `data` field (e.g. Binary).
        const data =
          body !== null &&
          typeof body === 'object' &&
          !Array.isArray(body) &&
          'data' in body &&
          (body as { resourceType?: unknown }).resourceType === undefined
            ? (body as { data: unknown }).data
            : body;
        return { data: data as T, meta };
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
  // fhir (raw FHIR escape hatch)
  // -------------------------------------------------------------------------

  /**
   * Raw FHIR R4 escape hatch.
   *
   * Use this when the simplified SDK methods don't cover your use case.
   * Sends requests directly to the ClinikAPI FHIR gateway with your tenant
   * context automatically applied (tenant tag injection + isolation).
   *
   * The path should be a FHIR resource path (e.g. '/Patient', '/Observation/123').
   * Do NOT include '/v1/' prefix — this goes directly to the FHIR layer.
   *
   * @example
   * // Create a raw FHIR resource
   * const { data } = await clinik.fhir.request('POST', '/Patient', {
   *   resourceType: 'Patient',
   *   name: [{ family: 'Smith', given: ['John'] }],
   *   gender: 'male',
   *   birthDate: '1990-01-15'
   * });
   *
   * @example
   * // Search with custom FHIR parameters
   * const { data } = await clinik.fhir.request('GET', '/Observation?code=8867-4&date=ge2024-01-01');
   *
   * @example
   * // Execute a FHIR operation
   * const { data } = await clinik.fhir.request('POST', '/Patient/$everything', { id: 'pt_123' });
   */
  public fhir = {
    request: async <T = any>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> => {
      // Validate method
      const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      if (!allowedMethods.includes(method.toUpperCase())) {
        throw new Error(`ClinikAPI: Invalid HTTP method "${method}". Allowed: ${allowedMethods.join(', ')}`);
      }

      // Ensure path starts with /
      const fhirPath = path.startsWith('/') ? path : `/${path}`;

      return this.request<T>(method.toUpperCase(), `/v1/fhir${fhirPath}`, body);
    },
  };

  // -------------------------------------------------------------------------
  // patients
  // -------------------------------------------------------------------------

  public patients = {
    create: async (data: PatientCreateRequest): Promise<ApiResponse<PatientSummary>> => {
      return this.request<PatientSummary>('POST', '/v1/patients', data);
    },

    /**
     * Read one patient.
     *
     * The two call shapes hit genuinely different endpoints, so they return
     * different things and the overloads say so:
     *
     * - `read(id)` → a `PatientSummary`. A true read-by-id: immediately
     *   consistent, so a patient created a moment ago is already readable.
     * - `read(id, { include })` → a destructured FHIR bundle. `_revinclude`
     *   makes this a SEARCH, and HealthLake's search index lags writes by
     *   ~10s, so a just-created patient can come back empty here. Fall back to
     *   `read(id)` when that matters.
     */
    read: (async (id: string, options?: ReadOptions): Promise<ApiResponse<any>> => {
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

      // Without _revinclude the API returns the simplified patient, not a
      // Bundle — running it through destructurePatientBundle used to yield
      // `{ patient: undefined }` and silently break every no-include read.
      if (!qs) {
        return { data: response.data as PatientSummary, meta: response.meta };
      }
      return { data: this.destructurePatientBundle(response.data), meta: response.meta };
    }) as {
      (id: string): Promise<ApiResponse<PatientSummary>>;
      (id: string, options: ReadOptions): Promise<ApiResponse<PatientReadResponse>>;
    },

    update: async (id: string, data: PatientUpdateRequest): Promise<ApiResponse<PatientSummary>> => {
      return this.request<PatientSummary>('PATCH', `/v1/patients/${this.sanitizeId(id)}`, data);
    },

    search: async (params?: PatientSearchParams): Promise<ApiResponse<PaginatedResponse<PatientSummary>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<PatientSummary>>('GET', `/v1/patients${qs}`);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/patients/${this.sanitizeId(id)}`);
    },
  };

  // -------------------------------------------------------------------------
  // practitioners
  // -------------------------------------------------------------------------

  public practitioners = {
    create: async (data: PractitionerCreateRequest): Promise<ApiResponse<Practitioner>> => {
      return this.request<Practitioner>('POST', '/v1/practitioners', data);
    },
    read: async (id: string): Promise<ApiResponse<Practitioner>> => {
      return this.request<Practitioner>('GET', `/v1/practitioners/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: PractitionerUpdateRequest): Promise<ApiResponse<Practitioner>> => {
      return this.request<Practitioner>('PATCH', `/v1/practitioners/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/practitioners/${this.sanitizeId(id)}`);
    },
    search: async (params?: PractitionerSearchParams): Promise<ApiResponse<PaginatedResponse<Practitioner>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Practitioner>>('GET', `/v1/practitioners${qs}`);
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
      prescriptions: [],
      notes: [],
      assessments: [],
      documents: [],
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
          case 'MedicationRequest': result.prescriptions.push(resource); break;
          case 'DocumentReference': result.notes.push(resource); break;
          case 'ClinicalImpression': result.assessments.push(resource); break;
          case 'Composition': result.documents.push(resource); break;
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
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/encounters/${this.sanitizeId(id)}`);
    },
    search: async (params?: ResourceSearchParams): Promise<ApiResponse<PaginatedResponse<Encounter>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Encounter>>('GET', `/v1/encounters${qs}`);
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
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/observations/${this.sanitizeId(id)}`);
    },
    search: async (params?: ResourceSearchParams): Promise<ApiResponse<PaginatedResponse<Observation>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Observation>>('GET', `/v1/observations${qs}`);
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
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/medications/${this.sanitizeId(id)}`);
    },
    search: async (params?: ResourceSearchParams): Promise<ApiResponse<PaginatedResponse<Medication>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Medication>>('GET', `/v1/medications${qs}`);
    },
  };  // -------------------------------------------------------------------------
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
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/appointments/${this.sanitizeId(id)}`);
    },
    search: async (params?: ResourceSearchParams): Promise<ApiResponse<PaginatedResponse<Appointment>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Appointment>>('GET', `/v1/appointments${qs}`);
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
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/intakes/${this.sanitizeId(id)}`);
    },
    search: async (params?: ResourceSearchParams): Promise<ApiResponse<PaginatedResponse<QuestionnaireResponse>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<QuestionnaireResponse>>('GET', `/v1/intakes${qs}`);
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
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/consents/${this.sanitizeId(id)}`);
    },
    search: async (params?: ResourceSearchParams): Promise<ApiResponse<PaginatedResponse<Consent>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Consent>>('GET', `/v1/consents${qs}`);
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
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/labs/${this.sanitizeId(id)}`);
    },
    search: async (params?: ResourceSearchParams): Promise<ApiResponse<PaginatedResponse<DiagnosticReport>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<DiagnosticReport>>('GET', `/v1/labs${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // notes (DocumentReference)
  // -------------------------------------------------------------------------

  public notes = {
    create: async (data: NoteCreateRequest): Promise<ApiResponse<DocumentReference>> => {
      return this.request<DocumentReference>('POST', '/v1/notes', data);
    },
    read: async (id: string): Promise<ApiResponse<DocumentReference>> => {
      return this.request<DocumentReference>('GET', `/v1/notes/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: NoteUpdateRequest): Promise<ApiResponse<DocumentReference>> => {
      return this.request<DocumentReference>('PATCH', `/v1/notes/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/notes/${this.sanitizeId(id)}`);
    },
    search: async (params?: NoteSearchParams): Promise<ApiResponse<PaginatedResponse<DocumentReference>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<DocumentReference>>('GET', `/v1/notes${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // prescriptions (MedicationRequest)
  // -------------------------------------------------------------------------

  public prescriptions = {
    create: async (data: PrescriptionCreateRequest): Promise<ApiResponse<MedicationRequest>> => {
      return this.request<MedicationRequest>('POST', '/v1/prescriptions', data);
    },
    read: async (id: string): Promise<ApiResponse<MedicationRequest>> => {
      return this.request<MedicationRequest>('GET', `/v1/prescriptions/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: PrescriptionUpdateRequest): Promise<ApiResponse<MedicationRequest>> => {
      return this.request<MedicationRequest>('PATCH', `/v1/prescriptions/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/prescriptions/${this.sanitizeId(id)}`);
    },
    search: async (params?: PrescriptionSearchParams): Promise<ApiResponse<PaginatedResponse<MedicationRequest>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<MedicationRequest>>('GET', `/v1/prescriptions${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // practitionerRoles
  // -------------------------------------------------------------------------

  public practitionerRoles = {
    create: async (data: PractitionerRoleCreateRequest): Promise<ApiResponse<PractitionerRole>> => {
      return this.request<PractitionerRole>('POST', '/v1/practitioner-roles', data);
    },
    read: async (id: string): Promise<ApiResponse<PractitionerRole>> => {
      return this.request<PractitionerRole>('GET', `/v1/practitioner-roles/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: PractitionerRoleUpdateRequest): Promise<ApiResponse<PractitionerRole>> => {
      return this.request<PractitionerRole>('PATCH', `/v1/practitioner-roles/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/practitioner-roles/${this.sanitizeId(id)}`);
    },
    search: async (params?: ResourceSearchParams): Promise<ApiResponse<PaginatedResponse<PractitionerRole>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<PractitionerRole>>('GET', `/v1/practitioner-roles${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // assessments (ClinicalImpression)
  // -------------------------------------------------------------------------

  public assessments = {
    create: async (data: AssessmentCreateRequest): Promise<ApiResponse<ClinicalImpression>> => {
      return this.request<ClinicalImpression>('POST', '/v1/assessments', data);
    },
    read: async (id: string): Promise<ApiResponse<ClinicalImpression>> => {
      return this.request<ClinicalImpression>('GET', `/v1/assessments/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: AssessmentUpdateRequest): Promise<ApiResponse<ClinicalImpression>> => {
      return this.request<ClinicalImpression>('PATCH', `/v1/assessments/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/assessments/${this.sanitizeId(id)}`);
    },
    search: async (params?: AssessmentSearchParams): Promise<ApiResponse<PaginatedResponse<ClinicalImpression>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<ClinicalImpression>>('GET', `/v1/assessments${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // documents (Composition)
  // -------------------------------------------------------------------------

  public documents = {
    create: async (data: DocumentCreateRequest): Promise<ApiResponse<Composition>> => {
      return this.request<Composition>('POST', '/v1/documents', data);
    },
    read: async (id: string): Promise<ApiResponse<Composition>> => {
      return this.request<Composition>('GET', `/v1/documents/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: DocumentUpdateRequest): Promise<ApiResponse<Composition>> => {
      return this.request<Composition>('PATCH', `/v1/documents/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/documents/${this.sanitizeId(id)}`);
    },
    search: async (params?: DocumentSearchParams): Promise<ApiResponse<PaginatedResponse<Composition>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Composition>>('GET', `/v1/documents${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // appointmentResponses
  // -------------------------------------------------------------------------

  public appointmentResponses = {
    create: async (data: AppointmentResponseCreateRequest): Promise<ApiResponse<AppointmentResponse>> => {
      return this.request<AppointmentResponse>('POST', '/v1/appointment-responses', data);
    },
    read: async (id: string): Promise<ApiResponse<AppointmentResponse>> => {
      return this.request<AppointmentResponse>('GET', `/v1/appointment-responses/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: AppointmentResponseUpdateRequest): Promise<ApiResponse<AppointmentResponse>> => {
      return this.request<AppointmentResponse>('PATCH', `/v1/appointment-responses/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/appointment-responses/${this.sanitizeId(id)}`);
    },
    search: async (params?: AppointmentResponseSearchParams): Promise<ApiResponse<PaginatedResponse<AppointmentResponse>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<AppointmentResponse>>('GET', `/v1/appointment-responses${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // tasks
  // -------------------------------------------------------------------------

  public tasks = {
    create: async (data: TaskCreateRequest): Promise<ApiResponse<Task>> => {
      return this.request<Task>('POST', '/v1/tasks', data);
    },
    read: async (id: string): Promise<ApiResponse<Task>> => {
      return this.request<Task>('GET', `/v1/tasks/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: TaskUpdateRequest): Promise<ApiResponse<Task>> => {
      return this.request<Task>('PATCH', `/v1/tasks/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/tasks/${this.sanitizeId(id)}`);
    },
    search: async (params?: TaskSearchParams): Promise<ApiResponse<PaginatedResponse<Task>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Task>>('GET', `/v1/tasks${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // slots
  // -------------------------------------------------------------------------

  public slots = {
    create: async (data: SlotCreateRequest): Promise<ApiResponse<Slot>> => {
      return this.request<Slot>('POST', '/v1/slots', data);
    },
    read: async (id: string): Promise<ApiResponse<Slot>> => {
      return this.request<Slot>('GET', `/v1/slots/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: SlotUpdateRequest): Promise<ApiResponse<Slot>> => {
      return this.request<Slot>('PATCH', `/v1/slots/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/slots/${this.sanitizeId(id)}`);
    },
    search: async (params?: SlotSearchParams): Promise<ApiResponse<PaginatedResponse<Slot>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Slot>>('GET', `/v1/slots${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // organizations
  // -------------------------------------------------------------------------

  public organizations = {
    create: async (data: OrganizationCreateRequest): Promise<ApiResponse<Organization>> => {
      return this.request<Organization>('POST', '/v1/organizations', data);
    },
    read: async (id: string): Promise<ApiResponse<Organization>> => {
      return this.request<Organization>('GET', `/v1/organizations/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: OrganizationUpdateRequest): Promise<ApiResponse<Organization>> => {
      return this.request<Organization>('PATCH', `/v1/organizations/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/organizations/${this.sanitizeId(id)}`);
    },
    search: async (params?: OrganizationSearchParams): Promise<ApiResponse<PaginatedResponse<Organization>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Organization>>('GET', `/v1/organizations${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // accounts
  // -------------------------------------------------------------------------

  public accounts = {
    create: async (data: AccountCreateRequest): Promise<ApiResponse<Account>> => {
      return this.request<Account>('POST', '/v1/accounts', data);
    },
    read: async (id: string): Promise<ApiResponse<Account>> => {
      return this.request<Account>('GET', `/v1/accounts/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: AccountUpdateRequest): Promise<ApiResponse<Account>> => {
      return this.request<Account>('PATCH', `/v1/accounts/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/accounts/${this.sanitizeId(id)}`);
    },
    search: async (params?: AccountSearchParams): Promise<ApiResponse<PaginatedResponse<Account>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Account>>('GET', `/v1/accounts${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // healthcareServices
  // -------------------------------------------------------------------------

  public healthcareServices = {
    create: async (data: HealthcareServiceCreateRequest): Promise<ApiResponse<HealthcareService>> => {
      return this.request<HealthcareService>('POST', '/v1/healthcare-services', data);
    },
    read: async (id: string): Promise<ApiResponse<HealthcareService>> => {
      return this.request<HealthcareService>('GET', `/v1/healthcare-services/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: HealthcareServiceUpdateRequest): Promise<ApiResponse<HealthcareService>> => {
      return this.request<HealthcareService>('PATCH', `/v1/healthcare-services/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/healthcare-services/${this.sanitizeId(id)}`);
    },
    search: async (params?: HealthcareServiceSearchParams): Promise<ApiResponse<PaginatedResponse<HealthcareService>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<HealthcareService>>('GET', `/v1/healthcare-services${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // serviceRequests
  // -------------------------------------------------------------------------

  public serviceRequests = {
    create: async (data: ServiceRequestCreateRequest): Promise<ApiResponse<ServiceRequest>> => {
      return this.request<ServiceRequest>('POST', '/v1/service-requests', data);
    },
    read: async (id: string): Promise<ApiResponse<ServiceRequest>> => {
      return this.request<ServiceRequest>('GET', `/v1/service-requests/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ServiceRequestUpdateRequest): Promise<ApiResponse<ServiceRequest>> => {
      return this.request<ServiceRequest>('PATCH', `/v1/service-requests/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/service-requests/${this.sanitizeId(id)}`);
    },
    search: async (params?: ServiceRequestSearchParams): Promise<ApiResponse<PaginatedResponse<ServiceRequest>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<ServiceRequest>>('GET', `/v1/service-requests${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // locations
  // -------------------------------------------------------------------------

  public locations = {
    create: async (data: LocationCreateRequest): Promise<ApiResponse<Location>> => {
      return this.request<Location>('POST', '/v1/locations', data);
    },
    read: async (id: string): Promise<ApiResponse<Location>> => {
      return this.request<Location>('GET', `/v1/locations/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: LocationUpdateRequest): Promise<ApiResponse<Location>> => {
      return this.request<Location>('PATCH', `/v1/locations/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/locations/${this.sanitizeId(id)}`);
    },
    search: async (params?: LocationSearchParams): Promise<ApiResponse<PaginatedResponse<Location>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Location>>('GET', `/v1/locations${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // schedules
  // -------------------------------------------------------------------------

  public schedules = {
    create: async (data: ScheduleCreateRequest): Promise<ApiResponse<Schedule>> => {
      return this.request<Schedule>('POST', '/v1/schedules', data);
    },
    read: async (id: string): Promise<ApiResponse<Schedule>> => {
      return this.request<Schedule>('GET', `/v1/schedules/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ScheduleUpdateRequest): Promise<ApiResponse<Schedule>> => {
      return this.request<Schedule>('PATCH', `/v1/schedules/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/schedules/${this.sanitizeId(id)}`);
    },
    search: async (params?: ScheduleSearchParams): Promise<ApiResponse<PaginatedResponse<Schedule>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Schedule>>('GET', `/v1/schedules${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // persons
  // -------------------------------------------------------------------------

  public persons = {
    create: async (data: PersonCreateRequest): Promise<ApiResponse<Person>> => {
      return this.request<Person>('POST', '/v1/persons', data);
    },
    read: async (id: string): Promise<ApiResponse<Person>> => {
      return this.request<Person>('GET', `/v1/persons/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: PersonUpdateRequest): Promise<ApiResponse<Person>> => {
      return this.request<Person>('PATCH', `/v1/persons/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/persons/${this.sanitizeId(id)}`);
    },
    search: async (params?: PersonSearchParams): Promise<ApiResponse<PaginatedResponse<Person>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Person>>('GET', `/v1/persons${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // familyHistory (FamilyMemberHistory)
  // -------------------------------------------------------------------------

  public familyHistory = {
    create: async (data: FamilyMemberHistoryCreateRequest): Promise<ApiResponse<FamilyMemberHistory>> => {
      return this.request<FamilyMemberHistory>('POST', '/v1/family-history', data);
    },
    read: async (id: string): Promise<ApiResponse<FamilyMemberHistory>> => {
      return this.request<FamilyMemberHistory>('GET', `/v1/family-history/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: FamilyMemberHistoryUpdateRequest): Promise<ApiResponse<FamilyMemberHistory>> => {
      return this.request<FamilyMemberHistory>('PATCH', `/v1/family-history/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/family-history/${this.sanitizeId(id)}`);
    },
    search: async (params?: FamilyMemberHistorySearchParams): Promise<ApiResponse<PaginatedResponse<FamilyMemberHistory>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<FamilyMemberHistory>>('GET', `/v1/family-history${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // carePlans
  // -------------------------------------------------------------------------

  public carePlans = {
    create: async (data: CarePlanCreateRequest): Promise<ApiResponse<CarePlan>> => {
      return this.request<CarePlan>('POST', '/v1/care-plans', data);
    },
    read: async (id: string): Promise<ApiResponse<CarePlan>> => {
      return this.request<CarePlan>('GET', `/v1/care-plans/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: CarePlanUpdateRequest): Promise<ApiResponse<CarePlan>> => {
      return this.request<CarePlan>('PATCH', `/v1/care-plans/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/care-plans/${this.sanitizeId(id)}`);
    },
    search: async (params?: CarePlanSearchParams): Promise<ApiResponse<PaginatedResponse<CarePlan>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<CarePlan>>('GET', `/v1/care-plans${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // immunizations
  // -------------------------------------------------------------------------

  public immunizations = {
    create: async (data: ImmunizationCreateRequest): Promise<ApiResponse<Immunization>> => {
      return this.request<Immunization>('POST', '/v1/immunizations', data);
    },
    read: async (id: string): Promise<ApiResponse<Immunization>> => {
      return this.request<Immunization>('GET', `/v1/immunizations/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ImmunizationUpdateRequest): Promise<ApiResponse<Immunization>> => {
      return this.request<Immunization>('PATCH', `/v1/immunizations/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/immunizations/${this.sanitizeId(id)}`);
    },
    search: async (params?: ImmunizationSearchParams): Promise<ApiResponse<PaginatedResponse<Immunization>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Immunization>>('GET', `/v1/immunizations${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // claims
  // -------------------------------------------------------------------------

  public claims = {
    create: async (data: ClaimCreateRequest): Promise<ApiResponse<Claim>> => {
      return this.request<Claim>('POST', '/v1/claims', data);
    },
    read: async (id: string): Promise<ApiResponse<Claim>> => {
      return this.request<Claim>('GET', `/v1/claims/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ClaimUpdateRequest): Promise<ApiResponse<Claim>> => {
      return this.request<Claim>('PATCH', `/v1/claims/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/claims/${this.sanitizeId(id)}`);
    },
    search: async (params?: ClaimSearchParams): Promise<ApiResponse<PaginatedResponse<Claim>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Claim>>('GET', `/v1/claims${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // claimResponses
  // -------------------------------------------------------------------------

  public claimResponses = {
    create: async (data: ClaimResponseCreateRequest): Promise<ApiResponse<ClaimResponse>> => {
      return this.request<ClaimResponse>('POST', '/v1/claim-responses', data);
    },
    read: async (id: string): Promise<ApiResponse<ClaimResponse>> => {
      return this.request<ClaimResponse>('GET', `/v1/claim-responses/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ClaimResponseUpdateRequest): Promise<ApiResponse<ClaimResponse>> => {
      return this.request<ClaimResponse>('PATCH', `/v1/claim-responses/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/claim-responses/${this.sanitizeId(id)}`);
    },
    search: async (params?: ClaimResponseSearchParams): Promise<ApiResponse<PaginatedResponse<ClaimResponse>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<ClaimResponse>>('GET', `/v1/claim-responses${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // allergies (AllergyIntolerance)
  // -------------------------------------------------------------------------

  public allergies = {
    create: async (data: AllergyIntoleranceCreateRequest): Promise<ApiResponse<AllergyIntolerance>> => {
      return this.request<AllergyIntolerance>('POST', '/v1/allergies', data);
    },
    read: async (id: string): Promise<ApiResponse<AllergyIntolerance>> => {
      return this.request<AllergyIntolerance>('GET', `/v1/allergies/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: AllergyIntoleranceUpdateRequest): Promise<ApiResponse<AllergyIntolerance>> => {
      return this.request<AllergyIntolerance>('PATCH', `/v1/allergies/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/allergies/${this.sanitizeId(id)}`);
    },
    search: async (params?: AllergyIntoleranceSearchParams): Promise<ApiResponse<PaginatedResponse<AllergyIntolerance>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<AllergyIntolerance>>('GET', `/v1/allergies${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // careTeams (CareTeam)
  // -------------------------------------------------------------------------

  public careTeams = {
    create: async (data: CareTeamCreateRequest): Promise<ApiResponse<CareTeam>> => {
      return this.request<CareTeam>('POST', '/v1/care-teams', data);
    },
    read: async (id: string): Promise<ApiResponse<CareTeam>> => {
      return this.request<CareTeam>('GET', `/v1/care-teams/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: CareTeamUpdateRequest): Promise<ApiResponse<CareTeam>> => {
      return this.request<CareTeam>('PATCH', `/v1/care-teams/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/care-teams/${this.sanitizeId(id)}`);
    },
    search: async (params?: CareTeamSearchParams): Promise<ApiResponse<PaginatedResponse<CareTeam>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<CareTeam>>('GET', `/v1/care-teams${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // conditions (Condition)
  // -------------------------------------------------------------------------

  public conditions = {
    create: async (data: ConditionCreateRequest): Promise<ApiResponse<Condition>> => {
      return this.request<Condition>('POST', '/v1/conditions', data);
    },
    read: async (id: string): Promise<ApiResponse<Condition>> => {
      return this.request<Condition>('GET', `/v1/conditions/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ConditionUpdateRequest): Promise<ApiResponse<Condition>> => {
      return this.request<Condition>('PATCH', `/v1/conditions/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/conditions/${this.sanitizeId(id)}`);
    },
    search: async (params?: ConditionSearchParams): Promise<ApiResponse<PaginatedResponse<Condition>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Condition>>('GET', `/v1/conditions${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // chargeItems (ChargeItem)
  // -------------------------------------------------------------------------

  public chargeItems = {
    create: async (data: ChargeItemCreateRequest): Promise<ApiResponse<ChargeItem>> => {
      return this.request<ChargeItem>('POST', '/v1/charge-items', data);
    },
    read: async (id: string): Promise<ApiResponse<ChargeItem>> => {
      return this.request<ChargeItem>('GET', `/v1/charge-items/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ChargeItemUpdateRequest): Promise<ApiResponse<ChargeItem>> => {
      return this.request<ChargeItem>('PATCH', `/v1/charge-items/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/charge-items/${this.sanitizeId(id)}`);
    },
    search: async (params?: ChargeItemSearchParams): Promise<ApiResponse<PaginatedResponse<ChargeItem>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<ChargeItem>>('GET', `/v1/charge-items${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // coverages (Coverage)
  // -------------------------------------------------------------------------

  public coverages = {
    create: async (data: CoverageCreateRequest): Promise<ApiResponse<Coverage>> => {
      return this.request<Coverage>('POST', '/v1/coverages', data);
    },
    read: async (id: string): Promise<ApiResponse<Coverage>> => {
      return this.request<Coverage>('GET', `/v1/coverages/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: CoverageUpdateRequest): Promise<ApiResponse<Coverage>> => {
      return this.request<Coverage>('PATCH', `/v1/coverages/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/coverages/${this.sanitizeId(id)}`);
    },
    search: async (params?: CoverageSearchParams): Promise<ApiResponse<PaginatedResponse<Coverage>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Coverage>>('GET', `/v1/coverages${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // eligibilityRequests (CoverageEligibilityRequest)
  // -------------------------------------------------------------------------

  public eligibilityRequests = {
    create: async (data: EligibilityRequestCreateRequest): Promise<ApiResponse<CoverageEligibilityRequest>> => {
      return this.request<CoverageEligibilityRequest>('POST', '/v1/eligibility-requests', data);
    },
    read: async (id: string): Promise<ApiResponse<CoverageEligibilityRequest>> => {
      return this.request<CoverageEligibilityRequest>('GET', `/v1/eligibility-requests/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: EligibilityRequestUpdateRequest): Promise<ApiResponse<CoverageEligibilityRequest>> => {
      return this.request<CoverageEligibilityRequest>('PATCH', `/v1/eligibility-requests/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/eligibility-requests/${this.sanitizeId(id)}`);
    },
    search: async (params?: EligibilityRequestSearchParams): Promise<ApiResponse<PaginatedResponse<CoverageEligibilityRequest>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<CoverageEligibilityRequest>>('GET', `/v1/eligibility-requests${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // eligibilityResponses (CoverageEligibilityResponse)
  // -------------------------------------------------------------------------

  public eligibilityResponses = {
    create: async (data: EligibilityResponseCreateRequest): Promise<ApiResponse<CoverageEligibilityResponse>> => {
      return this.request<CoverageEligibilityResponse>('POST', '/v1/eligibility-responses', data);
    },
    read: async (id: string): Promise<ApiResponse<CoverageEligibilityResponse>> => {
      return this.request<CoverageEligibilityResponse>('GET', `/v1/eligibility-responses/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: EligibilityResponseUpdateRequest): Promise<ApiResponse<CoverageEligibilityResponse>> => {
      return this.request<CoverageEligibilityResponse>('PATCH', `/v1/eligibility-responses/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/eligibility-responses/${this.sanitizeId(id)}`);
    },
    search: async (params?: EligibilityResponseSearchParams): Promise<ApiResponse<PaginatedResponse<CoverageEligibilityResponse>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<CoverageEligibilityResponse>>('GET', `/v1/eligibility-responses${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // eobs (ExplanationOfBenefit)
  // -------------------------------------------------------------------------

  public eobs = {
    create: async (data: EOBCreateRequest): Promise<ApiResponse<ExplanationOfBenefit>> => {
      return this.request<ExplanationOfBenefit>('POST', '/v1/eobs', data);
    },
    read: async (id: string): Promise<ApiResponse<ExplanationOfBenefit>> => {
      return this.request<ExplanationOfBenefit>('GET', `/v1/eobs/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: EOBUpdateRequest): Promise<ApiResponse<ExplanationOfBenefit>> => {
      return this.request<ExplanationOfBenefit>('PATCH', `/v1/eobs/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/eobs/${this.sanitizeId(id)}`);
    },
    search: async (params?: EOBSearchParams): Promise<ApiResponse<PaginatedResponse<ExplanationOfBenefit>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<ExplanationOfBenefit>>('GET', `/v1/eobs${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // devices (Device)
  // -------------------------------------------------------------------------

  public devices = {
    create: async (data: DeviceCreateRequest): Promise<ApiResponse<Device>> => {
      return this.request<Device>('POST', '/v1/devices', data);
    },
    read: async (id: string): Promise<ApiResponse<Device>> => {
      return this.request<Device>('GET', `/v1/devices/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: DeviceUpdateRequest): Promise<ApiResponse<Device>> => {
      return this.request<Device>('PATCH', `/v1/devices/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/devices/${this.sanitizeId(id)}`);
    },
    search: async (params?: DeviceSearchParams): Promise<ApiResponse<PaginatedResponse<Device>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Device>>('GET', `/v1/devices${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // deviceRequests (DeviceRequest)
  // -------------------------------------------------------------------------

  public deviceRequests = {
    create: async (data: DeviceRequestCreateRequest): Promise<ApiResponse<DeviceRequest>> => {
      return this.request<DeviceRequest>('POST', '/v1/device-requests', data);
    },
    read: async (id: string): Promise<ApiResponse<DeviceRequest>> => {
      return this.request<DeviceRequest>('GET', `/v1/device-requests/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: DeviceRequestUpdateRequest): Promise<ApiResponse<DeviceRequest>> => {
      return this.request<DeviceRequest>('PATCH', `/v1/device-requests/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/device-requests/${this.sanitizeId(id)}`);
    },
    search: async (params?: DeviceRequestSearchParams): Promise<ApiResponse<PaginatedResponse<DeviceRequest>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<DeviceRequest>>('GET', `/v1/device-requests${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // deviceUseStatements (DeviceUseStatement)
  // -------------------------------------------------------------------------

  public deviceUseStatements = {
    create: async (data: DeviceUseStatementCreateRequest): Promise<ApiResponse<DeviceUseStatement>> => {
      return this.request<DeviceUseStatement>('POST', '/v1/device-use-statements', data);
    },
    read: async (id: string): Promise<ApiResponse<DeviceUseStatement>> => {
      return this.request<DeviceUseStatement>('GET', `/v1/device-use-statements/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: DeviceUseStatementUpdateRequest): Promise<ApiResponse<DeviceUseStatement>> => {
      return this.request<DeviceUseStatement>('PATCH', `/v1/device-use-statements/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/device-use-statements/${this.sanitizeId(id)}`);
    },
    search: async (params?: DeviceUseStatementSearchParams): Promise<ApiResponse<PaginatedResponse<DeviceUseStatement>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<DeviceUseStatement>>('GET', `/v1/device-use-statements${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // goals (Goal)
  // -------------------------------------------------------------------------

  public goals = {
    create: async (data: GoalCreateRequest): Promise<ApiResponse<Goal>> => {
      return this.request<Goal>('POST', '/v1/goals', data);
    },
    read: async (id: string): Promise<ApiResponse<Goal>> => {
      return this.request<Goal>('GET', `/v1/goals/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: GoalUpdateRequest): Promise<ApiResponse<Goal>> => {
      return this.request<Goal>('PATCH', `/v1/goals/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/goals/${this.sanitizeId(id)}`);
    },
    search: async (params?: GoalSearchParams): Promise<ApiResponse<PaginatedResponse<Goal>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Goal>>('GET', `/v1/goals${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // invoices (Invoice)
  // -------------------------------------------------------------------------

  public invoices = {
    create: async (data: InvoiceCreateRequest): Promise<ApiResponse<Invoice>> => {
      return this.request<Invoice>('POST', '/v1/invoices', data);
    },
    read: async (id: string): Promise<ApiResponse<Invoice>> => {
      return this.request<Invoice>('GET', `/v1/invoices/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: InvoiceUpdateRequest): Promise<ApiResponse<Invoice>> => {
      return this.request<Invoice>('PATCH', `/v1/invoices/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/invoices/${this.sanitizeId(id)}`);
    },
    search: async (params?: InvoiceSearchParams): Promise<ApiResponse<PaginatedResponse<Invoice>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Invoice>>('GET', `/v1/invoices${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // medicationDispenses (MedicationDispense)
  // -------------------------------------------------------------------------

  public medicationDispenses = {
    create: async (data: MedicationDispenseCreateRequest): Promise<ApiResponse<MedicationDispense>> => {
      return this.request<MedicationDispense>('POST', '/v1/medication-dispenses', data);
    },
    read: async (id: string): Promise<ApiResponse<MedicationDispense>> => {
      return this.request<MedicationDispense>('GET', `/v1/medication-dispenses/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: MedicationDispenseUpdateRequest): Promise<ApiResponse<MedicationDispense>> => {
      return this.request<MedicationDispense>('PATCH', `/v1/medication-dispenses/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/medication-dispenses/${this.sanitizeId(id)}`);
    },
    search: async (params?: MedicationDispenseSearchParams): Promise<ApiResponse<PaginatedResponse<MedicationDispense>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<MedicationDispense>>('GET', `/v1/medication-dispenses${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // medicationKnowledge (MedicationKnowledge)
  // -------------------------------------------------------------------------

  public medicationKnowledge = {
    create: async (data: MedicationKnowledgeCreateRequest): Promise<ApiResponse<MedicationKnowledge>> => {
      return this.request<MedicationKnowledge>('POST', '/v1/medication-knowledge', data);
    },
    read: async (id: string): Promise<ApiResponse<MedicationKnowledge>> => {
      return this.request<MedicationKnowledge>('GET', `/v1/medication-knowledge/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: MedicationKnowledgeUpdateRequest): Promise<ApiResponse<MedicationKnowledge>> => {
      return this.request<MedicationKnowledge>('PATCH', `/v1/medication-knowledge/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/medication-knowledge/${this.sanitizeId(id)}`);
    },
    search: async (params?: MedicationKnowledgeSearchParams): Promise<ApiResponse<PaginatedResponse<MedicationKnowledge>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<MedicationKnowledge>>('GET', `/v1/medication-knowledge${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // medicationStatements (MedicationStatement)
  // -------------------------------------------------------------------------

  public medicationStatements = {
    create: async (data: MedicationStatementCreateRequest): Promise<ApiResponse<MedicationStatement>> => {
      return this.request<MedicationStatement>('POST', '/v1/medication-statements', data);
    },
    read: async (id: string): Promise<ApiResponse<MedicationStatement>> => {
      return this.request<MedicationStatement>('GET', `/v1/medication-statements/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: MedicationStatementUpdateRequest): Promise<ApiResponse<MedicationStatement>> => {
      return this.request<MedicationStatement>('PATCH', `/v1/medication-statements/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/medication-statements/${this.sanitizeId(id)}`);
    },
    search: async (params?: MedicationStatementSearchParams): Promise<ApiResponse<PaginatedResponse<MedicationStatement>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<MedicationStatement>>('GET', `/v1/medication-statements${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // paymentNotices (PaymentNotice)
  // -------------------------------------------------------------------------

  public paymentNotices = {
    create: async (data: PaymentNoticeCreateRequest): Promise<ApiResponse<PaymentNotice>> => {
      return this.request<PaymentNotice>('POST', '/v1/payment-notices', data);
    },
    read: async (id: string): Promise<ApiResponse<PaymentNotice>> => {
      return this.request<PaymentNotice>('GET', `/v1/payment-notices/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: PaymentNoticeUpdateRequest): Promise<ApiResponse<PaymentNotice>> => {
      return this.request<PaymentNotice>('PATCH', `/v1/payment-notices/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/payment-notices/${this.sanitizeId(id)}`);
    },
    search: async (params?: PaymentNoticeSearchParams): Promise<ApiResponse<PaginatedResponse<PaymentNotice>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<PaymentNotice>>('GET', `/v1/payment-notices${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // paymentReconciliations (PaymentReconciliation)
  // -------------------------------------------------------------------------

  public paymentReconciliations = {
    create: async (data: PaymentReconciliationCreateRequest): Promise<ApiResponse<PaymentReconciliation>> => {
      return this.request<PaymentReconciliation>('POST', '/v1/payment-reconciliations', data);
    },
    read: async (id: string): Promise<ApiResponse<PaymentReconciliation>> => {
      return this.request<PaymentReconciliation>('GET', `/v1/payment-reconciliations/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: PaymentReconciliationUpdateRequest): Promise<ApiResponse<PaymentReconciliation>> => {
      return this.request<PaymentReconciliation>('PATCH', `/v1/payment-reconciliations/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/payment-reconciliations/${this.sanitizeId(id)}`);
    },
    search: async (params?: PaymentReconciliationSearchParams): Promise<ApiResponse<PaginatedResponse<PaymentReconciliation>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<PaymentReconciliation>>('GET', `/v1/payment-reconciliations${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // specimens (Specimen)
  // -------------------------------------------------------------------------

  public specimens = {
    create: async (data: SpecimenCreateRequest): Promise<ApiResponse<Specimen>> => {
      return this.request<Specimen>('POST', '/v1/specimens', data);
    },
    read: async (id: string): Promise<ApiResponse<Specimen>> => {
      return this.request<Specimen>('GET', `/v1/specimens/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: SpecimenUpdateRequest): Promise<ApiResponse<Specimen>> => {
      return this.request<Specimen>('PATCH', `/v1/specimens/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/specimens/${this.sanitizeId(id)}`);
    },
    search: async (params?: SpecimenSearchParams): Promise<ApiResponse<PaginatedResponse<Specimen>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Specimen>>('GET', `/v1/specimens${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // imagingStudies (ImagingStudy)
  // -------------------------------------------------------------------------

  public imagingStudies = {
    create: async (data: ImagingStudyCreateRequest): Promise<ApiResponse<ImagingStudy>> => {
      return this.request<ImagingStudy>('POST', '/v1/imaging-studies', data);
    },
    read: async (id: string): Promise<ApiResponse<ImagingStudy>> => {
      return this.request<ImagingStudy>('GET', `/v1/imaging-studies/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ImagingStudyUpdateRequest): Promise<ApiResponse<ImagingStudy>> => {
      return this.request<ImagingStudy>('PATCH', `/v1/imaging-studies/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/imaging-studies/${this.sanitizeId(id)}`);
    },
    search: async (params?: ImagingStudySearchParams): Promise<ApiResponse<PaginatedResponse<ImagingStudy>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<ImagingStudy>>('GET', `/v1/imaging-studies${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // enrollmentRequests (EnrollmentRequest)
  // -------------------------------------------------------------------------

  public enrollmentRequests = {
    create: async (data: EnrollmentRequestCreateRequest): Promise<ApiResponse<EnrollmentRequest>> => {
      return this.request<EnrollmentRequest>('POST', '/v1/enrollment-requests', data);
    },
    read: async (id: string): Promise<ApiResponse<EnrollmentRequest>> => {
      return this.request<EnrollmentRequest>('GET', `/v1/enrollment-requests/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: EnrollmentRequestUpdateRequest): Promise<ApiResponse<EnrollmentRequest>> => {
      return this.request<EnrollmentRequest>('PATCH', `/v1/enrollment-requests/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/enrollment-requests/${this.sanitizeId(id)}`);
    },
    search: async (params?: EnrollmentRequestSearchParams): Promise<ApiResponse<PaginatedResponse<EnrollmentRequest>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<EnrollmentRequest>>('GET', `/v1/enrollment-requests${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // enrollmentResponses (EnrollmentResponse)
  // -------------------------------------------------------------------------

  public enrollmentResponses = {
    create: async (data: EnrollmentResponseCreateRequest): Promise<ApiResponse<EnrollmentResponse>> => {
      return this.request<EnrollmentResponse>('POST', '/v1/enrollment-responses', data);
    },
    read: async (id: string): Promise<ApiResponse<EnrollmentResponse>> => {
      return this.request<EnrollmentResponse>('GET', `/v1/enrollment-responses/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: EnrollmentResponseUpdateRequest): Promise<ApiResponse<EnrollmentResponse>> => {
      return this.request<EnrollmentResponse>('PATCH', `/v1/enrollment-responses/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/enrollment-responses/${this.sanitizeId(id)}`);
    },
    search: async (params?: EnrollmentResponseSearchParams): Promise<ApiResponse<PaginatedResponse<EnrollmentResponse>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<EnrollmentResponse>>('GET', `/v1/enrollment-responses${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // immunizationEvaluations (ImmunizationEvaluation)
  // -------------------------------------------------------------------------

  public immunizationEvaluations = {
    create: async (data: ImmunizationEvaluationCreateRequest): Promise<ApiResponse<ImmunizationEvaluation>> => {
      return this.request<ImmunizationEvaluation>('POST', '/v1/immunization-evaluations', data);
    },
    read: async (id: string): Promise<ApiResponse<ImmunizationEvaluation>> => {
      return this.request<ImmunizationEvaluation>('GET', `/v1/immunization-evaluations/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ImmunizationEvaluationUpdateRequest): Promise<ApiResponse<ImmunizationEvaluation>> => {
      return this.request<ImmunizationEvaluation>('PATCH', `/v1/immunization-evaluations/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/immunization-evaluations/${this.sanitizeId(id)}`);
    },
    search: async (params?: ImmunizationEvaluationSearchParams): Promise<ApiResponse<PaginatedResponse<ImmunizationEvaluation>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<ImmunizationEvaluation>>('GET', `/v1/immunization-evaluations${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // media (Media)
  // -------------------------------------------------------------------------

  public media = {
    create: async (data: MediaCreateRequest): Promise<ApiResponse<Media>> => {
      return this.request<Media>('POST', '/v1/media', data);
    },
    read: async (id: string): Promise<ApiResponse<Media>> => {
      return this.request<Media>('GET', `/v1/media/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: MediaUpdateRequest): Promise<ApiResponse<Media>> => {
      return this.request<Media>('PATCH', `/v1/media/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/media/${this.sanitizeId(id)}`);
    },
    search: async (params?: MediaSearchParams): Promise<ApiResponse<PaginatedResponse<Media>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Media>>('GET', `/v1/media${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // activityDefinitions (ActivityDefinition)
  // -------------------------------------------------------------------------

  public activityDefinitions = {
    create: async (data: ActivityDefinitionCreateRequest): Promise<ApiResponse<ActivityDefinition>> => {
      return this.request<ActivityDefinition>('POST', '/v1/activity-definitions', data);
    },
    read: async (id: string): Promise<ApiResponse<ActivityDefinition>> => {
      return this.request<ActivityDefinition>('GET', `/v1/activity-definitions/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: ActivityDefinitionUpdateRequest): Promise<ApiResponse<ActivityDefinition>> => {
      return this.request<ActivityDefinition>('PATCH', `/v1/activity-definitions/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/activity-definitions/${this.sanitizeId(id)}`);
    },
    search: async (params?: ActivityDefinitionSearchParams): Promise<ApiResponse<PaginatedResponse<ActivityDefinition>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<ActivityDefinition>>('GET', `/v1/activity-definitions${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // nutritionOrders (NutritionOrder)
  // -------------------------------------------------------------------------

  public nutritionOrders = {
    create: async (data: NutritionOrderCreateRequest): Promise<ApiResponse<NutritionOrder>> => {
      return this.request<NutritionOrder>('POST', '/v1/nutrition-orders', data);
    },
    read: async (id: string): Promise<ApiResponse<NutritionOrder>> => {
      return this.request<NutritionOrder>('GET', `/v1/nutrition-orders/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: NutritionOrderUpdateRequest): Promise<ApiResponse<NutritionOrder>> => {
      return this.request<NutritionOrder>('PATCH', `/v1/nutrition-orders/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/nutrition-orders/${this.sanitizeId(id)}`);
    },
    search: async (params?: NutritionOrderSearchParams): Promise<ApiResponse<PaginatedResponse<NutritionOrder>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<NutritionOrder>>('GET', `/v1/nutrition-orders${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // planDefinitions (PlanDefinition)
  // -------------------------------------------------------------------------

  public planDefinitions = {
    create: async (data: PlanDefinitionCreateRequest): Promise<ApiResponse<PlanDefinition>> => {
      return this.request<PlanDefinition>('POST', '/v1/plan-definitions', data);
    },
    read: async (id: string): Promise<ApiResponse<PlanDefinition>> => {
      return this.request<PlanDefinition>('GET', `/v1/plan-definitions/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: PlanDefinitionUpdateRequest): Promise<ApiResponse<PlanDefinition>> => {
      return this.request<PlanDefinition>('PATCH', `/v1/plan-definitions/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/plan-definitions/${this.sanitizeId(id)}`);
    },
    search: async (params?: PlanDefinitionSearchParams): Promise<ApiResponse<PaginatedResponse<PlanDefinition>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<PlanDefinition>>('GET', `/v1/plan-definitions${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // visionPrescriptions (VisionPrescription)
  // -------------------------------------------------------------------------

  public visionPrescriptions = {
    create: async (data: VisionPrescriptionCreateRequest): Promise<ApiResponse<VisionPrescription>> => {
      return this.request<VisionPrescription>('POST', '/v1/vision-prescriptions', data);
    },
    read: async (id: string): Promise<ApiResponse<VisionPrescription>> => {
      return this.request<VisionPrescription>('GET', `/v1/vision-prescriptions/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: VisionPrescriptionUpdateRequest): Promise<ApiResponse<VisionPrescription>> => {
      return this.request<VisionPrescription>('PATCH', `/v1/vision-prescriptions/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/vision-prescriptions/${this.sanitizeId(id)}`);
    },
    search: async (params?: VisionPrescriptionSearchParams): Promise<ApiResponse<PaginatedResponse<VisionPrescription>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<VisionPrescription>>('GET', `/v1/vision-prescriptions${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // riskAssessments (RiskAssessment)
  // -------------------------------------------------------------------------

  public riskAssessments = {
    create: async (data: RiskAssessmentCreateRequest): Promise<ApiResponse<RiskAssessment>> => {
      return this.request<RiskAssessment>('POST', '/v1/risk-assessments', data);
    },
    read: async (id: string): Promise<ApiResponse<RiskAssessment>> => {
      return this.request<RiskAssessment>('GET', `/v1/risk-assessments/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: RiskAssessmentUpdateRequest): Promise<ApiResponse<RiskAssessment>> => {
      return this.request<RiskAssessment>('PATCH', `/v1/risk-assessments/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/risk-assessments/${this.sanitizeId(id)}`);
    },
    search: async (params?: RiskAssessmentSearchParams): Promise<ApiResponse<PaginatedResponse<RiskAssessment>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<RiskAssessment>>('GET', `/v1/risk-assessments${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // auditEvents (AuditEvent)
  // -------------------------------------------------------------------------

  public auditEvents = {
    create: async (data: AuditEventCreateRequest): Promise<ApiResponse<AuditEvent>> => {
      return this.request<AuditEvent>('POST', '/v1/audit-events', data);
    },
    read: async (id: string): Promise<ApiResponse<AuditEvent>> => {
      return this.request<AuditEvent>('GET', `/v1/audit-events/${this.sanitizeId(id)}`);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/audit-events/${this.sanitizeId(id)}`);
    },
    search: async (params?: AuditEventSearchParams): Promise<ApiResponse<PaginatedResponse<AuditEvent>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<AuditEvent>>('GET', `/v1/audit-events${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // measures (Measure)
  // -------------------------------------------------------------------------

  public measures = {
    create: async (data: MeasureCreateRequest): Promise<ApiResponse<Measure>> => {
      return this.request<Measure>('POST', '/v1/measures', data);
    },
    read: async (id: string): Promise<ApiResponse<Measure>> => {
      return this.request<Measure>('GET', `/v1/measures/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: MeasureUpdateRequest): Promise<ApiResponse<Measure>> => {
      return this.request<Measure>('PATCH', `/v1/measures/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/measures/${this.sanitizeId(id)}`);
    },
    search: async (params?: MeasureSearchParams): Promise<ApiResponse<PaginatedResponse<Measure>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<Measure>>('GET', `/v1/measures${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // measureReports (MeasureReport)
  // -------------------------------------------------------------------------

  public measureReports = {
    create: async (data: MeasureReportCreateRequest): Promise<ApiResponse<MeasureReport>> => {
      return this.request<MeasureReport>('POST', '/v1/measure-reports', data);
    },
    read: async (id: string): Promise<ApiResponse<MeasureReport>> => {
      return this.request<MeasureReport>('GET', `/v1/measure-reports/${this.sanitizeId(id)}`);
    },
    update: async (id: string, data: MeasureReportUpdateRequest): Promise<ApiResponse<MeasureReport>> => {
      return this.request<MeasureReport>('PATCH', `/v1/measure-reports/${this.sanitizeId(id)}`, data);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/measure-reports/${this.sanitizeId(id)}`);
    },
    search: async (params?: MeasureReportSearchParams): Promise<ApiResponse<PaginatedResponse<MeasureReport>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<MeasureReport>>('GET', `/v1/measure-reports${qs}`);
    },
  };

  // -------------------------------------------------------------------------
  // immunizationRecommendations (ImmunizationRecommendation)
  // -------------------------------------------------------------------------

  public immunizationRecommendations = {
    create: async (data: ImmunizationRecommendationCreateRequest): Promise<ApiResponse<ImmunizationRecommendation>> => {
      return this.request<ImmunizationRecommendation>('POST', '/v1/immunization-recommendations', data);
    },
    read: async (id: string): Promise<ApiResponse<ImmunizationRecommendation>> => {
      return this.request<ImmunizationRecommendation>('GET', `/v1/immunization-recommendations/${this.sanitizeId(id)}`);
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>('DELETE', `/v1/immunization-recommendations/${this.sanitizeId(id)}`);
    },
    search: async (params?: ImmunizationRecommendationSearchParams): Promise<ApiResponse<PaginatedResponse<ImmunizationRecommendation>>> => {
      const qs = params ? this.buildQuery(params as Record<string, unknown>) : '';
      return this.request<PaginatedResponse<ImmunizationRecommendation>>('GET', `/v1/immunization-recommendations${qs}`);
    },
  };
}
