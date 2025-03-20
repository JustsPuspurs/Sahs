import { test, expect } from '@playwright/test';

async function loginUser(page) {
  await page.goto('http://127.0.0.1:8000');
  await page.click('button:has-text("Login")');
  await page.fill('#username', 'jaunsLietotajs');
  await page.fill('#password', 'DrošaParole123!');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.chessboard', { timeout: 10000 });
}

test.describe('Knight Movement Tests', () => {
  test('user can move knight in an L-shape from (1,7) to (2,5)', async ({ page }) => {
    await loginUser(page);
    const squares = page.locator('.chessboard .square');
    const knightStartIndex = 57;
    const destinationIndex = 42;
    await expect(squares.first()).toBeVisible();
    await squares.nth(knightStartIndex).click();
    await squares.nth(destinationIndex).click();
    await expect(squares.nth(destinationIndex).locator('img[alt="Knight"]')).toBeVisible();
    console.log('Knight Test: Move from (1,7) to (2,5) successful');
  });

  test('user can move knight in an L-shape from (1,7) to (0,5)', async ({ page }) => {
    await loginUser(page);
    const squares = page.locator('.chessboard .square');
    const knightStartIndex = 57; // (1,7)
    const destinationIndex = 40; // (0,5)
    await expect(squares.first()).toBeVisible();
    await squares.nth(knightStartIndex).click();
    await squares.nth(destinationIndex).click();
    await expect(squares.nth(destinationIndex).locator('img[alt="Knight"]')).toBeVisible();
    console.log('Knight Test: Move from (1,7) to (0,5) successful');
  });
});