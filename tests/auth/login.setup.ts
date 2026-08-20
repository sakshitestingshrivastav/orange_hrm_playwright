import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto('/web/index.php/auth/login');
  await expect(page.locator('input[name="username"]')).toBeVisible({ timeout: 30_000 });
  await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
  await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });

  // Save cookies + localStorage for later tests
  await page.context().storageState({ path: authFile });
});
