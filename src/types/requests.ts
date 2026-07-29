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

/** Generic search params for resources without specific search types */
export interface ResourceSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
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
  /** Marital status (e.g. 'married', 'single', 'divorced', 'widowed') */
  maritalStatus?: string;
  /** Photo URL or base64-encoded image */
  photo?: { url?: string; data?: string; contentType?: string };
  /** Emergency contacts / next of kin */
  contact?: Array<{
    relationship?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: {
      line?: string[];
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  }>;
  /** Languages the patient speaks */
  languages?: Array<{
    language: string;
    preferred?: boolean;
  }>;
  /** Reference to the patient's general practitioner (Practitioner ID) */
  generalPractitionerId?: string;
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
  maritalStatus?: string;
  photo?: { url?: string; data?: string; contentType?: string };
  contact?: Array<{
    relationship?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }>;
  languages?: Array<{
    language: string;
    preferred?: boolean;
  }>;
  generalPractitionerId?: string;
}

export interface PatientSearchParams extends PaginationParams {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  active?: boolean;
}

/**
 * The simplified patient shape the API returns from `create`, `update`,
 * `search`, and `read` without `include`.
 *
 * ⚠️ This is NOT a FHIR `Patient` — there is no `name[]` or `telecom[]`. The
 * simplified routes speak simplified JSON in both directions; raw FHIR comes
 * back only from `read(id, { include })` (a FHIR Bundle) and the `/v1/fhir/*`
 * passthrough. Reading `patient.name[0]` off one of these is the mistake this
 * type exists to prevent — use `fullName`.
 */
export interface PatientSummary {
  id: string;
  /** Ready-to-render display name; empty only when the record carries no name. */
  fullName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  active?: boolean;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  maritalStatus?: string;
  photo?: { url?: string; data?: string; contentType?: string };
  contact?: Array<{
    relationship?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }>;
  languages?: Array<{ language: string; preferred?: boolean }>;
  generalPractitionerId?: string;
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
  /** Photo URL or base64-encoded image */
  photo?: { url?: string; data?: string; contentType?: string };
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
  photo?: { url?: string; data?: string; contentType?: string };
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
  /** Additional participants (e.g. nurses, specialists) */
  participants?: Array<{ practitionerId: string; role?: string }>;
  /** Type of encounter (e.g. 'wellness visit', 'follow-up', 'urgent care') */
  type?: string;
  /** Service type (e.g. 'cardiology', 'general practice') */
  serviceType?: string;
  /** Priority/urgency of the encounter */
  priority?: string;
  /** Reason(s) for the encounter */
  reasonCode?: string | string[];
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
  /** Appointment ID that scheduled this encounter */
  appointmentId?: string;
  /** ServiceRequest ID that initiated this encounter */
  basedOnId?: string;
  /** Parent encounter ID (for sub-encounters) */
  partOfId?: string;
  /** Hospitalization details (for inpatient encounters) */
  hospitalization?: {
    admitSource?: string;
    dischargeDisposition?: string;
    reAdmission?: string;
    dietPreference?: string[];
    specialArrangement?: string[];
    destination?: string;
    origin?: string;
  };
}

export interface EncounterUpdateRequest {
  status?: string;
  class?: string;
  type?: string;
  serviceType?: string;
  priority?: string;
  reasonCode?: string | string[];
  period?: { start?: string; end?: string };
  lengthMinutes?: number;
  location?: string;
  serviceProvider?: string;
  diagnosis?: Array<{ condition: string; use?: string; rank?: number }>;
  hospitalization?: {
    admitSource?: string;
    dischargeDisposition?: string;
    reAdmission?: string;
    dietPreference?: string[];
    specialArrangement?: string[];
    destination?: string;
  };
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
  /** When this version was made available */
  issued?: string;
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
  /** Specimen ID used for this observation */
  specimenId?: string;
  /** Device ID used for measurement */
  deviceId?: string;
  note?: string;
}

export interface ObservationUpdateRequest {
  status?: string;
  valueQuantity?: { value: number; unit?: string; system?: string; code?: string };
  valueString?: string;
  interpretation?: string;
  note?: string;
  issued?: string;
}

// ---------------------------------------------------------------------------
// Medication
// ---------------------------------------------------------------------------

export interface MedicationCreateRequest {
  /** RxNorm, SNOMED CT, or free-text medication name */
  code: string | { system?: string; code: string; display?: string };
  status?: 'active' | 'inactive';
  form?: string;
  /** Manufacturer name */
  manufacturer?: string;
  /** Total amount of drug in package */
  amount?: { numerator: { value: number; unit: string }; denominator: { value: number; unit: string } };
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
  manufacturer?: string;
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
  /** Type of appointment (e.g. 'routine', 'walkin', 'urgent', 'followup') */
  appointmentType?: string;
  /** Service being booked (e.g. 'cardiology consultation', 'physical therapy') */
  serviceType?: string;
  /** Service category (e.g. 'general-practice', 'specialist', 'dental') */
  serviceCategory?: string;
  /** Specialty required (e.g. 'cardiology', 'dermatology') */
  specialty?: string;
  /** Reason for the appointment */
  reasonCode?: string;
  /** Priority (0 = routine, 1-9 = increasing urgency) */
  priority?: number;
  /** Shown on a subject line in a meeting request */
  description?: string;
  /** Additional comments about the appointment */
  comment?: string;
  /** Instructions for the patient (e.g. 'fast for 12 hours') */
  patientInstruction?: string;
  /** Reason for cancellation (only when status is cancelled/noshow) */
  cancelationReason?: string;
  /** ServiceRequest ID this appointment is allocated to assess */
  basedOnId?: string;
  /** Preferred time windows for the appointment */
  requestedPeriod?: Array<{ start?: string; end?: string }>;
  /** When the appointment was initially created (defaults to now) */
  created?: string;
}

export interface AppointmentUpdateRequest {
  status?: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow' | 'checked-in' | 'waitlist';
  start?: string;
  end?: string;
  minutesDuration?: number;
  description?: string;
  comment?: string;
  patientInstruction?: string;
  cancelationReason?: string;
  appointmentType?: string;
  serviceType?: string;
  specialty?: string;
  reasonCode?: string;
  priority?: number;
}

// ---------------------------------------------------------------------------
// Intake (QuestionnaireResponse)
// ---------------------------------------------------------------------------

/** Reusable answer value type for intake items */
export interface IntakeAnswerValue {
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDecimal?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueCoding?: { system?: string; code: string; display?: string };
  valueQuantity?: { value: number; unit?: string };
  valueUri?: string;
}

/** Reusable intake item structure (supports nesting) */
export interface IntakeItem {
  linkId: string;
  /** Element definition URI for the item */
  definition?: string;
  text?: string;
  answer?: IntakeAnswerValue[];
  /** Nested sub-items (for grouped questions) */
  items?: IntakeItem[];
}

export interface IntakeSubmitRequest {
  patientId: string;
  encounterId?: string;
  /** Who filled out the form (practitioner or device ID) */
  authorId?: string;
  /** Who provided the answers (patient, related person, practitioner) */
  sourceId?: string;
  /** Reference to the Questionnaire definition (canonical URL or ID) */
  questionnaire?: string;
  status?: 'in-progress' | 'completed' | 'amended' | 'stopped';
  /** When the answers were gathered (defaults to now) */
  authored?: string;
  /** CarePlan or ServiceRequest IDs this intake fulfills */
  basedOn?: string[];
  /** Observation or Procedure IDs this intake is part of */
  partOf?: string[];
  items: IntakeItem[];
}

