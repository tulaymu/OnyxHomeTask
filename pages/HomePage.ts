import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async dismissWelcomeBanner() {
    try {
      await this.page.locator('button[aria-label="Close Welcome Banner"]').click({ timeout: 3000 });
    } catch {}
  }

  async dismissCookieConsent() {
    try {
      await this.page.locator('.cc-dismiss, button:has-text("Me want it!"), button:has-text("Got it!")').first().click({ timeout: 3000 });
    } catch {}
  }

  async dismissAllPopups() {
    await this.dismissWelcomeBanner();
    await this.dismissCookieConsent();
    await this.page.waitForTimeout(500);
  }

  async getProductCount(): Promise<number> {
    await this.page.waitForSelector('.mat-grid-tile', { timeout: 10000 });
    return await this.page.locator('.mat-grid-tile').count();
  }

  async clickFirstProduct() {
    const products = this.page.locator('.mat-grid-tile');
    await products.first().click();
  }

  async isProductDialogVisible(): Promise<boolean> {
    return await this.page.locator('mat-dialog-container').first().isVisible({ timeout: 5000 });
  }

  async navigateToBasket() {
    await this.page.goto('/basket');
    await this.page.waitForLoadState('networkidle');
  }

  async isOnBasketPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('/basket');
  }
}
