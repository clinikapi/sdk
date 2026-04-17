export interface PatientCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
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
        // Will catch API Gateway 4xx/5xx errors
        throw new Error(`ClinikAPI Runtime Error: ${response.statusText}`);
      }
      return response.json();
    }
  };
}
