import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  
  // Check page title
  await expect(page).toHaveTitle(/ALG EcoTour/);
  
  // Check main navigation
  await expect(page.locator('nav')).toBeVisible();
  
  // Check main content
  await expect(page.locator('main').first()).toBeVisible();
  
  // Check for key elements
  await expect(page.locator('h1')).toBeVisible();
});
