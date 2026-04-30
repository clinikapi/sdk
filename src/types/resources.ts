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
// Practitioner  (Normative)
// @see https://www.hl7.org/fhir/R4/practitioner.html
// ---------------------------------------------------------------------------

export interface PractitionerQualification {
  identifier?: Identifier[];
  code: CodeableConcept;
  period?: Period;
  issuer?: Reference;
}

export interface Practitioner extends DomainResource {
  resourceType: 'Practitioner';
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  address?: Address[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: FhirDate;
  photo?: Attachment[];
  qualification?: PractitionerQualification[];
  communication?: CodeableConcept[];
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


// ---------------------------------------------------------------------------
// DocumentReference (Clinical Notes)
// @see https://www.hl7.org/fhir/R4/documentreference.html
// ---------------------------------------------------------------------------

export type DocumentReferenceStatus = 'current' | 'superseded' | 'entered-in-error';
export type DocumentRelationshipType = 'replaces' | 'transforms' | 'signs' | 'appends';

export interface DocumentReferenceContent {
  attachment: Attachment;
  format?: Coding;
}

export interface DocumentReferenceContext {
  encounter?: Reference[];
  event?: CodeableConcept[];
  period?: Period;
  facilityType?: CodeableConcept;
  practiceSetting?: CodeableConcept;
  sourcePatientInfo?: Reference;
  related?: Reference[];
}

export interface DocumentReferenceRelatesTo {
  code: DocumentRelationshipType;
  target: Reference;
}

export interface DocumentReference extends DomainResource {
  resourceType: 'DocumentReference';
  masterIdentifier?: Identifier;
  identifier?: Identifier[];
  /** Required (1..1) */
  status: DocumentReferenceStatus;
  docStatus?: 'preliminary' | 'final' | 'amended' | 'entered-in-error';
  type?: CodeableConcept;
  category?: CodeableConcept[];
  subject?: Reference;
  date?: FhirInstant;
  author?: Reference[];
  authenticator?: Reference;
  custodian?: Reference;
  relatesTo?: DocumentReferenceRelatesTo[];
  description?: string;
  securityLabel?: CodeableConcept[];
  /** Required (1..*) */
  content: DocumentReferenceContent[];
  context?: DocumentReferenceContext;
}


// ---------------------------------------------------------------------------
// MedicationRequest (Prescriptions)
// @see https://www.hl7.org/fhir/R4/medicationrequest.html
// ---------------------------------------------------------------------------

export type MedicationRequestStatus =
  | 'active'
  | 'on-hold'
  | 'cancelled'
  | 'completed'
  | 'entered-in-error'
  | 'stopped'
  | 'draft'
  | 'unknown';

export type MedicationRequestIntent =
  | 'proposal'
  | 'plan'
  | 'order'
  | 'original-order'
  | 'reflex-order'
  | 'filler-order'
  | 'instance-order'
  | 'option';

export type MedicationRequestPriority = 'routine' | 'urgent' | 'asap' | 'stat';

export interface MedicationRequestDosageInstruction {
  sequence?: number;
  text?: string;
  patientInstruction?: string;
  timing?: {
    repeat?: {
      frequency?: number;
      period?: number;
      periodUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
      boundsPeriod?: Period;
    };
    code?: CodeableConcept;
  };
  route?: CodeableConcept;
  method?: CodeableConcept;
  doseAndRate?: Array<{
    type?: CodeableConcept;
    doseQuantity?: Quantity;
    doseRange?: { low?: Quantity; high?: Quantity };
    rateQuantity?: Quantity;
  }>;
  maxDosePerPeriod?: Ratio;
}

export interface MedicationRequestDispenseRequest {
  initialFill?: { quantity?: Quantity; duration?: Quantity };
  dispenseInterval?: Quantity;
  validityPeriod?: Period;
  numberOfRepeatsAllowed?: number;
  quantity?: Quantity;
  expectedSupplyDuration?: Quantity;
  performer?: Reference;
}

export interface MedicationRequestSubstitution {
  allowedBoolean?: boolean;
  allowedCodeableConcept?: CodeableConcept;
  reason?: CodeableConcept;
}

export interface MedicationRequest extends DomainResource {
  resourceType: 'MedicationRequest';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: MedicationRequestStatus;
  statusReason?: CodeableConcept;
  /** Required (1..1) */
  intent: MedicationRequestIntent;
  category?: CodeableConcept[];
  priority?: MedicationRequestPriority;
  doNotPerform?: boolean;
  reportedBoolean?: boolean;
  reportedReference?: Reference;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  encounter?: Reference;
  supportingInformation?: Reference[];
  authoredOn?: FhirDateTime;
  requester?: Reference;
  performer?: Reference;
  performerType?: CodeableConcept;
  recorder?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  basedOn?: Reference[];
  groupIdentifier?: Identifier;
  courseOfTherapyType?: CodeableConcept;
  insurance?: Reference[];
  note?: Annotation[];
  dosageInstruction?: MedicationRequestDosageInstruction[];
  dispenseRequest?: MedicationRequestDispenseRequest;
  substitution?: MedicationRequestSubstitution;
  priorPrescription?: Reference;
}


// ---------------------------------------------------------------------------
// PractitionerRole  (STU)
// @see https://www.hl7.org/fhir/R4/practitionerrole.html
// ---------------------------------------------------------------------------

export interface PractitionerRoleAvailableTime {
  daysOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  allDay?: boolean;
  availableStartTime?: string;
  availableEndTime?: string;
}

export interface PractitionerRoleNotAvailable {
  description: string;
  during?: Period;
}

export interface PractitionerRole extends DomainResource {
  resourceType: 'PractitionerRole';
  identifier?: Identifier[];
  active?: boolean;
  period?: Period;
  practitioner?: Reference;
  organization?: Reference;
  code?: CodeableConcept[];
  specialty?: CodeableConcept[];
  location?: Reference[];
  healthcareService?: Reference[];
  telecom?: ContactPoint[];
  availableTime?: PractitionerRoleAvailableTime[];
  notAvailable?: PractitionerRoleNotAvailable[];
  availabilityExceptions?: string;
  endpoint?: Reference[];
}

// ---------------------------------------------------------------------------
// ClinicalImpression (Assessments)
// @see https://www.hl7.org/fhir/R4/clinicalimpression.html
// ---------------------------------------------------------------------------

export type ClinicalImpressionStatus = 'in-progress' | 'completed' | 'entered-in-error';

export interface ClinicalImpressionFinding {
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  basis?: string;
}

export interface ClinicalImpressionInvestigation {
  code: CodeableConcept;
  item?: Reference[];
}

export interface ClinicalImpression extends DomainResource {
  resourceType: 'ClinicalImpression';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: ClinicalImpressionStatus;
  statusReason?: CodeableConcept;
  code?: CodeableConcept;
  description?: string;
  /** Required (1..1) */
  subject: Reference;
  encounter?: Reference;
  effectiveDateTime?: FhirDateTime;
  effectivePeriod?: Period;
  date?: FhirDateTime;
  assessor?: Reference;
  previous?: Reference;
  problem?: Reference[];
  investigation?: ClinicalImpressionInvestigation[];
  protocol?: FhirUri[];
  summary?: string;
  finding?: ClinicalImpressionFinding[];
  prognosisCodeableConcept?: CodeableConcept[];
  prognosisReference?: Reference[];
  supportingInfo?: Reference[];
  note?: Annotation[];
}

// ---------------------------------------------------------------------------
// Composition (Documents)
// @see https://www.hl7.org/fhir/R4/composition.html
// ---------------------------------------------------------------------------

export type CompositionStatus = 'preliminary' | 'final' | 'amended' | 'entered-in-error';

export interface CompositionAttester {
  mode: 'personal' | 'professional' | 'legal' | 'official';
  time?: FhirDateTime;
  party?: Reference;
}

export interface CompositionRelatesTo {
  code: 'replaces' | 'transforms' | 'signs' | 'appends';
  targetIdentifier?: Identifier;
  targetReference?: Reference;
}

export interface CompositionEvent {
  code?: CodeableConcept[];
  period?: Period;
  detail?: Reference[];
}

export interface CompositionSection {
  title?: string;
  code?: CodeableConcept;
  author?: Reference[];
  focus?: Reference;
  text?: Narrative;
  mode?: 'working' | 'snapshot' | 'changes';
  orderedBy?: CodeableConcept;
  entry?: Reference[];
  emptyReason?: CodeableConcept;
  section?: CompositionSection[];
}

export interface Composition extends DomainResource {
  resourceType: 'Composition';
  identifier?: Identifier;
  /** Required (1..1) */
  status: CompositionStatus;
  /** Required (1..1) */
  type: CodeableConcept;
  category?: CodeableConcept[];
  subject?: Reference;
  encounter?: Reference;
  /** Required (1..1) */
  date: FhirDateTime;
  /** Required (1..*) */
  author: Reference[];
  /** Required (1..1) */
  title: string;
  confidentiality?: FhirCode;
  attester?: CompositionAttester[];
  custodian?: Reference;
  relatesTo?: CompositionRelatesTo[];
  event?: CompositionEvent[];
  section?: CompositionSection[];
}


// ---------------------------------------------------------------------------
// AppointmentResponse (STU)
// @see https://www.hl7.org/fhir/R4/appointmentresponse.html
// ---------------------------------------------------------------------------

export type AppointmentResponseParticipantStatus = 'accepted' | 'declined' | 'tentative' | 'needs-action';

export interface AppointmentResponse extends DomainResource {
  resourceType: 'AppointmentResponse';
  identifier?: Identifier[];
  /** Required (1..1) */
  appointment: Reference;
  start?: FhirInstant;
  end?: FhirInstant;
  participantType?: CodeableConcept[];
  actor?: Reference;
  /** Required (1..1) */
  participantStatus: AppointmentResponseParticipantStatus;
  comment?: string;
}

// ---------------------------------------------------------------------------
// Task (STU)
// @see https://www.hl7.org/fhir/R4/task.html
// ---------------------------------------------------------------------------

export type TaskStatus =
  | 'draft'
  | 'requested'
  | 'received'
  | 'accepted'
  | 'rejected'
  | 'ready'
  | 'cancelled'
  | 'in-progress'
  | 'on-hold'
  | 'failed'
  | 'completed'
  | 'entered-in-error';

export type TaskIntent =
  | 'unknown'
  | 'proposal'
  | 'plan'
  | 'order'
  | 'original-order'
  | 'reflex-order'
  | 'filler-order'
  | 'instance-order'
  | 'option';

export type TaskPriority = 'routine' | 'urgent' | 'asap' | 'stat';

export interface TaskInput {
  type: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDate?: FhirDate;
  valueDateTime?: FhirDateTime;
  valueReference?: Reference;
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
}

export interface TaskOutput {
  type: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDate?: FhirDate;
  valueDateTime?: FhirDateTime;
  valueReference?: Reference;
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
}

export interface TaskRestriction {
  repetitions?: number;
  period?: Period;
  recipient?: Reference[];
}

export interface Task extends DomainResource {
  resourceType: 'Task';
  identifier?: Identifier[];
  instantiatesCanonical?: FhirCanonical;
  instantiatesUri?: FhirUri;
  basedOn?: Reference[];
  groupIdentifier?: Identifier;
  partOf?: Reference[];
  /** Required (1..1) */
  status: TaskStatus;
  statusReason?: CodeableConcept;
  businessStatus?: CodeableConcept;
  /** Required (1..1) */
  intent: TaskIntent;
  priority?: TaskPriority;
  code?: CodeableConcept;
  description?: string;
  focus?: Reference;
  for?: Reference;
  encounter?: Reference;
  executionPeriod?: Period;
  authoredOn?: FhirDateTime;
  lastModified?: FhirDateTime;
  requester?: Reference;
  performerType?: CodeableConcept[];
  owner?: Reference;
  location?: Reference;
  reasonCode?: CodeableConcept;
  reasonReference?: Reference;
  insurance?: Reference[];
  note?: Annotation[];
  relevantHistory?: Reference[];
  restriction?: TaskRestriction;
  input?: TaskInput[];
  output?: TaskOutput[];
}

// ---------------------------------------------------------------------------
// Slot (STU)
// @see https://www.hl7.org/fhir/R4/slot.html
// ---------------------------------------------------------------------------

export type SlotStatus = 'busy' | 'free' | 'busy-unavailable' | 'busy-tentative' | 'entered-in-error';

export interface Slot extends DomainResource {
  resourceType: 'Slot';
  identifier?: Identifier[];
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  appointmentType?: CodeableConcept;
  /** Required (1..1) */
  schedule: Reference;
  /** Required (1..1) */
  status: SlotStatus;
  /** Required (1..1) */
  start: FhirInstant;
  /** Required (1..1) */
  end: FhirInstant;
  overbooked?: boolean;
  comment?: string;
}


// ---------------------------------------------------------------------------
// Organization (Normative)
// @see https://www.hl7.org/fhir/R4/organization.html
// ---------------------------------------------------------------------------

export interface OrganizationContact {
  purpose?: CodeableConcept;
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
}

export interface Organization extends DomainResource {
  resourceType: 'Organization';
  identifier?: Identifier[];
  active?: boolean;
  type?: CodeableConcept[];
  name?: string;
  alias?: string[];
  telecom?: ContactPoint[];
  address?: Address[];
  partOf?: Reference;
  contact?: OrganizationContact[];
  endpoint?: Reference[];
}

// ---------------------------------------------------------------------------
// Account (STU)
// @see https://www.hl7.org/fhir/R4/account.html
// ---------------------------------------------------------------------------

export type AccountStatus = 'active' | 'inactive' | 'entered-in-error' | 'on-hold' | 'unknown';

export interface AccountCoverage {
  coverage: Reference;
  priority?: number;
}

export interface AccountGuarantor {
  party: Reference;
  onHold?: boolean;
  period?: Period;
}

export interface Account extends DomainResource {
  resourceType: 'Account';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: AccountStatus;
  type?: CodeableConcept;
  name?: string;
  subject?: Reference[];
  servicePeriod?: Period;
  coverage?: AccountCoverage[];
  owner?: Reference;
  description?: string;
  guarantor?: AccountGuarantor[];
  partOf?: Reference;
}

// ---------------------------------------------------------------------------
// HealthcareService (STU)
// @see https://www.hl7.org/fhir/R4/healthcareservice.html
// ---------------------------------------------------------------------------

export interface HealthcareServiceEligibility {
  code?: CodeableConcept;
  comment?: string;
}

export interface HealthcareServiceAvailableTimeFhir {
  daysOfWeek?: FhirCode[];
  allDay?: boolean;
  availableStartTime?: string;
  availableEndTime?: string;
}

export interface HealthcareServiceNotAvailableFhir {
  description: string;
  during?: Period;
}

export interface HealthcareService extends DomainResource {
  resourceType: 'HealthcareService';
  identifier?: Identifier[];
  active?: boolean;
  providedBy?: Reference;
  category?: CodeableConcept[];
  type?: CodeableConcept[];
  specialty?: CodeableConcept[];
  location?: Reference[];
  name?: string;
  comment?: string;
  extraDetails?: string;
  photo?: Attachment;
  telecom?: ContactPoint[];
  coverageArea?: Reference[];
  serviceProvisionCode?: CodeableConcept[];
  eligibility?: HealthcareServiceEligibility[];
  program?: CodeableConcept[];
  characteristic?: CodeableConcept[];
  communication?: CodeableConcept[];
  referralMethod?: CodeableConcept[];
  appointmentRequired?: boolean;
  availableTime?: HealthcareServiceAvailableTimeFhir[];
  notAvailable?: HealthcareServiceNotAvailableFhir[];
  availabilityExceptions?: string;
  endpoint?: Reference[];
}

// ---------------------------------------------------------------------------
// ServiceRequest (STU)
// @see https://www.hl7.org/fhir/R4/servicerequest.html
// ---------------------------------------------------------------------------

export type ServiceRequestStatus = 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown';
export type ServiceRequestIntent = 'proposal' | 'plan' | 'directive' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
export type ServiceRequestPriority = 'routine' | 'urgent' | 'asap' | 'stat';

export interface ServiceRequest extends DomainResource {
  resourceType: 'ServiceRequest';
  identifier?: Identifier[];
  basedOn?: Reference[];
  replaces?: Reference[];
  requisition?: Identifier;
  /** Required (1..1) */
  status: ServiceRequestStatus;
  /** Required (1..1) */
  intent: ServiceRequestIntent;
  category?: CodeableConcept[];
  priority?: ServiceRequestPriority;
  doNotPerform?: boolean;
  code?: CodeableConcept;
  orderDetail?: CodeableConcept[];
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: FhirDateTime;
  occurrencePeriod?: Period;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: CodeableConcept;
  authoredOn?: FhirDateTime;
  requester?: Reference;
  performerType?: CodeableConcept;
  performer?: Reference[];
  locationCode?: CodeableConcept[];
  locationReference?: Reference[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  insurance?: Reference[];
  supportingInfo?: Reference[];
  specimen?: Reference[];
  bodySite?: CodeableConcept[];
  note?: Annotation[];
  patientInstruction?: string;
  relevantHistory?: Reference[];
}


// ---------------------------------------------------------------------------
// Location (Normative)
// @see https://www.hl7.org/fhir/R4/location.html
// ---------------------------------------------------------------------------

export type LocationStatus = 'active' | 'suspended' | 'inactive';
export type LocationMode = 'instance' | 'kind';

export interface LocationPosition {
  longitude: number;
  latitude: number;
  altitude?: number;
}

export interface LocationHoursOfOperation {
  daysOfWeek?: FhirCode[];
  allDay?: boolean;
  openingTime?: string;
  closingTime?: string;
}

export interface Location extends DomainResource {
  resourceType: 'Location';
  identifier?: Identifier[];
  status?: LocationStatus;
  operationalStatus?: Coding;
  name?: string;
  alias?: string[];
  description?: string;
  mode?: LocationMode;
  type?: CodeableConcept[];
  telecom?: ContactPoint[];
  address?: Address;
  physicalType?: CodeableConcept;
  position?: LocationPosition;
  managingOrganization?: Reference;
  partOf?: Reference;
  hoursOfOperation?: LocationHoursOfOperation[];
  availabilityExceptions?: string;
  endpoint?: Reference[];
}

// ---------------------------------------------------------------------------
// Schedule (STU)
// @see https://www.hl7.org/fhir/R4/schedule.html
// ---------------------------------------------------------------------------

export interface Schedule extends DomainResource {
  resourceType: 'Schedule';
  identifier?: Identifier[];
  active?: boolean;
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  /** Required (1..*) */
  actor: Reference[];
  planningHorizon?: Period;
  comment?: string;
}

// ---------------------------------------------------------------------------
// Person (STU)
// @see https://www.hl7.org/fhir/R4/person.html
// ---------------------------------------------------------------------------

export type PersonLinkAssurance = 'level1' | 'level2' | 'level3' | 'level4';

export interface PersonLink {
  target: Reference;
  assurance?: PersonLinkAssurance;
}

export interface Person extends DomainResource {
  resourceType: 'Person';
  identifier?: Identifier[];
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: FhirDate;
  address?: Address[];
  photo?: Attachment;
  managingOrganization?: Reference;
  active?: boolean;
  link?: PersonLink[];
}

// ---------------------------------------------------------------------------
// FamilyMemberHistory (STU)
// @see https://www.hl7.org/fhir/R4/familymemberhistory.html
// ---------------------------------------------------------------------------

export type FamilyMemberHistoryStatus = 'partial' | 'completed' | 'entered-in-error' | 'health-unknown';

export interface FamilyMemberHistoryCondition {
  code: CodeableConcept;
  outcome?: CodeableConcept;
  contributedToDeath?: boolean;
  onsetAge?: Quantity;
  onsetRange?: { low?: Quantity; high?: Quantity };
  onsetPeriod?: Period;
  onsetString?: string;
  note?: Annotation[];
}

export interface FamilyMemberHistory extends DomainResource {
  resourceType: 'FamilyMemberHistory';
  identifier?: Identifier[];
  instantiatesCanonical?: FhirCanonical[];
  instantiatesUri?: FhirUri[];
  /** Required (1..1) */
  status: FamilyMemberHistoryStatus;
  dataAbsentReason?: CodeableConcept;
  /** Required (1..1) */
  patient: Reference;
  date?: FhirDateTime;
  name?: string;
  /** Required (1..1) */
  relationship: CodeableConcept;
  sex?: CodeableConcept;
  bornPeriod?: Period;
  bornDate?: FhirDate;
  bornString?: string;
  ageAge?: Quantity;
  ageRange?: { low?: Quantity; high?: Quantity };
  ageString?: string;
  estimatedAge?: boolean;
  deceasedBoolean?: boolean;
  deceasedAge?: Quantity;
  deceasedRange?: { low?: Quantity; high?: Quantity };
  deceasedDate?: FhirDate;
  deceasedString?: string;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  condition?: FamilyMemberHistoryCondition[];
}


// ---------------------------------------------------------------------------
// CarePlan (STU)
// @see https://www.hl7.org/fhir/R4/careplan.html
// ---------------------------------------------------------------------------

export type CarePlanStatus = 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown';
export type CarePlanIntent = 'proposal' | 'plan' | 'order' | 'option';

export interface CarePlanActivityDetail {
  kind?: FhirCode;
  code?: CodeableConcept;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  goal?: Reference[];
  status: FhirCode;
  statusReason?: CodeableConcept;
  doNotPerform?: boolean;
  scheduledString?: string;
  scheduledPeriod?: Period;
  location?: Reference;
  performer?: Reference[];
  productCodeableConcept?: CodeableConcept;
  productReference?: Reference;
  dailyAmount?: Quantity;
  quantity?: Quantity;
  description?: string;
}

export interface CarePlanActivity {
  outcomeCodeableConcept?: CodeableConcept[];
  outcomeReference?: Reference[];
  progress?: Annotation[];
  reference?: Reference;
  detail?: CarePlanActivityDetail;
}

export interface CarePlan extends DomainResource {
  resourceType: 'CarePlan';
  identifier?: Identifier[];
  basedOn?: Reference[];
  replaces?: Reference[];
  partOf?: Reference[];
  /** Required (1..1) */
  status: CarePlanStatus;
  /** Required (1..1) */
  intent: CarePlanIntent;
  category?: CodeableConcept[];
  title?: string;
  description?: string;
  /** Required (1..1) */
  subject: Reference;
  encounter?: Reference;
  period?: Period;
  created?: FhirDateTime;
  author?: Reference;
  contributor?: Reference[];
  careTeam?: Reference[];
  addresses?: Reference[];
  supportingInfo?: Reference[];
  goal?: Reference[];
  activity?: CarePlanActivity[];
  note?: Annotation[];
}

// ---------------------------------------------------------------------------
// Immunization (STU)
// @see https://www.hl7.org/fhir/R4/immunization.html
// ---------------------------------------------------------------------------

export type ImmunizationStatus = 'completed' | 'entered-in-error' | 'not-done';

export interface ImmunizationPerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export interface ImmunizationReaction {
  date?: FhirDateTime;
  detail?: Reference;
  reported?: boolean;
}

export interface ImmunizationProtocolApplied {
  series?: string;
  authority?: Reference;
  targetDisease?: CodeableConcept[];
  doseNumberPositiveInt?: number;
  doseNumberString?: string;
  seriesDosesPositiveInt?: number;
  seriesDosesString?: string;
}

export interface Immunization extends DomainResource {
  resourceType: 'Immunization';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: ImmunizationStatus;
  statusReason?: CodeableConcept;
  /** Required (1..1) */
  vaccineCode: CodeableConcept;
  /** Required (1..1) */
  patient: Reference;
  encounter?: Reference;
  occurrenceDateTime?: FhirDateTime;
  occurrenceString?: string;
  recorded?: FhirDateTime;
  primarySource?: boolean;
  reportOrigin?: CodeableConcept;
  location?: Reference;
  manufacturer?: Reference;
  lotNumber?: string;
  expirationDate?: FhirDate;
  site?: CodeableConcept;
  route?: CodeableConcept;
  doseQuantity?: Quantity;
  performer?: ImmunizationPerformer[];
  note?: Annotation[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  isSubpotent?: boolean;
  subpotentReason?: CodeableConcept[];
  education?: Array<{ documentType?: string; reference?: FhirUri; publicationDate?: FhirDateTime; presentationDate?: FhirDateTime }>;
  programEligibility?: CodeableConcept[];
  fundingSource?: CodeableConcept;
  reaction?: ImmunizationReaction[];
  protocolApplied?: ImmunizationProtocolApplied[];
}

// ---------------------------------------------------------------------------
// Claim (STU)
// @see https://www.hl7.org/fhir/R4/claim.html
// Simplified — focuses on commonly used fields
// ---------------------------------------------------------------------------

export type ClaimStatus = 'active' | 'cancelled' | 'draft' | 'entered-in-error';
export type ClaimUse = 'claim' | 'preauthorization' | 'predetermination';

export interface ClaimDiagnosis {
  sequence: number;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
  type?: CodeableConcept[];
  onAdmission?: CodeableConcept;
  packageCode?: CodeableConcept;
}

export interface ClaimProcedure {
  sequence: number;
  type?: CodeableConcept[];
  date?: FhirDateTime;
  procedureCodeableConcept?: CodeableConcept;
  procedureReference?: Reference;
  udi?: Reference[];
}

export interface ClaimInsurance {
  sequence: number;
  focal: boolean;
  identifier?: Identifier;
  coverage: Reference;
  businessArrangement?: string;
  preAuthRef?: string[];
  claimResponse?: Reference;
}

export interface ClaimItem {
  sequence: number;
  careTeamSequence?: number[];
  diagnosisSequence?: number[];
  procedureSequence?: number[];
  informationSequence?: number[];
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  servicedDate?: FhirDate;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  quantity?: Quantity;
  unitPrice?: { value?: number; currency?: string };
  factor?: number;
  net?: { value?: number; currency?: string };
  udi?: Reference[];
  bodySite?: CodeableConcept;
  subSite?: CodeableConcept[];
  encounter?: Reference[];
}

export interface Claim extends DomainResource {
  resourceType: 'Claim';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: ClaimStatus;
  /** Required (1..1) */
  type: CodeableConcept;
  subType?: CodeableConcept;
  /** Required (1..1) */
  use: ClaimUse;
  /** Required (1..1) */
  patient: Reference;
  billablePeriod?: Period;
  /** Required (1..1) */
  created: FhirDateTime;
  enterer?: Reference;
  insurer?: Reference;
  /** Required (1..1) */
  provider: Reference;
  /** Required (1..1) */
  priority: CodeableConcept;
  fundsReserve?: CodeableConcept;
  related?: Array<{ claim?: Reference; relationship?: CodeableConcept; reference?: Identifier }>;
  prescription?: Reference;
  originalPrescription?: Reference;
  payee?: { type: CodeableConcept; party?: Reference };
  referral?: Reference;
  facility?: Reference;
  careTeam?: Array<{ sequence: number; provider: Reference; responsible?: boolean; role?: CodeableConcept; qualification?: CodeableConcept }>;
  supportingInfo?: Array<{ sequence: number; category: CodeableConcept; code?: CodeableConcept; timingDate?: FhirDate; timingPeriod?: Period; valueString?: string; valueBoolean?: boolean; valueQuantity?: Quantity; valueAttachment?: Attachment; valueReference?: Reference; reason?: Coding }>;
  diagnosis?: ClaimDiagnosis[];
  procedure?: ClaimProcedure[];
  /** Required (1..*) */
  insurance: ClaimInsurance[];
  accident?: { date: FhirDate; type?: CodeableConcept; locationAddress?: Address; locationReference?: Reference };
  item?: ClaimItem[];
  total?: { value?: number; currency?: string };
}

// ---------------------------------------------------------------------------
// ClaimResponse (STU)
// @see https://www.hl7.org/fhir/R4/claimresponse.html
// Simplified — focuses on commonly used fields
// ---------------------------------------------------------------------------

export type ClaimResponseStatus = 'active' | 'cancelled' | 'draft' | 'entered-in-error';
export type ClaimResponseUse = 'claim' | 'preauthorization' | 'predetermination';
export type ClaimResponseOutcome = 'queued' | 'complete' | 'error' | 'partial';

export interface ClaimResponseAdjudication {
  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: { value?: number; currency?: string };
  value?: number;
}

export interface ClaimResponseItem {
  itemSequence: number;
  noteNumber?: number[];
  adjudication?: ClaimResponseAdjudication[];
}

export interface ClaimResponseTotal {
  category: CodeableConcept;
  amount: { value?: number; currency?: string };
}

export interface ClaimResponsePayment {
  type: CodeableConcept;
  adjustment?: { value?: number; currency?: string };
  adjustmentReason?: CodeableConcept;
  date?: FhirDate;
  amount: { value?: number; currency?: string };
  identifier?: Identifier;
}

export interface ClaimResponseProcessNote {
  number?: number;
  type?: FhirCode;
  text?: string;
  language?: CodeableConcept;
}

export interface ClaimResponse extends DomainResource {
  resourceType: 'ClaimResponse';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: ClaimResponseStatus;
  /** Required (1..1) */
  type: CodeableConcept;
  subType?: CodeableConcept;
  /** Required (1..1) */
  use: ClaimResponseUse;
  /** Required (1..1) */
  patient: Reference;
  /** Required (1..1) */
  created: FhirDateTime;
  /** Required (1..1) */
  insurer: Reference;
  requestor?: Reference;
  request?: Reference;
  /** Required (1..1) */
  outcome: ClaimResponseOutcome;
  disposition?: string;
  preAuthRef?: string;
  preAuthPeriod?: Period;
  payeeType?: CodeableConcept;
  item?: ClaimResponseItem[];
  addItem?: any[];
  adjudication?: ClaimResponseAdjudication[];
  total?: ClaimResponseTotal[];
  payment?: ClaimResponsePayment;
  fundsReserve?: CodeableConcept;
  formCode?: CodeableConcept;
  form?: Attachment;
  processNote?: ClaimResponseProcessNote[];
  communicationRequest?: Reference[];
  insurance?: Array<{ sequence: number; focal: boolean; coverage: Reference; businessArrangement?: string; claimResponse?: Reference }>;
  error?: Array<{ itemSequence?: number; detailSequence?: number; subDetailSequence?: number; code: CodeableConcept }>;
}


// ---------------------------------------------------------------------------
// AllergyIntolerance (STU)
// @see https://www.hl7.org/fhir/R4/allergyintolerance.html
// ---------------------------------------------------------------------------

export type AllergyIntoleranceType = 'allergy' | 'intolerance';
export type AllergyIntoleranceCriticality = 'low' | 'high' | 'unable-to-assess';
export type AllergyIntoleranceCategory = 'food' | 'medication' | 'environment' | 'biologic';

export interface AllergyIntoleranceReaction {
  substance?: CodeableConcept;
  manifestation: CodeableConcept[];
  description?: string;
  onset?: FhirDateTime;
  severity?: 'mild' | 'moderate' | 'severe';
  exposureRoute?: CodeableConcept;
  note?: Annotation[];
}

export interface AllergyIntolerance extends DomainResource {
  resourceType: 'AllergyIntolerance';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: AllergyIntoleranceType;
  category?: AllergyIntoleranceCategory[];
  criticality?: AllergyIntoleranceCriticality;
  code?: CodeableConcept;
  /** Required (1..1) */
  patient: Reference;
  encounter?: Reference;
  onsetDateTime?: FhirDateTime;
  onsetAge?: Quantity;
  onsetPeriod?: Period;
  onsetRange?: { low?: Quantity; high?: Quantity };
  onsetString?: string;
  recordedDate?: FhirDateTime;
  recorder?: Reference;
  asserter?: Reference;
  lastOccurrence?: FhirDateTime;
  note?: Annotation[];
  reaction?: AllergyIntoleranceReaction[];
}

// ---------------------------------------------------------------------------
// CareTeam (STU)
// @see https://www.hl7.org/fhir/R4/careteam.html
// ---------------------------------------------------------------------------

export type CareTeamStatus = 'proposed' | 'active' | 'suspended' | 'inactive' | 'entered-in-error';

export interface CareTeamParticipant {
  role?: CodeableConcept[];
  member?: Reference;
  onBehalfOf?: Reference;
  period?: Period;
}

export interface CareTeam extends DomainResource {
  resourceType: 'CareTeam';
  identifier?: Identifier[];
  status?: CareTeamStatus;
  category?: CodeableConcept[];
  name?: string;
  subject?: Reference;
  encounter?: Reference;
  period?: Period;
  participant?: CareTeamParticipant[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  managingOrganization?: Reference[];
  telecom?: ContactPoint[];
  note?: Annotation[];
}

// ---------------------------------------------------------------------------
// Condition (STU)
// @see https://www.hl7.org/fhir/R4/condition.html
// ---------------------------------------------------------------------------

export interface ConditionStage {
  summary?: CodeableConcept;
  assessment?: Reference[];
  type?: CodeableConcept;
}

export interface ConditionEvidence {
  code?: CodeableConcept[];
  detail?: Reference[];
}

export interface Condition extends DomainResource {
  resourceType: 'Condition';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  category?: CodeableConcept[];
  severity?: CodeableConcept;
  code?: CodeableConcept;
  bodySite?: CodeableConcept[];
  /** Required (1..1) */
  subject: Reference;
  encounter?: Reference;
  onsetDateTime?: FhirDateTime;
  onsetAge?: Quantity;
  onsetPeriod?: Period;
  onsetRange?: { low?: Quantity; high?: Quantity };
  onsetString?: string;
  abatementDateTime?: FhirDateTime;
  abatementAge?: Quantity;
  abatementPeriod?: Period;
  abatementRange?: { low?: Quantity; high?: Quantity };
  abatementString?: string;
  recordedDate?: FhirDateTime;
  recorder?: Reference;
  asserter?: Reference;
  stage?: ConditionStage[];
  evidence?: ConditionEvidence[];
  note?: Annotation[];
}

// ---------------------------------------------------------------------------
// ChargeItem (STU)
// @see https://www.hl7.org/fhir/R4/chargeitem.html
// ---------------------------------------------------------------------------

export type ChargeItemStatus = 'planned' | 'billable' | 'not-billable' | 'aborted' | 'billed' | 'entered-in-error' | 'unknown';

export interface ChargeItemPerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export interface ChargeItem extends DomainResource {
  resourceType: 'ChargeItem';
  identifier?: Identifier[];
  definitionUri?: FhirUri[];
  definitionCanonical?: FhirCanonical[];
  /** Required (1..1) */
  status: ChargeItemStatus;
  partOf?: Reference[];
  /** Required (1..1) */
  code: CodeableConcept;
  /** Required (1..1) */
  subject: Reference;
  context?: Reference;
  occurrenceDateTime?: FhirDateTime;
  occurrencePeriod?: Period;
  performer?: ChargeItemPerformer[];
  performingOrganization?: Reference;
  requestingOrganization?: Reference;
  costCenter?: Reference;
  quantity?: Quantity;
  bodysite?: CodeableConcept[];
  factorOverride?: number;
  priceOverride?: { value?: number; currency?: string };
  overrideReason?: string;
  enterer?: Reference;
  enteredDate?: FhirDateTime;
  reason?: CodeableConcept[];
  service?: Reference[];
  productReference?: Reference;
  productCodeableConcept?: CodeableConcept;
  account?: Reference[];
  note?: Annotation[];
  supportingInformation?: Reference[];
}


// ---------------------------------------------------------------------------
// Coverage (STU)
// @see https://www.hl7.org/fhir/R4/coverage.html
// Simplified — focuses on commonly used fields
// ---------------------------------------------------------------------------

export type CoverageStatus = 'active' | 'cancelled' | 'draft' | 'entered-in-error';

export interface CoverageClass {
  type: CodeableConcept;
  value: string;
  name?: string;
}

export interface Coverage extends DomainResource {
  resourceType: 'Coverage';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: CoverageStatus;
  type?: CodeableConcept;
  policyHolder?: Reference;
  subscriber?: Reference;
  subscriberId?: string;
  /** Required (1..1) */
  beneficiary: Reference;
  dependent?: string;
  relationship?: CodeableConcept;
  period?: Period;
  /** Required (1..*) */
  payor: Reference[];
  class?: CoverageClass[];
  order?: number;
  network?: string;
  subrogation?: boolean;
  contract?: Reference[];
}

// ---------------------------------------------------------------------------
// CoverageEligibilityRequest (STU)
// @see https://www.hl7.org/fhir/R4/coverageeligibilityrequest.html
// Simplified — focuses on commonly used fields
// ---------------------------------------------------------------------------

export type CoverageEligibilityRequestStatus = 'active' | 'cancelled' | 'draft' | 'entered-in-error';

export interface CoverageEligibilityRequestInsurance {
  focal?: boolean;
  coverage: Reference;
  businessArrangement?: string;
}

export interface CoverageEligibilityRequestItem {
  supportingInfoSequence?: number[];
  category?: CodeableConcept;
  productOrService?: CodeableConcept;
  modifier?: CodeableConcept[];
  provider?: Reference;
  quantity?: Quantity;
  unitPrice?: { value?: number; currency?: string };
  facility?: Reference;
  diagnosis?: Array<{ diagnosisCodeableConcept?: CodeableConcept; diagnosisReference?: Reference }>;
}

export interface CoverageEligibilityRequest extends DomainResource {
  resourceType: 'CoverageEligibilityRequest';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: CoverageEligibilityRequestStatus;
  /** Required (1..*) */
  purpose: string[];
  /** Required (1..1) */
  patient: Reference;
  servicedDate?: FhirDate;
  servicedPeriod?: Period;
  /** Required (1..1) */
  created: FhirDateTime;
  enterer?: Reference;
  provider?: Reference;
  /** Required (1..1) */
  insurer: Reference;
  facility?: Reference;
  supportingInfo?: Array<{ sequence: number; information: Reference; appliesToAll?: boolean }>;
  insurance?: CoverageEligibilityRequestInsurance[];
  item?: CoverageEligibilityRequestItem[];
}

// ---------------------------------------------------------------------------
// CoverageEligibilityResponse (STU)
// @see https://www.hl7.org/fhir/R4/coverageeligibilityresponse.html
// Simplified — focuses on commonly used fields
// ---------------------------------------------------------------------------

export type CoverageEligibilityResponseStatus = 'active' | 'cancelled' | 'draft' | 'entered-in-error';
export type RemittanceOutcome = 'queued' | 'complete' | 'error' | 'partial';

export interface CoverageEligibilityResponseInsurance {
  coverage: Reference;
  inforce?: boolean;
  benefitPeriod?: Period;
  item?: any[];
}

export interface CoverageEligibilityResponse extends DomainResource {
  resourceType: 'CoverageEligibilityResponse';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: CoverageEligibilityResponseStatus;
  /** Required (1..*) */
  purpose: string[];
  /** Required (1..1) */
  patient: Reference;
  servicedDate?: FhirDate;
  servicedPeriod?: Period;
  /** Required (1..1) */
  created: FhirDateTime;
  requestor?: Reference;
  request?: Reference;
  /** Required (1..1) */
  outcome: RemittanceOutcome;
  disposition?: string;
  /** Required (1..1) */
  insurer: Reference;
  insurance?: CoverageEligibilityResponseInsurance[];
  preAuthRef?: string;
  form?: CodeableConcept;
  error?: Array<{ code: CodeableConcept }>;
}

// ---------------------------------------------------------------------------
// ExplanationOfBenefit (STU)
// @see https://www.hl7.org/fhir/R4/explanationofbenefit.html
// Simplified — focuses on commonly used fields
// ---------------------------------------------------------------------------

export type EOBStatus = 'active' | 'cancelled' | 'draft' | 'entered-in-error';
export type EOBUse = 'claim' | 'preauthorization' | 'predetermination';
export type EOBOutcome = 'queued' | 'complete' | 'error' | 'partial';

export interface EOBAdjudication {
  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: { value?: number; currency?: string };
  value?: number;
}

export interface EOBItem {
  sequence: number;
  careTeamSequence?: number[];
  diagnosisSequence?: number[];
  procedureSequence?: number[];
  informationSequence?: number[];
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  servicedDate?: FhirDate;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  quantity?: Quantity;
  unitPrice?: { value?: number; currency?: string };
  factor?: number;
  net?: { value?: number; currency?: string };
  adjudication?: EOBAdjudication[];
}

export interface EOBTotal {
  category: CodeableConcept;
  amount: { value?: number; currency?: string };
}

export interface EOBPayment {
  type: CodeableConcept;
  adjustment?: { value?: number; currency?: string };
  adjustmentReason?: CodeableConcept;
  date?: FhirDate;
  amount: { value?: number; currency?: string };
  identifier?: Identifier;
}

export interface EOBProcessNote {
  number?: number;
  type?: FhirCode;
  text?: string;
  language?: CodeableConcept;
}

export interface EOBInsurance {
  focal: boolean;
  coverage: Reference;
  preAuthRef?: string[];
}

export interface ExplanationOfBenefit extends DomainResource {
  resourceType: 'ExplanationOfBenefit';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: EOBStatus;
  /** Required (1..1) */
  type: CodeableConcept;
  subType?: CodeableConcept;
  /** Required (1..1) */
  use: EOBUse;
  /** Required (1..1) */
  patient: Reference;
  billablePeriod?: Period;
  /** Required (1..1) */
  created: FhirDateTime;
  enterer?: Reference;
  /** Required (1..1) */
  insurer: Reference;
  /** Required (1..1) */
  provider: Reference;
  priority?: CodeableConcept;
  fundsReserveRequested?: CodeableConcept;
  fundsReserve?: CodeableConcept;
  /** Required (1..1) */
  outcome: EOBOutcome;
  disposition?: string;
  preAuthRef?: string[];
  preAuthRefPeriod?: Period[];
  claim?: Reference;
  claimResponse?: Reference;
  careTeam?: Array<{ sequence: number; provider: Reference; responsible?: boolean; role?: CodeableConcept; qualification?: CodeableConcept }>;
  diagnosis?: Array<{ sequence: number; diagnosisCodeableConcept?: CodeableConcept; diagnosisReference?: Reference; type?: CodeableConcept[]; onAdmission?: CodeableConcept; packageCode?: CodeableConcept }>;
  procedure?: Array<{ sequence: number; type?: CodeableConcept[]; date?: FhirDateTime; procedureCodeableConcept?: CodeableConcept; procedureReference?: Reference; udi?: Reference[] }>;
  /** Required (1..*) */
  insurance: EOBInsurance[];
  accident?: { date?: FhirDate; type?: CodeableConcept; locationAddress?: Address; locationReference?: Reference };
  item?: EOBItem[];
  addItem?: any[];
  adjudication?: EOBAdjudication[];
  total?: EOBTotal[];
  payment?: EOBPayment;
  formCode?: CodeableConcept;
  form?: Attachment;
  processNote?: EOBProcessNote[];
  benefitPeriod?: Period;
  benefitBalance?: any[];
}


// ---------------------------------------------------------------------------
// Device (STU)
// @see https://www.hl7.org/fhir/R4/device.html
// ---------------------------------------------------------------------------

export type DeviceStatus = 'active' | 'inactive' | 'entered-in-error' | 'unknown';

export type DeviceNameType =
  | 'udi-label-name'
  | 'user-friendly-name'
  | 'patient-reported-name'
  | 'manufacturer-name'
  | 'model-name'
  | 'other';

export interface DeviceUdiCarrier {
  deviceIdentifier?: string;
  issuer?: FhirUri;
  jurisdiction?: FhirUri;
  carrierAIDC?: string;
  carrierHRF?: string;
  entryType?: FhirCode;
}

export interface DeviceDeviceName {
  name: string;
  type: DeviceNameType;
}

export interface DeviceSpecialization {
  systemType: CodeableConcept;
  version?: string;
}

export interface DeviceVersion {
  type?: CodeableConcept;
  component?: Identifier;
  value: string;
}

export interface DeviceProperty {
  type: CodeableConcept;
  valueQuantity?: Quantity[];
  valueCode?: CodeableConcept[];
}

export interface Device extends DomainResource {
  resourceType: 'Device';
  identifier?: Identifier[];
  definition?: Reference;
  udiCarrier?: DeviceUdiCarrier[];
  status?: DeviceStatus;
  statusReason?: CodeableConcept[];
  distinctIdentifier?: string;
  manufacturer?: string;
  manufactureDate?: FhirDateTime;
  expirationDate?: FhirDateTime;
  lotNumber?: string;
  serialNumber?: string;
  deviceName?: DeviceDeviceName[];
  modelNumber?: string;
  partNumber?: string;
  type?: CodeableConcept;
  specialization?: DeviceSpecialization[];
  version?: DeviceVersion[];
  property?: DeviceProperty[];
  patient?: Reference;
  owner?: Reference;
  contact?: ContactPoint[];
  location?: Reference;
  url?: FhirUri;
  note?: Annotation[];
  safety?: CodeableConcept[];
  parent?: Reference;
}

// ---------------------------------------------------------------------------
// DeviceRequest (STU)
// @see https://www.hl7.org/fhir/R4/devicerequest.html
// ---------------------------------------------------------------------------

export type DeviceRequestStatus =
  | 'draft'
  | 'active'
  | 'on-hold'
  | 'revoked'
  | 'completed'
  | 'entered-in-error'
  | 'unknown';

export type DeviceRequestIntent =
  | 'proposal'
  | 'plan'
  | 'directive'
  | 'order'
  | 'original-order'
  | 'reflex-order'
  | 'filler-order'
  | 'instance-order'
  | 'option';

export type DeviceRequestPriority = 'routine' | 'urgent' | 'asap' | 'stat';

export interface DeviceRequestParameter {
  code?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: { low?: Quantity; high?: Quantity };
  valueBoolean?: boolean;
}

export interface DeviceRequest extends DomainResource {
  resourceType: 'DeviceRequest';
  identifier?: Identifier[];
  instantiatesCanonical?: FhirCanonical[];
  instantiatesUri?: FhirUri[];
  basedOn?: Reference[];
  priorRequest?: Reference[];
  groupIdentifier?: Identifier;
  status?: DeviceRequestStatus;
  /** Required (1..1) */
  intent: DeviceRequestIntent;
  priority?: DeviceRequestPriority;
  codeReference?: Reference;
  codeCodeableConcept?: CodeableConcept;
  parameter?: DeviceRequestParameter[];
  /** Required (1..1) */
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: FhirDateTime;
  occurrencePeriod?: Period;
  occurrenceTiming?: any;
  authoredOn?: FhirDateTime;
  requester?: Reference;
  performerType?: CodeableConcept;
  performer?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  insurance?: Reference[];
  supportingInfo?: Reference[];
  note?: Annotation[];
  relevantHistory?: Reference[];
}

// ---------------------------------------------------------------------------
// DeviceUseStatement (STU)
// @see https://www.hl7.org/fhir/R4/deviceusestatement.html
// ---------------------------------------------------------------------------

export type DeviceUseStatementStatus =
  | 'active'
  | 'completed'
  | 'entered-in-error'
  | 'intended'
  | 'stopped'
  | 'on-hold';

export interface DeviceUseStatement extends DomainResource {
  resourceType: 'DeviceUseStatement';
  identifier?: Identifier[];
  basedOn?: Reference[];
  /** Required (1..1) */
  status: DeviceUseStatementStatus;
  /** Required (1..1) */
  subject: Reference;
  derivedFrom?: Reference[];
  timingTiming?: any;
  timingPeriod?: Period;
  timingDateTime?: FhirDateTime;
  recordedOn?: FhirDateTime;
  source?: Reference;
  /** Required (1..1) */
  device: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  bodySite?: CodeableConcept;
  note?: Annotation[];
}

// ---------------------------------------------------------------------------
// Goal (STU)
// @see https://www.hl7.org/fhir/R4/goal.html
// ---------------------------------------------------------------------------

export type GoalLifecycleStatus =
  | 'proposed'
  | 'planned'
  | 'accepted'
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'entered-in-error'
  | 'rejected';

export interface GoalTarget {
  measure?: CodeableConcept;
  detailQuantity?: Quantity;
  detailRange?: { low?: Quantity; high?: Quantity };
  detailCodeableConcept?: CodeableConcept;
  detailString?: string;
  detailBoolean?: boolean;
  detailInteger?: number;
  detailRatio?: Ratio;
  dueDate?: FhirDate;
  dueDuration?: Quantity;
}

export interface Goal extends DomainResource {
  resourceType: 'Goal';
  identifier?: Identifier[];
  /** Required (1..1) */
  lifecycleStatus: GoalLifecycleStatus;
  achievementStatus?: CodeableConcept;
  category?: CodeableConcept[];
  priority?: CodeableConcept;
  /** Required (1..1) */
  description: CodeableConcept;
  /** Required (1..1) */
  subject: Reference;
  startDate?: FhirDate;
  startCodeableConcept?: CodeableConcept;
  target?: GoalTarget[];
  statusDate?: FhirDate;
  statusReason?: string;
  expressedBy?: Reference;
  addresses?: Reference[];
  note?: Annotation[];
  outcomeCode?: CodeableConcept[];
  outcomeReference?: Reference[];
}


// ---------------------------------------------------------------------------
// Invoice (STU)
// @see https://www.hl7.org/fhir/R4/invoice.html
// ---------------------------------------------------------------------------

export type InvoiceStatus = 'draft' | 'issued' | 'balanced' | 'cancelled' | 'entered-in-error';

export type InvoicePriceComponentType = 'base' | 'surcharge' | 'deduction' | 'discount' | 'tax' | 'informational';

export interface InvoiceParticipant {
  role?: CodeableConcept;
  actor: Reference;
}

export interface InvoiceLineItemPriceComponent {
  type: InvoicePriceComponentType;
  code?: CodeableConcept;
  factor?: number;
  amount?: { value?: number; currency?: string };
}

export interface InvoiceLineItem {
  sequence?: number;
  chargeItemReference?: Reference;
  chargeItemCodeableConcept?: CodeableConcept;
  priceComponent?: InvoiceLineItemPriceComponent[];
}

export interface Invoice extends DomainResource {
  resourceType: 'Invoice';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: InvoiceStatus;
  cancelledReason?: string;
  type?: CodeableConcept;
  subject?: Reference;
  recipient?: Reference;
  date?: FhirDateTime;
  participant?: InvoiceParticipant[];
  issuer?: Reference;
  account?: Reference;
  lineItem?: InvoiceLineItem[];
  totalPriceComponent?: InvoiceLineItemPriceComponent[];
  totalNet?: { value?: number; currency?: string };
  totalGross?: { value?: number; currency?: string };
  paymentTerms?: string;
  note?: Annotation[];
}

// ---------------------------------------------------------------------------
// MedicationDispense (STU)
// @see https://www.hl7.org/fhir/R4/medicationdispense.html
// ---------------------------------------------------------------------------

export type MedicationDispenseStatus =
  | 'preparation'
  | 'in-progress'
  | 'cancelled'
  | 'on-hold'
  | 'completed'
  | 'entered-in-error'
  | 'stopped'
  | 'declined'
  | 'unknown';

export interface MedicationDispensePerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export interface MedicationDispenseSubstitution {
  wasSubstituted: boolean;
  type?: CodeableConcept;
  reason?: CodeableConcept[];
  responsibleParty?: Reference[];
}

export interface MedicationDispense extends DomainResource {
  resourceType: 'MedicationDispense';
  identifier?: Identifier[];
  partOf?: Reference[];
  /** Required (1..1) */
  status: MedicationDispenseStatus;
  statusReasonCodeableConcept?: CodeableConcept;
  statusReasonReference?: Reference;
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject?: Reference;
  context?: Reference;
  supportingInformation?: Reference[];
  performer?: MedicationDispensePerformer[];
  location?: Reference;
  authorizingPrescription?: Reference[];
  type?: CodeableConcept;
  quantity?: Quantity;
  daysSupply?: Quantity;
  whenPrepared?: FhirDateTime;
  whenHandedOver?: FhirDateTime;
  destination?: Reference;
  receiver?: Reference[];
  note?: Annotation[];
  dosageInstruction?: MedicationRequestDosageInstruction[];
  substitution?: MedicationDispenseSubstitution;
  detectedIssue?: Reference[];
  eventHistory?: Reference[];
}

// ---------------------------------------------------------------------------
// MedicationKnowledge (STU)
// @see https://www.hl7.org/fhir/R4/medicationknowledge.html
// ---------------------------------------------------------------------------

export type MedicationKnowledgeStatus = 'active' | 'inactive' | 'entered-in-error';

export interface MedicationKnowledgeIngredient {
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}

export interface MedicationKnowledgeCost {
  type: CodeableConcept;
  source?: string;
  cost: { value?: number; currency?: string };
}

export interface MedicationKnowledgePackaging {
  type?: CodeableConcept;
  quantity?: Quantity;
}

export interface MedicationKnowledge extends DomainResource {
  resourceType: 'MedicationKnowledge';
  code?: CodeableConcept;
  status?: MedicationKnowledgeStatus;
  manufacturer?: Reference;
  doseForm?: CodeableConcept;
  amount?: Quantity;
  synonym?: string[];
  productType?: CodeableConcept[];
  ingredient?: MedicationKnowledgeIngredient[];
  preparationInstruction?: string;
  intendedRoute?: CodeableConcept[];
  cost?: MedicationKnowledgeCost[];
  packaging?: MedicationKnowledgePackaging;
}

// ---------------------------------------------------------------------------
// MedicationStatement (STU)
// @see https://www.hl7.org/fhir/R4/medicationstatement.html
// ---------------------------------------------------------------------------

export type MedicationStatementStatus =
  | 'active'
  | 'completed'
  | 'entered-in-error'
  | 'intended'
  | 'stopped'
  | 'on-hold'
  | 'unknown'
  | 'not-taken';

export interface MedicationStatement extends DomainResource {
  resourceType: 'MedicationStatement';
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  /** Required (1..1) */
  status: MedicationStatementStatus;
  statusReason?: CodeableConcept[];
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  /** Required (1..1) */
  subject: Reference;
  context?: Reference;
  effectiveDateTime?: FhirDateTime;
  effectivePeriod?: Period;
  dateAsserted?: FhirDateTime;
  informationSource?: Reference;
  derivedFrom?: Reference[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  dosage?: MedicationRequestDosageInstruction[];
}


// ---------------------------------------------------------------------------
// PaymentNotice (STU)
// @see https://www.hl7.org/fhir/R4/paymentnotice.html
// ---------------------------------------------------------------------------

export type PaymentNoticeStatus = 'active' | 'cancelled' | 'draft' | 'entered-in-error';

export interface PaymentNotice extends DomainResource {
  resourceType: 'PaymentNotice';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: PaymentNoticeStatus;
  request?: Reference;
  response?: Reference;
  /** Required (1..1) */
  created: FhirDateTime;
  provider?: Reference;
  /** Required (1..1) */
  payment: Reference;
  paymentDate?: FhirDate;
  payee?: Reference;
  /** Required (1..1) */
  recipient: Reference;
  /** Required (1..1) */
  amount: { value?: number; currency?: string };
  paymentStatus?: CodeableConcept;
}

// ---------------------------------------------------------------------------
// PaymentReconciliation (STU)
// @see https://www.hl7.org/fhir/R4/paymentreconciliation.html
// ---------------------------------------------------------------------------

export type PaymentReconciliationStatus = 'active' | 'cancelled' | 'draft' | 'entered-in-error';
export type PaymentReconciliationOutcome = 'queued' | 'complete' | 'error' | 'partial';

export interface PaymentReconciliationDetail {
  identifier?: Identifier;
  predecessor?: Identifier;
  type: CodeableConcept;
  request?: Reference;
  submitter?: Reference;
  response?: Reference;
  date?: FhirDate;
  responsible?: Reference;
  payee?: Reference;
  amount?: { value?: number; currency?: string };
}

export interface PaymentReconciliationProcessNote {
  type?: FhirCode;
  text?: string;
}

export interface PaymentReconciliation extends DomainResource {
  resourceType: 'PaymentReconciliation';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: PaymentReconciliationStatus;
  period?: Period;
  /** Required (1..1) */
  created: FhirDateTime;
  paymentIssuer?: Reference;
  request?: Reference;
  requestor?: Reference;
  outcome?: PaymentReconciliationOutcome;
  disposition?: string;
  /** Required (1..1) */
  paymentDate: FhirDate;
  /** Required (1..1) */
  paymentAmount: { value?: number; currency?: string };
  paymentIdentifier?: Identifier;
  detail?: PaymentReconciliationDetail[];
  formCode?: CodeableConcept;
  processNote?: PaymentReconciliationProcessNote[];
}

// ---------------------------------------------------------------------------
// Specimen (STU)
// @see https://www.hl7.org/fhir/R4/specimen.html
// ---------------------------------------------------------------------------

export type SpecimenStatus = 'available' | 'unavailable' | 'unsatisfactory' | 'entered-in-error';

export interface SpecimenCollection {
  collector?: Reference;
  collectedDateTime?: FhirDateTime;
  collectedPeriod?: Period;
  duration?: Quantity;
  quantity?: Quantity;
  method?: CodeableConcept;
  bodySite?: CodeableConcept;
  fastingStatusCodeableConcept?: CodeableConcept;
  fastingStatusDuration?: Quantity;
}

export interface SpecimenContainer {
  identifier?: Identifier[];
  description?: string;
  type?: CodeableConcept;
  capacity?: Quantity;
  specimenQuantity?: Quantity;
  additiveCodeableConcept?: CodeableConcept;
  additiveReference?: Reference;
}

export interface Specimen extends DomainResource {
  resourceType: 'Specimen';
  identifier?: Identifier[];
  accessionIdentifier?: Identifier;
  status?: SpecimenStatus;
  type?: CodeableConcept;
  /** Required (1..1) */
  subject?: Reference;
  receivedTime?: FhirDateTime;
  parent?: Reference[];
  request?: Reference[];
  collection?: SpecimenCollection;
  processing?: Array<{
    description?: string;
    procedure?: CodeableConcept;
    additive?: Reference[];
    timeDateTime?: FhirDateTime;
    timePeriod?: Period;
  }>;
  container?: SpecimenContainer[];
  condition?: CodeableConcept[];
  note?: Annotation[];
}

// ---------------------------------------------------------------------------
// ImagingStudy (STU)
// @see https://www.hl7.org/fhir/R4/imagingstudy.html
// ---------------------------------------------------------------------------

export type ImagingStudyStatus = 'registered' | 'available' | 'cancelled' | 'entered-in-error' | 'unknown';

export interface ImagingStudySeries {
  uid: string;
  number?: number;
  modality: Coding;
  description?: string;
  numberOfInstances?: number;
  endpoint?: Reference[];
  bodySite?: Coding;
  laterality?: Coding;
  specimen?: Reference[];
  started?: FhirDateTime;
  performer?: Array<{ function?: CodeableConcept; actor: Reference }>;
  instance?: Array<{
    uid: string;
    sopClass: Coding;
    number?: number;
    title?: string;
  }>;
}

export interface ImagingStudy extends DomainResource {
  resourceType: 'ImagingStudy';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: ImagingStudyStatus;
  modality?: Coding[];
  /** Required (1..1) */
  subject: Reference;
  encounter?: Reference;
  started?: FhirDateTime;
  basedOn?: Reference[];
  referrer?: Reference;
  interpreter?: Reference[];
  endpoint?: Reference[];
  numberOfSeries?: number;
  numberOfInstances?: number;
  procedureReference?: Reference;
  procedureCode?: CodeableConcept[];
  location?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  description?: string;
  series?: ImagingStudySeries[];
}


// ---------------------------------------------------------------------------
// EnrollmentRequest (STU)
// @see https://www.hl7.org/fhir/R4/enrollmentrequest.html
// ---------------------------------------------------------------------------

export interface EnrollmentRequest extends DomainResource {
  resourceType: 'EnrollmentRequest';
  identifier?: Identifier[];
  status?: FhirCode;
  created?: FhirDateTime;
  insurer?: Reference;
  provider?: Reference;
  candidate?: Reference;
  coverage?: Reference;
}

// ---------------------------------------------------------------------------
// EnrollmentResponse (STU)
// @see https://www.hl7.org/fhir/R4/enrollmentresponse.html
// ---------------------------------------------------------------------------

export interface EnrollmentResponse extends DomainResource {
  resourceType: 'EnrollmentResponse';
  identifier?: Identifier[];
  status?: FhirCode;
  request?: Reference;
  outcome?: 'queued' | 'complete' | 'error' | 'partial';
  disposition?: string;
  created?: FhirDateTime;
  organization?: Reference;
  requestProvider?: Reference;
}

// ---------------------------------------------------------------------------
// ImmunizationEvaluation (STU)
// @see https://www.hl7.org/fhir/R4/immunizationevaluation.html
// ---------------------------------------------------------------------------

export type ImmunizationEvaluationStatus = 'completed' | 'entered-in-error';

export interface ImmunizationEvaluation extends DomainResource {
  resourceType: 'ImmunizationEvaluation';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: ImmunizationEvaluationStatus;
  /** Required (1..1) */
  patient: Reference;
  date?: FhirDateTime;
  authority?: Reference;
  /** Required (1..1) */
  targetDisease: CodeableConcept;
  /** Required (1..1) */
  immunizationEvent: Reference;
  /** Required (1..1) */
  doseStatus: CodeableConcept;
  doseStatusReason?: CodeableConcept[];
  description?: string;
  series?: string;
  doseNumberPositiveInt?: number;
  doseNumberString?: string;
  seriesDosesPositiveInt?: number;
  seriesDosesString?: string;
}

// ---------------------------------------------------------------------------
// Media (STU)
// @see https://www.hl7.org/fhir/R4/media.html
// ---------------------------------------------------------------------------

export type MediaStatus = 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed' | 'entered-in-error' | 'unknown';

export interface Media extends DomainResource {
  resourceType: 'Media';
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  /** Required (1..1) */
  status: MediaStatus;
  type?: CodeableConcept;
  modality?: CodeableConcept;
  view?: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  createdDateTime?: FhirDateTime;
  createdPeriod?: Period;
  issued?: FhirInstant;
  operator?: Reference;
  reasonCode?: CodeableConcept[];
  bodySite?: CodeableConcept;
  deviceName?: string;
  device?: Reference;
  height?: number;
  width?: number;
  frames?: number;
  duration?: number;
  /** Required (1..1) */
  content: Attachment;
  note?: Annotation[];
}


// ---------------------------------------------------------------------------
// ActivityDefinition (STU)
// @see https://www.hl7.org/fhir/R4/activitydefinition.html
// Simplified — skip dynamicValue, expression, library, relatedArtifact, transform
// ---------------------------------------------------------------------------

export interface ActivityDefinitionParticipant {
  type: string;
  role?: CodeableConcept;
}

export interface ActivityDefinition extends DomainResource {
  resourceType: 'ActivityDefinition';
  identifier?: Identifier[];
  url?: FhirUri;
  version?: string;
  name?: string;
  title?: string;
  /** Required (1..1) */
  status: FhirCode;
  experimental?: boolean;
  date?: FhirDateTime;
  publisher?: string;
  description?: string;
  purpose?: string;
  usage?: string;
  copyright?: string;
  topic?: CodeableConcept[];
  kind?: FhirCode;
  intent?: FhirCode;
  priority?: FhirCode;
  doNotPerform?: boolean;
  timingDateTime?: FhirDateTime;
  timingPeriod?: Period;
  location?: Reference;
  participant?: ActivityDefinitionParticipant[];
  code?: CodeableConcept;
  quantity?: Quantity;
  bodySite?: CodeableConcept[];
}

// ---------------------------------------------------------------------------
// NutritionOrder (STU)
// @see https://www.hl7.org/fhir/R4/nutritionorder.html
// ---------------------------------------------------------------------------

export interface NutritionOrderOralDietNutrient {
  modifier?: CodeableConcept;
  amount?: Quantity;
}

export interface NutritionOrderOralDiet {
  type?: CodeableConcept[];
  nutrient?: NutritionOrderOralDietNutrient[];
  instruction?: string;
}

export interface NutritionOrderSupplement {
  type?: CodeableConcept;
  productName?: string;
  quantity?: Quantity;
  instruction?: string;
}

export interface NutritionOrderEnteralFormula {
  baseFormulaType?: CodeableConcept;
  baseFormulaProductName?: string;
  additiveType?: CodeableConcept;
  routeofAdministration?: CodeableConcept;
  administrationInstruction?: string;
}

export interface NutritionOrder extends DomainResource {
  resourceType: 'NutritionOrder';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: FhirCode;
  /** Required (1..1) */
  intent: FhirCode;
  /** Required (1..1) */
  patient: Reference;
  encounter?: Reference;
  dateTime: FhirDateTime;
  orderer?: Reference;
  allergyIntolerance?: Reference[];
  foodPreferenceModifier?: CodeableConcept[];
  excludeFoodModifier?: CodeableConcept[];
  oralDiet?: NutritionOrderOralDiet;
  supplement?: NutritionOrderSupplement[];
  enteralFormula?: NutritionOrderEnteralFormula;
  note?: Annotation[];
}

// ---------------------------------------------------------------------------
// PlanDefinition (STU)
// @see https://www.hl7.org/fhir/R4/plandefinition.html
// Simplified — skip dynamicValue, expression, library, relatedArtifact
// ---------------------------------------------------------------------------

export interface PlanDefinitionGoal {
  description: CodeableConcept;
  priority?: CodeableConcept;
  category?: CodeableConcept;
}

export interface PlanDefinitionAction {
  title?: string;
  description?: string;
  priority?: string;
  code?: CodeableConcept[];
  type?: CodeableConcept;
  definitionUri?: FhirUri;
}

export interface PlanDefinition extends DomainResource {
  resourceType: 'PlanDefinition';
  identifier?: Identifier[];
  url?: FhirUri;
  version?: string;
  name?: string;
  title?: string;
  /** Required (1..1) */
  status: FhirCode;
  experimental?: boolean;
  date?: FhirDateTime;
  publisher?: string;
  description?: string;
  purpose?: string;
  usage?: string;
  copyright?: string;
  type?: CodeableConcept;
  topic?: CodeableConcept[];
  goal?: PlanDefinitionGoal[];
  action?: PlanDefinitionAction[];
}

// ---------------------------------------------------------------------------
// VisionPrescription (STU)
// @see https://www.hl7.org/fhir/R4/visionprescription.html
// ---------------------------------------------------------------------------

export interface VisionPrescriptionLensSpecPrism {
  amount: number;
  base: 'up' | 'down' | 'in' | 'out';
}

export interface VisionPrescriptionLensSpecification {
  product: CodeableConcept;
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
  note?: Annotation[];
  prism?: VisionPrescriptionLensSpecPrism[];
}

export interface VisionPrescription extends DomainResource {
  resourceType: 'VisionPrescription';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: FhirCode;
  created?: FhirDateTime;
  /** Required (1..1) */
  patient: Reference;
  encounter?: Reference;
  /** Required (1..1) */
  dateWritten: FhirDateTime;
  /** Required (1..1) */
  prescriber: Reference;
  /** Required (1..*) */
  lensSpecification: VisionPrescriptionLensSpecification[];
}

// ---------------------------------------------------------------------------
// RiskAssessment (STU)
// @see https://www.hl7.org/fhir/R4/riskassessment.html
// ---------------------------------------------------------------------------

export interface RiskAssessmentPrediction {
  outcome?: CodeableConcept;
  probabilityDecimal?: number;
  qualitativeRisk?: CodeableConcept;
  relativeRisk?: number;
  rationale?: string;
}

export interface RiskAssessment extends DomainResource {
  resourceType: 'RiskAssessment';
  identifier?: Identifier[];
  basedOn?: Reference[];
  /** Required (1..1) */
  status: FhirCode;
  method?: CodeableConcept;
  code?: CodeableConcept;
  /** Required (1..1) */
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: FhirDateTime;
  condition?: Reference;
  performer?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  prediction?: RiskAssessmentPrediction[];
  mitigation?: string;
  note?: Annotation[];
}


// ---------------------------------------------------------------------------
// AuditEvent (STU)
// @see https://www.hl7.org/fhir/R4/auditevent.html
// Simplified — immutable, create and read only
// ---------------------------------------------------------------------------

export interface AuditEventAgent {
  type?: CodeableConcept;
  role?: CodeableConcept[];
  who?: Reference;
  altId?: string;
  name?: string;
  requestor: boolean;
  location?: Reference;
  policy?: FhirUri[];
  media?: Coding;
  network?: { address?: string; type?: string };
  purposeOfUse?: CodeableConcept[];
}

export interface AuditEventSource {
  site?: string;
  observer: Reference;
  type?: Coding[];
}

export interface AuditEventEntity {
  what?: Reference;
  type?: Coding;
  role?: Coding;
  lifecycle?: Coding;
  securityLabel?: Coding[];
  name?: string;
  description?: string;
  query?: string;
  detail?: Array<{ type: string; valueString?: string; valueBase64Binary?: string }>;
}

export interface AuditEvent extends DomainResource {
  resourceType: 'AuditEvent';
  type: Coding;
  subtype?: Coding[];
  action?: FhirCode;
  period?: Period;
  /** Required (1..1) */
  recorded: FhirInstant;
  outcome?: FhirCode;
  outcomeDesc?: string;
  purposeOfEvent?: CodeableConcept[];
  /** Required (1..*) */
  agent: AuditEventAgent[];
  /** Required (1..1) */
  source: AuditEventSource;
  entity?: AuditEventEntity[];
}

// ---------------------------------------------------------------------------
// Measure (STU)
// @see https://www.hl7.org/fhir/R4/measure.html
// Simplified — skip library, relatedArtifact, supplementalData, population criteria
// ---------------------------------------------------------------------------

export interface MeasureGroup {
  code?: CodeableConcept;
  description?: string;
  population?: Array<{
    code?: CodeableConcept;
    description?: string;
    criteria?: { language: string; expression: string };
  }>;
  stratifier?: Array<{
    code?: CodeableConcept;
    description?: string;
    criteria?: { language: string; expression: string };
  }>;
}

export interface Measure extends DomainResource {
  resourceType: 'Measure';
  url?: FhirUri;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  /** Required (1..1) */
  status: FhirCode;
  experimental?: boolean;
  date?: FhirDateTime;
  publisher?: string;
  description?: string;
  purpose?: string;
  usage?: string;
  copyright?: string;
  topic?: CodeableConcept[];
  scoring?: CodeableConcept;
  type?: CodeableConcept[];
  riskAdjustment?: string;
  rationale?: string;
  clinicalRecommendationStatement?: string;
  guidance?: string;
  group?: MeasureGroup[];
}

// ---------------------------------------------------------------------------
// MeasureReport (STU)
// @see https://www.hl7.org/fhir/R4/measurereport.html
// Simplified — skip stratifier details, focus on group populations and measure scores
// ---------------------------------------------------------------------------

export interface MeasureReportGroupPopulation {
  code?: CodeableConcept;
  count?: number;
  subjectResults?: Reference;
}

export interface MeasureReportGroup {
  code?: CodeableConcept;
  population?: MeasureReportGroupPopulation[];
  measureScore?: Quantity;
}

export interface MeasureReport extends DomainResource {
  resourceType: 'MeasureReport';
  identifier?: Identifier[];
  /** Required (1..1) */
  status: FhirCode;
  /** Required (1..1) */
  type: FhirCode;
  /** Required (1..1) */
  measure: FhirCanonical;
  subject?: Reference;
  date?: FhirDateTime;
  reporter?: Reference;
  /** Required (1..1) */
  period: Period;
  group?: MeasureReportGroup[];
}

// ---------------------------------------------------------------------------
// ImmunizationRecommendation (STU)
// @see https://www.hl7.org/fhir/R4/immunizationrecommendation.html
// ---------------------------------------------------------------------------

export interface ImmunizationRecommendationDateCriterion {
  code: CodeableConcept;
  value: FhirDateTime;
}

export interface ImmunizationRecommendationRecommendation {
  vaccineCode?: CodeableConcept[];
  targetDisease?: CodeableConcept;
  contraindicatedVaccineCode?: CodeableConcept[];
  /** Required (1..1) */
  forecastStatus: CodeableConcept;
  forecastReason?: CodeableConcept[];
  dateCriterion?: ImmunizationRecommendationDateCriterion[];
  description?: string;
  series?: string;
  doseNumberPositiveInt?: number;
  doseNumberString?: string;
  seriesDosesPositiveInt?: number;
  seriesDosesString?: string;
  supportingImmunization?: Reference[];
  supportingPatientInformation?: Reference[];
}

export interface ImmunizationRecommendation extends DomainResource {
  resourceType: 'ImmunizationRecommendation';
  identifier?: Identifier[];
  /** Required (1..1) */
  patient: Reference;
  /** Required (1..1) */
  date: FhirDateTime;
  authority?: Reference;
  /** Required (1..*) */
  recommendation: ImmunizationRecommendationRecommendation[];
}
