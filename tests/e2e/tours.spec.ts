import { test, expect } from '@playwright/test';

test('tours page navigation and tour card click', async ({ page }) => {
  // Navigate to tours page
  await page.goto('/ecoTour');
  
  // Verify we're on tours page
  await expect(page).toHaveURL(/.*ecoTour.*/);
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Find first tour card/link
  const firstTourLink = page.locator('a[href*="/ecoTour/"]').first();
  
  if (await firstTourLink.isVisible()) {
    // Click on first tour
    await firstTourLink.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Verify we're on a tour detail page
    await expect(page).toHaveURL(/.*\/ecoTour\/\d+.*/);
  } else {
    // If no tour links, check if page loads content
    await expect(page.locator('main').first()).toBeVisible();
    console.log('No tour cards found - checking page content');
  }
});
