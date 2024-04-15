import { test, expect } from '@playwright/test';

test('Page loads', async ({ page }) => {
  const response = await page.request.get('/');
  expect(response.status()).toBe(200);
});