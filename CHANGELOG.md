# Changelog

## 0.3.2

- **429 handling.** A rate-limited `GET`, `HEAD`, `PUT` or `DELETE` is retried up to 3 times, waiting for the `Retry-After` the server sends (capped at 30 seconds). `POST` and `PATCH` are not repeated automatically (the SDK sends no idempotency key). Quota 429s are not retried. The final 429 is thrown as `ClinikRateLimitError` and now carries the server's `message`, `code`, `requestId` and `retryAfter`.
- **`ClinikPayloadTooLargeError`** for `413 PAYLOAD_TOO_LARGE` (request body over 5 MB).
- `Retry-After` given as an HTTP date is understood.
- Sandbox notes in the README: synthetic data only, 90-day clean-up, 60 requests per minute, 1,000-record import cap.
- A server `requestId` in an error body is used when the `x-request-id` header is absent.

## 0.3.1

- `requestId` is required on eligibility-response creates.
