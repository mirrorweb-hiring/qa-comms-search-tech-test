import { test, expect } from '@playwright/test';
import { describe } from 'node:test';

test.describe('Login functionality', ()=> {
    test('should log in successfully', async ({ page }) => {
        // Navigate to the login page
        await page.goto('/login');
        await page.fill('#email', 'example@example.com');
        await page.fill('#password', 'asdf');
        await page.click('button[type="submit"]');
    
        // Assert that login was successful
        await expect(page).toHaveURL('http://localhost:5173/dashboard');
       
    
    });
    
    test('should not let unauthprized person login', async ({ page }) => {
        // Navigate to the login page
        await page.goto('/login');
        await page.fill('#email', 'abc@gmail.com');
        await page.fill('#password', 'test');
        await page.click('button[type="submit"]');
    
        // Asserting that login is not successful
        await expect(page).toHaveURL('http://localhost:5173/login#'); 
    
    });

    test('try login when password is wrong ', async ({ page }) => {
        // Navigate to the login page
        await page.goto('/login');
        await page.fill('#email', 'example@example.com');
        await page.fill('#password', 'test');
        await page.click('button[type="submit"]');
    
        // Asserting that login is not successful
        await expect(page).toHaveURL('http://localhost:5173/login#'); 
    
    });
    

})

