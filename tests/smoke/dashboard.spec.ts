import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.DASHBOARD_URL!);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
  });

  test('should show Dashboard page heading @smoke', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.pageHeading).toBeVisible({ timeout: 15_000 });
    await expect(dashboardPage.pageHeading).toHaveText('Dashboard');
  });

  test('should show key dashboard section side bar texts on first view @smoke', async ({
    page,
  }) => {
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
