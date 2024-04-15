import { test, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
const username = process.env.PW_TEST_USERNAME || "";
const password = process.env.PW_TEST_PASSWORD || "";

test('authenticate', async ({ page }) => {
    // Perform authentication steps. Replace these actions with your own.
    await page.goto('/');
    await page.getByText('Aven').click();
    await page.getByRole('button', { name: 'Log in' }).click();

    await page.waitForURL('/');
  
    await expect(page.getByRole('button', { name: 'Create New Character' })).toBeVisible();
    //await page.context().storageState({ path: authFile });
  });