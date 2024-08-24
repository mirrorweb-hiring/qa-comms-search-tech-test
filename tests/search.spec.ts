import { test, expect } from '@playwright/test';


test.describe('Message search functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('#email', 'example@example.com');
        await page.fill('#password', 'asdf');
        await page.click('button[type="submit"]');
    
        // Assert that login was successful
        await expect(page).toHaveURL('http://localhost:5173/dashboard');
       
      });

    test('verify searching a message with when search results are non-zero', async ({ page }) => {
        const searchQuery = "Colo accusantium uredo abduco uter volo volo"
        await page.click("a[href='/search']")
        //asserting that search tab is active
        await expect(page.locator("a[href='/search']")).toHaveAttribute("aria-current");
        await page.fill("#query", searchQuery)
        await page.click('button[type="submit"]');
        await expect(page.locator("h2")).toHaveText("Search Results");
        await expect(page.locator("p[class='text-sm text-gray-500'] > span")).toHaveText(searchQuery)
        await expect(page.locator("ul[role='list'] > li")).toHaveCount(1);

      });

      test('verify searching a message with when result is zero', async ({ page }) => {
        const searchQuery = "unknownquery389832"
        await page.click("a[href='/search']")
        //asserting that search tab is active
        await expect(page.locator("a[href='/search']")).toHaveAttribute("aria-current");
        await page.fill("#query", searchQuery)
        await page.click('button[type="submit"]');
        await expect(page.locator("h2")).toHaveText("Search Results");
        await expect(page.locator("p[class='text-sm text-gray-500'] > span")).toHaveText(searchQuery)
        await expect(page.locator("ul[role='list'] > li")).toHaveCount(0);


      });

      test('verify viewing of the searched result', async ({ page }) => {
        const searchQuery = "Colo accusantium uredo abduco uter volo volo"
        await page.click("a[href='/search']")
        //asserting that search tab is active
        await expect(page.locator("a[href='/search']")).toHaveAttribute("aria-current");
        await page.fill("#query", searchQuery)
        await page.click('button[type="submit"]');
        await expect(page.locator("h2")).toHaveText("Search Results");
        await expect(page.locator("p[class='text-sm text-gray-500'] > span")).toHaveText(searchQuery)
        await expect(page.locator("ul[role='list'] > li")).toHaveCount(1);

        await page.click("a[href*='/search/results']")
        await expect(page.locator('div[class="h-full w-full"]')).toBeVisible()
        await expect(page.locator("h2[class*='text-lg']")).toContainText(searchQuery);



      });
})

