import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');
    await page.click('button:has-text("Login")');
    await page.fill('#username', 'jaunsLietotajs');
    await page.fill('#password', 'DrošaParole123!');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.modal', { state: 'hidden' });
    await expect(page.locator('.modal')).toHaveCount(0);
    console.log('Login Test: Successful login');
  });

  test('shows error when username is empty', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');
    await page.click('button:has-text("Login")');
    await page.fill('#username', '');
    await page.fill('#password', 'DrošaParole123!');
    await page.click('button[type="submit"]');
    const errorLocator = page.locator('.error-message');
    await expect(errorLocator).toContainText('Username is required');
    console.log('Login Validation: Error for empty username displayed');
  });

  test('shows error when password is empty', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');
    await page.click('button:has-text("Login")');
    await page.fill('#username', 'jaunsLietotajs');
    await page.fill('#password', '');
    await page.click('button[type="submit"]');
    const errorLocator = page.locator('.error-message');
    await expect(errorLocator).toContainText('Password is required');
    console.log('Login Validation: Error for empty password displayed');
  });
});