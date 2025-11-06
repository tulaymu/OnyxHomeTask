import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let authToken: string;
let basketId: number;

test.describe('Basket API', () => {
  test.beforeAll(async ({ request }) => {
    const email = `test-${Date.now()}@juice-sh.op`;
    const password = 'Password123!';
    
    const registerResponse = await request.post(`${BASE_URL}/api/Users`, {
      data: {
        email: email,
        password: password,
        passwordRepeat: password,
        securityQuestion: {
          id: 1,
          question: "Your eldest siblings middle name?",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01"
        },
        securityAnswer: "test"
      }
    });
    
    const loginResponse = await request.post(`${BASE_URL}/rest/user/login`, {
      data: {
        email: email,
        password: password
      }
    });
    
    expect(loginResponse.status()).toBe(200);
    
    const loginData = await loginResponse.json();
    authToken = loginData.authentication.token;
    basketId = loginData.authentication.bid;
  });

  test('should retrieve basket items', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/rest/basket/${basketId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('success');
    expect(data.data).toHaveProperty('Products');
  });

  test('should add product to basket', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/BasketItems`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        ProductId: 1,
        BasketId: basketId,
        quantity: 2
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('success');
    expect(data.data).toHaveProperty('id');
  });

  test('should fail to add product without authentication', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/BasketItems`, {
      data: {
        ProductId: 1,
        BasketId: 999,
        quantity: 1
      }
    });
    
    // Should return 401 Unauthorized or similar error
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should fail to add product with invalid data', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/BasketItems`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        ProductId: -1,
        BasketId: basketId,
        quantity: 0
      }
    });
    
    // Should return error status
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
