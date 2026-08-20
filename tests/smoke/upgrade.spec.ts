import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Upgrade page', () => {
  test.beforeEach(async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await page.goto(process.env.DASHBOARD_URL!);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
  });

  test('Verify that clicking on upgrade link opens a new tab', async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: /Upgrade/i }).click(),
    ]);
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/.*\/upgrade-to-advanced.*/);
  });
});
