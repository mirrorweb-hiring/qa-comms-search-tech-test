import { test, expect, type Page } from '@playwright/test';
import { login } from '../utils/helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('./login');
});

test.describe('login page', () => {
  test('validate login page is displayed as expected', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByText('Email address')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.getByText('Password')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('login as valid user', async ({ page }) => {
    await page.locator('#email').fill('example@example.com');
    await page.locator('#password').fill('asdf');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('login as invalid user', async ({ page }) => {
    await page.locator('#email').fill('test@email.com');
    await page.locator('#password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Validate error message
    await expect(page.getByText('Invalid email or password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('logout validation', async ({ page }) => {
    // login as valid user
    await login(page);

    // Logout user
    await page.getByRole('link', { name: 'Logout' }).click();

    // Validate login page
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });
})