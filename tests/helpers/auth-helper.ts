import { APIRequestContext } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export interface AuthToken {
  token: string;
  basketId: number;
}

export async function registerUser(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<void> {
  await request.post(`${BASE_URL}/api/Users`, {
    data: {
      email,
      password,
      passwordRepeat: password,
      securityQuestion: {
        id: 1,
        question: "Your eldest siblings middle name?",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
      },
      securityAnswer: "test"
    }
  }).catch(() => {});
}

export async function getAuthToken(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<AuthToken> {
  const loginResponse = await request.post(`${BASE_URL}/rest/user/login`, {
    data: { email, password }
  });
  
  if (loginResponse.status() !== 200) {
    throw new Error(`Login failed with status ${loginResponse.status()}`);
  }
  
  const loginData = await loginResponse.json();
  return {
    token: loginData.authentication.token,
    basketId: loginData.authentication.bid
  };
}

export async function createUserAndGetToken(
  request: APIRequestContext,
  email?: string,
  password?: string
): Promise<AuthToken> {
  const userEmail = email || `test-${Date.now()}@juice-sh.op`;
  const userPassword = password || 'Password123!';
  
  await registerUser(request, userEmail, userPassword);
  return await getAuthToken(request, userEmail, userPassword);
}
