// tests/extension.spec.ts
import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// --- Correção para __dirname em ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- Fim da Correção ---

const dist = path.resolve(__dirname, '..', 'dist');

test('Browser launches with extension and can open a page', async () => {
  // 1. Lança o browser com a nossa extensão carregada
  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${dist}`,
      `--load-extension=${dist}`
    ]
  });

  // 2. Abre uma nova página
  const page = await context.newPage();
  
  // 3. Navega para um site de teste
  await page.goto('https://example.com');

  // 4. Verifica se a página carregou corretamente (Smoke Test)
  const heading = page.locator('h1');
  await expect(heading).toHaveText('Example Domain');
  
  // 5. Fecha o contexto
  await context.close();
});