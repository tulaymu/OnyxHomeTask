import { Page } from '@playwright/test';

export class TestHelpers {
  /**
   * Dismisses the welcome banner and cookie consent if present
   */
  static async dismissWelcomeBanner(page: Page): Promise<void> {
    try {
      await page.locator('button[aria-label="Close Welcome Banner"]').click({ timeout: 3000 });
    } catch {
      // Banner not present, continue
    }

    try {
      await page.locator('button:has-text("Me want it!")').click({ timeout: 3000 });
    } catch {
      // Cookie consent not present, continue
    }
  }

  /**
   * Waits for products to load on the page
   */
  static async waitForProducts(page: Page): Promise<void> {
    await page.waitForSelector('.mat-grid-tile', { timeout: 10000 });
  }

  /**
   * Generates a random email for testing
   */
  static generateTestEmail(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@juice-sh.op`;
  }

  /**
   * Gets a random product ID (typically 1-20 in Juice Shop)
   */
  static getRandomProductId(): number {
    return Math.floor(Math.random() * 20) + 1;
  }
}
