import { test, expect, chromium } from '@playwright/test';
import { TestPage } from 'test-automation/pages/test-page.js';
import { login } from 'test-automation/pages/login.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


test('Login page loads', async ({ page }) => {

    await page.goto('./login');
    await expect(page).toHaveTitle(/Comms Search/);
    await sleep(5000);
    console.log('Comms Search');
  });


test('User can login to application', async ({ page }) => {
    test.setTimeout(120 * 1000);
    // Perforing user login that is imported from login.js
    await login(page);
    await sleep(3000);

    //Assertion to check Last 30 days dashboard is visible
    const dashboardPage = page.locator(TestPage.last30Days);
    await expect(dashboardPage).toBeVisible();
    await expect(page.locator(TestPage.last30Days)).toHaveText('Last 30 days');

    //Assertion to check logout button is visible, meaning login was successful
    const logoutBtnCheck = page.locator(TestPage.logoutBtn);
    await expect(logoutBtnCheck).toBeVisible();
    await sleep(3000);
  });


    
test('Dashboards are populated', async ({ page }) => {
  test.setTimeout(120 * 1000);
  // Perforing user login that is imported from login.js
    await login(page);
    await sleep(5000);

    const totalMessages = page.locator(TestPage.totalMessages);
    await expect(totalMessages).toBeVisible();
    await expect(page.locator(TestPage.totalMessagePercent)).toHaveText('32.55813953488372%');

    const totalActions = page.locator(TestPage.totalActions);
    await expect(totalActions).toBeVisible();
    await expect(page.locator(TestPage.totalActionsPercent)).toHaveText('-2.941176470588235%');
  });


  test('Most recent messages populated', async ({ page }) => {
    test.setTimeout(120 * 1000);
    // Perforing user login that is imported from login.js
    await login(page);
    await sleep(5000);

    const mostRecentMessages = page.locator(TestPage.mostRecentMessages);
    await expect(mostRecentMessages).toBeVisible();
    
    // Assertion to confirm that recent messages are listed (first, fourth and seventh)
    await expect(page.locator(TestPage.messageOne)).toBeVisible();
    await expect(page.locator(TestPage.messageFour)).toBeVisible();
    await expect(page.locator(TestPage.messageSeven)).toBeVisible();
  });


  test('User can search & view message enteries', async ({ page }) => {
    test.setTimeout(120 * 1000);
    await login(page);
    await sleep(3000);
  
    const searchBtn = page.locator(TestPage.searchButtonHeader);
    await expect(searchBtn).toBeVisible();
    await page.click(TestPage.searchButtonHeader);
    await sleep(3000);

    const searchField = page.locator(TestPage.searchField);
    await expect(searchField).toBeVisible();
    await page.fill(TestPage.searchField, 'test');
    await page.click(TestPage.searchButton);
    await sleep(3000);
      
    const searchResults = page.locator(TestPage.searchResults);
    await expect(searchResults).toBeVisible();
    await expect(page.locator(TestPage.searchResults)).toHaveText('test');
    await page.click(TestPage.viewFirstResult);
      
    const resultsEmailPopulated = page.locator(TestPage.firstResultEmail);
    await expect(resultsEmailPopulated).toBeVisible();

    await expect(page.locator(TestPage.firstResultEmail)).toHaveText('kian.kuphal@yahoo.com');
  });    

  test('User can navigate from Serch -> Dashboard', async ({ page }) => {
    test.setTimeout(120 * 1000);
    // Perforing user login that is imported from login.js
    await login(page);
    await sleep(5000);

    const searchBtn = page.locator(TestPage.searchButtonHeader);
    await expect(searchBtn).toBeVisible();
    await page.click(TestPage.searchButtonHeader);

    const dashboardBtn = page.locator(TestPage.dashboardButtonHeader);
    await expect(dashboardBtn).toBeVisible();
    await page.click(TestPage.dashboardButtonHeader);
    await expect(page.locator(TestPage.last30Days)).toBeVisible();
  });


     