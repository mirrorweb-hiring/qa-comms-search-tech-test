import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { LoginPage } from '../pages/loginPage';


test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.signIn();
})

test('verify dashboard page displays recent messages', async ({page}) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyRecentMessagesList();
})

test('Verify % of change in Total messages', async({page}) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyTotalMessagePercentage();
})


