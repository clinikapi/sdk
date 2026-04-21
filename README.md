# @clinikapi/sdk

Server-side TypeScript SDK for the [ClinikAPI](https://clinikapi.com) healthcare infrastructure platform. Build clinical applications with a simple, type-safe API — we handle FHIR R4 transformation, tenant isolation, and HIPAA-compliant storage.

## Install

```bash
npm install @clinikapi/sdk
```

## Quick Start

```ts
import { Clinik } from '@clinikapi/sdk';

const clinik = new Clinik(process.env.CLINIKAPI_SECRET_KEY!);

// Create a patient
const { data: patient, meta } = await clinik.patients.create({
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  gender: 'female',
  birthDate: '1990-03-15',
});

console.log(patient.id);                  // "pt_abc123"
console.log(meta.requestId);              // "req_7f3a..."
console.log(meta.rateLimitRemaining);     // 498
```

## Server-Side Only

This SDK authenticates with your secret API key. Never use it in client-side code.

For frontend UI, use [@clinikapi/react](https://www.npmjs.com/package/@clinikapi/react) which communicates through your backend proxy.

## 14 Resource Namespaces

```ts
clinik.patients            // Patient
clinik.practitioners       // Practitioner
clinik.practitionerRoles   // PractitionerRole
clinik.encounters          // Encounter
clinik.observations        // Observation
clinik.medications         // Medication
clinik.prescriptions       // MedicationRequest
clinik.appointments        // Appointment
clinik.intakes             // QuestionnaireResponse
clinik.consents            // Consent
clinik.labs                // DiagnosticReport
clinik.notes               // DocumentReference
clinik.assessments         // ClinicalImpression
clinik.documents           // Composition
```

Each namespace provides: `create`, `read`, `update`, `delete`, `search`.

## Response Format

Every method returns `ApiResponse<T>`:

```ts
const { data, meta } = await clinik.patients.read('pt_abc123');

// data: Patient resource
// meta: { requestId, timestamp, status, rateLimitTotal, rateLimitRemaining, rateLimitReset }
```

## Patient Read with Related Resources

```ts
const { data } = await clinik.patients.read('pt_abc123', {
  include: ['Encounter', 'Observation', 'MedicationRequest'],
});

data.patient;        // Patient
data.encounters;     // Encounter[]
data.observations;   // Observation[]
data.prescriptions;  // MedicationRequest[]
```

## Search with Pagination

```ts
const { data: results } = await clinik.patients.search({
  name: 'Doe',
  gender: 'female',
  count: 20,
});

for (const patient of results.data) {
  console.log(patient.name?.[0]?.family);
}

if (results.hasMore) {
  const { data: next } = await clinik.patients.search({
    name: 'Doe',
    cursor: results.cursor,
  });
}
```

## Raw FHIR Escape Hatch

When the simplified API doesn't cover your use case:

```ts
const { data } = await clinik.fhir.request('GET', '/Observation?code=8867-4&_sort=-date');
```

## Configuration

```ts
const clinik = new Clinik(process.env.CLINIKAPI_SECRET_KEY!, {
  baseUrl: 'https://api.clinikehr.com',  // default
  timeout: 30000,                         // ms, default: 30s
  retries: 2,                             // auto-retry on 5xx/429, default: 2
});
```

## Error Handling

```ts
try {
  await clinik.patients.create({ firstName: '', lastName: '' });
} catch (err) {
  if (err.name === 'ClinikValidationError') {
    console.error(err.issues);  // field-level validation errors
  } else if (err.name === 'ClinikRateLimitError') {
    console.error('Retry after:', err.retryAfter);
  }
}
```

## Security

- Path traversal protection on all resource IDs
- HTTPS enforcement (warns on non-HTTPS baseUrl)
- Browser environment detection (warns if used client-side)
- Body size limits (1MB max)
- PHI sanitization in error messages
- Jittered exponential backoff on retries

## Requirements

- Node.js 18+ (or any runtime with `fetch`)
- TypeScript 5+ recommended

## Documentation

Full docs at [docs.clinikapi.com/sdk](https://docs.clinikapi.com/sdk/installation)

## License

MIT
