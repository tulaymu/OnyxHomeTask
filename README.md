# OWASP Juice Shop - Automated Test Suite

Automated UI and API tests for OWASP Juice Shop using Playwright and TypeScript.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm

## Quick Start

```bash
git clone https://github.com/tulaymu/OnyxHomeTask.git
cd OnyxHomeTask
npm ci && npm test
```

This will install dependencies, start Juice Shop in Docker, run all tests, and generate a report.

## Setup

### Install Dependencies

```bash
npm ci
```

### Install Playwright Browsers

```bash
npx playwright install --with-deps
```

### Start Juice Shop (Optional)

```bash
npm run docker:up
```

The app will be available at `http://localhost:3000`

## Running Tests

### Run All Tests
```bash
npm test
```

### Run with Live Demo (if Docker unavailable)
```bash
BASE_URL=https://demo.owasp-juice.shop npm test
```

Note: Live demos may be slow or down. Docker is more reliable.

### Run UI Tests Only
```bash
npm run test:ui
```

### Run API Tests Only
```bash
npm run test:api
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### View Report
```bash
npm run test:report
```

## Test Coverage

### UI Tests (6 tests)

**Authentication** (`tests/ui/auth.spec.ts`):
- Login with valid credentials
- Error on invalid credentials (negative)
- Empty credentials blocked (negative)

**Shopping Flow** (`tests/ui/shopping.spec.ts`):
- Browse products and view details
- Navigate to basket page
- Display products on homepage

### API Tests (11 tests)

**Authentication** (`tests/api/auth.spec.ts`):
- Get Bearer token on login
- Access protected endpoint with token
- Fail with invalid token (negative)
- Fail without token (negative)

**Products** (`tests/api/products.spec.ts`):
- Get all products
- Search products
- Handle invalid search

**Basket** (`tests/api/basket.spec.ts`):
- Get basket items with auth
- Add product with auth
- Fail without auth (negative)
- Fail with invalid data (negative)

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/playwright.yml`):

1. Starts Juice Shop with Docker Compose
2. Runs tests headless on Ubuntu
3. Publishes artifacts (HTML report, JSON results, failure screenshots)

Triggers: push to main/master, PRs, manual dispatch

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline configuration
├── tests/
│   ├── ui/
│   │   ├── auth.spec.ts           # Authentication UI tests
│   │   └── shopping.spec.ts       # Shopping flow tests
│   └── api/
│       ├── auth.spec.ts           # Auth API tests
│       ├── products.spec.ts       # Products API tests
│       └── basket.spec.ts         # Basket API tests
├── docker-compose.yml             # Juice Shop setup
├── playwright.config.ts           # Test configuration
├── package.json                   # Dependencies
└── README.md                      # Documentation
```

## Assumptions

1. Tests work with latest stable OWASP Juice Shop
2. API tests create temporary users to avoid conflicts
3. UI tests use stable selectors (IDs, ARIA labels)
4. Extended timeouts for Docker startup
5. Tests run on Chromium by default
6. Clean state assumed between runs

## Future Improvements

### Testing
- Visual regression testing
- Data-driven tests with fixtures
- Performance metrics
- Full checkout flow
- Accessibility testing (a11y)
- Multi-browser testing

### Code Quality
- ESLint & Prettier
- Page Object Model pattern
- Helper utilities for common actions
- Pre-commit hooks

### CI/CD
- Test notifications (Slack/email)
- Flakiness detection
- Parallel execution
- Scheduled runs
- Test management integration

### Monitoring
- Test metrics dashboard
- Execution time tracking
- Flakiness monitoring

## Troubleshooting

### Docker Issues
```bash
docker-compose down
docker-compose up --force-recreate
```

### Port 3000 in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### Tests Failing
1. Check Juice Shop: `curl http://localhost:3000`
2. View logs: `docker-compose logs`
3. Run headed: `npm run test:headed`
4. Check report: `npm run test:report`

## License

Interview project only.
