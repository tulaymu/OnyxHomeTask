import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async navigateToLogin() {
    await this.page.locator('#navbarAccount').click();
    await this.page.locator('#navbarLoginButton').click();
    await this.page.waitForSelector('#email', { timeout: 5000 });
  }

  async fillCredentials(email: string, password: string) {
    await this.page.locator('#email').fill(email);
    await this.page.locator('#password').fill(password);
  }

  async clickLogin() {
    await this.page.locator('#loginButton').click();
  }

  async login(email: string, password: string) {
    await this.navigateToLogin();
    await this.fillCredentials(email, password);
    await this.clickLogin();
  }

  async isLoginButtonDisabled(): Promise<boolean> {
    return await this.page.locator('#loginButton').isDisabled();
  }

  async isErrorVisible(): Promise<boolean> {
    try {
      const errorLocator = this.page.locator('.error, mat-error, [role="alert"]');
      return await errorLocator.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  async logout() {
    try {
      await this.page.locator('#navbarAccount').click({ timeout: 2000 });
      await this.page.locator('#navbarLogoutButton').click({ timeout: 2000 });
    } catch {
      // Already logged out
    }
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.page.locator('#navbarAccount').isVisible({ timeout: 5000 });
  }
}
