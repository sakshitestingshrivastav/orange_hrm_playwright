import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto('/web/index.php/auth/login');
    await expect(page.locator('input[name="username"]')).toBeVisible({ timeout: 30_000 });

    await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);

    await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });
  });

  test('should land on dashboard URL after successful login @smoke', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.expectDashboardUrl();
    await expect(page).toHaveURL(/\/dashboard\/index/);
  });

  test('should show Dashboard page heading @smoke', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.pageHeading).toBeVisible({ timeout: 15_000 });
    await expect(dashboardPage.pageHeading).toHaveText('Dashboard');
  });

  test('should show key dashboard section side bar texts on first view @smoke', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.recruitment).toBeVisible({ timeout: 15_000 });
    await expect(dashboardPage.myInfo).toBeVisible();
    await expect(dashboardPage.performance).toBeVisible();
  });

  test('should show Upgrade button on dashboard @smoke', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.upgradeButton).toBeVisible({ timeout: 15_000 });
  });
});
