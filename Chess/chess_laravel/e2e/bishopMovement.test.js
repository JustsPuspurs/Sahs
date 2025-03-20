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

    await squares.nth(49).click();
    await squares.nth(41).click();
    await page.waitForTimeout(500);

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

    await squares.nth(51).click();
    await squares.nth(43).click();
    await page.waitForTimeout(500);

    await squares.nth(58).click();
    await squares.nth(44).click();
    await page.waitForTimeout(500);
    await expect(squares.nth(44).locator('img[alt="Bishop"]')).toBeVisible();
    console.log('Bishop Test: Bishop moved diagonally right successfully');
  });
});