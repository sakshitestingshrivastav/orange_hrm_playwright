import { test } from '@playwright/test';

test('check base url', async ({ page }) => {
  await page.goto('/docs/intro');
  console.log('Full URL after goto:', page.url());
});