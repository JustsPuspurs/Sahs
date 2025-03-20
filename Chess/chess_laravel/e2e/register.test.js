import { test, expect } from '@playwright/test';

test.describe('Registration Tests', () => {
  test('user can register with valid details', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');
    await page.click('button:has-text("Register")');
    await page.fill('#username', 'newTestUsseer');
    await page.fill('#password', 'TestPassword123!');
    await page.fill('#password_confirmation', 'TestPassword123!');
    await page.click('button[type="submit"]');
    // Check success message
    await expect(page.locator('.success-message')).toHaveText('Registration successful!');
    console.log('Registration Test: Successful registration');
  });

  test('shows error if password is less than 8 characters', async ({ page }) => {
 
    await page.goto('http://127.0.0.1:8000');
    await page.click('button:has-text("Register")');
    await page.fill('#username', 'shortPassUser');
    // Enter a password shorter than 8 characters. 
    await page.fill('#password', 'short');
    await page.fill('#password_confirmation', 'short');
    await page.click('button[type="submit"]');

    // Check for an error message indicating the password is too short.
    const errorLocator = page.locator('.error-message');
    await expect(errorLocator).toContainText('at least 8 characters');
    console.log('Registration Validation: Password length error displayed');
  });

  test('shows error if password and confirmation do not match', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');
    await page.click('button:has-text("Register")');
    await page.fill('#username', 'mismatchUser');
    await page.fill('#password', 'ValidPassword1!');
    await page.fill('#password_confirmation', 'DifferentPassword');
    await page.click('button[type="submit"]');

    // Check for an error message regarding password confirmation mismatch.
    const errorLocator = page.locator('.error-message');
    await expect(errorLocator).toContainText('confirmation does not match');
    console.log('Registration Validation: Password confirmation mismatch error displayed');
  });
});