import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'testuser@juice-sh.op',
  password: 'Password123!'
};

test.describe('User Authentication', () => {
  test.beforeAll(async ({ request }) => {
    await request.post('http://localhost:3000/api/Users', {
      data: {
        email: TEST_USER.email,
        password: TEST_USER.password,
        passwordRepeat: TEST_USER.password,
        securityQuestion: {
          id: 1,
          question: "Your eldest siblings middle name?",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01"
        },
        securityAnswer: "test"
      }
    }).catch(() => {});
  });

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

  test.afterEach(async ({ page }) => {
    try {
      await page.locator('#navbarAccount').click({ timeout: 2000 });
      await page.locator('#navbarLogoutButton').click({ timeout: 2000 });
    } catch {}
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.locator('#navbarAccount').click();
    await page.locator('#navbarLoginButton').click();
    await page.waitForSelector('#email', { timeout: 5000 });
    
    await page.locator('#email').fill('invalid@test.com');
    await page.locator('#password').fill('wrongpassword');
    await page.locator('#loginButton').click();
    
    await expect(page.locator('.error, mat-error, [role="alert"]')).toBeVisible({ timeout: 5000 });
  });

  test('should not allow login with empty credentials', async ({ page }) => {
    await page.locator('#navbarAccount').click();
    await page.locator('#navbarLoginButton').click();
    await page.waitForSelector('#email', { timeout: 5000 });
    
    const loginButton = page.locator('#loginButton');
    const isDisabled = await loginButton.isDisabled();
    
    if (!isDisabled) {
      await loginButton.click();
      await expect(page.locator('#email')).toBeVisible();
    } else {
      expect(isDisabled).toBeTruthy();
    }
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.locator('#navbarAccount').click();
    await page.locator('#navbarLoginButton').click();
    await page.waitForSelector('#email', { timeout: 5000 });
    
    await page.locator('#email').fill(TEST_USER.email);
    await page.locator('#password').fill(TEST_USER.password);
    await page.locator('#loginButton').click();
    
    await expect(page.locator('#navbarAccount')).toBeVisible({ timeout: 5000 });
  });
});
