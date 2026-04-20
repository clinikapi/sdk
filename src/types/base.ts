/**
 * FHIR R4 Base Types
 * @see https://www.hl7.org/fhir/R4/datatypes.html
 */

// --- Primitive Wrappers ---

/** FHIR instant: an ISO 8601 date+time with timezone */
export type FhirInstant = string;

/** FHIR dateTime: date, date-time, or partial date */
export type FhirDateTime = string;

/** FHIR date: YYYY, YYYY-MM, or YYYY-MM-DD */
export type FhirDate = string;

/** FHIR time: HH:MM:SS */
export type FhirTime = string;

/** FHIR uri */
export type FhirUri = string;

/** FHIR canonical: uri referencing a conformance resource */
export type FhirCanonical = string;

/** FHIR code: string with restricted character set */
export type FhirCode = string;

// --- Complex Types ---

export interface Identifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: CodeableConcept;
  system?: FhirUri;
  value?: string;
  period?: Period;
  assigner?: Reference;
}

export interface HumanName {
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: Period;
}

export interface ContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  rank?: number;
  period?: Period;
}

export interface Address {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type?: 'postal' | 'physical' | 'both';
  text?: string;
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: Period;
}

export interface Period {
  start?: FhirDateTime;
  end?: FhirDateTime;
}

export interface Coding {
  system?: FhirUri;
  version?: string;
  code?: FhirCode;
  display?: string;
  userSelected?: boolean;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Reference {
  reference?: string;
  type?: FhirUri;
  identifier?: Identifier;
  display?: string;
}

export interface Quantity {
  value?: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: FhirUri;
  code?: FhirCode;
}

export interface Ratio {
  numerator?: Quantity;
  denominator?: Quantity;
}

export interface Attachment {
  contentType?: FhirCode;
  language?: FhirCode;
  data?: string;
  url?: FhirUri;
  size?: number;
  hash?: string;
  title?: string;
  creation?: FhirDateTime;
}

export interface Annotation {
  authorReference?: Reference;
  authorString?: string;
  time?: FhirDateTime;
  text: string;
}

export interface Narrative {
  status: 'generated' | 'extensions' | 'additional' | 'empty';
  div: string;
}

export interface Meta {
  versionId?: string;
  lastUpdated?: FhirInstant;
  source?: FhirUri;
  profile?: FhirCanonical[];
  security?: Coding[];
  tag?: Coding[];
}

export interface Extension {
  url: FhirUri;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueCode?: FhirCode;
  valueCoding?: Coding;
  valueCodeableConcept?: CodeableConcept;
  valueReference?: Reference;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueDateTime?: FhirDateTime;
  valueDate?: FhirDate;
}
