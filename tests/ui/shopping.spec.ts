import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    try {
      await page.locator('button[aria-label="Close Welcome Banner"]').click({ timeout: 3000 });
    } catch {}
    
    try {
      await page.locator('.cc-dismiss, button:has-text("Me want it!"), button:has-text("Got it!")').first().click({ timeout: 3000 });
    } catch {}
    
    await page.waitForTimeout(500);
  });

  test('should browse products and view product details', async ({ page }) => {
    await page.waitForSelector('.mat-grid-tile', { timeout: 10000 });
    
    const products = page.locator('.mat-grid-tile');
    await expect(products.first()).toBeVisible();
    
    await products.first().click();
    await expect(page.locator('mat-dialog-container').first()).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to basket page', async ({ page }) => {
    await page.goto('/basket');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/\/basket/);
    await expect(page.locator('h1, mat-card').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display products on homepage', async ({ page }) => {
    await page.waitForSelector('.mat-grid-tile', { timeout: 10000 });
    
    const productCount = await page.locator('.mat-grid-tile').count();
    expect(productCount).toBeGreaterThan(0);
  });
});
