export interface PatientCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ReadOptions {
  include?: string[];
}

export interface Patient {
  resourceType: 'Patient';
  id: string;
  name?: Array<{ family: string; given: string[] }>;
  active?: boolean;
}

export interface Encounter {
  resourceType: 'Encounter';
  id: string;
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'finished';
  subject: { reference: string };
}

export interface Observation {
  resourceType: 'Observation';
  id: string;
  status: string;
  code: any;
  subject: { reference: string };
}

export interface Medication {
  resourceType: 'Medication';
  id: string;
}

export interface Appointment {
  resourceType: 'Appointment';
  id: string;
  status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow' | 'entered-in-error' | 'checked-in' | 'waitlist';
  start?: string;
  end?: string;
}

export interface QuestionnaireResponse {
  resourceType: 'QuestionnaireResponse';
  id: string;
  status: 'in-progress' | 'completed' | 'amended' | 'entered-in-error' | 'stopped';
  subject?: { reference: string }; 
  item?: Array<{ linkId: string; text?: string; answer?: any[] }>;
}

export interface Consent {
  resourceType: 'Consent';
  id: string;
  status: 'draft' | 'proposed' | 'active' | 'rejected' | 'inactive' | 'entered-in-error';
  scope: { coding: Array<{ code: string }> };
  category: { coding: Array<{ code: string }> }[];
  patient?: { reference: string };
}

export interface PatientReadResponse {
  patient: Patient;
  encounters: Encounter[];
  observations: Observation[];
  medications: Medication[];
  appointments: Appointment[];
  intakes: QuestionnaireResponse[];
  consents: Consent[];
}

export class Clinik {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, options?: { baseUrl?: string }) {
    this.apiKey = apiKey;
    // Base URL targets the AWS API Gateway executing the Hono Lambda
    this.baseUrl = options?.baseUrl || 'https://api.clinikehr.com';
  }

  public patients = {
    /**
     * Securely creates a patient via the ClinikAPI
     * Data is validated and routed to the customer's isolated FHIR store in AWS HealthLake
     */
    create: async (data: PatientCreateRequest) => {
      const response = await fetch(`${this.baseUrl}/v1/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`ClinikAPI Runtime Error: ${response.statusText}`);
      }
      return response.json();
    },

    /**
     * Updates an existing patient via a robust FHIR Partial Update (PATCH) operation.
     * This avoids conflicts by only updating exactly the fields explicitly provided.
     */
    update: async (id: string, data: Partial<PatientCreateRequest>) => {
      const response = await fetch(`${this.baseUrl}/v1/patients/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json-patch+json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`ClinikAPI Runtime Error: ${response.statusText}`);
      }
      return response.json();
    },
    
    /**
     * Intelligently reads a patient and automatically destructures any included resources 
     * out of the raw FHIR Searchset Bundle perfectly into typings.
     */
    read: async (id: string, options?: ReadOptions): Promise<PatientReadResponse> => {
      // 1. Build FHIR query params based on includes
      const params = new URLSearchParams();
      if (options?.include) {
        // Standard FHIR reverse chaining for common relationships to Patient
        options.include.forEach(inc => {
          params.append('_revinclude', `${inc}:subject`);
          params.append('_revinclude', `${inc}:patient`); // handle both standard fields depending on resource
        });
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      // 2. Fetch the raw bundle from the gateway
      const response = await fetch(`${this.baseUrl}/v1/patients/${id}${queryString}`, {
        headers: {
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`ClinikAPI Runtime Error: ${response.statusText}`);
      }
      
      const rawBundle = await response.json();
      
      // 3. Initialize the clean, destructured payload
      const result: any = {
        encounters: [],
        observations: [],
        medications: [],
        appointments: [],
        intakes: [],
        consents: []
      };

      // 4. Intelligently map the flat FHIR bundle into categorized property arrays
      if (rawBundle.resourceType === 'Bundle' && rawBundle.entry) {
        for (const entry of rawBundle.entry) {
          const resource = entry.resource;
          if (!resource) continue;
          
          switch (resource.resourceType) {
            case 'Patient':
              result.patient = resource;
              break;
            case 'Encounter':
              result.encounters.push(resource);
              break;
            case 'Observation':
              result.observations.push(resource);
              break;
            case 'Medication':
              result.medications.push(resource);
              break;
            case 'Appointment':
              result.appointments.push(resource);
              break;
            case 'QuestionnaireResponse':
              result.intakes.push(resource);
              break;
            case 'Consent':
              result.consents.push(resource);
              break;
          }
        }
      } else if (rawBundle.resourceType === 'Patient') {
        // Fallback for simple single-resource returns with no includes
        result.patient = rawBundle;
      }
      
      return result as PatientReadResponse;
    }
  };

  private createCreateMethod(resourcePath: string) {
    return async (data: any) => {
      const response = await fetch(`${this.baseUrl}/v1/${resourcePath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`ClinikAPI Runtime Error: ${response.statusText}`);
      return response.json();
    };
  }

  private createReadMethod(resourcePath: string) {
    return async (id: string, options?: ReadOptions) => {
      const params = new URLSearchParams();
      if (options?.include) {
        options.include.forEach(inc => {
          params.append('_include', `${resourcePath}:${inc}`);
        });
      }
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${this.baseUrl}/v1/${resourcePath}/${id}${queryString}`, {
        headers: {
          'x-api-key': this.apiKey
        }
      });
      if (!response.ok) throw new Error(`ClinikAPI Runtime Error: ${response.statusText}`);
      return response.json();
    };
  }

  private createUpdateMethod(resourcePath: string) {
    return async (id: string, data: any) => {
      const response = await fetch(`${this.baseUrl}/v1/${resourcePath}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json-patch+json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`ClinikAPI Runtime Error: ${response.statusText}`);
      return response.json();
    };
  }

  public encounters = {
    create: this.createCreateMethod('encounters'),
    read: this.createReadMethod('encounters'),
    update: this.createUpdateMethod('encounters')
  };

  public observations = {
    create: this.createCreateMethod('observations'),
    read: this.createReadMethod('observations'),
    update: this.createUpdateMethod('observations')
  };

  public medications = {
    create: this.createCreateMethod('medications'),
    read: this.createReadMethod('medications'),
    update: this.createUpdateMethod('medications')
  };

  public appointments = {
    create: this.createCreateMethod('appointments'),
    read: this.createReadMethod('appointments'),
    update: this.createUpdateMethod('appointments')
  };

  public intakes = {
    /**
     * Submits a filled-out intake form and automatically maps it to a FHIR QuestionnaireResponse.
     */
    submit: async (data: any) => {
      const response = await fetch(`${this.baseUrl}/v1/intakes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`ClinikAPI Runtime Error: ${response.statusText}`);
      return response.json();
    },
    read: this.createReadMethod('intakes'),
    update: this.createUpdateMethod('intakes')
  };

  public consents = {
    /**
     * Digitally signs and securely logs a standard HIPAA or Treatment consent document.
     */
    sign: async (data: any) => {
      const response = await fetch(`${this.baseUrl}/v1/consents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`ClinikAPI Runtime Error: ${response.statusText}`);
      return response.json();
    },
    read: this.createReadMethod('consents'),
    update: this.createUpdateMethod('consents')
  };
}
