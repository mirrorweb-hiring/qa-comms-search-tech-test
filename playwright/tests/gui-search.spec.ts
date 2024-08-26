import { test, expect, type Page } from '@playwright/test';
import { login, isValidEmail } from '../utils/helpers';

test.beforeEach(async ({ page }) => {
  await login(page);
  await page.goto('/search');
});

test.describe('search functionality', () => {
  test('validate search page is displayed as expected', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Search' })).toBeVisible();
    await expect(page.getByText('Enter a search query to find messages that match your criteria')).toBeVisible();
    await expect(page.getByText('Query', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('E.g. lorem ipsum')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('perform a basic search with results', async ({ page }) => {
    await page.getByPlaceholder('E.g. lorem ipsum').fill('lorem');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page).toHaveURL(/\/search\/results/);
    await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible();
    await expect(page.getByText('Showing results for: lorem')).toBeVisible();

    // Check if search results are displayed
    const searchResults = page.locator('//ul[@role="list"]/li');
    await expect(searchResults.first()).toBeVisible();
    expect(await searchResults.count()).toBeGreaterThan(0);

    // Validate format of the first search result
    const firstResult = searchResults.first();

    // Check email
    const emailElement = firstResult.locator('p.text-sm.font-semibold.leading-6.text-gray-900 div');
    const email = await emailElement.innerText();
    expect(isValidEmail(email), `Email "${email}" is not valid`).toBeTruthy();

    // Check content text
    const contentElement = firstResult.locator('p.mt-1.text-xs.leading-5.text-gray-500 span');
    await expect(contentElement).toBeVisible();
    expect(await contentElement.innerText()).not.toBe('');

    // Check 'View' link
    await expect(firstResult.getByText('View')).toBeVisible();
  });

  test('perform a search with no results', async ({ page }) => {
    await page.getByPlaceholder('E.g. lorem ipsum').fill('xyzabc123');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page).toHaveURL(/\/search\/results/);
    await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible();
    await expect(page.getByText('Showing results for: xyzabc123')).toBeVisible();

    // Check if the results list is empty
    const searchResults = page.locator('ul[role="list"] li');
    await expect(searchResults).toHaveCount(0);

    // TODO: 
    // Feature request for error message if no results found
    // Implement and test for a "No results found" message
    // await expect(page.getByText('No results found')).toBeVisible();
  });

  test('validate search result details', async ({ page }) => {
    await page.getByPlaceholder('E.g. lorem ipsum').fill('lorem');
    await page.getByRole('button', { name: 'Search' }).click();

    // Click on the first search result
    await page.locator('ul[role="list"] li').first().getByText('View').click();

    // Check if message details are displayed
    const msgHeaderPath = '//h2[contains(@class, "text-lg")]'
    await expect(page.locator(msgHeaderPath)).toBeVisible(); // Subject
    await expect(page.locator(`${msgHeaderPath}/../p`)).toBeVisible(); // Content

    // Validate email in the message details
    const emailElement = page.locator(`${msgHeaderPath}/following-sibling::p`);
    await expect(emailElement).toBeVisible();
    const email = await emailElement.innerText();
    expect(isValidEmail(email), `Email "${email}" in message details is not valid`).toBeTruthy();
  });

  test('search functionality is only accessible to authenticated users', async ({ page, context }) => {
    // Clear cookies to simulate unauthenticated user
    await context.clearCookies();

    await page.goto('/search');
    await expect(page).toHaveURL('/login');
  });
});