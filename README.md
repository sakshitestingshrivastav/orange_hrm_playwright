# OrangeHRM Playwright

Automated end-to-end tests for [OrangeHRM](https://www.orangehrm.com/) using [Playwright](https://playwright.dev/).

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn

## Setup

```bash
npm init -y
npm install -D @playwright/test typescript
npx playwright install
```

### What these commands do

| Command | Purpose |
|---|---|
| `npm init -y` | Creates `package.json` (marks this folder as an npm project) |
| `npm install -D @playwright/test typescript` | Installs Playwright test framework + TypeScript as dev dependencies |
| `npx playwright install` | Downloads browser binaries (Chromium, Firefox, WebKit) |

## Running tests

```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run tests with UI mode
npx playwright test --ui
```

## Project structure

```
orangeHRM/
├── tests/          # Test specs
├── pages/          # Page Object Model classes
├── utils/          # Helpers and fixtures
└── playwright.config.ts
```

## Reporting

After a run, open the HTML report:

```bash
npx playwright show-report
```

## License

ISC
