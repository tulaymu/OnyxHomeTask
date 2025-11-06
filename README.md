# Juice Shop Test Automation

Playwright tests for OWASP Juice Shop - covers UI flows and API endpoints with CI/CD pipeline.

## Quick Start

```bash
git clone https://github.com/tulaymu/OnyxHomeTask.git
cd OnyxHomeTask
npm ci && npm test
```

## What's Inside

- **UI Tests** - Login, shopping, checkout flow
- **API Tests** - Auth, products, basket, checkout endpoints  
- **CI/CD** - GitHub Actions with Docker
- **Page Objects** - Clean test structure
- **Fixtures** - Reusable test data

## Running Tests

```bash
npm test              # all tests
npm run test:smoke    # critical path only
npm run test:ui       # UI tests
npm run test:api      # API tests
npm run test:headed   # watch tests run
npm run test:debug    # debug mode
npm run test:report   # open HTML report
```

## Test Coverage

**UI (8 tests)**
- Authentication (login, errors, validation)
- Shopping (browse, basket, checkout)

**API (14 tests)**  
- Auth (Bearer tokens, invalid auth)
- Products (list, search)
- Basket (add, retrieve, errors)
- Checkout (wallet, delivery)

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
## Project Structure

```
tests/
├── ui/           # UI tests (login, shopping, checkout)
├── api/          # API tests (auth, products, basket)
└── helpers/      # Utils (auth, health checks, cleanup)

pages/            # Page objects (LoginPage, HomePage)
fixtures/         # Test data (users, products)
config/           # Environment settings
```

## CI/CD Pipeline

GitHub Actions workflow:
1. Starts Juice Shop in Docker
2. Runs tests headless
3. Uploads HTML & JSON reports

## Setup Details

**Requirements:** Node 18+, Docker

If no Docker available:
```bash
BASE_URL=https://demo.owasp-juice.shop npm test
```

## Assumptions

- Fresh Juice Shop (no pre-existing data)
- Tests create their own users (avoids conflicts)
- Default port 3000
- Chrome browser

## With More Time

- Full payment flow testing
- Visual regression (screenshot diffs)
- Performance/load testing
- Multi-browser support (Firefox, Safari)
- API schema validation  
- Allure reports
- Database cleanup hooks
- Parallel execution optimization

## Environment Variables

`BASE_URL` - Juice Shop URL (default: http://localhost:3000)
`CI` - Enables retries & headless mode
`TEST_ENV` - Environment: local/docker/demo

## Troubleshooting

**Docker issues:**
```bash
docker-compose down && docker-compose up --force-recreate
```

**Port 3000 busy:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Tests failing:**
- Check app: `curl http://localhost:3000`
- View logs: `docker-compose logs`
- Run visually: `npm run test:headed`
- Check report: `npm run test:report`