export interface IntakeUpdateRequest {
  status?: 'in-progress' | 'completed' | 'amended' | 'stopped';
  items?: IntakeItem[];
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

/** Provision data reference (simplified) */
export interface ConsentProvisionDataInput {
  /** How the resource reference is interpreted */
  meaning: 'instance' | 'related' | 'dependents' | 'authoredby';
  /** Reference to the actual data */
  reference: string;
}

/** Consent provision rules (supports nesting) */
export interface ConsentProvisionInput {
  type?: 'deny' | 'permit';
  period?: { start?: string; end?: string };
  /** Who/what controlled by this rule */
  actor?: Array<{ role: string; reference: string }>;
  /** Specific actions permitted/denied */
  action?: Array<{ system?: string; code: string; display?: string }>;
  /** Security labels that define affected resources */
  securityLabel?: Array<{ system?: string; code: string; display?: string }>;
  /** Context of activities covered by this rule */
  purpose?: Array<{ system?: string; code: string; display?: string }>;
  /** Data classes the provision applies to (e.g. Resource Type, Profile) */
  class?: Array<{ system?: string; code: string; display?: string }>;
  /** LOINC or SNOMED codes in the content */
  code?: Array<{ system?: string; code: string; display?: string }>;
  /** Timeframe for data controlled by this rule */
  dataPeriod?: { start?: string; end?: string };
  /** Specific data references controlled by this rule */
  data?: ConsentProvisionDataInput[];
  /** Nested exception rules */
  provision?: ConsentProvisionInput[];
}

export interface ConsentSignRequest {
  patientId: string;
  status?: 'draft' | 'proposed' | 'active' | 'rejected' | 'inactive';
  /** Required — 'patient-privacy' | 'research' | 'treatment' | 'adr' */
  scope: string;
  /** Required — e.g. 'hipaa-notice', 'treatment-consent' */
  category: string | string[];
  dateTime?: string;
  /** Who is agreeing to the policy (practitioner, organization, patient) */
  performerId?: string;
  /** Organization that is custodian of the consent */
  organizationId?: string;
  /** Policy URI(s) the consent references */
  policyUri?: string;
  /** Multiple policies with authority */
  policies?: Array<{ authority?: string; uri?: string }>;
  /** Regulation that this consents to */
  policyRule?: string;
  /** Source document the consent was taken from (attachment) */
  sourceAttachment?: { contentType?: string; data?: string; url?: string; title?: string };
  /** Source document reference ID (Consent, DocumentReference, Contract, QuestionnaireResponse) */
  sourceReferenceId?: string;
  /** Verification details (supports multiple verifications) */
  verification?: Array<{
    verified: boolean;
    verifiedWith?: string;
    verificationDate?: string;
  }>;
  /** Provision rules */
  provision?: ConsentProvisionInput;
}

export interface ConsentUpdateRequest {
  status?: 'draft' | 'proposed' | 'active' | 'rejected' | 'inactive';
  verification?: Array<{
    verified: boolean;
    verifiedWith?: string;
    verificationDate?: string;
  }>;
  provision?: ConsentProvisionInput;
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
  /** When the report is clinically relevant (point in time) */
  effectiveDateTime?: string;
  /** When the report is clinically relevant (time range) */
  effectivePeriod?: { start?: string; end?: string };
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
  /** ServiceRequest IDs this report is based on */
  basedOn?: string[];
  /** Media/images linked to this report */
  media?: Array<{ comment?: string; linkId: string }>;
}

export interface LabUpdateRequest {
  status?: string;
  conclusion?: string;
  conclusionCodes?: Array<{ system?: string; code: string; display?: string }>;
  resultIds?: string[];
  resultsInterpreter?: string;
  presentedForm?: Array<{ contentType: string; data?: string; url?: string; title?: string }>;
  /** Effective date/time (point in time) */
  effectiveDateTime?: string;
  /** Effective period (time range) */
  effectivePeriod?: { start?: string; end?: string };
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
  /** Relationships to other documents */
  relatesTo?: Array<{
    /** replaces, transforms, signs, appends */
    code: 'replaces' | 'transforms' | 'signs' | 'appends';
    /** Target DocumentReference ID */
    targetId: string;
  }>;
  /** Document security tags */
  securityLabel?: Array<{ system?: string; code: string; display?: string }>;
  /** Who authenticated the document (Practitioner ID) */
  authenticatorId?: string;
  /** Organization maintaining the document */
  custodianId?: string;
  /** Time period of the clinical service documented */
  servicePeriod?: { start?: string; end?: string };
  /** Kind of facility where patient was seen */
  facilityType?: string;
  /** Clinical specialty (e.g. cardiology, oncology) */
  practiceSetting?: string;
}

export interface NoteUpdateRequest {
  title?: string;
  content?: string;
  contentType?: string;
  docStatus?: 'preliminary' | 'final' | 'amended';
  category?: string;
  /** Add/update relationships to other documents */
  relatesTo?: Array<{
    code: 'replaces' | 'transforms' | 'signs' | 'appends';
    targetId: string;
  }>;
  securityLabel?: Array<{ system?: string; code: string; display?: string }>;
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
  /** Reason for current status (e.g. why on-hold or cancelled) */
  statusReason?: string;
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  /** Category of medication usage (inpatient, outpatient, community, discharge) */
  category?: string;
  /** True if this is a "do not perform" order */
  doNotPerform?: boolean;
  /** When the prescription was authored (defaults to now) */
  authoredOn?: string;
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
  /** Intended performer of administration (Practitioner ID) */
  performerId?: string;
  /** Course of therapy type (continuous, acute, seasonal) */
  courseOfTherapy?: string;
  /** Reference to a prior prescription being replaced */
  priorPrescriptionId?: string;
}

export interface PrescriptionUpdateRequest {
  status?: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'stopped';
  statusReason?: string;
  dosageText?: string;
  refills?: number;
  quantity?: { value: number; unit: string };
  supplyDays?: number;
  note?: string;
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  performerId?: string;
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

export interface PractitionerRoleAvailableTimeInput {
  daysOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  allDay?: boolean;
  availableStartTime?: string;
  availableEndTime?: string;
}

export interface PractitionerRoleNotAvailableInput {
  description: string;
  during?: { start?: string; end?: string };
}

export interface PractitionerRoleCreateRequest {
  practitionerId: string;
  organizationName?: string;
  role: string;
  specialty?: string[];
  locationName?: string;
  phone?: string;
  email?: string;
  /** Period during which the role is valid */
  period?: { start?: string; end?: string };
  /** Multiple availability schedules */
  availableTime?: PractitionerRoleAvailableTimeInput[];
  /** Periods when the practitioner is not available */
  notAvailable?: PractitionerRoleNotAvailableInput[];
  /** Free-text description of availability exceptions */
  availabilityExceptions?: string;
  // Legacy single-schedule fields (still supported, mapped to availableTime[0])
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
  active?: boolean;
  period?: { start?: string; end?: string };
  availableTime?: PractitionerRoleAvailableTimeInput[];
  notAvailable?: PractitionerRoleNotAvailableInput[];
  availabilityExceptions?: string;
  availableDays?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  availableStartTime?: string;
  availableEndTime?: string;
}

// ---------------------------------------------------------------------------
// Assessments (ClinicalImpression)
// ---------------------------------------------------------------------------

export interface AssessmentInvestigation {
  /** Name/code for the investigation set (e.g. "Initial labs", "Imaging") */
  name: string;
  /** Reference IDs to Observation, DiagnosticReport, QuestionnaireResponse, etc. */
  itemIds?: string[];
}

export interface AssessmentFinding {
  /** Coded finding (ICD-10, SNOMED) */
  code?: string;
  /** Human-readable finding text */
  text: string;
  /** Which investigations support this finding */
  basis?: string;
}

export interface AssessmentCreateRequest {
  status: 'in-progress' | 'completed';
  /** Reason for current status */
  statusReason?: string;
  patientId: string;
  encounterId?: string;
  practitionerId?: string;
  /** Kind of assessment performed (e.g. "initial-assessment", "follow-up") */
  code?: string;
  description?: string;
  summary: string;
  findings?: AssessmentFinding[];
  note?: string;
  effectiveDateTime?: string;
  /** When the assessment was documented (defaults to now) */
  date?: string;
  /** Reference to the previous assessment for this patient */
  previousAssessmentId?: string;
  /** Condition or AllergyIntolerance IDs being assessed */
  problemIds?: string[];
  /** Sets of investigations (labs, imaging, questionnaires) */
  investigations?: AssessmentInvestigation[];
  /** Clinical protocol URIs followed */
  protocol?: string[];
  /** Prognosis codes (e.g. "good", "poor", "guarded") */
  prognosis?: Array<{ code?: string; text: string }>;
  /** Supporting information references */
  supportingInfoIds?: string[];
}

export interface AssessmentUpdateRequest {
  status?: 'in-progress' | 'completed';
  statusReason?: string;
  summary?: string;
  description?: string;
  findings?: AssessmentFinding[];
  note?: string;
  investigations?: AssessmentInvestigation[];
  prognosis?: Array<{ code?: string; text: string }>;
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

/** Document section (supports nesting) */
export interface DocumentSection {
  title: string;
  code?: string;
  text: string;
  resourceIds?: string[];
  /** Per-section author (Practitioner ID) — overrides document-level author */
  authorId?: string;
  /** Section mode: working, snapshot, changes */
  mode?: 'working' | 'snapshot' | 'changes';
  /** Nested sub-sections */
  sections?: DocumentSection[];
}

/** Document attester */
export interface DocumentAttester {
  /** personal, professional, legal, official */
  mode: 'personal' | 'professional' | 'legal' | 'official';
  /** When the composition was attested */
  time?: string;
  /** Who attested (Practitioner ID) */
  partyId?: string;
}

/** Document relationship */
export interface DocumentRelatesTo {
  /** replaces, transforms, signs, appends */
  code: 'replaces' | 'transforms' | 'signs' | 'appends';
  /** Target Composition ID */
  targetId: string;
}

/** Clinical event documented */
export interface DocumentEvent {
  /** Code(s) for the event */
  code?: Array<{ system?: string; code: string; display?: string }>;
  /** Period covered by the documentation */
  period?: { start?: string; end?: string };
  /** Reference IDs to event details */
  detailIds?: string[];
}

export interface DocumentCreateRequest {
  status: 'preliminary' | 'final' | 'amended';
  type: string;
  /** Document categories for classification */
  category?: string[];
  patientId: string;
  encounterId?: string;
  practitionerId: string;
  title: string;
  date?: string;
  sections: DocumentSection[];
  confidentiality?: 'N' | 'R' | 'V';
  /** Who attested to the accuracy of the document */
  attester?: DocumentAttester[];
  /** Organization maintaining the document */
  custodianId?: string;
  /** Relationships to other compositions/documents */
  relatesTo?: DocumentRelatesTo[];
  /** Clinical services being documented */
  event?: DocumentEvent[];
}

export interface DocumentUpdateRequest {
  status?: 'preliminary' | 'final' | 'amended';
  title?: string;
  sections?: DocumentSection[];
  confidentiality?: 'N' | 'R' | 'V';
  attester?: DocumentAttester[];
}

export interface DocumentSearchParams extends PaginationParams {
  patientId?: string;
  practitionerId?: string;
  type?: string;
  status?: string;
  date?: string;
}


// ---------------------------------------------------------------------------
// Appointment Responses
// ---------------------------------------------------------------------------

export interface AppointmentResponseCreateRequest {
  /** Required — the appointment this response relates to */
  appointmentId: string;
  /** Required — accepted, declined, tentative, needs-action */
  participantStatus: 'accepted' | 'declined' | 'tentative' | 'needs-action';
  /** The participant (Patient, Practitioner, etc.) */
  actorId?: string;
  /** Role of participant in the appointment */
  participantType?: string;
  /** Proposed new start time (if different from appointment) */
  start?: string;
  /** Proposed new end time (if different from appointment) */
  end?: string;
  /** Additional comments */
  comment?: string;
}

export interface AppointmentResponseUpdateRequest {
  participantStatus?: 'accepted' | 'declined' | 'tentative' | 'needs-action';
  start?: string;
  end?: string;
  comment?: string;
}

export interface AppointmentResponseSearchParams extends PaginationParams {
  appointmentId?: string;
  actorId?: string;
  participantStatus?: string;
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export interface TaskInputOutput {
  /** Label for the input/output */
  type: string;
  /** Value — supports common types */
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueReference?: string;
}

export interface TaskCreateRequest {
  /** Required — draft, requested, received, accepted, rejected, ready, cancelled, in-progress, on-hold, failed, completed, entered-in-error */
  status: 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'cancelled' | 'in-progress' | 'on-hold' | 'failed' | 'completed';
  /** Required — unknown, proposal, plan, order, original-order, reflex-order, filler-order, instance-order, option */
  intent: 'unknown' | 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  /** Reason for current status */
  statusReason?: string;
  /** Business status (e.g. "Specimen collected", "IV prepped") */
  businessStatus?: string;
  /** Task priority */
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  /** Task type code */
  code?: string;
  /** Human-readable description */
  description?: string;
  /** What the task is acting on (resource reference) */
  focusId?: string;
  /** Beneficiary of the task (usually Patient ID) */
  patientId?: string;
  /** Encounter during which this task originated */
  encounterId?: string;
  /** Start and end time of execution */
  executionPeriod?: { start?: string; end?: string };
  /** When the task was authored (defaults to now) */
  authoredOn?: string;
  /** Who is requesting the task (Practitioner ID) */
  requesterId?: string;
  /** Who is responsible for the task (Practitioner ID) */
  ownerId?: string;
  /** Reason for the task */
  reasonCode?: string;
  /** Additional notes */
  note?: string;
  /** Request IDs this task fulfills */
  basedOn?: string[];
  /** Parent task IDs */
  partOf?: string[];
  /** Task inputs */
  input?: TaskInputOutput[];
  /** Task outputs */
  output?: TaskInputOutput[];
  /** Fulfillment restrictions */
  restriction?: {
    repetitions?: number;
    period?: { start?: string; end?: string };
    recipientIds?: string[];
  };
}

export interface TaskUpdateRequest {
  status?: 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'cancelled' | 'in-progress' | 'on-hold' | 'failed' | 'completed';
  statusReason?: string;
  businessStatus?: string;
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  description?: string;
  ownerId?: string;
  executionPeriod?: { start?: string; end?: string };
  note?: string;
  output?: TaskInputOutput[];
}

export interface TaskSearchParams extends PaginationParams {
  patientId?: string;
  ownerId?: string;
  requesterId?: string;
  status?: string;
  priority?: string;
  code?: string;
}

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------

export interface SlotCreateRequest {
  /** Required — the schedule this slot belongs to (Schedule resource ID) */
  scheduleId: string;
  /** Required — busy, free, busy-unavailable, busy-tentative */
  status: 'busy' | 'free' | 'busy-unavailable' | 'busy-tentative';
  /** Required — start time (ISO 8601) */
  start: string;
  /** Required — end time (ISO 8601) */
  end: string;
  /** Service category */
  serviceCategory?: string;
  /** Service type */
  serviceType?: string;
  /** Specialty */
  specialty?: string;
  /** Appointment type that can be booked */
  appointmentType?: string;
  /** Whether the slot has been overbooked */
  overbooked?: boolean;
  /** Additional comments */
  comment?: string;
}

export interface SlotUpdateRequest {
  status?: 'busy' | 'free' | 'busy-unavailable' | 'busy-tentative';
  overbooked?: boolean;
  comment?: string;
}

export interface SlotSearchParams extends PaginationParams {
  scheduleId?: string;
  status?: string;
  serviceType?: string;
  specialty?: string;
  dateFrom?: string;
  dateTo?: string;
}


// ---------------------------------------------------------------------------
// Organizations (FHIR Organization)
// ---------------------------------------------------------------------------

export interface OrganizationContactInput {
  /** Contact purpose (e.g. billing, admin, hr, press) */
  purpose?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface OrganizationCreateRequest {
  /** Organization name */
  name: string;
  /** Whether the organization is active */
  active?: boolean;
  /** Organization type (e.g. prov, dept, team, govt, ins, pay, edu, reli, crs, cg, bus, other) */
  type?: string[];
  /** Alternate names */
  alias?: string[];
  phone?: string;
  email?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  /** Parent organization ID */
  partOfId?: string;
  /** Contact people for the organization */
  contact?: OrganizationContactInput[];
}

export interface OrganizationUpdateRequest {
  name?: string;
  active?: boolean;
  type?: string[];
  alias?: string[];
  phone?: string;
  email?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  partOfId?: string;
  contact?: OrganizationContactInput[];
}

export interface OrganizationSearchParams extends PaginationParams {
  name?: string;
  type?: string;
  active?: boolean;
}

// ---------------------------------------------------------------------------
// Accounts (FHIR Account)
// ---------------------------------------------------------------------------

export interface AccountCoverageInput {
  /** Coverage resource ID */
  coverageId: string;
  /** Priority of this coverage */
  priority?: number;
}

export interface AccountGuarantorInput {
  /** Responsible party (Patient, RelatedPerson, or Organization reference) */
  partyId: string;
  /** Whether credit/hold is applied */
  onHold?: boolean;
  /** Guarantee period */
  period?: { start?: string; end?: string };
}

export interface AccountCreateRequest {
  /** Required — active, inactive, on-hold */
  status: 'active' | 'inactive' | 'on-hold';
  /** Account type (e.g. patient, expense, depreciation) */
  type?: string;
  /** Human-readable label */
  name?: string;
  /** Patient or entity the account is for */
  patientId?: string;
  /** Transaction window */
  servicePeriod?: { start?: string; end?: string };
  /** Insurance coverage */
  coverage?: AccountCoverageInput[];
  /** Organization managing the account */
  ownerId?: string;
  /** Explanation of purpose */
  description?: string;
  /** Guarantors responsible for the account */
  guarantor?: AccountGuarantorInput[];
  /** Parent account ID */
  partOfId?: string;
}

export interface AccountUpdateRequest {
  status?: 'active' | 'inactive' | 'on-hold';
  name?: string;
  description?: string;
  servicePeriod?: { start?: string; end?: string };
  coverage?: AccountCoverageInput[];
  guarantor?: AccountGuarantorInput[];
}

export interface AccountSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  type?: string;
  ownerId?: string;
}

// ---------------------------------------------------------------------------
// Healthcare Services (FHIR HealthcareService)
// ---------------------------------------------------------------------------

export interface HealthcareServiceAvailableTime {
  daysOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  allDay?: boolean;
  availableStartTime?: string;
  availableEndTime?: string;
}

export interface HealthcareServiceNotAvailable {
  description: string;
  during?: { start?: string; end?: string };
}

export interface HealthcareServiceCreateRequest {
  /** Service name */
  name: string;
  /** Whether the service is active */
  active?: boolean;
  /** Organization that provides this service */
  providedById?: string;
  /** Broad category (e.g. counselling, surgery, dental) */
  category?: string[];
  /** Service type (e.g. general-practice, cardiology) */
  type?: string[];
  /** Specialties handled */
  specialty?: string[];
  /** Location name(s) where service is provided */
  locationNames?: string[];
  /** Additional description */
  comment?: string;
  /** Extra details (markdown) */
  extraDetails?: string;
  phone?: string;
  email?: string;
  /** Whether an appointment is required */
  appointmentRequired?: boolean;
  /** Availability schedules */
  availableTime?: HealthcareServiceAvailableTime[];
  /** Periods when not available */
  notAvailable?: HealthcareServiceNotAvailable[];
  /** Free-text availability exceptions */
  availabilityExceptions?: string;
  /** Programs this service is part of */
  program?: string[];
  /** Referral methods accepted */
  referralMethod?: string[];
  /** Languages offered */
  communication?: string[];
}

export interface HealthcareServiceUpdateRequest {
  name?: string;
  active?: boolean;
  category?: string[];
  type?: string[];
  specialty?: string[];
  comment?: string;
  extraDetails?: string;
  phone?: string;
  email?: string;
  appointmentRequired?: boolean;
  availableTime?: HealthcareServiceAvailableTime[];
  notAvailable?: HealthcareServiceNotAvailable[];
  availabilityExceptions?: string;
}

export interface HealthcareServiceSearchParams extends PaginationParams {
  name?: string;
  type?: string;
  specialty?: string;
  active?: boolean;
}

// ---------------------------------------------------------------------------
// Service Requests (FHIR ServiceRequest)
// ---------------------------------------------------------------------------

export interface ServiceRequestCreateRequest {
  /** Required — draft, active, on-hold, revoked, completed */
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed';
  /** Required — proposal, plan, directive, order, original-order, reflex-order, filler-order, instance-order, option */
  intent: 'proposal' | 'plan' | 'directive' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  /** Patient ID */
  patientId: string;
  /** Encounter context */
  encounterId?: string;
  /** What is being requested (e.g. "CBC", "MRI Brain", "Physical Therapy") */
  code?: string | { system?: string; code: string; display?: string };
  /** Classification of service */
  category?: string[];
  /** Priority */
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  /** True if service should NOT be performed */
  doNotPerform?: boolean;
  /** When service should occur (point in time) */
  occurrenceDateTime?: string;
  /** When service should occur (time range) */
  occurrencePeriod?: { start?: string; end?: string };
  /** Whether the service is needed on an as-needed basis */
  asNeeded?: boolean;
  /** When the request was signed/authored */
  authoredOn?: string;
  /** Who is requesting the service (Practitioner ID) */
  requesterId?: string;
  /** Desired performer type */
  performerType?: string;
  /** Specific performer(s) (Practitioner IDs) */
  performerIds?: string[];
  /** Reason for the request */
  reasonCode?: string[];
  /** Body site(s) */
  bodySite?: string[];
  /** Additional notes */
  note?: string;
  /** Instructions for the patient */
  patientInstruction?: string;
  /** Request IDs this fulfills */
  basedOn?: string[];
  /** Request IDs this replaces */
  replaces?: string[];
}

export interface ServiceRequestUpdateRequest {
  status?: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed';
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  occurrenceDateTime?: string;
  occurrencePeriod?: { start?: string; end?: string };
  performerIds?: string[];
  note?: string;
  patientInstruction?: string;
}

export interface ServiceRequestSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  priority?: string;
  category?: string;
  requesterId?: string;
  performerId?: string;
  code?: string;
}


// ---------------------------------------------------------------------------
// Locations (FHIR Location)
// ---------------------------------------------------------------------------

export interface LocationHoursOfOperationInput {
  daysOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  allDay?: boolean;
  openingTime?: string;
  closingTime?: string;
}

export interface LocationCreateRequest {
  /** Location name */
  name: string;
  /** Location status */
  status?: 'active' | 'suspended' | 'inactive';
  /** Additional details about the location */
  description?: string;
  /** instance (specific place) or kind (class of locations) */
  mode?: 'instance' | 'kind';
  /** Location type codes */
  type?: string[];
  /** Alternate names */
  alias?: string[];
  phone?: string;
  email?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  /** Physical form (building, wing, room, bed, vehicle, etc.) */
  physicalType?: string;
  /** GPS coordinates */
  position?: {
    longitude: number;
    latitude: number;
    altitude?: number;
  };
  /** Organization that manages this location */
  managingOrganizationId?: string;
  /** Parent location ID */
  partOfId?: string;
  /** Operating hours */
  hoursOfOperation?: LocationHoursOfOperationInput[];
  /** Description of availability exceptions */
  availabilityExceptions?: string;
}

export interface LocationUpdateRequest {
  name?: string;
  status?: 'active' | 'suspended' | 'inactive';
  description?: string;
  mode?: 'instance' | 'kind';
  type?: string[];
  alias?: string[];
  phone?: string;
  email?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  physicalType?: string;
  position?: {
    longitude: number;
    latitude: number;
    altitude?: number;
  };
  managingOrganizationId?: string;
  partOfId?: string;
  hoursOfOperation?: LocationHoursOfOperationInput[];
  availabilityExceptions?: string;
}

export interface LocationSearchParams extends PaginationParams {
  name?: string;
  status?: string;
  type?: string;
  address?: string;
}

// ---------------------------------------------------------------------------
// Schedules (FHIR Schedule)
// ---------------------------------------------------------------------------

export interface ScheduleCreateRequest {
  /** Whether the schedule is active (default: true) */
  active?: boolean;
  /** Broad categorization of services */
  serviceCategory?: string[];
  /** Specific service types available */
  serviceType?: string[];
  /** Practitioner specialties */
  specialty?: string[];
  /** Required — references to Practitioner, Location, etc. */
  actorIds: string[];
  /** Period the schedule covers */
  planningHorizon?: {
    start?: string;
    end?: string;
  };
  /** Additional comments */
  comment?: string;
}

export interface ScheduleUpdateRequest {
  active?: boolean;
  serviceCategory?: string[];
  serviceType?: string[];
  specialty?: string[];
  actorIds?: string[];
  planningHorizon?: {
    start?: string;
    end?: string;
  };
  comment?: string;
}

export interface ScheduleSearchParams extends PaginationParams {
  actorId?: string;
  serviceType?: string;
  specialty?: string;
  active?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Persons (FHIR Person)
// ---------------------------------------------------------------------------

export interface PersonLinkInput {
  /** Target resource ID (Patient, Practitioner, RelatedPerson) */
  targetId: string;
  /** Assurance level: level1 (no match), level2 (some), level3 (high), level4 (verified) */
  assurance?: 'level1' | 'level2' | 'level3' | 'level4';
}

export interface PersonCreateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  /** Photo */
  photo?: { url?: string; data?: string; contentType?: string };
  /** Managing organization ID */
  managingOrganizationId?: string;
  /** Whether active (default: true) */
  active?: boolean;
  /** Links to other records (Patient, Practitioner, RelatedPerson) */
  link?: PersonLinkInput[];
}

export interface PersonUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  photo?: { url?: string; data?: string; contentType?: string };
  managingOrganizationId?: string;
  active?: boolean;
  link?: PersonLinkInput[];
}

export interface PersonSearchParams extends PaginationParams {
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

// ---------------------------------------------------------------------------
// Family Member History (FHIR FamilyMemberHistory)
// ---------------------------------------------------------------------------

export interface FamilyMemberHistoryConditionInput {
  /** Required — condition code or description */
  code: string;
  /** Outcome of the condition */
  outcome?: string;
  /** Whether the condition contributed to death */
  contributedToDeath?: boolean;
  /** Onset description (e.g. "Age 45", "In childhood") */
  onsetString?: string;
  /** Additional notes about the condition */
  note?: string;
}

export interface FamilyMemberHistoryCreateRequest {
  /** Required — partial, completed, health-unknown */
  status: 'partial' | 'completed' | 'health-unknown';
  /** Required — patient this history belongs to */
  patientId: string;
  /** When the history was recorded */
  date?: string;
  /** Family member's name */
  name?: string;
  /** Required — relationship to patient (mother, father, sibling, etc.) */
  relationship: string;
  /** Family member's sex */
  sex?: string;
  /** Family member's birth date */
  bornDate?: string;
  /** Approximate age (e.g. "around 50") */
  ageString?: string;
  /** Whether the age is estimated */
  estimatedAge?: boolean;
  /** Whether the family member is deceased */
  deceasedBoolean?: boolean;
  /** Date of death */
  deceasedDate?: string;
  /** Why the history was recorded */
  reasonCode?: string[];
  /** Additional notes */
  note?: string;
  /** Health conditions */
  condition?: FamilyMemberHistoryConditionInput[];
}

export interface FamilyMemberHistoryUpdateRequest {
  status?: 'partial' | 'completed' | 'health-unknown';
  date?: string;
  name?: string;
  relationship?: string;
  sex?: string;
  deceasedBoolean?: boolean;
  deceasedDate?: string;
  reasonCode?: string[];
  note?: string;
  condition?: FamilyMemberHistoryConditionInput[];
}

export interface FamilyMemberHistorySearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  relationship?: string;
  dateFrom?: string;
  dateTo?: string;
}


// ---------------------------------------------------------------------------
// Care Plans (FHIR CarePlan)
// ---------------------------------------------------------------------------

export interface CarePlanActivityInput {
  /** Activity description */
  description: string;
  /** Activity status (e.g. not-started, scheduled, in-progress, completed, cancelled) */
  status: string;
  /** Activity code */
  code?: string;
  /** Scheduled timing as text */
  scheduledString?: string;
  /** Performer (Practitioner ID) */
  performerId?: string;
  /** Reference to another resource */
  referenceId?: string;
}

export interface CarePlanCreateRequest {
  /** Required — draft, active, on-hold, revoked, completed */
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed';
  /** Required — proposal, plan, order, option */
  intent: 'proposal' | 'plan' | 'order' | 'option';
  /** Required — patient this care plan is for */
  patientId: string;
  /** Encounter context */
  encounterId?: string;
  /** Human-readable title */
  title?: string;
  /** Description of the care plan */
  description?: string;
  /** Category tags */
  category?: string[];
  /** Time period covered by the care plan */
  period?: { start?: string; end?: string };
  /** When the care plan was created (defaults to now) */
  created?: string;
  /** Author (Practitioner ID) */
  authorId?: string;
  /** Contributor Practitioner IDs */
  contributorIds?: string[];
  /** CareTeam IDs */
  careTeamIds?: string[];
  /** Condition IDs this plan addresses */
  addressesIds?: string[];
  /** Goal IDs */
  goalIds?: string[];
  /** Additional notes */
  note?: string;
  /** Planned activities */
  activity?: CarePlanActivityInput[];
  /** CarePlan IDs this is based on */
  basedOn?: string[];
  /** CarePlan IDs this replaces */
  replaces?: string[];
  /** CarePlan IDs this is part of */
  partOf?: string[];
}

export interface CarePlanUpdateRequest {
  status?: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed';
  title?: string;
  description?: string;
  note?: string;
  activity?: CarePlanActivityInput[];
}

export interface CarePlanSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  category?: string;
  authorId?: string;
}

// ---------------------------------------------------------------------------
// Immunizations (FHIR Immunization)
// ---------------------------------------------------------------------------

export interface ImmunizationCreateRequest {
  /** Required — completed, not-done */
  status: 'completed' | 'not-done';
  /** Required — vaccine code (string or coded) */
  vaccineCode: string | { system?: string; code: string; display?: string };
  /** Required — patient ID */
  patientId: string;
  /** Encounter context */
  encounterId?: string;
  /** When the immunization was administered (defaults to now) */
  occurrenceDateTime?: string;
  /** When the immunization was recorded */
  recorded?: string;
  /** Whether the content originates from the primary source */
  primarySource?: boolean;
  /** Vaccine manufacturer name */
  manufacturer?: string;
  /** Vaccine lot number */
  lotNumber?: string;
  /** Vaccine expiration date */
  expirationDate?: string;
  /** Body site (e.g. left arm, right deltoid) */
  site?: string;
  /** Route of administration (e.g. intramuscular, oral) */
  route?: string;
  /** Dose quantity */
  doseQuantity?: { value: number; unit?: string };
  /** Performers */
  performer?: Array<{ function?: string; actorId: string }>;
  /** Additional notes */
  note?: string;
  /** Reason codes */
  reasonCode?: string[];
  /** Reason for not-done status */
  statusReason?: string;
  /** Whether the dose is subpotent */
  isSubpotent?: boolean;
  /** Reactions observed */
  reaction?: Array<{ date?: string; reported?: boolean }>;
  /** Protocol applied */
  protocolApplied?: Array<{ series?: string; doseNumber?: number; seriesDoses?: number; targetDisease?: string[] }>;
}

export interface ImmunizationUpdateRequest {
  status?: 'completed' | 'not-done';
  statusReason?: string;
  note?: string;
}

export interface ImmunizationSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  vaccineCode?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Claims (FHIR Claim)
// ---------------------------------------------------------------------------

export interface ClaimCreateRequest {
  /** Required — active, cancelled, draft */
  status: 'active' | 'cancelled' | 'draft';
  /** Required — claim type (institutional, oral, pharmacy, professional, vision) */
  type: string;
  /** Required — claim, preauthorization, predetermination */
  use: 'claim' | 'preauthorization' | 'predetermination';
  /** Required — patient ID */
  patientId: string;
  /** When the claim was created (defaults to now) */
  created?: string;
  /** Required — provider (Practitioner/Organization ID) */
  providerId: string;
  /** Insurer (Organization ID) */
  insurerId?: string;
  /** Required — priority (normal, immediate, deferred, stat) */
  priority: string;
  /** Billable period */
  billablePeriod?: { start?: string; end?: string };
  /** Diagnoses */
  diagnosis?: Array<{ sequence: number; code: string }>;
  /** Procedures */
  procedure?: Array<{ sequence: number; code: string; date?: string }>;
  /** Required — insurance coverage */
  insurance: Array<{ sequence: number; focal: boolean; coverageId: string }>;
  /** Line items */
  item?: Array<{
    sequence: number;
    productOrService: string;
    quantity?: { value: number; unit?: string };
    unitPrice?: { value: number; currency?: string };
    net?: { value: number; currency?: string };
  }>;
  /** Total claim amount */
  total?: { value: number; currency?: string };
  /** Additional notes */
  note?: string;
}

export interface ClaimUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
}

