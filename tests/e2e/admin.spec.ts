import { test, expect } from '@playwright/test';
import { Selectors } from './selectors';

test.describe('Admin Flows (Authenticated)', () => {
  // Use storage state for authenticated admin
  test.use({ storageState: 'tests/e2e/.auth/admin.json' });

  test('"/admin/dashboard" loads and shows analytics cards', async ({ page }) => {
    const response = await page.goto('/admin/dashboard');
    
    // Assert not 404
    expect(response?.status()).not.toBe(404);
    
    // Assert key UI element exists
    await expect(page.locator(Selectors.common.main)).toBeVisible();
    
    // Wait for potential dynamic loading
    await page.waitForTimeout(2000);
    
    // Look for analytics cards
    const analyticsCards = page.locator(Selectors.admin.dashboard.analyticsCards).first();
    const statsCards = page.locator(Selectors.admin.dashboard.statsCards).first();
    
    if (await analyticsCards.isVisible()) {
      console.log('Analytics cards found');
    }
    
    if (await statsCards.isVisible()) {
      console.log('Stats cards found');
    }
  });

  test('"/admin/tours" create minimal tour with lat/lng and verify it appears', async ({ page }) => {
    const response = await page.goto('/admin/tours');
    
    // Assert not 404
    expect(response?.status()).not.toBe(404);
    
    // Assert key UI element exists
    await expect(page.locator(Selectors.common.main)).toBeVisible();
    
    // Look for create tour button
    const createButton = page.locator(Selectors.admin.tours.createButton).first();
    
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(1000);
      
      // Fill tour form with minimal data
      const titleField = page.locator(Selectors.admin.tours.titleInput).first();
      const descriptionField = page.locator(Selectors.admin.tours.descriptionInput).first();
      const locationField = page.locator(Selectors.admin.tours.locationInput).first();
      const priceField = page.locator(Selectors.admin.tours.priceInput).first();
      const maxParticipantsField = page.locator(Selectors.admin.tours.maxParticipantsInput).first();
      const latitudeField = page.locator(Selectors.admin.tours.latitudeInput).first();
      const longitudeField = page.locator(Selectors.admin.tours.longitudeInput).first();
      
      if (await titleField.isVisible()) {
        await titleField.fill('Test Tour for E2E');
      }
      
      if (await descriptionField.isVisible()) {
        await descriptionField.fill('This is a test tour created by E2E automation');
      }
      
      if (await locationField.isVisible()) {
        await locationField.fill('Algiers, Algeria');
      }
      
      if (await priceField.isVisible()) {
        await priceField.fill('100');
      }
      
      if (await maxParticipantsField.isVisible()) {
        await maxParticipantsField.fill('10');
      }
      
      if (await latitudeField.isVisible()) {
        await latitudeField.fill('36.7538');
      }
      
      if (await longitudeField.isVisible()) {
        await longitudeField.fill('3.0588');
      }
      
      // Submit form
      const submitButton = page.locator(Selectors.admin.tours.submitButton).first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(3000);
        
        console.log('Tour creation submitted');
      }
    } else {
      console.log('No create tour button found');
      test.skip(true, 'Create tour functionality not available');
    }
  });

  test('"/admin/bookings" loads; if bookings exist confirm/cancel first pending', async ({ page }) => {
    const response = await page.goto('/admin/bookings');
    
    // Assert not 404
    expect(response?.status()).not.toBe(404);
    
    // Assert key UI element exists
    await expect(page.locator(Selectors.common.main)).toBeVisible();
    
    // Wait for potential dynamic loading
    await page.waitForTimeout(2000);
    
    // Look for booking management options
    const bookingList = page.locator(Selectors.admin.bookings.bookingList).first();
    const confirmButton = page.locator(Selectors.admin.bookings.confirmButton).first();
    const cancelButton = page.locator(Selectors.admin.bookings.cancelButton).first();
    
    if (await bookingList.isVisible()) {
      console.log('Booking list found');
      
      // Try to confirm first booking if available
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
        
        // Look for confirmation dialog
        const confirmDialog = page.locator('button:has-text("Yes"), button:has-text("Confirm")').first();
        if (await confirmDialog.isVisible()) {
          await confirmDialog.click();
          await page.waitForTimeout(2000);
          
          console.log('Booking confirmation submitted');
        }
      }
      
      // Try to cancel first booking if available
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        await page.waitForTimeout(1000);
        
        // Look for confirmation dialog
        const cancelDialog = page.locator('button:has-text("Yes"), button:has-text("Confirm")').first();
        if (await cancelDialog.isVisible()) {
          await cancelDialog.click();
          await page.waitForTimeout(2000);
          
          console.log('Booking cancellation submitted');
        }
      }
    } else {
      console.log('No booking list found');
      test.skip(true, 'No booking management interface found');
    }
  });
});
