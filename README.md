# @clinikapi/sdk

Server-side TypeScript SDK for the [ClinikAPI](https://clinikapi.com) healthcare infrastructure platform. Build clinical applications with a simple, type-safe API — we handle FHIR R4 transformation, tenant isolation, and HIPAA compliant storage.

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

## 62 Resource Namespaces

Organized by FHIR domain:

```ts
// Individuals
clinik.patients              clinik.practitioners
clinik.practitionerRoles     clinik.persons
clinik.familyHistory

// Entities
clinik.organizations         clinik.locations
clinik.healthcareServices    clinik.devices

// Clinical — Summary
clinik.conditions            clinik.allergies
clinik.assessments

// Clinical — Diagnostics
clinik.observations          clinik.labs
clinik.specimens             clinik.imagingStudies
clinik.media                 clinik.riskAssessments

// Clinical — Medications
clinik.medications           clinik.prescriptions
clinik.medicationDispenses   clinik.medicationStatements
clinik.medicationKnowledge   clinik.immunizations
clinik.immunizationEvaluations
clinik.immunizationRecommendations
clinik.nutritionOrders       clinik.visionPrescriptions

// Clinical — Care Provision
clinik.encounters            clinik.carePlans
clinik.careTeams             clinik.goals
clinik.serviceRequests       clinik.deviceRequests
clinik.deviceUseStatements   clinik.consents

// Documents and Forms
clinik.notes                 clinik.documents
clinik.intakes

// Scheduling
clinik.appointments          clinik.appointmentResponses
clinik.schedules             clinik.slots

// Workflow
clinik.tasks                 clinik.activityDefinitions
clinik.planDefinitions

// Financial — Billing
clinik.accounts              clinik.chargeItems
clinik.invoices

// Financial — Claims
clinik.claims                clinik.claimResponses
clinik.eobs                  clinik.paymentNotices
clinik.paymentReconciliations

// Financial — Insurance
clinik.coverages             clinik.eligibilityRequests
clinik.eligibilityResponses  clinik.enrollmentRequests
clinik.enrollmentResponses

// Quality and Audit
clinik.measures              clinik.measureReports
clinik.auditEvents
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
  baseUrl: 'https://api.clinikapi.com',  // default
  timeout: 30000,                         // ms, default: 30s
  retries: 2,                             // retries for GET/HEAD/PUT/DELETE on 5xx, network errors and timeouts, default: 2
});
```

## Test keys (sandbox)

Keys that start with `clk_test_` use the sandbox:

- **Synthetic data only.** Never put real patient information in the sandbox. Every test-key response carries `X-Sandbox-Notice: synthetic-data-only`.
- **Clean-up after 90 days.** Sandbox records are removed automatically after 90 days.
- **60 requests per minute** for all of an organization's test keys together. Past that the API answers `429 RATE_LIMITED` with a `Retry-After` header.
- **1,000 records per bulk import**, and exports from the sandbox are returned in the response itself and limited to what fits in it.
- Live keys answer `503 LIVE_STORE_UNAVAILABLE` ("Live data is not available yet; use a test key") until live data opens.

## Rate limits and retries

A `429` is retried automatically, waiting for the `Retry-After` the server sends (never longer than 30 seconds), up to 3 times. This applies to `GET`, `HEAD`, `PUT` and `DELETE` only. A `POST` or `PATCH` is not repeated on its own, because the SDK does not send an idempotency key; handle the error and decide. Quota and bulk-limit 429s (`MONTHLY_QUOTA_EXCEEDED`, `SANDBOX_QUOTA_EXCEEDED` or `BULK_RATE_LIMITED`) are never retried: no wait clears them.

Server errors (5xx), network failures and timeouts are retried the same way, with a jittered backoff, but only for `GET`, `HEAD`, `PUT` and `DELETE`: a `POST` (create) or `PATCH` (update) is never sent twice, since it may already have been applied. `LIVE_STORE_UNAVAILABLE`, `PROJECT_NOT_READY` and `PROJECT_PAUSED` are not retried.

If the last answer is still a 429, it is thrown as `ClinikRateLimitError` with the server's `message`, `code`, `requestId` and `retryAfter` (seconds).

## Error Handling

A key whose project cannot serve requests is refused before anything is counted: `402 PAYMENT_REQUIRED` (billing stopped), `503 PROJECT_PAUSED` or `503 PROJECT_NOT_READY`. A paused project is never retried automatically.

```ts
try {
  await clinik.patients.create({ firstName: '', lastName: '' });
} catch (err) {
  if (err.name === 'ClinikValidationError') {
    console.error(err.issues);  // field-level validation errors
  } else if (err.name === 'ClinikRateLimitError') {
    console.error('Retry after:', err.retryAfter);
  } else if (err.name === 'ClinikPaymentRequiredError') {
    console.error('Billing for this project has stopped');  // 402 PAYMENT_REQUIRED
  } else if (err.name === 'ClinikProjectPausedError') {
    console.error('This project is paused');  // 503 PROJECT_PAUSED, not retried
  } else if (err.name === 'ClinikProjectNotReadyError') {
    console.error('Project is still being set up; try again shortly');  // 503 PROJECT_NOT_READY
  } else if (err.name === 'ClinikPayloadTooLargeError') {
    console.error('Body is over the 5 MB limit; send it in smaller parts');  // 413 PAYLOAD_TOO_LARGE
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