export interface ClaimSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  use?: string;
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Claim Responses (FHIR ClaimResponse)
// ---------------------------------------------------------------------------

export interface ClaimResponseCreateRequest {
  /** Required — active, cancelled, draft */
  status: 'active' | 'cancelled' | 'draft';
  /** Required — claim type */
  type: string;
  /** Required — claim, preauthorization, predetermination */
  use: 'claim' | 'preauthorization' | 'predetermination';
  /** Required — patient ID */
  patientId: string;
  /** When the response was created (defaults to now) */
  created?: string;
  /** Required — insurer (Organization ID) */
  insurerId: string;
  /** Claim ID this responds to */
  requestId?: string;
  /** Required — queued, complete, error, partial */
  outcome: 'queued' | 'complete' | 'error' | 'partial';
  /** Disposition message */
  disposition?: string;
  /** Pre-authorization reference */
  preAuthRef?: string;
  /** Payee type */
  payeeType?: string;
  /** Adjudicated line items */
  item?: Array<{
    itemSequence: number;
    adjudication: Array<{ category: string; amount?: { value: number; currency?: string } }>;
  }>;
  /** Totals by category */
  total?: Array<{ category: string; amount: { value: number; currency?: string } }>;
  /** Payment details */
  payment?: { type: string; amount: { value: number; currency?: string }; date?: string };
  /** Processing notes */
  processNote?: Array<{ number?: number; text: string }>;
  /** Additional notes */
  note?: string;
}

