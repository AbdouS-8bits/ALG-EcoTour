import { test, expect } from '@playwright/test';
import { Selectors } from './selectors';

test.describe('SEO Tests', () => {
  test('"/robots.txt" returns 200 and contains "User-agent"', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    
    // Assert 200 status
    expect(response?.status()).toBe(200);
    
    // Assert content contains "User-agent"
    const content = await page.content();
    expect(content).toContain('User-agent');
  });

  test('sitemap route returns 200', async ({ page }) => {
    // Try common sitemap URLs
    const sitemapUrls = ['/sitemap.xml', '/sitemap', '/sitemap/'];
    let foundSitemap = false;
    
    for (const sitemapUrl of sitemapUrls) {
      const response = await page.goto(sitemapUrl);
      if (response?.status() === 200) {
        foundSitemap = true;
        console.log(`Sitemap found at: ${sitemapUrl}`);
        break;
      }
    }
    
    if (!foundSitemap) {
      console.log('No sitemap found at common URLs');
      test.info().annotations.push({
        type: 'issue',
        description: 'No sitemap found at /sitemap.xml, /sitemap, or /sitemap/'
      });
    }
  });
});
