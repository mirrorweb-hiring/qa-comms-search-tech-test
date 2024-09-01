import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.signIn();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Comms Search");
});

test('verify I can login to application', async ({page}) => {
  await expect(page).toHaveTitle("Comms Search");
})

test('verify I can logout of application', async({page}) => {
  const loginPage = new LoginPage(page);
  await loginPage.logout();
})