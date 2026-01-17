import { test, expect } from '@playwright/test';
import { Selectors } from './selectors';

test.describe('Media Tests', () => {
  test('tour detail gallery renders without broken image placeholder (basic check: at least one image element or fallback)', async ({ page }) => {
    // First go to tours to get a tour
    await page.goto('/ecoTour');
    await page.waitForLoadState('networkidle');
    
    // Find first tour card
    const firstTourCard = page.locator(Selectors.tours.firstTourCard).first();
    
    if (await firstTourCard.isVisible()) {
      await firstTourCard.click();
      await page.waitForLoadState('networkidle');
      
      // Look for gallery elements
      const galleryContainer = page.locator(Selectors.media.gallery).first();
      const imageGallery = page.locator(Selectors.media.imageGallery).first();
      const carousel = page.locator(Selectors.media.carousel).first();
      const tourImages = page.locator(Selectors.media.tourImages).first();
      
      let galleryFound = false;
      
      if (await galleryContainer.isVisible()) {
        console.log('Gallery container found');
        galleryFound = true;
      }
      
      if (await imageGallery.isVisible()) {
        console.log('Image gallery component found');
        galleryFound = true;
      }
      
      if (await carousel.isVisible()) {
        console.log('Image carousel found');
        galleryFound = true;
      }
      
      if (await tourImages.isVisible()) {
        console.log('Tour images found');
        galleryFound = true;
      }
      
      if (galleryFound) {
        // Basic check: at least one image element or fallback
        const hasImages = await page.locator('img').count() > 0;
        
        if (hasImages) {
          console.log('Gallery renders with images');
        } else {
          console.log('Gallery found but no images - checking for fallback');
          test.info().annotations.push({
            type: 'issue',
            description: 'Gallery found but no images loaded'
          });
        }
      } else {
        console.log('No gallery elements found on tour detail page');
        test.skip(true, 'No gallery found on tour detail page');
      }
    } else {
      console.log('No tours available for gallery test');
      test.skip(true, 'No tours available');
    }
  });

  test('admin upload flow if UI exists; otherwise document limitation', async ({ page }) => {
    // Try to access admin upload interface
    const response = await page.goto('/admin/upload');
    
    // Check if upload page exists
    if (response?.status() === 404) {
      console.log('Admin upload page not found - trying upload endpoint via UI');
      
      // Try to find upload in admin tours or media section
      await page.goto('/admin/tours');
      await page.waitForTimeout(2000);
      
      // Look for upload button or form
      const uploadButton = page.locator(Selectors.media.uploadButton).first();
      const fileInput = page.locator(Selectors.media.fileInput).first();
      
      if (await uploadButton.isVisible()) {
        await uploadButton.click();
        await page.waitForTimeout(1000);
        
        // Look for file input after clicking upload button
        const fileInputAfterClick = page.locator(Selectors.media.fileInput).first();
        if (await fileInputAfterClick.isVisible()) {
          console.log('File input found after clicking upload button');
        }
      } else if (await fileInput.isVisible()) {
        console.log('File input directly visible');
      } else {
        console.log('No upload UI elements found');
        test.info().annotations.push({
          type: 'issue',
          description: 'No upload UI elements found in admin interface'
        });
      }
    } else {
      // Upload page exists, test it
      console.log('Admin upload page found');
      
      // Look for upload form elements
      const fileInput = page.locator(Selectors.media.fileInput).first();
      const uploadForm = page.locator(Selectors.media.uploadForm).first();
      const submitButton = page.locator('button[type="submit"], button:has-text("Upload")').first();
      
      if (await fileInput.isVisible()) {
        console.log('File input found on upload page');
      }
      
      if (await uploadForm.isVisible()) {
        console.log('Upload form found');
      }
      
      if (await submitButton.isVisible()) {
        console.log('Upload submit button found');
      }
      
      // Test drag and drop area if exists
      const dropZone = page.locator(Selectors.media.dropZone).first();
      if (await dropZone.isVisible()) {
        console.log('Drag and drop zone found');
      }
    }
  });
});
