import { test, expect } from '@playwright/test';
import { generateString } from '../../../src/utils/helper.ts';

test.describe('My Info page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.DASHBOARD_URL!);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
  });

  test('Verify that clicking on my info side bar link opens the my info page', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
  });

  test('Verify that user is able to  enter the input value in last name', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    await page.getByPlaceholder('Last Name').fill('Test');
    await expect(page.getByPlaceholder('Last Name')).toHaveValue('Test');
    await page.getByPlaceholder('Last Name').clear();
    await page.getByPlaceholder('Last Name').fill('Sakshi');
    await expect(page.getByPlaceholder('Last Name')).toHaveValue('Sakshi');
  });

  test('Verify that user is able to enter the input value in first name', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    await page.getByPlaceholder('First Name').fill('Test');
    await expect(page.getByPlaceholder('First Name')).toHaveValue('Test');
    await page.getByPlaceholder('First Name').clear();
    const str = generateString(20);
    await page.getByPlaceholder('First Name').fill(str);
    await expect(page.getByPlaceholder('First Name')).toHaveValue(str);
  });

  test('Verify that user is able to enter the input value in middle name', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    const str = generateString(40);
    await page.getByPlaceholder('Middle Name').fill(str);
    await expect(page.getByPlaceholder('Middle Name')).toHaveValue(str);
    await page.getByRole('button', { name: 'Save' }).first().click();
    await expect(page.getByText('Should not exceed 30 characters')).toBeVisible();
  });

  test.only('Verify that user is able to enter driver value input', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    const driverLicense = page
      .locator('.oxd-input-group')
      .filter({ hasText: "Driver's License Number" })
      .locator('input');
    await driverLicense.fill('123456');
    await expect(driverLicense).toHaveValue('123456');
  });
});
