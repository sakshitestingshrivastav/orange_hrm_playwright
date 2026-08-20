import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Upgrade page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/web/index.php/auth/login');
    await expect(page.locator('input[name="username"]')).toBeVisible({ timeout: 30_000 });
    await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
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
