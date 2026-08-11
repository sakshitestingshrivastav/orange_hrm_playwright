# OrangeHRM Playwright

Automated end-to-end tests for [OrangeHRM](https://www.orangehrm.com/) using [Playwright](https://playwright.dev/).

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn

## Setup

```bash
npm install
npx playwright install
```

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
