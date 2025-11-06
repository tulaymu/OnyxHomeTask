import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Shopping Flow', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.dismissAllPopups();
  });

  test('should browse products and view product details', async () => {
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    await homePage.clickFirstProduct();
    
    const dialogVisible = await homePage.isProductDialogVisible();
    expect(dialogVisible).toBeTruthy();
  });

  test('should navigate to basket page', async ({ page }) => {
    await homePage.navigateToBasket();
    
    const isOnBasket = await homePage.isOnBasketPage();
    expect(isOnBasket).toBeTruthy();
    
    await expect(page.locator('h1, mat-card').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display products on homepage', async () => {
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });
});
