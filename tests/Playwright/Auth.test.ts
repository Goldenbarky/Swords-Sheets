import { test, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
const username = process.env.PW_TEST_USERNAME || "";
const password = process.env.PW_TEST_PASSWORD || "";

test('authenticate', async ({ page }) => {
    // Perform authentication steps. Replace these actions with your own.
    await page.goto('/');
    await page.getByText('Aven').click();
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL('https://accounts.google.com/**');

    // Old Google sign in form
    await page.getByLabel('Email or phone').fill(username);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByLabel('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Next' }).click();

    const html = await page.locator('body').innerHTML();

    await page.waitForTimeout(3000);
    if(page.url().includes("google")) await page.getByRole('button', { name: 'Continue' }).click();

    await page.waitForURL('/');
  
    expect(page.getByRole("img")).toBeVisible();
    //await page.context().storageState({ path: authFile });
  });