import { expect } from '@playwright/test';
import { TestPage } from 'test-automation/pages/test-page.js';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


//Performing login action here to avoid long lines of duplicate code in every test and test file.
async function login (page) {
    await page.goto('./login');
    await expect(page).toHaveTitle(/Comms Search/);
    await sleep(5000);
    await page.click(TestPage.emailSignInField);
    await page.fill(TestPage.emailSignInField, 'example@example.com');
    await page.click(TestPage.passwordSignInField);
    await page.fill(TestPage.passwordSignInField, 'asdf');
    await page.click(TestPage.signInButton);
    await sleep(3000);
  
  }

  export { login };