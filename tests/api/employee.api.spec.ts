import { test, expect } from '@playwright/test';
import employeeMock from '../../src/mocks/api/employee.mock.json';

test('should return employee details from mock API @api', async ({ page }) => {
  // Intercept the not-ready endpoint and return mock data
  await page.route('**/api/employee/101', async (route) => {
    await route.fulfill({
      status: employeeMock.status,
      contentType: 'application/json',
      body: JSON.stringify(employeeMock.body),
    });
  });

  // Make a request that hits the mocked endpoint
  await page.goto('/');
  const response = await page.evaluate(async () => {
    const res = await fetch('/api/employee/101');
    return {
      status: res.status,
      body: await res.json(),
    };
  });

  expect(response.status).toBe(200);
  expect(response.body.id).toBe(101);
  expect(response.body.firstName).toBe('Sakshi');
});
