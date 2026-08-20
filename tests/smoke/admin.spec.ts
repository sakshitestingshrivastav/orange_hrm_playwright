import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Admin page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.DASHBOARD_URL!);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
  });

  test('Verify that clicking on admin side bar link opens the admin page', async ({ page }) => {
    await page.getByText('Admin').click();
    await expect(page.url()).toContain('/admin/');
  });
});
