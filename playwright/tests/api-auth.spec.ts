import { test, expect, APIRequestContext } from '@playwright/test';
import { apiLogin } from 'playwright/utils/helpers';

test.describe('API Authentication Tests', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:8080',
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  async function testProtectedEndpoint(endpoint: string, cookie: string | undefined) {
    const response = await apiContext.get(endpoint, cookie ? {
      headers: { Cookie: cookie }
    } : {});
    return response;
  }

  test('Successful login', async () => {
    const { response } = await apiLogin(apiContext, 'example@example.com', 'asdf');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('user');
    expect(response.headers()['set-cookie']).toBeDefined();
  });

  test('Login with invalid credentials', async () => {
    const { response } = await apiLogin(apiContext, 'invalid@example.com', 'wrongpassword');
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error', 'Invalid email or password');
  });

  test('Login with malformed request body', async () => {
    const loginResponse = await apiContext.post('/login', {
      data: {
        username: 'example@example.com', // Using 'username' instead of 'email'
        pass: 'asdf' // Using 'pass' instead of 'password'
      }
    });
    expect(loginResponse.ok()).toBeFalsy();
    expect(loginResponse.status()).toBe(400);
    const body = await loginResponse.json();
    expect(body).toHaveProperty('error', 'Bad Request');
  });

  test('Logout functionality', async () => {
    const { cookie } = await apiLogin(apiContext, 'example@example.com', 'asdf');
    expect(cookie).toBeDefined();

    const logoutResponse = await apiContext.get('/logout', {
      headers: { Cookie: cookie }
    });
    expect(logoutResponse.ok()).toBeTruthy();

    const messagesResponse = await testProtectedEndpoint('/messages', cookie);
    expect(messagesResponse.ok()).toBeFalsy();
    expect(messagesResponse.status()).toBe(401);
  });

  test('Accessing protected endpoints with valid session', async () => {
    const { cookie } = await apiLogin(apiContext, 'example@example.com', 'asdf');
    expect(cookie).toBeDefined();

    const protectedEndpoints = [
      '/messages',
      '/search?q=test',
      '/stats/total-messages',
    ];

    for (const endpoint of protectedEndpoints) {
      const response = await testProtectedEndpoint(endpoint, cookie);
      expect(response.ok(), `Endpoint ${endpoint} failed with status ${response.status()}`).toBeTruthy();
      expect(response.status(), `Endpoint ${endpoint} returned unexpected status ${response.status()}`).toBe(200);
    }

    // Test PUT /messages/:id
    const putEndpoint = '/messages/some-message-id';
    const putResponse = await apiContext.put(putEndpoint, {
      headers: { Cookie: cookie },
      data: { status: 'compliant' }
    });
    expect(putResponse.ok(), `PUT request to ${putEndpoint} failed with status ${putResponse.status()}`).toBeTruthy();
    expect(putResponse.status(), `PUT request to ${putEndpoint} returned unexpected status ${putResponse.status()}`).toBe(200);
  });

  test('Accessing protected endpoints without session', async () => {
    const protectedEndpoints = [
      '/messages',
      '/search?q=test',
      '/stats/total-messages',
    ];

    for (const endpoint of protectedEndpoints) {
      const response = await testProtectedEndpoint(endpoint, '');
      expect(response.ok(), `Unauthenticated access to ${endpoint} unexpectedly succeeded`).toBeFalsy();
      expect(response.status(), `Endpoint ${endpoint} returned unexpected status ${response.status()} for unauthenticated access`).toBe(401);
      const body = await response.json();
      expect(body, `Endpoint ${endpoint} did not return expected error message`).toHaveProperty('error', 'Unauthenticated');
    }
  });

  test('Concurrent login attempts', async () => {
    const loginPromises = [];
    for (let i = 0; i < 5; i++) {
      loginPromises.push(apiLogin(apiContext, 'example@example.com', 'asdf'));
    }
    const loginResults = await Promise.all(loginPromises);

    // All login attempts should be successful
    loginResults.forEach(({ response }) => {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });

    // Check if all sessions are valid by accessing a protected endpoint
    const messagePromises = loginResults.map(({ cookie }) =>
      testProtectedEndpoint('/messages', cookie)
    );
    const messageResponses = await Promise.all(messagePromises);
    messageResponses.forEach(response => {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });
  });
});