/**
 * FHIR R4 Resource Interfaces
 * Each resource includes all fields defined in the FHIR R4 spec.
 * Required fields (cardinality 1..1 or 1..*) are non-optional.
 * @see https://www.hl7.org/fhir/R4/resourcelist.html
 */

import type {
  Address,
  Annotation,
  Attachment,
  CodeableConcept,
  Coding,
  ContactPoint,
  Extension,
  FhirCanonical,
  FhirCode,
  FhirDate,
  FhirDateTime,
  FhirInstant,
  FhirUri,
  HumanName,
  Identifier,
  Meta,
  Narrative,
  Period,
  Quantity,
  Ratio,
  Reference,
} from './base';

// ---------------------------------------------------------------------------
// Shared DomainResource base
// ---------------------------------------------------------------------------

export interface DomainResource {
  id?: string;
  meta?: Meta;
  implicitRules?: FhirUri;
  language?: FhirCode;
  text?: Narrative;
  contained?: DomainResource[];
  extension?: Extension[];
  modifierExtension?: Extension[];
}

// ---------------------------------------------------------------------------
// Patient  (Normative)
// @see https://www.hl7.org/fhir/R4/patient.html
// ---------------------------------------------------------------------------

export interface PatientContact {
  relationship?: CodeableConcept[];
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  organization?: Reference;
  period?: Period;
}

export interface PatientCommunication {
  language: CodeableConcept;
  preferred?: boolean;
}

export interface PatientLink {
  other: Reference;
  type: 'replaced-by' | 'replaces' | 'refer' | 'seealso';
}

export interface Patient extends DomainResource {
  resourceType: 'Patient';
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: FhirDate;
  deceasedBoolean?: boolean;
  deceasedDateTime?: FhirDateTime;
  address?: Address[];
  maritalStatus?: CodeableConcept;
  multipleBirthBoolean?: boolean;
  multipleBirthInteger?: number;
  photo?: Attachment[];
  contact?: PatientContact[];
  communication?: PatientCommunication[];
  generalPractitioner?: Reference[];
  managingOrganization?: Reference;
  link?: PatientLink[];
}


// ---------------------------------------------------------------------------
// Encounter  (Normative)
// @see https://www.hl7.org/fhir/R4/encounter.html
// ---------------------------------------------------------------------------

export type EncounterStatus =
  | 'planned'
  | 'arrived'
  | 'triaged'
  | 'in-progress'
  | 'onleave'
  | 'finished'
  | 'cancelled'
  | 'entered-in-error'
  | 'unknown';

export interface EncounterStatusHistory {
  status: EncounterStatus;
  period: Period;
}

export interface EncounterClassHistory {
  class: Coding;
  period: Period;
}

export interface EncounterParticipant {
  type?: CodeableConcept[];
  period?: Period;
  individual?: Reference;
}

export interface EncounterDiagnosis {
  condition: Reference;
  use?: CodeableConcept;
  rank?: number;
}

export interface EncounterHospitalization {
  preAdmissionIdentifier?: Identifier;
  origin?: Reference;
  admitSource?: CodeableConcept;
  reAdmission?: CodeableConcept;
  dietPreference?: CodeableConcept[];
  specialCourtesy?: CodeableConcept[];
  specialArrangement?: CodeableConcept[];
  destination?: Reference;
  dischargeDisposition?: CodeableConcept;
}

export interface EncounterLocation {
  location: Reference;
  status?: 'planned' | 'active' | 'reserved' | 'completed';
  physicalType?: CodeableConcept;
  period?: Period;
}

export interface Encounter extends DomainResource {
  resourceType: 'Encounter';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: EncounterStatus;
  statusHistory?: EncounterStatusHistory[];
  /** Required (1..1) — e.g. AMB, IMP, EMER */
  class: Coding;
  classHistory?: EncounterClassHistory[];
  type?: CodeableConcept[];
  serviceType?: CodeableConcept;
  priority?: CodeableConcept;
  subject?: Reference;
  episodeOfCare?: Reference[];
  basedOn?: Reference[];
  participant?: EncounterParticipant[];
  appointment?: Reference[];
  period?: Period;
  length?: Quantity;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  diagnosis?: EncounterDiagnosis[];
  account?: Reference[];
  hospitalization?: EncounterHospitalization;
  location?: EncounterLocation[];
  serviceProvider?: Reference;
  partOf?: Reference;
}

// ---------------------------------------------------------------------------
// Observation  (Normative)
// @see https://www.hl7.org/fhir/R4/observation.html
// ---------------------------------------------------------------------------

export type ObservationStatus =
  | 'registered'
  | 'preliminary'
  | 'final'
  | 'amended'
  | 'corrected'
  | 'cancelled'
  | 'entered-in-error'
  | 'unknown';

