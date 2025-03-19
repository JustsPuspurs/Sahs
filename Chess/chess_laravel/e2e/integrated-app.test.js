import { test, expect } from '@playwright/test';

// Helper function to log in and wait for the chessboard to appear.
async function loginUser(page) {
  await page.goto('http://127.0.0.1:8000');
  await page.click('button:has-text("Login")');
  await page.fill('#username', 'jaunsLietotajs');
  await page.fill('#password', 'DrošaParole123!');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.chessboard', { timeout: 10000 });
}

// 6.1.1. PIESLĒGŠANĀS TESTI
test.describe('Login Tests', () => {
  test('Lietotājs var pieslēgties un login modāls pazūd', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');
    await page.click('button:has-text("Login")');
    await page.fill('#username', 'jaunsLietotajs');
    await page.fill('#password', 'DrošaParole123!');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.modal', { state: 'hidden' });
    await expect(page.locator('.modal')).toBeHidden();
  });
});

// 6.1.2. REĢISTRĒŠANĀS TESTI
test.describe('Registration Tests', () => {
  test('Lietotājs var reģistrēties ar derīgiem datiem', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');
    await page.click('button:has-text("Register")');
    await page.fill('#username', 'jaunsLietotajjs');
    await page.fill('#password', 'DrošaParole123!');
    await page.fill('#password_confirmation', 'DrošaParole123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('.success-message')).toHaveText('Registration successful!');
  });
});

// 6.1.3. BANDINIEKA KUSTĪBAS TESTI (Pawn Movement)
test.describe('Pawn Movement Test', () => {
  test('Bandinieks tiek pareizi pārvietots', async ({ page }) => {
    await loginUser(page);

    const pawnSquareIndex = 48;
    const destinationSquareIndex = 40;
    
    const squares = page.locator('.chessboard .square');
    await expect(squares.first()).toBeVisible();
    await squares.nth(pawnSquareIndex).click();
    await squares.nth(destinationSquareIndex).click();
    await expect(squares.nth(destinationSquareIndex).locator('img[alt="Pawn"]')).toBeVisible();
  });
});

// 6.1.4. LAIDŅA KUSTĪBAS TESTI (Bishop Movement)
test.describe('Bishop Movement Test', () => {
  test('Laidņa kustība diagonālā virzienā ir pareiza', async ({ page }) => {
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
  });
});

// 6.1.5. ZIRGA KUSTĪBAS TESTI (Knight Movement)
test.describe('Knight Movement Test', () => {
  test('Zirgs veic "L-veida" kustību un nonāk mērķa lauciņā', async ({ page }) => {
    await loginUser(page);

    const knightStartIndex = 57;
    const knightDestinationIndex = 42;
    
    const squares = page.locator('.chessboard .square');
    await expect(squares.first()).toBeVisible();
    await squares.nth(knightStartIndex).click();
    await squares.nth(knightDestinationIndex).click();
    await expect(squares.nth(knightDestinationIndex).locator('img[alt="Knight"]')).toBeVisible();
  });
});