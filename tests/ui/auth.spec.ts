import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import testData from '../../fixtures/testData.json';

test.describe('User Authentication', () => {
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

  test('should show error message with invalid credentials', async ({ page }) => {
    await loginPage.login(testData.invalidUser.email, testData.invalidUser.password);
    
    await page.waitForTimeout(1000);
    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBeTruthy();
  });

  test('should not allow login with empty credentials', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    const isDisabled = await loginPage.isLoginButtonDisabled();
    
    if (!isDisabled) {
      await loginPage.clickLogin();
      await expect(page.locator('#email')).toBeVisible();
    } else {
      expect(isDisabled).toBeTruthy();
    }
  });

  test('should successfully login with valid credentials', async () => {
    await loginPage.login(testData.validUser.email, testData.validUser.password);
    
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });
});
