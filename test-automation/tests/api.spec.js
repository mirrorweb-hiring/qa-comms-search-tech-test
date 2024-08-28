import { test, expect } from '@playwright/test';


const baseUrl = 'http://localhost:8080';

test.describe('/me endpoint', () => {
  test('Should return 401 Unauthorized without a valid session', async ({ request }) => {
    const response = await request.get(`${baseUrl}/me`);
    expect(response.status()).toBe(401);
  });
});

test.describe('/login and /logout endpoint', () => {

  test('Should successfully login with valid credentials', async ({ request }) => {
    // Valid credentials for the test
    const validEmail = 'example@example.com';
    const validPassword = 'asdf';

    const response = await request.post(`${baseUrl}/login`, {
      data: {
        email: validEmail,
        password: validPassword
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user).toHaveProperty('id');

    const setCookieHeader = response.headers()['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader.includes('comms_auth')).toBeTruthy();
  });

  test('Should return 400 Invalid email or password for wrong credentials', async ({ request }) => {
    const response = await request.post(`${baseUrl}/login`, {
      data: {
        // Invalid credentials for testing
        email: 'abcdef@example.com', 
        password: 'testtest1' 
      }
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('Invalid email or password');
  });

  test('Should return 400 Bad Request if password is not passed', async ({ request }) => {
    const response = await request.post(`${baseUrl}/login`, {
      data: {
        // Passing empty password field
        email: 'abcdef@example.com', 
        password: '' 
      }
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('Bad Request');
  });


  test('Should log out successfully and clear cookies', async ({ request }) => {
    const logoutUrl = `${baseUrl}/logout`;

    const response = await request.get(logoutUrl, {
      headers: {
        'Cookie': 'comms_auth=mock-valid-session-cookie'
      }
    });

    // Checking that the logout was successful
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Logged out');

    // Checking that auth cookie is cleared
    const setCookieHeader = response.headers()['set-cookie'];
    expect(setCookieHeader).toContain('comms_auth=; Max-Age=0');
  });
  
});  


