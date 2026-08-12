import { test, expect } from '@playwright/test';
import { generateString } from '../../src/utils/helper';

test('should login with valid admin credentials', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await page.locator('input[name="username"]').fill(process.env.ADMIN_USERNAME!);
  await page.locator('input[name="password"]').fill(process.env.ADMIN_PASSWORD!);
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/dashboard/);
});

test('should login with invalid admin credentials', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await page.locator('input[name="username"]').fill(generateString(5));
  await page.locator('input[name="password"]').fill(generateString(5));
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

test('should login with valid username and invalid password', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await page.locator('input[name="username"]').fill(process.env.ADMIN_USERNAME!);
  await page.locator('input[name="password"]').fill(generateString(5));
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

test('should login with valid password and invalid username', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await page.locator('input[name="username"]').fill(generateString(5));
  await page.locator('input[name="password"]').fill(process.env.ADMIN_PASSWORD!);
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

test('should see error message with empty credentials', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await page.locator('input[name="username"]').fill('');
  await page.locator('input[name="password"]').fill('');
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('.oxd-input-field-error-message').nth(1)).toHaveText('Required');
});