export interface ClaimResponseUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
  disposition?: string;
}

export interface ClaimResponseSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  use?: string;
  outcome?: string;
  requestId?: string;
}


// ---------------------------------------------------------------------------
// Allergies (FHIR AllergyIntolerance)
// ---------------------------------------------------------------------------

export interface AllergyIntoleranceReactionInput {
  /** Substance that caused the reaction */
  substance?: string;
  /** Required — clinical symptoms/signs (e.g. "Hives", "Anaphylaxis") */
  manifestation: string[];
  /** Description of the reaction */
  description?: string;
  /** When the reaction occurred */
  onset?: string;
  /** Severity of the reaction */
  severity?: 'mild' | 'moderate' | 'severe';
  /** How the allergen was encountered */
  exposureRoute?: string;
  /** Additional notes */
  note?: string;
}

export interface AllergyIntoleranceCreateRequest {
  /** Required — patient this allergy belongs to */
  patientId: string;
  /** Clinical status */
  clinicalStatus?: 'active' | 'inactive' | 'resolved';
  /** Verification status */
  verificationStatus?: 'unconfirmed' | 'confirmed' | 'refuted';
  /** Allergy or intolerance */
  type?: 'allergy' | 'intolerance';
  /** Category of the allergen */
  category?: ('food' | 'medication' | 'environment' | 'biologic')[];
  /** Criticality of the allergy */
  criticality?: 'low' | 'high' | 'unable-to-assess';
  /** What the allergy is to (substance code or text) */
  code?: string | { system?: string; code: string; display?: string };
  /** Encounter context */
  encounterId?: string;
  /** When the allergy onset occurred */
  onsetDateTime?: string;
  /** Onset description */
  onsetString?: string;
  /** When the allergy was recorded */
  recordedDate?: string;
  /** Practitioner who recorded the allergy */
  recorderId?: string;
  /** Who asserted the allergy (Practitioner/Patient ID) */
  asserterId?: string;
  /** When the allergy last occurred */
  lastOccurrence?: string;
  /** Additional notes */
  note?: string;
  /** Adverse reactions */
  reaction?: AllergyIntoleranceReactionInput[];
}

export interface AllergyIntoleranceUpdateRequest {
  clinicalStatus?: 'active' | 'inactive' | 'resolved';
  verificationStatus?: 'unconfirmed' | 'confirmed' | 'refuted';
  note?: string;
  reaction?: AllergyIntoleranceReactionInput[];
}

export interface AllergyIntoleranceSearchParams extends PaginationParams {
  patientId?: string;
  clinicalStatus?: string;
  type?: string;
  category?: string;
  criticality?: string;
  code?: string;
}

// ---------------------------------------------------------------------------
// Care Teams (FHIR CareTeam)
// ---------------------------------------------------------------------------

export interface CareTeamParticipantInput {
  /** Role of the participant */
  role?: string;
  /** Required — member reference (Practitioner, Patient, Organization, etc.) */
  memberId: string;
  /** Organization the member represents */
  onBehalfOfId?: string;
  /** Period of participation */
  period?: { start?: string; end?: string };
}

