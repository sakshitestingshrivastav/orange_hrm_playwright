import { test, expect } from '@playwright/test';
import studentMock from '../../src/mocks/api/student.mock.json';

test('should return student details from mock API @api', async ({ page }) => {
  // Intercept the not-ready endpoint and return mock data
  await page.route('**/api/student/101', async (route) => {
    await route.fulfill({
      status: studentMock.status,
      contentType: 'application/json',
      body: JSON.stringify(studentMock.body),
    });
  });

  // Make a request that hits the mocked endpoint
  await page.goto('/');
  const response = await page.evaluate(async () => {
    const res = await fetch('/api/student/101');
    return {
      status: res.status,
      body: await res.json(),
    };
  });

  expect(response.status).toBe(200);
  expect(response.body.student_id).toBe(101);
  expect(response.body.firstName).toBe('Suber');
  expect(response.body.lastName).toBe('Panchal');
  expect(response.body.email).toBe('suber@example.com');
  expect(response.body.role_number).toBe('100234100');
  expect(response.body.standard).toBe('10');
});