export interface ObservationReferenceRange {
  low?: Quantity;
  high?: Quantity;
  type?: CodeableConcept;
  appliesTo?: CodeableConcept[];
  age?: { low?: Quantity; high?: Quantity };
  text?: string;
}

export interface ObservationComponent {
  code: CodeableConcept;
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: { low?: Quantity; high?: Quantity };
  valueRatio?: Ratio;
  valuePeriod?: Period;
  valueDateTime?: FhirDateTime;
  valueTime?: string;
  dataAbsentReason?: CodeableConcept;
  interpretation?: CodeableConcept[];
  referenceRange?: ObservationReferenceRange[];
}

export interface Observation extends DomainResource {
  resourceType: 'Observation';
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  /** Required (1..1) */
  status: ObservationStatus;
  category?: CodeableConcept[];
  /** Required (1..1) — LOINC preferred */
  code: CodeableConcept;
  subject?: Reference;
  focus?: Reference[];
  encounter?: Reference;
  effectiveDateTime?: FhirDateTime;
  effectivePeriod?: Period;
  effectiveInstant?: FhirInstant;
  issued?: FhirInstant;
  performer?: Reference[];
  // value[x] — one of many
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: { low?: Quantity; high?: Quantity };
  valueRatio?: Ratio;
  valuePeriod?: Period;
  valueDateTime?: FhirDateTime;
  valueTime?: string;
  dataAbsentReason?: CodeableConcept;
  interpretation?: CodeableConcept[];
  note?: Annotation[];
  bodySite?: CodeableConcept;
  method?: CodeableConcept;
  specimen?: Reference;
  device?: Reference;
  referenceRange?: ObservationReferenceRange[];
  hasMember?: Reference[];
  derivedFrom?: Reference[];
  component?: ObservationComponent[];
}


// ---------------------------------------------------------------------------
// Medication  (STU3)
// @see https://www.hl7.org/fhir/R4/medication.html
// ---------------------------------------------------------------------------

export type MedicationStatus = 'active' | 'inactive' | 'entered-in-error';

export interface MedicationIngredient {
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}

export interface MedicationBatch {
  lotNumber?: string;
  expirationDate?: FhirDateTime;
}

export interface Medication extends DomainResource {
  resourceType: 'Medication';
  identifier?: Identifier[];
  code?: CodeableConcept;
  status?: MedicationStatus;
  manufacturer?: Reference;
  form?: CodeableConcept;
  amount?: Ratio;
  ingredient?: MedicationIngredient[];
  batch?: MedicationBatch;
}

// ---------------------------------------------------------------------------
// Appointment  (STU)
// @see https://www.hl7.org/fhir/R4/appointment.html
// ---------------------------------------------------------------------------

export type AppointmentStatus =
  | 'proposed'
  | 'pending'
  | 'booked'
  | 'arrived'
  | 'fulfilled'
  | 'cancelled'
  | 'noshow'
  | 'entered-in-error'
  | 'checked-in'
  | 'waitlist';

export type ParticipantRequired = 'required' | 'optional' | 'information-only';
export type ParticipationStatus = 'accepted' | 'declined' | 'tentative' | 'needs-action';

export interface AppointmentParticipant {
  type?: CodeableConcept[];
  actor?: Reference;
  required?: ParticipantRequired;
  /** Required (1..1) */
  status: ParticipationStatus;
  period?: Period;
}

export interface Appointment extends DomainResource {
  resourceType: 'Appointment';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: AppointmentStatus;
  cancelationReason?: CodeableConcept;
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  appointmentType?: CodeableConcept;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  priority?: number;
  description?: string;
  supportingInformation?: Reference[];
  start?: FhirInstant;
  end?: FhirInstant;
  minutesDuration?: number;
  slot?: Reference[];
  created?: FhirDateTime;
  comment?: string;
  patientInstruction?: string;
  basedOn?: Reference[];
  /** Required (1..*) */
  participant: AppointmentParticipant[];
  requestedPeriod?: Period[];
}

// ---------------------------------------------------------------------------
// QuestionnaireResponse  (STU)
// @see https://www.hl7.org/fhir/R4/questionnaireresponse.html
// ---------------------------------------------------------------------------

export type QuestionnaireResponseStatus =
  | 'in-progress'
  | 'completed'
  | 'amended'
  | 'entered-in-error'
  | 'stopped';

export interface QuestionnaireResponseItemAnswer {
  valueBoolean?: boolean;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: FhirDate;
  valueDateTime?: FhirDateTime;
  valueTime?: string;
  valueString?: string;
  valueUri?: FhirUri;
  valueAttachment?: Attachment;
  valueCoding?: Coding;
  valueQuantity?: Quantity;
  valueReference?: Reference;
  item?: QuestionnaireResponseItem[];
}

