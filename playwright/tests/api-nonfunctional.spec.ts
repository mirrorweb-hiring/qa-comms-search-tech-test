import { test, expect, APIRequestContext } from '@playwright/test';
import { apiLogin } from 'playwright/utils/helpers';

test.describe('Non-functional API Tests', () => {
  let apiContext: APIRequestContext;
  let cookie: string

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

  test('API response times are within acceptable limits', async () => {
    const endpoints = ['/messages', '/search?q=test', '/stats/total-messages'];
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      await apiContext.get(endpoint, {
        headers: { Cookie: cookie }
      });
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(5000);
    }
  });

  test('API handles errors gracefully', async () => {
    // Test with invalid message ID
    const invalidResponse = await apiContext.get('/messages/HzMWCcdsd4itQlderNSfV', {
      headers: { Cookie: cookie }
    });
    expect(invalidResponse.status()).toBe(404);
    
    // Test with invalid status update
    const invalidUpdateResponse = await apiContext.put('/messages/HzMWCcdPO4itQlderNSfV', {
      headers: { Cookie: cookie },
      data: { status: 'invalid-status' }
    });
    expect(invalidUpdateResponse.status()).toBe(400);
  });
});