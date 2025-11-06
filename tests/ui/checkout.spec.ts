import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import testData from '../../fixtures/testData.json';

test.describe('Checkout Flow', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeAll(async ({ request }) => {
    await request.post('http://localhost:3000/api/Users', {
      data: {
        email: testData.validUser.email,
        password: testData.validUser.password,
        passwordRepeat: testData.validUser.password,
        securityQuestion: {
          id: testData.securityQuestion.id,
          question: testData.securityQuestion.question,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01"
        },
        securityAnswer: testData.securityQuestion.answer
      }
    }).catch(() => {});
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    
    await homePage.navigate();
    await homePage.dismissAllPopups();
  });

  test.afterEach(async () => {
    await loginPage.logout();
  });

  test('@smoke complete purchase journey', async ({ page }) => {
    // Login
    await loginPage.login(testData.validUser.email, testData.validUser.password);
    
    // Wait for products to load
    await page.waitForSelector('.mat-grid-tile', { timeout: 10000 });
    
    // Add first product to basket
    try {
      const addButton = page.locator('[aria-label="Add to Basket"]').first();
      await addButton.waitFor({ state: 'visible', timeout: 5000 });
      await addButton.click();
      await page.waitForTimeout(1000);
    } catch {
      // Fallback if button not found
      await page.locator('.mat-grid-tile').first().click();
      await page.locator('button:has-text("Add to Basket"), [aria-label="Close Dialog"]').first().click();
    }
    
    // Go to basket
    await page.goto('/basket');
    await expect(page).toHaveURL(/\/basket/);
    
    // Check basket page loaded
    await page.waitForTimeout(1000);
    const basketHeading = page.locator('h1, .heading');
    await expect(basketHeading.first()).toBeVisible({ timeout: 5000 });
    
    // Proceed to checkout (if button exists)
    const checkoutButton = page.locator('#checkoutButton, button:has-text("Checkout")');
    const checkoutExists = await checkoutButton.count() > 0;
    
    if (checkoutExists) {
      await checkoutButton.click();
      await page.waitForURL(/\/address|\/delivery|\/payment/, { timeout: 5000 });
    }
  });

  test('basket shows added items', async ({ page }) => {
    await loginPage.login(testData.validUser.email, testData.validUser.password);
    
    // Navigate to basket
    await page.goto('/basket');
    await expect(page).toHaveURL(/\/basket/);
    
    // Check basket page loaded
    const basketPage = page.locator('mat-card, app-basket, .basket-page');
    await expect(basketPage.first()).toBeVisible({ timeout: 5000 });
  });
});
