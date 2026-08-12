import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

test('should login with valid admin credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
  await expect(page).toHaveURL(/dashboard/);
});

test('should login with empty credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await loginPage.login('', '');
  await expect(page.locator('.oxd-input-field-error-message').nth(1)).toHaveText('Required');
});

test('should login with valid username and empty password field', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await loginPage.login(process.env.ADMIN_USERNAME!, '');
  await expect(page.locator('.oxd-input-field-error-message').last()).toHaveText('Required');
});

test('should login with valid password and empty username field', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await loginPage.login(process.env.ADMIN_USERNAME!, '');
  await expect(page.locator('.oxd-input-field-error-message').nth(0)).toHaveText('Required');
});

test('should login with invalid password and valid username', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await loginPage.login(
    process.env.ADMIN_USERNAME!,
    `${process.env.ADMIN_PASSWORD!}${Math.random()}`,
  );
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

test('should login with valid password and invalid username', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await loginPage.login(
    `${process.env.ADMIN_USERNAME!}${Math.random()}`,
    process.env.ADMIN_PASSWORD!,
  );
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});
