import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Authentication API', () => {
  let testEmail: string;
  let testPassword: string;

  test.beforeAll(async ({ request }) => {
    testEmail = `test-${Date.now()}@juice-sh.op`;
    testPassword = 'Password123!';
    
    await request.post(`${BASE_URL}/api/Users`, {
      data: {
        email: testEmail,
        password: testPassword,
        passwordRepeat: testPassword,
        securityQuestion: {
          id: 1,
          question: "Your eldest siblings middle name?",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01"
        },
        securityAnswer: "test"
      }
    });
  });

  test('should authenticate and receive Bearer token', async ({ request }) => {
    const loginResponse = await request.post(`${BASE_URL}/rest/user/login`, {
      data: {
        email: testEmail,
        password: testPassword
      }
    });
    
    expect(loginResponse.status()).toBe(200);
    
    const data = await loginResponse.json();
    expect(data.authentication).toHaveProperty('token');
    expect(data.authentication).toHaveProperty('bid');
    expect(data.authentication.token).toBeTruthy();
    expect(data.authentication.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
  });

  test('should use Bearer token to access protected endpoint', async ({ request }) => {
    const loginResponse = await request.post(`${BASE_URL}/rest/user/login`, {
      data: {
        email: testEmail,
        password: testPassword
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.authentication.token;
    const basketId = loginData.authentication.bid;
    
    const basketResponse = await request.get(`${BASE_URL}/rest/basket/${basketId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
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
