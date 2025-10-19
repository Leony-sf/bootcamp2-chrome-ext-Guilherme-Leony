// tests/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url'; // <-- CORREÇÃO (ADICIONADO)

// --- Correção para __dirname em ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- Fim da Correção ---

// Define o caminho para a pasta 'dist' que criamos no Passo 1
const distPath = path.join(__dirname, '..', 'dist'); // <-- Esta linha agora funciona

export default defineConfig({
  // O diretório onde seus arquivos de teste estão
  testDir: __dirname,
  
  // Onde salvar os relatórios
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  
  use: {
    // Rodar os testes sem abrir a janela do navegador (mais rápido para CI)
    headless: true,
  },
  
  projects: [
    {
      name: 'chromium-with-extension',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          // Argumentos essenciais para carregar a extensão
          args: [
            `--disable-extensions-except=${distPath}`,
            `--load-extension=${distPath}`
          ]
        }
      }
    }
  ]
});