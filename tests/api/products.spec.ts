import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Products API', () => {
  test('should retrieve all products', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/Products`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('success');
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data.length).toBeGreaterThan(0);
    
    const product = data.data[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
  });

  test('should search products by name', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/rest/products/search?q=apple`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('success');
    expect(data.data).toBeInstanceOf(Array);
  });

  test('should handle invalid product search gracefully', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/rest/products/search?q=`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('success');
  });
});
