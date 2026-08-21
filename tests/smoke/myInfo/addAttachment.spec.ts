import { test, expect } from '@playwright/test';
import { generateString } from '../../../src/utils/helper.ts';

test.describe('Add Attachment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.DASHBOARD_URL!);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL!, { timeout: 30_000 });
  });
  test('Verify that user is able to see error if saved without adding attachment', async ({
    page,
  }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    await page.getByRole('button', { name: ' Add' }).click();
    const attachmentForm = page.locator('form').filter({
      has: page.locator('input[type="file"]'),
    });
    await attachmentForm.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Required')).toBeVisible();
  });

  test('Verify that user is able to select second image in this attachment', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    await page.getByRole('button', { name: ' Add' }).click();
    const attachmentForm = page.locator('form').filter({
      has: page.locator('input[type="file"]'),
    });
    await attachmentForm.locator('input[type="file"]').setInputFiles('src/utils/image.png');
    await expect(attachmentForm).toHaveValue(/image\.png/);
  });

  test('Verify that image second is also selected in this attachment', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    await page.getByRole('button', { name: ' Add' }).click();
    const attachmentForm = page.locator('form').filter({
      has: page.locator('input[type="file"]'),
    });
    await attachmentForm.locator('input[type="file"]').setInputFiles('src/utils/image1.png');
    await attachmentForm.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Successfully Saved')).toBeVisible();
  });

  test('Verify that ', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page.url()).toContain('/viewPersonalDetails/');
    await page.getByRole('button', { name: ' Add' }).click();
    const attachmentForm = page.locator('form').filter({
      has: page.locator('input[type="file"]'),
    });
    await attachmentForm.locator('input[type="file"]').setInputFiles('src/utils/image1.png');
    await attachmentForm.getByPlaceholder('Type comment here').fill(generateString(20));
    await attachmentForm.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Successfully Saved')).toBeVisible();
  });
});
