// Synthetic rule fixtures only. Never import or execute this file.
// ruleid: secureci-no-eval
eval(userInput);
// ok: secureci-no-eval
JSON.parse(userInput);

// Deliberately fake placeholder, not a credential.
// ruleid: secureci-hardcoded-secret
const apiKey = "FAKE_EXAMPLE_SECRET";
// ok: secureci-hardcoded-secret
const password = process.env.PASSWORD;
// ok: secureci-hardcoded-secret
const service = "secureci-api";

// ruleid: secureci-disabled-tls-verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// ruleid: secureci-disabled-tls-verification
const insecureOptions = { rejectUnauthorized: false };
// ok: secureci-disabled-tls-verification
const secureOptions = { rejectUnauthorized: true };
