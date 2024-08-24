import { test, expect } from '@playwright/test';

test.describe('Dashboard and its content', ()=> {
    test.beforeEach(async ({ page }) => {
        // Navigate to the login page
        await page.goto('/login');
        await page.fill('#email', 'example@example.com');
        await page.fill('#password', 'asdf');
        await page.click('button[type="submit"]');
    
        // Assert that login was successful
        await expect(page).toHaveURL('http://localhost:5173/dashboard');
       
    
    });
    
    test('verify contents of the dashboard', async ({ page }) => {
    
        await expect(page.locator("h3[class*='text-base']").first()).toHaveText("Last 30 days");
        await expect(page.locator("(//h3[(text()='Last 30 days')]/following-sibling::dl/div/dt)[1]")).toHaveText("Total Messages")
        await expect(page.locator("(//h3[(text()='Last 30 days')]/following-sibling::dl/div/dt)[2]")).toHaveText("Total Actions")
        
        await expect(page.locator("h3[class*='text-base']").filter({
            hasText: "Most recent messages"
        })).toBeVisible();
        await expect(page.locator('[role="list"]')).toBeVisible()
        
       
    });
    

})

