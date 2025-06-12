# 📊 Average Calculator Microservice

This microservice exposes a REST API endpoint to compute a rolling average of numbers fetched from an external evaluation service, based on a given number category (prime, fibonacci, even, or random).

---

## 🚀 Features

- REST API endpoint: `GET /numbers/{numberid}`
- Supported `{numberid}` values:
  - `p` – Prime numbers
  - `f` – Fibonacci numbers
  - `e` – Even numbers
  - `r` – Random numbers
- Maintains a sliding window of up to **10 unique numbers**
- Fetches numbers from a third-party server only
- Ignores:
  - Duplicate numbers
  - Slow responses (> 500 ms)
  - API call errors
- Response includes:
  - Previous and current window states
  - New numbers fetched
  - Average of the current window

---

## 🧪 Example

### Request
```http
GET http://localhost:9876/numbers/e
```
## Response
json

{
  "windowPrevState": [2, 4, 6, 8],
  "windowCurrState": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  "numbers": [10, 12, 14, 16, 18, 20],
  "avg": 12.0
}

## 🌐 External Test APIs
Prime: http://20.244.56.144/evaluation-service/primes

Fibonacci: http://20.244.56.144/evaluation-service/fibo

Even: http://20.244.56.144/evaluation-service/even

Random: http://20.244.56.144/evaluation-service/rand

## 📌 Notes
The microservice maintains fast responses by using async calls and a 500 ms timeout.

Only unique numbers are stored and old entries are removed once the window exceeds the limit.

This does not implement number-generating logic — it fetches all data from the provided APIs.
