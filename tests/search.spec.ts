import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { SearchPage } from '../pages/searchPage';
import { DashboardPage } from '../pages/dashboardPage';

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.signIn();
})

test('Verify search result', async ({page}) => {
    const searchPage = new SearchPage(page);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForRecentMessageToBeVisible();
    var description: string = await dashboardPage.getLatestMessageDescription();
    var emailId: string = await dashboardPage.getLatestEmailId();
    await searchPage.navigateToSearchPage();
    await searchPage.searchMessage(description);
    await searchPage.verifySearchResults(description);
    await searchPage.refresh();
    await searchPage.searchMessage(emailId);
    await searchPage.verifySearchResults(emailId);
    
})