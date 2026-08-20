import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Admin page', () => {
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
});
