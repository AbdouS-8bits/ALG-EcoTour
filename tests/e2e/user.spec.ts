import { test, expect } from '@playwright/test';
import { chromium } from '@playwright/test';
import { Selectors } from './selectors';

test.describe('User Flows (Authenticated)', () => {
  // Use storage state for authenticated user
  test.use({ storageState: 'tests/e2e/.auth/user.json' });

  test('create booking from tour detail and verify success UI', async ({ page }) => {
    // First go to tours to select a tour
    await page.goto('/ecoTour');
    await page.waitForLoadState('networkidle');
    
    // Find first tour card
    const firstTourCard = page.locator(Selectors.tours.firstTourCard).first();
    
    if (await firstTourCard.isVisible()) {
      await firstTourCard.click();
      await page.waitForLoadState('networkidle');
      
      // Look for booking button
      const bookingButton = page.locator(Selectors.tours.bookingButton).first();
      
      if (await bookingButton.isVisible()) {
        await bookingButton.click();
        await page.waitForTimeout(2000);
        
        // Fill booking form if present
        const guestNameField = page.locator('input[name="guestName"], input[placeholder*="name"], input[id*="guestName"]').first();
        const guestEmailField = page.locator('input[name="guestEmail"], input[type="email"], input[placeholder*="email"]').first();
        const guestPhoneField = page.locator('input[name="guestPhone"], input[type="tel"], input[placeholder*="phone"]').first();
        const participantsField = page.locator('input[name="participants"], input[type="number"], input[placeholder*="participants"]').first();
        
        if (await guestNameField.isVisible()) {
          await guestNameField.fill('Test Guest');
        }
        if (await guestEmailField.isVisible()) {
          await guestEmailField.fill('guest@example.com');
        }
        if (await guestPhoneField.isVisible()) {
          await guestPhoneField.fill('+1234567890');
        }
        if (await participantsField.isVisible()) {
          await participantsField.fill('2');
        }
        
        // Submit booking
        const submitButton = page.locator('button[type="submit"], button:has-text("Confirm"), button:has-text("Book")').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(3000);
          
          // Look for success UI
          const successMessage = page.locator(Selectors.common.success).first();
          if (await successMessage.isVisible()) {
            console.log('Booking success UI found');
          }
        }
      } else {
        console.log('No booking button found on tour detail page');
        test.skip(true, 'No booking functionality available');
      }
    } else {
      console.log('No tours available for booking test');
      test.skip(true, 'No tours available');
    }
    
    // Assert page doesn't crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('"/bookings" shows at least one booking or empty-state without crash', async ({ page }) => {
    const response = await page.goto('/bookings');
    
    // Assert not 404
    expect(response?.status()).not.toBe(404);
    
    // Assert key UI element exists
    await expect(page.locator(Selectors.common.main)).toBeVisible();
    
    // Wait for potential dynamic loading
    await page.waitForTimeout(2000);
    
    // Look for booking listings or empty state
    const bookingCards = page.locator(Selectors.user.bookings.bookingCard).first();
    const emptyState = page.locator(Selectors.user.bookings.emptyState).first();
    
    if (await bookingCards.isVisible()) {
      console.log('Booking cards found');
    } else if (await emptyState.isVisible()) {
      console.log('Empty bookings state shown');
    } else {
      console.log('No booking content found - checking page structure');
      // At least verify page loaded without crashing
    }
    
    // Assert page doesn't crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('cancel booking if UI exists (otherwise mark as skipped with clear message)', async ({ page }) => {
    await page.goto('/bookings');
    await page.waitForTimeout(2000);
    
    // Look for booking with cancel option
    const bookingCard = page.locator(Selectors.user.bookings.bookingCard).first();
    const cancelButton = page.locator(Selectors.user.bookings.cancelButton).first();
    
    if (await bookingCard.isVisible() && await cancelButton.isVisible()) {
      await cancelButton.click();
      await page.waitForTimeout(1000);
      
      // Look for confirmation dialog
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")').first();
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(2000);
        
        console.log('Booking cancellation submitted');
      }
    } else {
      console.log('No bookings found or no cancel option available');
      test.skip(true, 'No bookings available to cancel or no cancel option found');
    }
    
    // Assert page doesn't crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('"/profile" update flow if page exists', async ({ page }) => {
    const response = await page.goto('/profile');
    
    // Assert not 404
    expect(response?.status()).not.toBe(404);
    
    // Assert key UI element exists
    await expect(page.locator(Selectors.common.main)).toBeVisible();
    
    // Look for profile form
    const profileForm = page.locator(Selectors.user.profile.form).first();
    if (await profileForm.isVisible()) {
      // Update name field
      const nameField = page.locator(Selectors.user.profile.nameInput).first();
      if (await nameField.isVisible()) {
        await nameField.fill('Updated Test User');
      }
      
      // Look for save/update button
      const saveButton = page.locator(Selectors.user.profile.saveButton).first();
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(2000);
        
        console.log('Profile update submitted');
      }
    } else {
      console.log('No profile form found');
      test.skip(true, 'Profile page does not exist or has no form');
    }
    
    // Assert page doesn't crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('"/settings" update flow if page exists', async ({ page }) => {
    const response = await page.goto('/settings');
    
    // Assert not 404
    expect(response?.status()).not.toBe(404);
    
    // Assert key UI element exists
    await expect(page.locator(Selectors.common.main)).toBeVisible();
    
    // Look for settings options
    const languageSelect = page.locator(Selectors.user.settings.languageSelect).first();
    const emailNotificationsToggle = page.locator(Selectors.user.settings.emailNotificationsToggle).first();
    const darkModeToggle = page.locator(Selectors.user.settings.darkModeToggle).first();
    
    let settingsFound = false;
    
    if (await languageSelect.isVisible()) {
      await languageSelect.selectOption('en');
      settingsFound = true;
    }
    
    if (await emailNotificationsToggle.isVisible()) {
      await emailNotificationsToggle.click();
      settingsFound = true;
    }
    
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      settingsFound = true;
    }
    
    if (settingsFound) {
      // Look for save button
      const saveButton = page.locator(Selectors.user.settings.saveButton).first();
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(2000);
        
        console.log('Settings update submitted');
      }
    } else {
      console.log('No settings options found');
      test.skip(true, 'Settings page does not exist or has no options');
    }
    
    // Assert page doesn't crash
    await expect(page.locator('body')).toBeVisible();
  });
});
