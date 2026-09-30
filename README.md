# SecureCI – Static Analysis Pipeline

## Overview

SecureCI is an initial, beginner-level static-analysis foundation for a small Node.js/Express API and React frontend. It demonstrates running ESLint and local Semgrep rules in GitHub Actions. It is not a production security platform, and passing these checks does not establish that an application is secure.

The frontend is a static project overview. It does not fetch scan results, report vulnerability counts, or display live CI status.

## Project Structure

```text
.github/workflows/security.yml   # Automated checks on pushes and pull requests
backend/
  src/app.js                    # Express application
  src/server.js                 # Environment-based server configuration
  src/routes/health.js          # GET /api/health
  test/health.test.js            # HTTP endpoint test
  eslint.config.js
  package.json / package-lock.json
frontend/
  src/App.jsx                   # Simple project overview
  src/main.jsx / styles.css
  index.html / vite.config.js
  eslint.config.js
  package.json / package-lock.json
semgrep/
  secureci-rules.yml             # Three local security rules
  tests/secureci-rules.js        # Non-executed synthetic rule fixtures
  requirements.txt              # Pinned Semgrep CLI version
.semgrepignore
.gitignore
package.json                    # Commands shared by local development and CI
README.md
```

## Technologies

- Node.js 22, Express, and Node's built-in test runner
- React and Vite
- ESLint 10 flat configuration with JSX support and React Hooks lint rules
- Semgrep Community Edition with local YAML rules
- GitHub Actions on an Ubuntu runner

Backend and frontend dependencies have separate lockfiles. The root package contains command shortcuts and has no dependencies; npm workspaces are unnecessary for this small example.

## How It Works

1. A push or pull request starts the workflow.
2. Dependencies are installed from committed lockfiles with `npm ci`.
3. ESLint checks both packages, including unused and undefined variables, common mistakes, and direct `eval` use.
4. An HTTP health-endpoint test and a frontend production build run.
5. Semgrep tests its rules against synthetic positive and negative examples, then scans repository source.
6. A failing command fails the job. Semgrep's `--error` flag makes findings fail the scan, including findings from the WARNING-severity secret rule. `--strict` makes relevant scan/configuration errors fail too.

The three rules flag direct `eval()` calls, string literals assigned to selected credential-like variable names, and two common ways of disabling TLS certificate verification. These are narrow pattern checks, not comprehensive secret detection or data-flow analysis. Findings require human review and may be false positives; differently structured unsafe code can be missed.

Only dependencies, generated output, and the deliberately unsafe rule fixtures are excluded from the repository scan. The fixtures are separately checked with `security:test` and never run as JavaScript. `FAKE_EXAMPLE_SECRET` is an intentionally fake test value.

## Local Setup

Install Node.js 22.14 or newer (Node 22 LTS is used in CI), npm, and Git. From the project root:

```sh
npm run setup
```

This runs `npm ci` for both packages. To update dependencies deliberately, use `npm install --prefix backend` or `npm install --prefix frontend` and review the changed lockfile.

## Running the Backend

```sh
npm run backend
```

Open <http://127.0.0.1:3000/api/health>. Expected response:

```json
{"status":"ok","service":"secureci-api"}
```

The server reads `PORT` (default `3000`) and `HOST` (default `127.0.0.1`) from environment variables. It rejects invalid port numbers. For example, in PowerShell:

```powershell
$env:PORT = '3001'
npm run backend
```

No `.env` loader is included; set variables in your shell. Credentials do not belong in source control. There is no authentication, database, or user-input endpoint in this foundation.

Run the HTTP test:

```sh
npm test
```

## Running the Frontend

In another terminal:

```sh
npm run frontend
```

Open the local URL printed by Vite (normally <http://127.0.0.1:5173>). The overview does not require the backend to be running.

Build and preview:

```sh
npm run build
npm run preview --prefix frontend
```

Vite writes the build to `frontend/dist`, which is ignored by Git. The preview server is for local inspection, not production hosting.

## Running ESLint

```sh
npm run lint
```

Both packages must pass with zero warnings. Each package can also run its own `npm run lint` command.

## Running Semgrep

Install Python 3.12, then create an isolated environment:

```sh
python -m venv .venv
```

Activate it in PowerShell with `.\.venv\Scripts\Activate.ps1`, or on Linux/macOS with `source .venv/bin/activate`. If PowerShell activation is restricted, add the environment's Scripts directory to the current terminal's PATH without changing the system execution policy:

```powershell
$env:PATH = "$PWD\.venv\Scripts;$env:PATH"
```

Then run:

```sh
python -m pip install -r semgrep/requirements.txt
npm run security:test
npm run security
```

The npm scripts require `semgrep` on the current terminal's PATH. Scanning with these local rules does not require an account or token. Metrics are explicitly disabled. Read [Semgrep's rule syntax documentation](https://docs.semgrep.dev/writing-rules/rule-syntax) before extending the rules, and add matching/non-matching fixtures.

## GitHub Actions

`.github/workflows/security.yml` runs on `push` and `pull_request`, with read-only repository permissions and a 15-minute timeout. It installs Node.js 22 and Python 3.12, runs the same npm commands used locally, and installs the pinned Semgrep version. Results are available in the repository's **Actions** tab; a workflow file alone is not evidence of a successful hosted run.

## Deployment

No Railway or other production deployment is configured. Deployment integration can be added and verified later. There is no deployment URL.

## Future Improvements

- Dependency scanning and a dependency-update policy
- Dedicated secret scanning beyond the current small heuristic
- Docker integration
- SARIF reporting in GitHub code scanning
- Deployment integration, including Railway if appropriate
- Additional Semgrep rules and regression fixtures
- Broader application tests as functionality is added
