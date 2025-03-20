import { test, expect } from '@playwright/test';

async function loginUser(page) {
  await page.goto('http://127.0.0.1:8000');
  await page.click('button:has-text("Login")');
  await page.fill('#username', 'jaunsLietotajs');
  await page.fill('#password', 'DrošaParole123!');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.chessboard', { timeout: 10000 });
}

test.describe('Pawn Movement Tests', () => {
  test('user can move pawn forward one square', async ({ page }) => {
    await loginUser(page);
    const squares = page.locator('.chessboard .square');
    const pawnSquareIndex = 48;
    const oneSquareDestination = 40;
    await squares.nth(pawnSquareIndex).click();
    await squares.nth(oneSquareDestination).click();
    await expect(squares.nth(oneSquareDestination).locator('img[alt="Pawn"]')).toBeVisible();
    console.log('Pawn Test: 1-square move successful');
  });

  test('user can move pawn forward two squares from starting position', async ({ page }) => {
    await loginUser(page);
    const squares = page.locator('.chessboard .square');
    const pawnSquareIndex = 48;
    const twoSquareDestination = 32;
    await squares.nth(pawnSquareIndex).click();
    await squares.nth(twoSquareDestination).click(); 
    await expect(squares.nth(twoSquareDestination).locator('img[alt="Pawn"]')).toBeVisible();
    console.log('Pawn Test: 2-square move successful');
  });
});