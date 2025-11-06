import { test, expect } from '@playwright/test';
import { createUserAndGetToken } from '../helpers/auth-helper';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let authToken: string;
let basketId: number;

test.describe('Basket API', () => {
  test.beforeAll(async ({ request }) => {
    const auth = await createUserAndGetToken(request);
    authToken = auth.token;
    basketId = auth.basketId;
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
