import { test, expect } from '@playwright/test';

// Helper function to log in and wait for the chessboard to appear.
async function loginUser(page) {
  await page.goto('http://127.0.0.1:8000');
  await page.click('button:has-text("Login")');
  await page.fill('#username', 'jaunsLietotajs');
  await page.fill('#password', 'DrošaParole123!');
  await page.click('button[type="submit"]');
  // Wait until the chessboard is visible, indicating successful login.
  await page.waitForSelector('.chessboard', { timeout: 10000 });
}

//
// 6.1. AUTOMĀTISKĀ TESTĒŠANA
// Testi izmanto http://127.0.0.1:8000, kur ir integrēta lietojumprogramma.
// Konfigurācijas faili (playwright.config.js un playwright-ct.config.js) nodrošina vidi ar Desktop Chrome.
//

// 6.1.1. PIESLĒGŠANĀS TESTI
test.describe('Login Tests', () => {
  test('Lietotājs var pieslēgties un login modāls pazūd', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');
    // Atver login modālu
    await page.click('button:has-text("Login")');
    // Aizpilda autentifikācijas laukus
    await page.fill('#username', 'jaunsLietotajs');
    await page.fill('#password', 'DrošaParole123!');
    // Iesniedz formu
    await page.click('button[type="submit"]');
    // Gaida, kamēr modāls kļūst paslēpts (piemēram, ar CSS display: none)
    await page.waitForSelector('.modal', { state: 'hidden' });
    await expect(page.locator('.modal')).toBeHidden();
  });
});

// 6.1.2. REĢISTRĒŠANĀS TESTI
test.describe('Registration Tests', () => {
  test('Lietotājs var reģistrēties ar derīgiem datiem', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');
    await page.click('button:has-text("Register")');
    // Aizpilda reģistrācijas formu
    await page.fill('#username', 'jaunsLietotajjs');
    await page.fill('#password', 'DrošaParole123!');
    await page.fill('#password_confirmation', 'DrošaParole123!');
    // Iesniedz formu
    await page.click('button[type="submit"]');
    // Pārbauda, vai redzams paziņojums par veiksmīgu reģistrāciju
    await expect(page.locator('.success-message')).toHaveText('Registration successful!');
  });
});

// 6.1.3. BANDINIEKA KUSTĪBAS TESTI (Pawn Movement)
test.describe('Pawn Movement Test', () => {
  test('Bandinieks tiek pareizi pārvietots', async ({ page }) => {
    // Pārliecināmies, ka lietotājs ir pieslēdzies un šaha dēlis ir redzams
    await loginUser(page);
    
    // Pieņemsim, ka baltā bandinieka sākuma pozīcija ir (0,6):
    // indekss = 6*8 + 0 = 48.
    // Pārvietošana uz vienu lauciņu uz priekšu (rinda 5, kolonna 0):
    // indekss = 5*8 + 0 = 40.
    const pawnSquareIndex = 48;
    const destinationSquareIndex = 40;
    
    const squares = page.locator('.chessboard .square');
    await expect(squares.first()).toBeVisible();
    await squares.nth(pawnSquareIndex).click();
    await squares.nth(destinationSquareIndex).click();
    // Pārbauda, vai jaunajā lauciņā ir redzams bandinieka attēls (alt teksts "Pawn")
    await expect(squares.nth(destinationSquareIndex).locator('img[alt="Pawn"]')).toBeVisible();
  });
});

// 6.1.4. LAIDŅA KUSTĪBAS TESTI (Bishop Movement)
// Since the bishop at (2,7) (index 58) is initially blocked by the pawn at (1,6) (index 49),
// we first move that pawn from (1,6) to (1,5) (index 41) to clear the diagonal.
test.describe('Bishop Movement Test', () => {
  test('Laidņa kustība diagonālā virzienā ir pareiza', async ({ page }) => {
    await loginUser(page);
    
    const squares = page.locator('.chessboard .square');
    await expect(squares.first()).toBeVisible();

    // Clear pawn blocking the bishop:
    // Pawn at (1,6) is at index 49. Move it to (1,5) which is index 41.
    await squares.nth(49).click();
    await squares.nth(41).click();
    // Wait for board state update.
    await page.waitForTimeout(500);

    // Now move bishop from (2,7) (index 58) diagonally to (0,5) (index 40).
    await squares.nth(58).click();
    await squares.nth(40).click();
    // Wait for board update.
    await page.waitForTimeout(500);

    // Verify that the destination square now shows the bishop image (with alt "Bishop")
    await expect(squares.nth(40).locator('img[alt="Bishop"]')).toBeVisible();
  });
});

// 6.1.5. ZIRGA KUSTĪBAS TESTI (Knight Movement)
test.describe('Knight Movement Test', () => {
  test('Zirgs veic "L-veida" kustību un nonāk mērķa lauciņā', async ({ page }) => {
    await loginUser(page);
    
    // Pieņemsim, ka baltā zirga sākuma pozīcija ir (1,7):
    // indekss = 7*8 + 1 = 57.
    // Mērķa lauciņš: (2,5):
    // indekss = 5*8 + 2 = 42.
    const knightStartIndex = 57;
    const knightDestinationIndex = 42;
    
    const squares = page.locator('.chessboard .square');
    await expect(squares.first()).toBeVisible();
    await squares.nth(knightStartIndex).click();
    await squares.nth(knightDestinationIndex).click();
    await expect(squares.nth(knightDestinationIndex).locator('img[alt="Knight"]')).toBeVisible();
  });
});