export interface CareTeamCreateRequest {
  /** Required — team name */
  name: string;
  /** Team status */
  status?: 'proposed' | 'active' | 'suspended' | 'inactive';
  /** Team categories */
  category?: string[];
  /** Patient this team is for */
  patientId?: string;
  /** Encounter context */
  encounterId?: string;
  /** Active period */
  period?: { start?: string; end?: string };
  /** Team members */
  participant?: CareTeamParticipantInput[];
  /** Reason codes for the team */
  reasonCode?: string[];
  /** Managing organization IDs */
  managingOrganizationIds?: string[];
  /** Team phone number */
  phone?: string;
  /** Team email */
  email?: string;
  /** Additional notes */
  note?: string;
}

export interface CareTeamUpdateRequest {
  name?: string;
  status?: 'proposed' | 'active' | 'suspended' | 'inactive';
  participant?: CareTeamParticipantInput[];
  note?: string;
}

export interface CareTeamSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  category?: string;
}

// ---------------------------------------------------------------------------
// Conditions (FHIR Condition)
// ---------------------------------------------------------------------------

export interface ConditionStageInput {
  /** Stage summary (e.g. "Stage II", "Early stage") */
  summary?: string;
  /** Stage type (e.g. "clinical", "pathological") */
  type?: string;
}

export interface ConditionEvidenceInput {
  /** Evidence codes */
  code?: string[];
  /** Reference IDs to supporting evidence */
  detailIds?: string[];
}

export interface ConditionCreateRequest {
  /** Required — patient this condition belongs to */
  patientId: string;
  /** Clinical status */
  clinicalStatus?: 'active' | 'recurrence' | 'relapse' | 'inactive' | 'remission' | 'resolved';
  /** Verification status */
  verificationStatus?: 'unconfirmed' | 'provisional' | 'differential' | 'confirmed' | 'refuted';
  /** Condition category */
  category?: ('problem-list-item' | 'encounter-diagnosis')[];
  /** Severity */
  severity?: string;
  /** Condition code (ICD-10, SNOMED, or free text) */
  code?: string | { system?: string; code: string; display?: string };
  /** Body sites affected */
  bodySite?: string[];
  /** Encounter context */
  encounterId?: string;
  /** When the condition started */
  onsetDateTime?: string;
  /** Onset description */
  onsetString?: string;
  /** When the condition resolved */
  abatementDateTime?: string;
  /** Abatement description */
  abatementString?: string;
  /** When the condition was recorded */
  recordedDate?: string;
  /** Practitioner who recorded the condition */
  recorderId?: string;
  /** Who asserted the condition (Practitioner/Patient ID) */
  asserterId?: string;
  /** Clinical staging information */
  stage?: ConditionStageInput[];
  /** Supporting evidence */
  evidence?: ConditionEvidenceInput[];
  /** Additional notes */
  note?: string;
}

export interface ConditionUpdateRequest {
  clinicalStatus?: 'active' | 'recurrence' | 'relapse' | 'inactive' | 'remission' | 'resolved';
  verificationStatus?: 'unconfirmed' | 'provisional' | 'differential' | 'confirmed' | 'refuted';
  severity?: string;
  abatementDateTime?: string;
  abatementString?: string;
  note?: string;
  stage?: ConditionStageInput[];
  evidence?: ConditionEvidenceInput[];
}

export interface ConditionSearchParams extends PaginationParams {
  patientId?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  category?: string;
  severity?: string;
  code?: string;
}

// ---------------------------------------------------------------------------
// Charge Items (FHIR ChargeItem)
// ---------------------------------------------------------------------------

export interface ChargeItemPerformerInput {
  /** Performer function/role */
  function?: string;
  /** Required — performer reference */
  actorId: string;
}

export interface ChargeItemCreateRequest {
  /** Required — planned, billable, not-billable, aborted, billed */
  status: 'planned' | 'billable' | 'not-billable' | 'aborted' | 'billed';
  /** Required — billing code */
  code: string | { system?: string; code: string; display?: string };
  /** Required — patient ID */
  patientId: string;
  /** Encounter context */
  encounterId?: string;
  /** When the charge occurred (point in time) */
  occurrenceDateTime?: string;
  /** When the charge occurred (time range) */
  occurrencePeriod?: { start?: string; end?: string };
  /** Performers */
  performer?: ChargeItemPerformerInput[];
  /** Organization that performed the service */
  performingOrganizationId?: string;
  /** Organization that requested the service */
  requestingOrganizationId?: string;
  /** Quantity of the charge */
  quantity?: { value: number; unit?: string };
  /** Body sites */
  bodySite?: string[];
  /** Price override */
  priceOverride?: { value: number; currency?: string };
  /** Reason for price override */
  overrideReason?: string;
  /** When the charge was entered */
  enteredDate?: string;
  /** Reason codes */
  reason?: string[];
  /** Account IDs to charge */
  accountIds?: string[];
  /** Additional notes */
  note?: string;
}

export interface ChargeItemUpdateRequest {
  status?: 'planned' | 'billable' | 'not-billable' | 'aborted' | 'billed';
  note?: string;
}

export interface ChargeItemSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  code?: string;
  dateFrom?: string;
  dateTo?: string;
}


// ---------------------------------------------------------------------------
// Coverages (FHIR Coverage)
// ---------------------------------------------------------------------------

export interface CoverageCreateRequest {
  /** Required — active, cancelled, draft */
  status: 'active' | 'cancelled' | 'draft';
  /** Required — patient (beneficiary) ID */
  patientId: string;
  /** Coverage type (medical, dental, vision, pharmacy) */
  type?: string;
  /** Subscriber ID on the insurance card */
  subscriberId?: string;
  /** Subscriber reference (Patient/RelatedPerson) */
  subscriberRef?: string;
  /** Policy holder reference */
  policyHolderRef?: string;
  /** Relationship to subscriber (self, spouse, child, other) */
  relationship?: string;
  /** Coverage period */
  period?: { start?: string; end?: string };
  /** Required — payor Organization IDs */
  payorIds: string[];
  /** Coverage class (group, plan, subplan, etc.) */
  class?: Array<{ type: string; value: string; name?: string }>;
  /** Relative order of the coverage */
  order?: number;
  /** Insurance plan network */
  network?: string;
  /** Dependent number */
  dependent?: string;
  /** Subrogation flag */
  subrogation?: boolean;
}

export interface CoverageUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
  period?: { start?: string; end?: string };
  network?: string;
}

export interface CoverageSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  type?: string;
  payorId?: string;
}

// ---------------------------------------------------------------------------
// Eligibility Requests (FHIR CoverageEligibilityRequest)
// ---------------------------------------------------------------------------

export interface EligibilityRequestCreateRequest {
  /** Required — active, cancelled, draft */
  status: 'active' | 'cancelled' | 'draft';
  /** Required — purpose codes (auth-requirements, benefits, discovery, validation) */
  purpose: string[];
  /** Required — patient ID */
  patientId: string;
  /** When the request was created (defaults to now) */
  created?: string;
  /** Required — insurer Organization ID */
  insurerId: string;
  /** Provider (Practitioner/Organization ID) */
  providerId?: string;
  /** Serviced date (point in time) */
  servicedDate?: string;
  /** Serviced period */
  servicedPeriod?: { start?: string; end?: string };
  /** Insurance coverages to check */
  insurance?: Array<{ focal?: boolean; coverageId: string }>;
  /** Items to check eligibility for */
  item?: Array<{ category?: string; productOrService?: string }>;
}

export interface EligibilityRequestUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
}

export interface EligibilityRequestSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Eligibility Responses (FHIR CoverageEligibilityResponse)
// ---------------------------------------------------------------------------

export interface EligibilityResponseCreateRequest {
  /** Required — active, cancelled, draft */
  status: 'active' | 'cancelled' | 'draft';
  /** Required — purpose codes */
  purpose: string[];
  /** Required — patient ID */
  patientId: string;
  /** When the response was created (defaults to now) */
  created?: string;
  /** CoverageEligibilityRequest ID this responds to */
  requestId?: string;
  /** Required — queued, complete, error, partial */
  outcome: 'queued' | 'complete' | 'error' | 'partial';
  /** Required — insurer Organization ID */
  insurerId: string;
  /** Disposition message */
  disposition?: string;
  /** Insurance details */
  insurance?: Array<{ coverageId: string; inforce?: boolean; benefitPeriod?: { start?: string; end?: string } }>;
  /** Pre-authorization reference */
  preAuthRef?: string;
  /** Processing errors */
  error?: Array<{ code: string }>;
}

export interface EligibilityResponseUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
  disposition?: string;
}

export interface EligibilityResponseSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  outcome?: string;
  requestId?: string;
}

// ---------------------------------------------------------------------------
// Explanation of Benefit (FHIR ExplanationOfBenefit)
// ---------------------------------------------------------------------------

export interface EOBCreateRequest {
  /** Required — active, cancelled, draft */
  status: 'active' | 'cancelled' | 'draft';
  /** Required — EOB type (institutional, oral, pharmacy, professional, vision) */
  type: string;
  /** Required — claim, preauthorization, predetermination */
  use: 'claim' | 'preauthorization' | 'predetermination';
  /** Required — patient ID */
  patientId: string;
  /** When the EOB was created (defaults to now) */
  created?: string;
  /** Required — insurer Organization ID */
  insurerId: string;
  /** Required — provider (Practitioner/Organization ID) */
  providerId: string;
  /** Required — queued, complete, error, partial */
  outcome: 'queued' | 'complete' | 'error' | 'partial';
  /** Disposition message */
  disposition?: string;
  /** Claim ID this EOB relates to */
  claimId?: string;
  /** ClaimResponse ID this EOB relates to */
  claimResponseId?: string;
  /** Billable period */
  billablePeriod?: { start?: string; end?: string };
  /** Required — insurance coverage */
  insurance: Array<{ focal: boolean; coverageId: string }>;
  /** Line items */
  item?: Array<{
    sequence: number;
    productOrService: string;
    quantity?: { value: number; unit?: string };
    unitPrice?: { value: number; currency?: string };
    net?: { value: number; currency?: string };
    adjudication?: Array<{ category: string; amount?: { value: number; currency?: string } }>;
  }>;
  /** Totals by category */
  total?: Array<{ category: string; amount: { value: number; currency?: string } }>;
  /** Payment details */
  payment?: { type: string; amount: { value: number; currency?: string }; date?: string };
  /** Processing notes */
  processNote?: Array<{ number?: number; text: string }>;
}

export interface EOBUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
  disposition?: string;
}

export interface EOBSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  use?: string;
  outcome?: string;
  claimId?: string;
}


// ---------------------------------------------------------------------------
// Devices (FHIR Device)
// ---------------------------------------------------------------------------

export interface DeviceCreateRequest {
  /** Device status */
  status?: 'active' | 'inactive';
  /** Required — user-friendly device name */
  deviceName: string;
  /** Manufacturer name */
  manufacturer?: string;
  /** Model number */
  modelNumber?: string;
  /** Serial number */
  serialNumber?: string;
  /** Lot number */
  lotNumber?: string;
  /** Date of manufacture */
  manufactureDate?: string;
  /** Expiration date */
  expirationDate?: string;
  /** Device type/kind */
  type?: string;
  /** Patient this device is affixed to */
  patientId?: string;
  /** Organization responsible for the device */
  ownerId?: string;
  /** Location where the device is found */
  locationId?: string;
  /** Network address of the device */
  url?: string;
  /** Additional notes */
  note?: string;
  /** Parent device ID */
  parentId?: string;
  /** UDI carrier information */
  udiCarrier?: Array<{ deviceIdentifier?: string; carrierHRF?: string }>;
  /** Safety codes */
  safety?: string[];
}

