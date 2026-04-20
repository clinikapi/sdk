/**
 * ClinikAPI Simplified Request/Response Types
 *
 * These are the developer-friendly abstractions that ClinikAPI accepts.
 * The backend transforms these into strict FHIR R4 resources automatically.
 */

import type {
  Appointment,
  Consent,
  DiagnosticReport,
  Encounter,
  Medication,
  Observation,
  Patient,
  QuestionnaireResponse,
} from './resources';

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** Options for read operations that support FHIR _include / _revinclude */
export interface ReadOptions {
  include?: string[];
}

/** Pagination parameters for list/search operations */
export interface PaginationParams {
  /** Number of results per page (default: 20, max: 100) */
  count?: number;
  /** Pagination cursor from a previous response */
  cursor?: string;
}

/** Standard paginated list response */
export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  cursor?: string;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// API Response Envelope
// ---------------------------------------------------------------------------

/** Metadata returned with every successful API response */
export interface ResponseMeta {
  /** Unique request ID for tracing / support tickets */
  requestId: string;
  /** ISO 8601 timestamp of when the server processed the request */
  timestamp: string;
  /** HTTP status code */
  status: number;
  /** Rate limit: total requests allowed in the current window */
  rateLimitTotal?: number;
  /** Rate limit: requests remaining in the current window */
  rateLimitRemaining?: number;
  /** Rate limit: seconds until the window resets */
  rateLimitReset?: number;
}

/**
 * Every SDK method returns an `ApiResponse<T>`.
 *
 * The `data` property contains the resource (Patient, Encounter, etc.).
 * The `meta` property contains request metadata for observability.
 *
 * @example
 * const response = await clinik.patients.create({ firstName: 'Jane', lastName: 'Doe' });
 * console.log(response.data.id);           // "pt_abc123"
 * console.log(response.meta.requestId);     // "req_7f3a..."
 * console.log(response.meta.rateLimitRemaining); // 498
 */
export interface ApiResponse<T> {
  /** The resource or result payload */
  data: T;
  /** Server metadata (request ID, rate limits, timestamp) */
  meta: ResponseMeta;
}

// ---------------------------------------------------------------------------
// Patient
// ---------------------------------------------------------------------------

export interface PatientCreateRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface PatientUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  active?: boolean;
}

export interface PatientSearchParams extends PaginationParams {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  active?: boolean;
}

/** Destructured patient bundle — the SDK maps a raw FHIR searchset into this shape */
export interface PatientReadResponse {
  patient: Patient;
  encounters: Encounter[];
  observations: Observation[];
  medications: Medication[];
  appointments: Appointment[];
  intakes: QuestionnaireResponse[];
  consents: Consent[];
  labs: DiagnosticReport[];
}

// ---------------------------------------------------------------------------
// Encounter
// ---------------------------------------------------------------------------

export interface EncounterCreateRequest {
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled';
  /** Required — e.g. 'AMB' (ambulatory), 'IMP' (inpatient), 'EMER' (emergency) */
  class: string;
  patientId: string;
  practitionerId?: string;
  type?: string;
  reasonCode?: string;
  period?: { start?: string; end?: string };
}

export interface EncounterUpdateRequest {
  status?: string;
  class?: string;
  type?: string;
  reasonCode?: string;
  period?: { start?: string; end?: string };
}

// ---------------------------------------------------------------------------
// Observation
// ---------------------------------------------------------------------------

export interface ObservationCreateRequest {
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled';
  /** LOINC code or text describing the observation type */
  code: string | { system?: string; code: string; display?: string };
  patientId: string;
  encounterId?: string;
  effectiveDateTime?: string;
  /** Numeric value with optional unit */
  valueQuantity?: { value: number; unit?: string; system?: string; code?: string };
  valueString?: string;
  valueCodeableConcept?: { system?: string; code: string; display?: string };
  /** For multi-component observations (e.g. blood pressure) */
  component?: Array<{
    code: string | { system?: string; code: string; display?: string };
    valueQuantity?: { value: number; unit?: string; system?: string; code?: string };
    valueString?: string;
  }>;
  category?: string;
  note?: string;
}

