# Changelog

## 0.3.2

- **429 handling.** A rate-limited `GET`, `HEAD`, `PUT` or `DELETE` is retried up to 3 times, waiting for the `Retry-After` the server sends (capped at 30 seconds). `POST` and `PATCH` are not repeated automatically (the SDK sends no idempotency key). Quota and bulk-limit 429s (`MONTHLY_QUOTA_EXCEEDED`, `SANDBOX_QUOTA_EXCEEDED`, `BULK_RATE_LIMITED`) are not retried. The 429 retries have their own budget, so `retries: 0` no longer turns them off (it still turns off retries for server errors and network failures). The final 429 is thrown as `ClinikRateLimitError` and now carries the server's `message`, `code`, `requestId` and `retryAfter`.
- **Safer retries.** A server error (5xx), network failure or timeout is retried only for `GET`, `HEAD`, `PUT` and `DELETE`. A `POST` (create) or `PATCH` (partial update) is never sent twice: if it failed after the server applied it, a retry would create a duplicate. A timed-out create or update says so, so you can check before sending it again.
- **States are not retried.** `LIVE_STORE_UNAVAILABLE`, `PROJECT_NOT_READY` and `PROJECT_PAUSED` are thrown at once instead of after the retry backoff; `SANDBOX_UNAVAILABLE` (a temporary outage) is still retried for safe methods.
- **Patient reads with appointments** no longer ask for `Appointment:subject` (Appointment has no `subject` parameter; a conformant server refused the whole read).
- **`ClinikPayloadTooLargeError`** for `413 PAYLOAD_TOO_LARGE` (request body over 5 MB).
- `Retry-After` given as an HTTP date is understood.
- Sandbox notes in the README: synthetic data only, 90-day clean-up, 60 requests per minute, 1,000-record import cap.
- A server `requestId` in an error body is used when the `x-request-id` header is absent.

## 0.3.1

- `requestId` is required on eligibility-response creates.
