import { Page, expect } from '@playwright/test';
import { APIRequestContext, APIResponse } from '@playwright/test';

interface LoginResult {
  response: APIResponse;
  cookie: string;
}

/**
 * Performs login operation
 * @param page The Playwright Page object
 * @param email The email to use for login (default: 'example@example.com')
 * @param password The password to use for login (default: 'asdf')
 * @returns Promise that resolves when login is complete and dashboard is loaded
 */
export async function login(page: Page, email: string = 'example@example.com', password: string = 'asdf'): Promise<void> {
  await page.goto('./login');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Attempts to log in a user with the provided credentials.
 * @param apiContext - The Playwright API request context to use for the login request.
 * @param email - The email address of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @returns A promise that resolves to a LoginResult object containing the API response and session cookie (if successful).
 */
export async function apiLogin(apiContext: APIRequestContext, email: string, password: string): Promise<LoginResult> {
  let cookie = '';
  const loginResponse = await apiContext.post('/login', {
    data: { email, password }
  });
  if (loginResponse.ok()) {
    let cookie = loginResponse.headers()['set-cookie'];
    return { response: loginResponse, cookie };
  }
  return { response: loginResponse, cookie };
}

/**
 * Validates if a given string matches the timestamp format "DD/MM/YYYY, HH:mm:ss"
 * @param timestamp The timestamp string to validate
 * @returns boolean indicating whether the timestamp is valid
 */
export function isValidTimestamp(timestamp: string): boolean {
  // This regex matches the format "DD/MM/YYYY, HH:mm:ss"
  const timestampRegex = /\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{1,2}:\d{1,2}/;
  return timestampRegex.test(timestamp);
}

/**
 * Validates if a given string is a valid email address
 * @param email The email string to validate
 * @returns boolean indicating whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