export interface ObservationUpdateRequest {
  status?: string;
  valueQuantity?: { value: number; unit?: string; system?: string; code?: string };
  valueString?: string;
  note?: string;
}

// ---------------------------------------------------------------------------
// Medication
// ---------------------------------------------------------------------------

export interface MedicationCreateRequest {
  /** RxNorm, SNOMED CT, or free-text medication name */
  code: string | { system?: string; code: string; display?: string };
  status?: 'active' | 'inactive';
  form?: string;
  ingredient?: Array<{
    item: string | { system?: string; code: string; display?: string };
    isActive?: boolean;
    strength?: { numerator: { value: number; unit: string }; denominator: { value: number; unit: string } };
  }>;
  batch?: { lotNumber?: string; expirationDate?: string };
}

export interface MedicationUpdateRequest {
  status?: 'active' | 'inactive';
  form?: string;
  batch?: { lotNumber?: string; expirationDate?: string };
}

// ---------------------------------------------------------------------------
// Appointment
// ---------------------------------------------------------------------------

export interface AppointmentCreateRequest {
  status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow' | 'checked-in' | 'waitlist';
  patientId: string;
  practitionerId?: string;
  start?: string;
  end?: string;
  minutesDuration?: number;
  appointmentType?: string;
  serviceType?: string;
  reasonCode?: string;
  description?: string;
  comment?: string;
  patientInstruction?: string;
}

export interface AppointmentUpdateRequest {
  status?: string;
  start?: string;
  end?: string;
  minutesDuration?: number;
  description?: string;
  comment?: string;
  cancelationReason?: string;
}

// ---------------------------------------------------------------------------
// Intake (QuestionnaireResponse)
// ---------------------------------------------------------------------------

export interface IntakeSubmitRequest {
  patientId: string;
  encounterId?: string;
  /** Reference to the Questionnaire definition */
  questionnaire?: string;
  status?: 'in-progress' | 'completed' | 'amended' | 'stopped';
  items: Array<{
    linkId: string;
    text?: string;
    answer?: Array<{
      valueString?: string;
      valueBoolean?: boolean;
      valueInteger?: number;
      valueDate?: string;
      valueCoding?: { system?: string; code: string; display?: string };
    }>;
  }>;
}

export interface IntakeUpdateRequest {
  status?: 'in-progress' | 'completed' | 'amended' | 'stopped';
  items?: Array<{
    linkId: string;
    text?: string;
    answer?: Array<{
      valueString?: string;
      valueBoolean?: boolean;
      valueInteger?: number;
      valueDate?: string;
    }>;
  }>;
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

export interface ConsentSignRequest {
  patientId: string;
  status?: 'draft' | 'proposed' | 'active' | 'rejected' | 'inactive';
  /** Required — 'patient-privacy' | 'research' | 'treatment' | 'adr' */
  scope: string;
  /** Required — e.g. 'hipaa-notice', 'treatment-consent' */
  category: string | string[];
  dateTime?: string;
  /** Policy URI(s) the consent references */
  policyUri?: string;
  /** Provision rules */
  provision?: {
    type?: 'deny' | 'permit';
    period?: { start?: string; end?: string };
    purpose?: Array<{ system?: string; code: string; display?: string }>;
  };
}

export interface ConsentUpdateRequest {
  status?: 'draft' | 'proposed' | 'active' | 'rejected' | 'inactive';
  provision?: {
    type?: 'deny' | 'permit';
    period?: { start?: string; end?: string };
  };
}

// ---------------------------------------------------------------------------
// Labs (DiagnosticReport)
// ---------------------------------------------------------------------------

export interface LabCreateRequest {
  status: 'registered' | 'partial' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'appended' | 'cancelled';
  /** Required — LOINC code for the report type */
  code: string | { system?: string; code: string; display?: string };
  patientId: string;
  encounterId?: string;
  effectiveDateTime?: string;
  /** References to Observation resources that are part of this report */
  resultIds?: string[];
  category?: string;
  conclusion?: string;
  performer?: string;
}

export interface LabUpdateRequest {
  status?: string;
  conclusion?: string;
  resultIds?: string[];
}
