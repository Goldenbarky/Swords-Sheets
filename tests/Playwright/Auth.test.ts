import { test, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
const username = process.env.PW_TEST_USERNAME || "";
const password = process.env.PW_TEST_PASSWORD || "";

console.log(username);

// import { chromium } from 'playwright-extra';
// // Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// import stealth from 'puppeteer-extra-plugin-stealth';

// // Add the plugin to playwright
// chromium.use(stealth);

// const browser = await chromium.launch({ headless: true });
// const page = await browser.newPage();

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
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.waitForURL('/');
  
    expect(page.getByRole("img")).toBeVisible();
    //await page.context().storageState({ path: authFile });
  });