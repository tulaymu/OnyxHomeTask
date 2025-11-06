export const environments = {
  local: {
    baseURL: 'http://localhost:3000',
    timeout: 30000
  },
  docker: {
    baseURL: 'http://juice-shop:3000',
    timeout: 30000
  },
  demo: {
    baseURL: 'https://demo.owasp-juice.shop',
    timeout: 60000
  }
};

export function getEnvironment() {
  const env = process.env.TEST_ENV || 'local';
  return environments[env as keyof typeof environments] || environments.local;
}
