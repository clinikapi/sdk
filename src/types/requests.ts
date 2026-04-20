/**
 * ClinikAPI Simplified Request/Response Types
 *
 * These are the developer-friendly abstractions that ClinikAPI accepts.
 * The backend transforms these into strict FHIR R4 resources automatically.
 */

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
  prescriptions: MedicationRequest[];
  notes: DocumentReference[];
  assessments: ClinicalImpression[];
  documents: Composition[];
}

// ---------------------------------------------------------------------------
// Practitioner
// ---------------------------------------------------------------------------

export interface PractitionerQualificationInput {
  /** Qualification name (e.g. "MD", "Board Certified - Internal Medicine") */
  name: string;
  /** Issuing organization (e.g. "American Board of Internal Medicine") */
  issuer?: string;
  /** Period of validity */
  period?: { start?: string; end?: string };
  /** License/certification number */
  identifier?: string;
}

export interface PractitionerCreateRequest {
  firstName: string;
  lastName: string;
  prefix?: string[];
  suffix?: string[];
  email?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  /** National Provider Identifier (US) */
  npi?: string;
  /** Primary specialty (e.g. "Cardiology", "Family Medicine") */
  specialty?: string;
  /** Structured qualifications / licenses / certifications */
  qualifications?: PractitionerQualificationInput[];
  /** Languages the practitioner speaks (BCP-47 codes or display names) */
  languages?: string[];
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface PractitionerUpdateRequest {
  firstName?: string;
  lastName?: string;
  prefix?: string[];
  suffix?: string[];
  email?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  active?: boolean;
  specialty?: string;
  qualifications?: PractitionerQualificationInput[];
  languages?: string[];
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface PractitionerSearchParams extends PaginationParams {
  name?: string;
  specialty?: string;
  npi?: string;
  active?: boolean;
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
  /** Type of encounter (e.g. 'wellness visit', 'follow-up', 'urgent care') */
  type?: string;
  /** Service type (e.g. 'cardiology', 'general practice') */
  serviceType?: string;
  /** Priority/urgency of the encounter */
  priority?: string;
  /** Reason for the encounter */
  reasonCode?: string;
  /** Time period of the encounter */
  period?: { start?: string; end?: string };
  /** Duration in minutes (alternative to period) */
  lengthMinutes?: number;
  /** Location name where the encounter took place */
  location?: string;
  /** Organization/service provider name */
  serviceProvider?: string;
  /** Diagnosis codes or descriptions addressed during the encounter */
  diagnosis?: Array<{ condition: string; use?: string; rank?: number }>;
}

export interface EncounterUpdateRequest {
  status?: string;
  class?: string;
  type?: string;
  serviceType?: string;
  priority?: string;
  reasonCode?: string;
  period?: { start?: string; end?: string };
  lengthMinutes?: number;
  location?: string;
  diagnosis?: Array<{ condition: string; use?: string; rank?: number }>;
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
  /** Who performed/recorded the observation */
  performerId?: string;
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
  /** Category (e.g. 'vital-signs', 'laboratory', 'social-history', 'exam') */
  category?: string;
  /** Clinical interpretation (e.g. 'H' high, 'L' low, 'N' normal, 'A' abnormal) */
  interpretation?: string;
  /** Normal reference range */
  referenceRange?: { low?: { value: number; unit?: string }; high?: { value: number; unit?: string }; text?: string };
  /** Body site where observation was made */
  bodySite?: string;
  /** Method used to make the observation */
  method?: string;
  note?: string;
}

export interface ObservationUpdateRequest {
  status?: string;
  valueQuantity?: { value: number; unit?: string; system?: string; code?: string };
  valueString?: string;
  interpretation?: string;
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
  /** When the report is clinically relevant */
  effectiveDateTime?: string;
  /** References to Observation resources that are part of this report */
  resultIds?: string[];
  /** Category (e.g. 'LAB', 'RAD', 'PAT' for lab/radiology/pathology) */
  category?: string;
  /** Clinical conclusion / interpretation text */
  conclusion?: string;
  /** Conclusion codes (e.g. SNOMED findings) */
  conclusionCodes?: Array<{ system?: string; code: string; display?: string }>;
  /** Practitioner who performed the diagnostic */
  performer?: string;
  /** Practitioner who interpreted the results */
  resultsInterpreter?: string;
  /** Specimen IDs referenced by this report */
  specimenIds?: string[];
  /** Attached report documents (e.g. PDF lab report) */
  presentedForm?: Array<{ contentType: string; data?: string; url?: string; title?: string }>;
}

export interface LabUpdateRequest {
  status?: string;
  conclusion?: string;
  conclusionCodes?: Array<{ system?: string; code: string; display?: string }>;
  resultIds?: string[];
  resultsInterpreter?: string;
  presentedForm?: Array<{ contentType: string; data?: string; url?: string; title?: string }>;
}


// ---------------------------------------------------------------------------
// Notes (DocumentReference)
// ---------------------------------------------------------------------------

export type NoteType =
  | 'progress-note'
  | 'discharge-summary'
  | 'consultation-note'
  | 'history-and-physical'
  | 'operative-note'
  | 'procedure-note'
  | 'referral-note'
  | 'transfer-summary'
  | 'other';

export interface NoteCreateRequest {
  patientId: string;
  /** The practitioner who authored the note */
  authorId?: string;
  /** Encounter this note is associated with */
  encounterId?: string;
  /** Type of clinical note */
  type?: NoteType;
  /** Human-readable title / description */
  title: string;
  /** The note content — plain text or markdown */
  content: string;
  /** MIME type of the content (default: text/plain) */
  contentType?: string;
  /** Document status */
  docStatus?: 'preliminary' | 'final' | 'amended';
  /** Category tags for filtering */
  category?: string;
  /** Date the note was clinically relevant (defaults to now) */
  date?: string;
}

export interface NoteUpdateRequest {
  title?: string;
  content?: string;
  contentType?: string;
  docStatus?: 'preliminary' | 'final' | 'amended';
  category?: string;
}

export interface NoteSearchParams extends PaginationParams {
  patientId?: string;
  authorId?: string;
  encounterId?: string;
  type?: NoteType;
  category?: string;
  date?: string;
}


// ---------------------------------------------------------------------------
// Prescriptions (MedicationRequest)
// ---------------------------------------------------------------------------

export interface PrescriptionCreateRequest {
  patientId: string;
  /** The prescribing practitioner */
  prescriberId: string;
  /** Encounter during which the prescription was written */
  encounterId?: string;
  /** Medication — RxNorm code, SNOMED code, or free-text name */
  medication: string | { system?: string; code: string; display?: string };
  /** Required — defaults to 'order' */
  intent?: 'proposal' | 'plan' | 'order' | 'original-order';
  status?: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'draft';
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  /** Dosage instructions in plain text (e.g. "Take 1 tablet twice daily with food") */
  dosageText?: string;
  /** Structured dosage */
  dosage?: {
    dose?: { value: number; unit: string };
    frequency?: number;
    period?: number;
    periodUnit?: 'h' | 'd' | 'wk' | 'mo';
    route?: string;
  };
  /** Number of refills allowed */
  refills?: number;
  /** Quantity to dispense */
  quantity?: { value: number; unit: string };
  /** Expected supply duration in days */
  supplyDays?: number;
  /** Allow generic substitution */
  substitutionAllowed?: boolean;
  /** Clinical reason for the prescription */
  reason?: string;
  /** Additional notes for the pharmacist */
  note?: string;
}

export interface PrescriptionUpdateRequest {
  status?: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'stopped';
  dosageText?: string;
  refills?: number;
  quantity?: { value: number; unit: string };
  supplyDays?: number;
  note?: string;
}

export interface PrescriptionSearchParams extends PaginationParams {
  patientId?: string;
  prescriberId?: string;
  status?: string;
  medication?: string;
}


// ---------------------------------------------------------------------------
// PractitionerRole
// ---------------------------------------------------------------------------

export interface PractitionerRoleCreateRequest {
  practitionerId: string;
  organizationName?: string;
  role: string;
  specialty?: string[];
  locationName?: string;
  phone?: string;
  email?: string;
  availableDays?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  availableStartTime?: string;
  availableEndTime?: string;
}

export interface PractitionerRoleUpdateRequest {
  practitionerId?: string;
  organizationName?: string;
  role?: string;
  specialty?: string[];
  locationName?: string;
  phone?: string;
  email?: string;
  availableDays?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  availableStartTime?: string;
  availableEndTime?: string;
  active?: boolean;
}

// ---------------------------------------------------------------------------
// Assessments (ClinicalImpression)
// ---------------------------------------------------------------------------

export interface AssessmentCreateRequest {
  status: 'in-progress' | 'completed';
  patientId: string;
  encounterId?: string;
  practitionerId?: string;
  description?: string;
  summary: string;
  findings?: Array<{ code?: string; text: string }>;
  note?: string;
  effectiveDateTime?: string;
}

export interface AssessmentUpdateRequest {
  status?: 'in-progress' | 'completed';
  summary?: string;
  findings?: Array<{ code?: string; text: string }>;
  note?: string;
}

export interface AssessmentSearchParams extends PaginationParams {
  patientId?: string;
  practitionerId?: string;
  status?: string;
  encounterId?: string;
}

// ---------------------------------------------------------------------------
// Documents (Composition)
// ---------------------------------------------------------------------------

export interface DocumentCreateRequest {
  status: 'preliminary' | 'final' | 'amended';
  type: string;
  patientId: string;
  encounterId?: string;
  practitionerId: string;
  title: string;
  date?: string;
  sections: Array<{
    title: string;
    code?: string;
    text: string;
    resourceIds?: string[];
  }>;
  confidentiality?: 'N' | 'R' | 'V';
}

export interface DocumentUpdateRequest {
  status?: 'preliminary' | 'final' | 'amended';
  title?: string;
  sections?: Array<{
    title: string;
    code?: string;
    text: string;
    resourceIds?: string[];
  }>;
}

export interface DocumentSearchParams extends PaginationParams {
  patientId?: string;
  practitionerId?: string;
  type?: string;
  status?: string;
  date?: string;
}
