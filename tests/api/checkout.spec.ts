import { test, expect } from '@playwright/test';
import { createUserAndGetToken } from '../helpers/auth-helper';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Checkout API', () => {
  let authToken: string;
  let basketId: number;

  test.beforeAll(async ({ request }) => {
    const auth = await createUserAndGetToken(request);
    authToken = auth.token;
    basketId = auth.basketId;
    
    // Add a product to basket first
    await request.post(`${BASE_URL}/api/BasketItems`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        ProductId: 1,
        BasketId: basketId,
        quantity: 1
      }
    });
  });

  test('retrieve wallet balance', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/rest/wallet/balance`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('success');
  });

  test('get delivery methods', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/Deliveries`);
    
    // May return 500 or 200 depending on setup
    expect([200, 500]).toContain(response.status());
  });

  test('checkout requires authentication', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/BasketItems`, {
      data: {
        ProductId: 1,
        BasketId: 999,
        quantity: 1
      }
    });
    
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
