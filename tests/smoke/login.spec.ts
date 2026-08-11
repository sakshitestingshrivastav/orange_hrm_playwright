import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

test('should login with valid admin credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto('/web/index.php/auth/login');
  await loginPage.login(
    process.env.ADMIN_USERNAME!,
    process.env.ADMIN_PASSWORD!
  );

  await expect(page).toHaveURL(/dashboard/);
});