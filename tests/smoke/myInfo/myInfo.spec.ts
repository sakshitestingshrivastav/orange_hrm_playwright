import { test, expect } from '@playwright/test';

test.describe('My Info page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.DASHBOARD_URL!);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
  });

  test('Verify that clicking on my info side bar link opens the my info page', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
  });

  test('Verify that user is able to enter text in enter name input feild', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('First Name').clear();
    await page.getByPlaceholder('First Name').fill('Shrivastav');
    await page.getByPlaceholder('First Name').fill(Math.random().toString(36).substring(2, 15));
  });

  test('Verify that updating gender on my info page updates the gender', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    await page.getByRole('radio', { name: 'Female' }).click({ force: true });
    await page.getByRole('button', { name: 'Save' }).first().click();
    await expect(page.getByText('Successfully Updated')).toBeVisible();
  });
});
