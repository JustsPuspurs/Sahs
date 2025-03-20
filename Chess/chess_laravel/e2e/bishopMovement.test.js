import { test, expect } from '@playwright/test';

async function loginUser(page) {
  await page.goto('http://127.0.0.1:8000');
  await page.click('button:has-text("Login")');
  await page.fill('#username', 'jaunsLietotajs');
  await page.fill('#password', 'DrošaParole123!');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.chessboard', { timeout: 10000 });
}

test.describe('Bishop Movement Tests', () => {
  test('user can move bishop diagonally to the left after clearing pawn', async ({ page }) => {
    await loginUser(page);
    const squares = page.locator('.chessboard .square');
    await expect(squares.first()).toBeVisible();

    // Clear pawn blocking bishop's left diagonal:
    // Pawn at (1,6): index = 6*8 + 1 = 49 => move to (1,5): index = 5*8 + 1 = 41.
    await squares.nth(49).click();
    await squares.nth(41).click();
    await page.waitForTimeout(500);

    // Move bishop from (2,7): index = 7*8 + 2 = 58 to (0,5): index = 5*8 + 0 = 40.
    await squares.nth(58).click();
    await squares.nth(40).click();
    await page.waitForTimeout(500);
    await expect(squares.nth(40).locator('img[alt="Bishop"]')).toBeVisible();
    console.log('Bishop Test: Bishop moved diagonally left successfully');
  });

  test('user can move bishop diagonally to the right after clearing pawn', async ({ page }) => {
    await loginUser(page);
    const squares = page.locator('.chessboard .square');
    await expect(squares.first()).toBeVisible();

    // Clear pawn blocking bishop's right diagonal:
    // For bishop at (2,7): index 58, try to move to (4,5): row=5, col=4 => index = 5*8 + 4 = 44.
    // Assume pawn at (3,6) is blocking: (3,6): index = 6*8 + 3 = 51 => move it to (3,5): index = 5*8 + 3 = 43.
    await squares.nth(51).click();
    await squares.nth(43).click();
    await page.waitForTimeout(500);

    // Now move bishop from (2,7): index 58 to (4,5): index 44.
    await squares.nth(58).click();
    await squares.nth(44).click();
    await page.waitForTimeout(500);
    await expect(squares.nth(44).locator('img[alt="Bishop"]')).toBeVisible();
    console.log('Bishop Test: Bishop moved diagonally right successfully');
  });
});