export interface DeviceUpdateRequest {
  status?: 'active' | 'inactive';
  note?: string;
  locationId?: string;
  patientId?: string;
}

export interface DeviceSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  type?: string;
  manufacturer?: string;
  modelNumber?: string;
}

// ---------------------------------------------------------------------------
// Device Requests (FHIR DeviceRequest)
// ---------------------------------------------------------------------------

export interface DeviceRequestCreateRequest {
  /** Request status */
  status?: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed';
  /** Required — the intent of the request */
  intent: 'proposal' | 'plan' | 'directive' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  /** Required — device being requested (text or coded) */
  code: string | { system?: string; code: string; display?: string };
  /** Required — patient ID */
  patientId: string;
  /** Encounter during which the request was made */
  encounterId?: string;
  /** Priority of the request */
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  /** When the device should be used (point in time) */
  occurrenceDateTime?: string;
  /** When the device should be used (period) */
  occurrencePeriod?: { start?: string; end?: string };
  /** When the request was authored (defaults to now) */
  authoredOn?: string;
  /** Practitioner who made the request */
  requesterId?: string;
  /** Who should fulfill the request */
  performerId?: string;
  /** Type of performer */
  performerType?: string;
  /** Reason codes for the request */
  reasonCode?: string[];
  /** Additional notes */
  note?: string;
  /** IDs of resources this request is based on */
  basedOn?: string[];
}

export interface DeviceRequestUpdateRequest {
  status?: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed';
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  note?: string;
}

export interface DeviceRequestSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  intent?: string;
  code?: string;
}

// ---------------------------------------------------------------------------
// Device Use Statements (FHIR DeviceUseStatement)
// ---------------------------------------------------------------------------

export interface DeviceUseStatementCreateRequest {
  /** Required — statement status (FHIR R4 device-statement-status value set;
   *  'not-done' is NOT in it — HealthLake rejects it) */
  status: 'active' | 'completed' | 'on-hold' | 'intended' | 'stopped' | 'entered-in-error';
  /** Required — patient ID */
  patientId: string;
  /** Required — device reference */
  deviceId: string;
  /** When the device was used (point in time) */
  timingDateTime?: string;
  /** When the device was used (period) */
  timingPeriod?: { start?: string; end?: string };
  /** When the statement was recorded */
  recordedOn?: string;
  /** Who made the statement (Practitioner/Patient ID) */
  sourceId?: string;
  /** Reason codes for device use */
  reasonCode?: string[];
  /** Body site where device was used */
  bodySite?: string;
  /** Additional notes */
  note?: string;
  /** ServiceRequest IDs this statement is based on */
  basedOn?: string[];
}

export interface DeviceUseStatementUpdateRequest {
  status?: 'active' | 'completed' | 'on-hold' | 'intended' | 'stopped' | 'entered-in-error';
  note?: string;
}

export interface DeviceUseStatementSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  deviceId?: string;
}

// ---------------------------------------------------------------------------
// Goals (FHIR Goal)
// ---------------------------------------------------------------------------

export interface GoalCreateRequest {
  /** Required — lifecycle status */
  lifecycleStatus: 'proposed' | 'planned' | 'accepted' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'rejected';
  /** Achievement status */
  achievementStatus?: 'in-progress' | 'improving' | 'worsening' | 'no-change' | 'achieved' | 'sustaining' | 'not-achieved' | 'no-progress' | 'not-attainable';
  /** Required — what the goal is */
  description: string;
  /** Required — patient ID */
  patientId: string;
  /** Goal categories (treatment, dietary, behavioral, etc.) */
  category?: string[];
  /** Priority level */
  priority?: 'high-priority' | 'medium-priority' | 'low-priority';
  /** When pursuit of the goal began */
  startDate?: string;
  /** Target outcomes */
  target?: Array<{
    measure?: string;
    detailString?: string;
    detailQuantity?: { value: number; unit?: string };
    dueDate?: string;
  }>;
  /** When goal status was last changed */
  statusDate?: string;
  /** Reason for current status */
  statusReason?: string;
  /** Who created the goal (Practitioner/Patient ID) */
  expressedById?: string;
  /** Condition/Observation IDs this goal addresses */
  addressesIds?: string[];
  /** Additional notes */
  note?: string;
  /** Outcome codes */
  outcomeCode?: string[];
}

export interface GoalUpdateRequest {
  lifecycleStatus?: 'proposed' | 'planned' | 'accepted' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'rejected';
  achievementStatus?: 'in-progress' | 'improving' | 'worsening' | 'no-change' | 'achieved' | 'sustaining' | 'not-achieved' | 'no-progress' | 'not-attainable';
  statusReason?: string;
  note?: string;
  target?: Array<{
    measure?: string;
    detailString?: string;
    detailQuantity?: { value: number; unit?: string };
    dueDate?: string;
  }>;
}

export interface GoalSearchParams extends PaginationParams {
  patientId?: string;
  lifecycleStatus?: string;
  achievementStatus?: string;
  category?: string;
}


// ---------------------------------------------------------------------------
// Invoices (FHIR Invoice)
// ---------------------------------------------------------------------------

export interface InvoiceCreateRequest {
  /** Required — invoice status */
  status: 'draft' | 'issued' | 'balanced' | 'cancelled';
  /** Patient the invoice is for */
  patientId?: string;
  /** Invoice type */
  type?: string;
  /** Recipient (Organization/Patient reference) */
  recipientId?: string;
  /** Invoice date (defaults to now) */
  date?: string;
  /** Issuing Organization ID */
  issuerId?: string;
  /** Account ID */
  accountId?: string;
  /** Participants involved in the invoice */
  participant?: Array<{ role?: string; actorId: string }>;
  /** Line items */
  lineItem?: Array<{
    sequence?: number;
    chargeItemCode: string;
    priceComponent?: Array<{
      type: string;
      amount?: { value: number; currency?: string };
    }>;
  }>;
  /** Total net amount */
  totalNet?: { value: number; currency?: string };
  /** Total gross amount */
  totalGross?: { value: number; currency?: string };
  /** Payment terms */
  paymentTerms?: string;
  /** Reason for cancellation */
  cancelledReason?: string;
  /** Additional notes */
  note?: string;
}

export interface InvoiceUpdateRequest {
  status?: 'draft' | 'issued' | 'balanced' | 'cancelled';
  cancelledReason?: string;
  note?: string;
}

export interface InvoiceSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  issuerId?: string;
}

// ---------------------------------------------------------------------------
// Medication Dispenses (FHIR MedicationDispense)
// ---------------------------------------------------------------------------

export interface MedicationDispenseCreateRequest {
  /** Required — dispense status */
  status: 'preparation' | 'in-progress' | 'cancelled' | 'on-hold' | 'completed' | 'stopped' | 'declined';
  /** Required — medication code or name */
  medication: string | { system?: string; code: string; display?: string };
  /** Required — patient ID */
  patientId: string;
  /** Encounter ID */
  encounterId?: string;
  /** Reason for current status */
  statusReasonCodeableConcept?: string;
  /** Category of dispense */
  category?: string;
  /** Performers */
  performer?: Array<{ function?: string; actorId: string }>;
  /** Location ID */
  locationId?: string;
  /** Authorizing prescription (MedicationRequest) IDs */
  authorizingPrescriptionIds?: string[];
  /** Type of dispense (trial fill, partial fill, emergency fill) */
  type?: string;
  /** Quantity dispensed */
  quantity?: { value: number; unit?: string };
  /** Number of days supply */
  daysSupply?: number;
  /** When the dispense was prepared */
  whenPrepared?: string;
  /** When the medication was handed over */
  whenHandedOver?: string;
  /** Dosage instructions text */
  dosageText?: string;
  /** Substitution details */
  substitution?: { wasSubstituted: boolean; type?: string; reason?: string };
  /** Additional notes */
  note?: string;
}

export interface MedicationDispenseUpdateRequest {
  status?: 'preparation' | 'in-progress' | 'cancelled' | 'on-hold' | 'completed' | 'stopped' | 'declined';
  statusReasonCodeableConcept?: string;
  note?: string;
}

export interface MedicationDispenseSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  medication?: string;
}

// ---------------------------------------------------------------------------
// Medication Knowledge (FHIR MedicationKnowledge)
// ---------------------------------------------------------------------------

export interface MedicationKnowledgeCreateRequest {
  /** Medication code or name */
  code?: string | { system?: string; code: string; display?: string };
  /** Status (default: active) */
  status?: 'active' | 'inactive';
  /** Manufacturer name */
  manufacturer?: string;
  /** Dose form (e.g. tablet, capsule) */
  doseForm?: string;
  /** Amount of drug in package */
  amount?: { value: number; unit?: string };
  /** Synonyms / alternate names */
  synonym?: string[];
  /** Product types */
  productType?: string[];
  /** Ingredients */
  ingredient?: Array<{
    item: string | { system?: string; code: string; display?: string };
    isActive?: boolean;
    strength?: {
      numerator: { value: number; unit: string };
      denominator: { value: number; unit: string };
    };
  }>;
  /** Preparation instructions */
  preparationInstruction?: string;
  /** Intended routes of administration */
  intendedRoute?: string[];
  /** Cost information */
  cost?: Array<{
    type: string;
    source?: string;
    cost: { value: number; currency?: string };
  }>;
  /** Packaging details */
  packaging?: {
    type?: string;
    quantity?: { value: number; unit?: string };
  };
}

export interface MedicationKnowledgeUpdateRequest {
  status?: 'active' | 'inactive';
  doseForm?: string;
  preparationInstruction?: string;
}

export interface MedicationKnowledgeSearchParams extends PaginationParams {
  code?: string;
  status?: string;
  doseForm?: string;
  manufacturer?: string;
}

// ---------------------------------------------------------------------------
// Medication Statements (FHIR MedicationStatement)
// ---------------------------------------------------------------------------

export interface MedicationStatementCreateRequest {
  /** Required — statement status */
  status: 'active' | 'completed' | 'stopped' | 'on-hold' | 'intended' | 'not-taken';
  /** Required — medication code or name */
  medication: string | { system?: string; code: string; display?: string };
  /** Required — patient ID */
  patientId: string;
  /** Encounter ID */
  encounterId?: string;
  /** Reasons for current status */
  statusReason?: string[];
  /** Category of medication usage */
  category?: string;
  /** When the medication was taken (point in time) */
  effectiveDateTime?: string;
  /** When the medication was taken (period) */
  effectivePeriod?: { start?: string; end?: string };
  /** When the statement was asserted */
  dateAsserted?: string;
  /** Who provided the information (Patient/Practitioner ID) */
  informationSourceId?: string;
  /** Reason codes for taking the medication */
  reasonCode?: string[];
  /** Dosage instructions text */
  dosageText?: string;
  /** Additional notes */
  note?: string;
  /** Based on (MedicationRequest/CarePlan/ServiceRequest IDs) */
  basedOn?: string[];
  /** Part of (other resource IDs) */
  partOf?: string[];
}

