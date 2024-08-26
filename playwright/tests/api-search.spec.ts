import { test, expect, APIRequestContext } from '@playwright/test';
import { apiLogin } from 'playwright/utils/helpers';

test.describe('Search API Tests', () => {
  let apiContext: APIRequestContext;
  let cookie: string;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:8080',
    });    
    const response = await apiLogin(apiContext, 'example@example.com', 'asdf');
    cookie = response.cookie
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('Search functionality returns accurate results', async () => {
    const searchTerms = ['lorem', 'ipsum', 'nonexistent'];
    
    for (const term of searchTerms) {
      const response = await apiContext.get(`/search?q=${term}`, {
        headers: { Cookie: cookie }
      });
      expect(response.ok()).toBeTruthy();
      const results = await response.json();
      
      // Check that each result contains the search term
      results.forEach((result: { subject: any; content: any; }) => {
        expect(result.subject.toLowerCase() + result.content.toLowerCase()).toContain(term);
      });
      
      // For 'nonexistent', expect empty results
      if (term === 'nonexistent') {
        expect(results).toHaveLength(0);
      } else {
        expect(results.length).toBeGreaterThan(0);
      }
    }
  });
});