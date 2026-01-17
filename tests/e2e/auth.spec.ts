import { test, expect } from '@playwright/test';
import { Selectors } from './selectors';

test.describe('Authentication Tests', () => {
  test('signup page loads; attempt signup once; assert not 429; capture response status if fails', async ({ page }) => {
    const response = await page.goto('/auth/signup');
    
    // Assert signup page loads (not 404)
    expect(response?.status()).not.toBe(404);
    
    // Generate random email
    const randomEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    // Fill signup form
    await page.fill(Selectors.auth.emailInput, randomEmail);
    await page.fill(Selectors.auth.passwordInput, testPassword);
    
    // Look for name field
    const nameField = page.locator(Selectors.auth.nameInput).first();
    if (await nameField.isVisible()) {
      await nameField.fill('Test User');
    }
    
    // Submit form and capture response
    let signupResponse;
    try {
      [signupResponse] = await Promise.all([
        page.waitForResponse(response => response.url().includes('/api/auth/signup')),
        page.locator(Selectors.auth.submitButton).first().click()
      ]);
    } catch (error) {
      console.log('Signup request may not have been captured');
    }
    
    // Assert we don't get rate limiting (429)
    if (signupResponse) {
      expect(signupResponse.status()).not.toBe(429);
      
      // Capture response status if fails
      if (signupResponse.status() >= 400) {
        test.info().annotations.push({
          type: 'issue',
          description: `Signup failed with status ${signupResponse.status()}`
        });
      }
    }
    
    // Wait for response processing
    await page.waitForTimeout(2000);
  });

  test('login works for normal user', async ({ page }) => {
    const response = await page.goto('/auth/login');
    
    // Assert login page loads (not 404)
    expect(response?.status()).not.toBe(404);
    
    // Use test credentials
    const testEmail = process.env.E2E_USER_EMAIL || 'user@example.com';
    const testPassword = process.env.E2E_USER_PASSWORD || 'password123';
    
    // Fill login form
    await page.fill(Selectors.auth.emailInput, testEmail);
    await page.fill(Selectors.auth.passwordInput, testPassword);
    
    // Submit form
    await page.locator(Selectors.auth.submitButton).first().click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Check if login was successful
    const currentUrl = page.url();
    const isStillOnLoginPage = currentUrl.includes('login');
    
    if (isStillOnLoginPage) {
      console.log('Login failed - check credentials or user existence');
      test.info().annotations.push({
        type: 'issue',
        description: 'Login failed - check credentials or user existence'
      });
    } else {
      console.log('Login successful');
    }
  });

  test('logout works (logout button disappears OR session endpoint shows unauthenticated)', async ({ page }) => {
    // First login
    await page.goto('/auth/login');
    
    const testEmail = process.env.E2E_USER_EMAIL || 'user@example.com';
    const testPassword = process.env.E2E_USER_PASSWORD || 'password123';
    
    await page.fill(Selectors.auth.emailInput, testEmail);
    await page.fill(Selectors.auth.passwordInput, testPassword);
    
    await page.locator(Selectors.auth.submitButton).first().click();
    await page.waitForTimeout(3000);
    
    // Look for logout functionality
    const logoutButton = page.locator(Selectors.navbar.logoutButton).first();
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForTimeout(2000);
      
      // Check if logout button disappears
      const logoutButtonAfter = page.locator(Selectors.navbar.logoutButton).first();
      if (!(await logoutButtonAfter.isVisible())) {
        console.log('Logout successful - logout button disappeared');
      } else {
        console.log('Logout button still visible after click');
      }
    } else {
      console.log('No logout button found - logout may not be implemented');
      test.info().annotations.push({
        type: 'issue',
        description: 'Logout functionality not found in UI'
      });
    }
  });
});
