import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/web/index.php/auth/login');
    await expect(page.locator('input[name="username"]')).toBeVisible({ timeout: 30_000 });
    await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
  });

  test('Verify that clicking on admin side bar link opens the admin page', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
    await page.getByText('Admin').click();
    await expect(page.url()).toContain('/admin/');
  });

  test('Verify that clicking on my info side bar link opens the my info page', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
  });

  test('Verify that updating gender on my info page updates the gender', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    await page.getByRole('radio', { name: 'Female' }).click({ force: true });
    await page.getByRole('button', { name: 'Save' }).first().click();
    await expect(page.getByText('Successfully Updated')).toBeVisible();
  });

  test('Verify that clicking on upgrade link opens a new tab', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: /Upgrade/i }).click(),
    ]);
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/.*\/upgrade-to-advanced.*/);
  });
});
