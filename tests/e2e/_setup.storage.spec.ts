import { test as setup, expect } from '@playwright/test';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

// Get credentials from environment variables
const USER_EMAIL = process.env.E2E_USER_EMAIL || 'user@example.com';
const USER_PASSWORD = process.env.E2E_USER_PASSWORD || 'password123';
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'admin123';

setup.describe('Authentication Setup', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  setup.beforeAll(async () => {
    browser = await chromium.launch();
  });

  setup.afterAll(async () => {
    await browser.close();
  });

  setup('setup user authentication state', async ({}) => {
    context = await browser.newContext();
    page = await context.newPage();
    
    // Try to login with existing user
    await page.goto('/auth/login');
    
    // Fill login form
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', USER_PASSWORD);
    
    // Submit form
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    await submitButton.click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Check if login was successful
    const currentUrl = page.url();
    const isStillOnLoginPage = currentUrl.includes('login');
    
    if (isStillOnLoginPage) {
      // User doesn't exist, create it via signup
      console.log('User not found, creating via signup...');
      await page.goto('/auth/signup');
      
      // Fill signup form
      await page.fill('input[type="email"]', USER_EMAIL);
      await page.fill('input[type="password"]', USER_PASSWORD);
      
      const nameField = page.locator('input[name="name"], input[placeholder*="name"], input[id*="name"]').first();
      if (await nameField.isVisible()) {
        await nameField.fill('Test User');
      }
      
      // Submit signup
      const signupButton = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register")').first();
      await signupButton.click();
      
      // Wait for signup to complete
      await page.waitForTimeout(2000);
      
      // Try login again
      await page.goto('/auth/login');
      await page.fill('input[type="email"]', USER_EMAIL);
      await page.fill('input[type="password"]', USER_PASSWORD);
      await submitButton.click();
      await page.waitForTimeout(3000);
    }
    
    // Save storage state
    await context.storageState({ path: 'tests/e2e/.auth/user.json' });
    await context.close();
    
    console.log('User authentication state saved to .auth/user.json');
  });

  setup('setup admin authentication state', async ({}) => {
    context = await browser.newContext();
    page = await context.newPage();
    
    // Try to login with admin credentials
    await page.goto('/auth/login');
    
    // Fill login form
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    
    // Submit form
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    await submitButton.click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Check if login was successful
    const currentUrl = page.url();
    const isStillOnLoginPage = currentUrl.includes('login');
    
    if (isStillOnLoginPage) {
      console.log('Admin login failed - admin user may not exist or credentials incorrect');
      console.log('To create admin user: 1) Create regular user 2) Update role to admin in database');
      // Save failed state for documentation
      await context.storageState({ path: 'tests/e2e/.auth/admin-failed.json' });
    } else {
      // Save storage state
      await context.storageState({ path: 'tests/e2e/.auth/admin.json' });
      console.log('Admin authentication state saved to .auth/admin.json');
    }
    
    await context.close();
  });
});
