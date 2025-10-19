
import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dist = path.resolve(__dirname, '..', 'dist');

test('Browser launches with extension and can open a page', async () => {

  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${dist}`,
      `--load-extension=${dist}`
    ]
  });


  const page = await context.newPage();
  
 
  await page.goto('https://example.com');

  
  const heading = page.locator('h1');
  await expect(heading).toHaveText('Example Domain');
  
 
  await context.close();
});