export interface MedicationStatementUpdateRequest {
  status?: 'active' | 'completed' | 'stopped' | 'on-hold' | 'intended' | 'not-taken';
  statusReason?: string[];
  note?: string;
  effectiveDateTime?: string;
  effectivePeriod?: { start?: string; end?: string };
}

export interface MedicationStatementSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  medication?: string;
  category?: string;
}


// ---------------------------------------------------------------------------
// Payment Notices (FHIR PaymentNotice)
// ---------------------------------------------------------------------------

export interface PaymentNoticeCreateRequest {
  /** Required — active, cancelled, draft */
  status: 'active' | 'cancelled' | 'draft';
  /** When created (defaults to now) */
  created?: string;
  /** Provider (Practitioner/Organization) reference */
  providerId?: string;
  /** Required — PaymentReconciliation ID */
  paymentId: string;
  /** Date of payment */
  paymentDate?: string;
  /** Payee (Practitioner/Organization) reference */
  payeeId?: string;
  /** Required — recipient Organization ID */
  recipientId: string;
  /** Required — payment amount */
  amount: { value: number; currency?: string };
  /** Payment status (e.g. paid, cleared) */
  paymentStatus?: string;
  /** Reference to any request resource */
  requestId?: string;
  /** Reference to any response resource */
  responseId?: string;
}

export interface PaymentNoticeUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
  paymentStatus?: string;
}

export interface PaymentNoticeSearchParams extends PaginationParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  providerId?: string;
}

// ---------------------------------------------------------------------------
// Payment Reconciliations (FHIR PaymentReconciliation)
// ---------------------------------------------------------------------------

export interface PaymentReconciliationCreateRequest {
  /** Required — active, cancelled, draft */
  status: 'active' | 'cancelled' | 'draft';
  /** When created (defaults to now) */
  created?: string;
  /** Payment issuer Organization ID */
  paymentIssuerId?: string;
  /** Task ID this reconciliation is for */
  requestId?: string;
  /** Requestor (Practitioner/Organization) reference */
  requestorId?: string;
  /** Processing outcome */
  outcome?: 'queued' | 'complete' | 'error' | 'partial';
  /** Disposition message */
  disposition?: string;
  /** Required — date of payment */
  paymentDate: string;
  /** Required — total payment amount */
  paymentAmount: { value: number; currency?: string };
  /** Period covered */
  period?: { start?: string; end?: string };
  /** Payment detail lines */
  detail?: Array<{
    type: string;
    requestId?: string;
    submitterId?: string;
    payeeId?: string;
    date?: string;
    amount?: { value: number; currency?: string };
  }>;
  /** Processing notes */
  processNote?: Array<{
    type?: string;
    text: string;
  }>;
}

export interface PaymentReconciliationUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
  disposition?: string;
  outcome?: 'queued' | 'complete' | 'error' | 'partial';
}

export interface PaymentReconciliationSearchParams extends PaginationParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  outcome?: string;
}

// ---------------------------------------------------------------------------
// Specimens (FHIR Specimen)
// ---------------------------------------------------------------------------

export interface SpecimenCreateRequest {
  /** Specimen status */
  status?: 'available' | 'unavailable' | 'unsatisfactory';
  /** Specimen type (e.g. blood, urine, tissue) */
  type?: string;
  /** Required — patient ID */
  patientId: string;
  /** When the specimen was received */
  receivedTime?: string;
  /** Parent specimen IDs */
  parentIds?: string[];
  /** ServiceRequest IDs */
  requestIds?: string[];
  /** Collection details */
  collection?: {
    collectorId?: string;
    collectedDateTime?: string;
    quantity?: { value: number; unit?: string };
    method?: string;
    bodySite?: string;
  };
  /** Container details */
  container?: Array<{
    description?: string;
    type?: string;
    capacity?: { value: number; unit?: string };
    specimenQuantity?: { value: number; unit?: string };
  }>;
  /** Specimen condition codes */
  condition?: string[];
  /** Additional notes */
  note?: string;
}

export interface SpecimenUpdateRequest {
  status?: 'available' | 'unavailable' | 'unsatisfactory';
  note?: string;
  condition?: string[];
}

export interface SpecimenSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Imaging Studies (FHIR ImagingStudy)
// ---------------------------------------------------------------------------

export interface ImagingStudyCreateRequest {
  /** Required — registered, available, cancelled */
  status: 'registered' | 'available' | 'cancelled';
  /** Required — patient ID */
  patientId: string;
  /** Encounter ID */
  encounterId?: string;
  /** Imaging modalities (e.g. CT, MR, US, XR, NM, PT) */
  modality?: string[];
  /** When the study started */
  started?: string;
  /** Referring practitioner ID */
  referrerId?: string;
  /** Interpreting practitioner IDs */
  interpreterIds?: string[];
  /** Number of series in the study */
  numberOfSeries?: number;
  /** Number of instances in the study */
  numberOfInstances?: number;
  /** Procedure codes */
  procedureCode?: string[];
  /** Location ID */
  locationId?: string;
  /** Reason codes */
  reasonCode?: string[];
  /** Study description */
  description?: string;
  /** Additional notes */
  note?: string;
  /** Based on (ServiceRequest/CarePlan IDs) */
  basedOn?: string[];
  /** Series data */
  series?: Array<{
    uid: string;
    number?: number;
    modality: string;
    description?: string;
    numberOfInstances?: number;
    bodySite?: string;
    laterality?: string;
    started?: string;
  }>;
}

export interface ImagingStudyUpdateRequest {
  status?: 'registered' | 'available' | 'cancelled';
  description?: string;
  note?: string;
}

export interface ImagingStudySearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  modality?: string;
  dateFrom?: string;
  dateTo?: string;
}


// ---------------------------------------------------------------------------
// Enrollment Requests (FHIR EnrollmentRequest)
// ---------------------------------------------------------------------------

export interface EnrollmentRequestCreateRequest {
  /** Status — active, cancelled, draft (defaults to active) */
  status?: 'active' | 'cancelled' | 'draft';
  /** When created (defaults to now) */
  created?: string;
  /** Insurer Organization ID */
  insurerId?: string;
  /** Provider (Practitioner/Organization ID) */
  providerId?: string;
  /** Required — Patient ID (the candidate for enrollment) */
  candidateId: string;
  /** Coverage ID */
  coverageId?: string;
}

export interface EnrollmentRequestUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
}

export interface EnrollmentRequestSearchParams extends PaginationParams {
  candidateId?: string;
  status?: string;
  insurerId?: string;
}

// ---------------------------------------------------------------------------
// Enrollment Responses (FHIR EnrollmentResponse)
// ---------------------------------------------------------------------------

export interface EnrollmentResponseCreateRequest {
  /** Status — active, cancelled, draft (defaults to active) */
  status?: 'active' | 'cancelled' | 'draft';
  /** EnrollmentRequest ID */
  requestId?: string;
  /** Processing outcome */
  outcome?: 'queued' | 'complete' | 'error' | 'partial';
  /** Disposition message */
  disposition?: string;
  /** When created (defaults to now) */
  created?: string;
  /** Insurer Organization ID */
  organizationId?: string;
  /** Request provider (Practitioner/Organization ID) */
  requestProviderId?: string;
}

export interface EnrollmentResponseUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
  disposition?: string;
}

export interface EnrollmentResponseSearchParams extends PaginationParams {
  status?: string;
  outcome?: string;
}

// ---------------------------------------------------------------------------
// Immunization Evaluations (FHIR ImmunizationEvaluation)
// ---------------------------------------------------------------------------

export interface ImmunizationEvaluationCreateRequest {
  /** Required — completed */
  status: 'completed';
  /** Required — Patient ID */
  patientId: string;
  /** Evaluation date */
  date?: string;
  /** Authority Organization ID */
  authorityId?: string;
  /** Required — disease being evaluated against */
  targetDisease: string;
  /** Required — Immunization ID */
  immunizationEventId: string;
  /** Required — valid, not-valid */
  doseStatus: string;
  /** Reasons for the dose status */
  doseStatusReason?: string[];
  /** Description of the evaluation */
  description?: string;
  /** Vaccine series name */
  series?: string;
  /** Dose number within series */
  doseNumber?: number;
  /** Recommended number of doses for series */
  seriesDoses?: number;
}

export interface ImmunizationEvaluationUpdateRequest {
  status?: 'completed';
  description?: string;
}

export interface ImmunizationEvaluationSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  immunizationEventId?: string;
  targetDisease?: string;
}

// ---------------------------------------------------------------------------
// Media (FHIR Media)
// ---------------------------------------------------------------------------

export interface MediaCreateRequest {
  /** Required — preparation, in-progress, not-done, on-hold, stopped, completed */
  status: 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed';
  /** Type of media — image, video, audio */
  type?: string;
  /** Acquisition equipment type */
  modality?: string;
  /** Imaging view */
  view?: string;
  /** Patient ID */
  patientId?: string;
  /** Encounter ID */
  encounterId?: string;
  /** When the media was created */
  createdDateTime?: string;
  /** When the media was issued */
  issued?: string;
  /** Operator Practitioner ID */
  operatorId?: string;
  /** Reason codes */
  reasonCode?: string[];
  /** Body site */
  bodySite?: string;
  /** Device name */
  deviceName?: string;
  /** Device ID */
  deviceId?: string;
  /** Image height in pixels */
  height?: number;
  /** Image width in pixels */
  width?: number;
  /** Number of frames (for multi-frame images) */
  frames?: number;
  /** Duration in seconds (for video/audio) */
  duration?: number;
  /** Required — media content */
  content: {
    contentType: string;
    data?: string;
    url?: string;
    title?: string;
  };
  /** Additional notes */
  note?: string;
  /** Based on (ServiceRequest/CarePlan IDs) */
  basedOn?: string[];
}

export interface MediaUpdateRequest {
  status?: 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed';
  note?: string;
}

export interface MediaSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  type?: string;
  modality?: string;
  dateFrom?: string;
  dateTo?: string;
}


// ---------------------------------------------------------------------------
// Activity Definitions (FHIR ActivityDefinition)
// ---------------------------------------------------------------------------

export interface ActivityDefinitionCreateRequest {
  /** Required — draft, active, retired */
  status: 'draft' | 'active' | 'retired';
  /** Computer-friendly name */
  name?: string;
  /** Human-friendly title */
  title?: string;
  /** Description of the activity */
  description?: string;
  /** Why this activity definition is defined */
  purpose?: string;
  /** Describes the clinical usage */
  usage?: string;
  /** Kind of resource (Appointment, MedicationRequest, ServiceRequest, Task, etc.) */
  kind?: string;
  /** Activity code — string or coded concept */
  code?: string | { system?: string; code: string; display?: string };
  /** Intent of the activity */
  intent?: 'proposal' | 'plan' | 'directive' | 'order';
  /** Priority of the activity */
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  /** True if the activity should NOT be performed */
  doNotPerform?: boolean;
  /** When the activity should occur (point in time) */
  timingDateTime?: string;
  /** When the activity should occur (period) */
  timingPeriod?: { start?: string; end?: string };
  /** Location ID where the activity occurs */
  locationId?: string;
  /** Participants in the activity */
  participant?: Array<{ type: string; role?: string }>;
  /** Quantity of the activity */
  quantity?: { value: number; unit?: string };
  /** Body sites for the activity */
  bodySite?: string[];
  /** Publisher of the definition */
  publisher?: string;
  /** Date of publication */
  date?: string;
  /** Business version */
  version?: string;
  /** Canonical URL */
  url?: string;
  /** For testing purposes, not real usage */
  experimental?: boolean;
  /** Topic categories */
  topic?: string[];
}