export interface QuestionnaireResponseItem {
  /** Required (1..1) */
  linkId: string;
  definition?: FhirUri;
  text?: string;
  answer?: QuestionnaireResponseItemAnswer[];
  item?: QuestionnaireResponseItem[];
}

export interface QuestionnaireResponse extends DomainResource {
  resourceType: 'QuestionnaireResponse';
  identifier?: Identifier;
  basedOn?: Reference[];
  partOf?: Reference[];
  questionnaire?: FhirCanonical;
  /** Required (1..1) */
  status: QuestionnaireResponseStatus;
  subject?: Reference;
  encounter?: Reference;
  authored?: FhirDateTime;
  author?: Reference;
  source?: Reference;
  item?: QuestionnaireResponseItem[];
}

// ---------------------------------------------------------------------------
// Consent  (STU)
// @see https://www.hl7.org/fhir/R4/consent.html
// ---------------------------------------------------------------------------

export type ConsentStatus =
  | 'draft'
  | 'proposed'
  | 'active'
  | 'rejected'
  | 'inactive'
  | 'entered-in-error';

export type ConsentProvisionType = 'deny' | 'permit';

export interface ConsentPolicy {
  authority?: FhirUri;
  uri?: FhirUri;
}

export interface ConsentVerification {
  verified: boolean;
  verifiedWith?: Reference;
  verificationDate?: FhirDateTime;
}

export interface ConsentProvisionActor {
  role: CodeableConcept;
  reference: Reference;
}

export interface ConsentProvisionData {
  meaning: 'instance' | 'related' | 'dependents' | 'authoredby';
  reference: Reference;
}

export interface ConsentProvision {
  type?: ConsentProvisionType;
  period?: Period;
  actor?: ConsentProvisionActor[];
  action?: CodeableConcept[];
  securityLabel?: Coding[];
  purpose?: Coding[];
  class?: Coding[];
  code?: CodeableConcept[];
  dataPeriod?: Period;
  data?: ConsentProvisionData[];
  provision?: ConsentProvision[];
}

export interface Consent extends DomainResource {
  resourceType: 'Consent';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: ConsentStatus;
  /** Required (1..1) — privacy | research | patient-privacy | treatment */
  scope: CodeableConcept;
  /** Required (1..*) */
  category: CodeableConcept[];
  patient?: Reference;
  dateTime?: FhirDateTime;
  performer?: Reference[];
  organization?: Reference[];
  sourceAttachment?: Attachment;
  sourceReference?: Reference;
  policy?: ConsentPolicy[];
  policyRule?: CodeableConcept;
  verification?: ConsentVerification[];
  provision?: ConsentProvision;
}

// ---------------------------------------------------------------------------
// DiagnosticReport  (STU)
// @see https://www.hl7.org/fhir/R4/diagnosticreport.html
// ---------------------------------------------------------------------------

export type DiagnosticReportStatus =
  | 'registered'
  | 'partial'
  | 'preliminary'
  | 'final'
  | 'amended'
  | 'corrected'
  | 'appended'
  | 'cancelled'
  | 'entered-in-error'
  | 'unknown';

export interface DiagnosticReportMedia {
  comment?: string;
  /** Required (1..1) */
  link: Reference;
}

export interface DiagnosticReport extends DomainResource {
  resourceType: 'DiagnosticReport';
  identifier?: Identifier[];
  basedOn?: Reference[];
  /** Required (1..1) */
  status: DiagnosticReportStatus;
  category?: CodeableConcept[];
  /** Required (1..1) — LOINC preferred */
  code: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  effectiveDateTime?: FhirDateTime;
  effectivePeriod?: Period;
  issued?: FhirInstant;
  performer?: Reference[];
  resultsInterpreter?: Reference[];
  specimen?: Reference[];
  result?: Reference[];
  imagingStudy?: Reference[];
  media?: DiagnosticReportMedia[];
  conclusion?: string;
  conclusionCode?: CodeableConcept[];
  presentedForm?: Attachment[];
}

// ---------------------------------------------------------------------------
// Bundle  (used for search results)
// @see https://www.hl7.org/fhir/R4/bundle.html
// ---------------------------------------------------------------------------

export type BundleType =
  | 'document'
  | 'message'
  | 'transaction'
  | 'transaction-response'
  | 'batch'
  | 'batch-response'
  | 'history'
  | 'searchset'
  | 'collection';

export interface BundleLink {
  relation: string;
  url: FhirUri;
}

export interface BundleEntrySearch {
  mode?: 'match' | 'include' | 'outcome';
  score?: number;
}

export interface BundleEntry<T = DomainResource> {
  fullUrl?: FhirUri;
  resource?: T;
  search?: BundleEntrySearch;
}

export interface Bundle<T = DomainResource> {
  resourceType: 'Bundle';
  id?: string;
  meta?: Meta;
  type: BundleType;
  total?: number;
  link?: BundleLink[];
  entry?: BundleEntry<T>[];
}
