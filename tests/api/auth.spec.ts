import { test, expect } from '@playwright/test';
import { createUserAndGetToken, getAuthToken } from '../helpers/auth-helper';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Authentication API', () => {
  let testEmail: string;
  let testPassword: string;

  test.beforeAll(async ({ request }) => {
    testEmail = `test-${Date.now()}@juice-sh.op`;
    testPassword = 'Password123!';
    
    const auth = await createUserAndGetToken(request, testEmail, testPassword);
    expect(auth.token).toBeTruthy();
  });

  test('should authenticate and receive Bearer token', async ({ request }) => {
    const auth = await getAuthToken(request, testEmail, testPassword);
    
    expect(auth.token).toBeTruthy();
    expect(auth.basketId).toBeTruthy();
    expect(auth.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
  });

  test('should use Bearer token to access protected endpoint', async ({ request }) => {
    const auth = await getAuthToken(request, testEmail, testPassword);
    
    const basketResponse = await request.get(`${BASE_URL}/rest/basket/${auth.basketId}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    expect(basketResponse.status()).toBe(200);
    const basketData = await basketResponse.json();
    expect(basketData.status).toBe('success');
  });

  test('should fail with invalid Bearer token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/rest/basket/1`, {
      headers: {
        'Authorization': 'Bearer invalid-token-12345'
      }
    });
    
    expect(response.status()).toBeGreaterThanOrEqual(401);
  });

  test('should fail without Bearer token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/rest/basket/1`);
    expect(response.status()).toBeGreaterThanOrEqual(401);
  });
});