export interface ActivityDefinitionUpdateRequest {
  status?: 'draft' | 'active' | 'retired';
  title?: string;
  description?: string;
  version?: string;
}

export interface ActivityDefinitionSearchParams extends PaginationParams {
  status?: string;
  name?: string;
  title?: string;
  kind?: string;
  code?: string;
}

// ---------------------------------------------------------------------------
// Nutrition Orders (FHIR NutritionOrder)
// ---------------------------------------------------------------------------

export interface NutritionOrderCreateRequest {
  /** Required — draft, active, on-hold, revoked, completed */
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed';
  /** Required — proposal, plan, directive, order */
  intent: 'proposal' | 'plan' | 'directive' | 'order';
  /** Required — Patient ID */
  patientId: string;
  /** Encounter ID */
  encounterId?: string;
  /** Date/time of the order (defaults to now) */
  dateTime?: string;
  /** Ordering practitioner ID */
  ordererId?: string;
  /** AllergyIntolerance IDs to consider */
  allergyIntoleranceIds?: string[];
  /** Food preference modifiers */
  foodPreferenceModifier?: string[];
  /** Foods to exclude */
  excludeFoodModifier?: string[];
  /** Oral diet specification */
  oralDiet?: {
    type?: string[];
    instruction?: string;
    nutrient?: Array<{ modifier?: string; amount?: { value: number; unit?: string } }>;
  };
  /** Supplement specification */
  supplement?: Array<{
    type?: string;
    productName?: string;
    quantity?: { value: number; unit?: string };
    instruction?: string;
  }>;
  /** Enteral formula specification */
  enteralFormula?: {
    baseFormulaType?: string;
    baseFormulaProductName?: string;
    additiveType?: string;
    routeOfAdministration?: string;
    administrationInstruction?: string;
  };
  /** Additional notes */
  note?: string;
}

export interface NutritionOrderUpdateRequest {
  status?: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed';
  note?: string;
}

export interface NutritionOrderSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Plan Definitions (FHIR PlanDefinition)
// ---------------------------------------------------------------------------

export interface PlanDefinitionCreateRequest {
  /** Required — draft, active, retired */
  status: 'draft' | 'active' | 'retired';
  /** Computer-friendly name */
  name?: string;
  /** Human-friendly title */
  title?: string;
  /** Type of plan (order-set, clinical-protocol, eca-rule, workflow-definition) */
  type?: string;
  /** Description of the plan */
  description?: string;
  /** Why this plan definition is defined */
  purpose?: string;
  /** Describes the clinical usage */
  usage?: string;
  /** Publisher of the definition */
  publisher?: string;
  /** Date of publication */
  date?: string;
  /** Business version */
  version?: string;
  /** Canonical URL */
  url?: string;
  /** For testing purposes, not real usage */
  experimental?: boolean;
  /** Topic categories */
  topic?: string[];
  /** Goals of the plan */
  goal?: Array<{ description: string; priority?: string; category?: string }>;
  /** Actions in the plan */
  action?: Array<{
    title?: string;
    description?: string;
    priority?: string;
    code?: string;
    type?: string;
    definitionUri?: string;
  }>;
}

export interface PlanDefinitionUpdateRequest {
  status?: 'draft' | 'active' | 'retired';
  title?: string;
  description?: string;
  version?: string;
}

export interface PlanDefinitionSearchParams extends PaginationParams {
  status?: string;
  name?: string;
  title?: string;
  type?: string;
}

// ---------------------------------------------------------------------------
// Vision Prescriptions (FHIR VisionPrescription)
// ---------------------------------------------------------------------------

export interface VisionPrescriptionCreateRequest {
  /** Required — active, cancelled, draft */
  status: 'active' | 'cancelled' | 'draft';
  /** Required — Patient ID */
  patientId: string;
  /** Encounter ID */
  encounterId?: string;
  /** When created (defaults to now) */
  created?: string;
  /** Required — date the prescription was written */
  dateWritten: string;
  /** Required — prescribing Practitioner ID */
  prescriberId: string;
  /** Required — lens specifications */
  lensSpecification: Array<{
    product: string;
    eye: 'right' | 'left';
    sphere?: number;
    cylinder?: number;
    axis?: number;
    add?: number;
    power?: number;
    backCurve?: number;
    diameter?: number;
    color?: string;
    brand?: string;
    note?: string;
    prism?: Array<{ amount: number; base: 'up' | 'down' | 'in' | 'out' }>;
  }>;
}

export interface VisionPrescriptionUpdateRequest {
  status?: 'active' | 'cancelled' | 'draft';
}

export interface VisionPrescriptionSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  prescriberId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Risk Assessments (FHIR RiskAssessment)
// ---------------------------------------------------------------------------

export interface RiskAssessmentCreateRequest {
  /** Required — registered, preliminary, final, amended */
  status: 'registered' | 'preliminary' | 'final' | 'amended';
  /** Required — Patient ID */
  patientId: string;
  /** Encounter ID */
  encounterId?: string;
  /** Assessment method */
  method?: string;
  /** Assessment code */
  code?: string;
  /** When the assessment occurred */
  occurrenceDateTime?: string;
  /** Condition being assessed (Condition ID) */
  conditionId?: string;
  /** Performing practitioner ID */
  performerId?: string;
  /** Reason codes for the assessment */
  reasonCode?: string[];
  /** Risk predictions */
  prediction?: Array<{
    outcome?: string;
    probabilityDecimal?: number;
    qualitativeRisk?: string;
    relativeRisk?: number;
    rationale?: string;
  }>;
  /** Mitigation actions */
  mitigation?: string;
  /** Additional notes */
  note?: string;
  /** Based on (reference ID) */
  basedOnId?: string;
}

export interface RiskAssessmentUpdateRequest {
  status?: 'registered' | 'preliminary' | 'final' | 'amended';
  mitigation?: string;
  note?: string;
  prediction?: Array<{
    outcome?: string;
    probabilityDecimal?: number;
    qualitativeRisk?: string;
    relativeRisk?: number;
    rationale?: string;
  }>;
}

export interface RiskAssessmentSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  method?: string;
  conditionId?: string;
}


// ---------------------------------------------------------------------------
// Audit Events (FHIR AuditEvent)
// ---------------------------------------------------------------------------

export interface AuditEventCreateRequest {
  /** Required — event type code (e.g. "rest", "login", "export") */
  type: string;
  /** Subtypes */
  subtype?: string[];
  /** Action code: C, R, U, D, E */
  action?: string;
  /** Required — ISO 8601 timestamp */
  recorded: string;
  /** Outcome: 0=success, 4=minor failure, 8=serious failure, 12=major failure */
  outcome?: string;
  /** Outcome description */
  outcomeDesc?: string;
  /** Purpose of event */
  purposeOfEvent?: string[];
  /** Required — who was involved */
  agent: Array<{
    who: string;
    name?: string;
    requestor: boolean;
    role?: string;
    networkAddress?: string;
  }>;
  /** Required — where the event originated */
  source: {
    observer: string;
    site?: string;
    type?: string;
  };
  /** Entities involved */
  entity?: Array<{
    what?: string;
    type?: string;
    role?: string;
    name?: string;
    description?: string;
  }>;
}

/** Audit events are immutable — no update fields */
export interface AuditEventUpdateRequest {}

export interface AuditEventSearchParams extends PaginationParams {
  action?: string;
  outcome?: string;
  agent?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Measures (FHIR Measure)
// ---------------------------------------------------------------------------

export interface MeasureCreateRequest {
  /** Required — draft, active, retired */
  status: 'draft' | 'active' | 'retired';
  /** Computer-friendly name */
  name?: string;
  /** Human-friendly title */
  title?: string;
  /** Description */
  description?: string;
  /** Why this measure is defined */
  purpose?: string;
  /** Describes the clinical usage */
  usage?: string;
  /** Publisher */
  publisher?: string;
  /** Date of publication */
  date?: string;
  /** Business version */
  version?: string;
  /** Canonical URL */
  url?: string;
  /** For testing purposes */
  experimental?: boolean;
  /** Scoring method: proportion, ratio, continuous-variable, cohort */
  scoring?: string;
  /** Measure type: process, outcome, structure, patient-reported-outcome, composite */
  type?: string[];
  /** Risk adjustment description */
  riskAdjustment?: string;
  /** Rationale for the measure */
  rationale?: string;
  /** Clinical recommendation statement */
  clinicalRecommendationStatement?: string;
  /** Guidance for implementers */
  guidance?: string;
  /** Topic categories */
  topic?: string[];
  /** Measure groups */
  group?: Array<{ code?: string; description?: string }>;
}

export interface MeasureUpdateRequest {
  status?: 'draft' | 'active' | 'retired';
  title?: string;
  description?: string;
  version?: string;
}

export interface MeasureSearchParams extends PaginationParams {
  status?: string;
  name?: string;
  title?: string;
  topic?: string;
}

// ---------------------------------------------------------------------------
// Measure Reports (FHIR MeasureReport)
// ---------------------------------------------------------------------------

export interface MeasureReportCreateRequest {
  /** Required — complete, pending, error */
  status: 'complete' | 'pending' | 'error';
  /** Required — individual, subject-list, summary, data-collection */
  type: 'individual' | 'subject-list' | 'summary' | 'data-collection';
  /** Required — Measure reference (canonical URL or ID) */
  measureId: string;
  /** Patient ID */
  patientId?: string;
  /** Report date (defaults to now) */
  date?: string;
  /** Reporter (Practitioner/Organization ID) */
  reporterId?: string;
  /** Required — reporting period */
  period: { start: string; end: string };
  /** Report groups */
  group?: Array<{
    code?: string;
    population?: Array<{ code?: string; count?: number }>;
    measureScore?: { value: number; unit?: string };
  }>;
}

export interface MeasureReportUpdateRequest {
  status?: 'complete' | 'pending' | 'error';
}

export interface MeasureReportSearchParams extends PaginationParams {
  patientId?: string;
  status?: string;
  measureId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Immunization Recommendations (FHIR ImmunizationRecommendation)
// ---------------------------------------------------------------------------

export interface ImmunizationRecommendationCreateRequest {
  /** Required — Patient ID */
  patientId: string;
  /** Required — when recommendations were created */
  date: string;
  /** Organization ID for the authority */
  authorityId?: string;
  /** Required — recommendation entries */
  recommendation: Array<{
    vaccineCode?: string[];
    targetDisease?: string;
    /** Required — forecast status */
    forecastStatus: string;
    forecastReason?: string[];
    description?: string;
    series?: string;
    doseNumber?: number;
    seriesDoses?: number;
    dateCriterion?: Array<{ code: string; value: string }>;
  }>;
}

/** ImmunizationRecommendation is not commonly updated */
export interface ImmunizationRecommendationUpdateRequest {}

export interface ImmunizationRecommendationSearchParams extends PaginationParams {
  patientId?: string;
  vaccineCode?: string;
  targetDisease?: string;
  dateFrom?: string;
  dateTo?: string;
}
