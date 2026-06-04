import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL ?? 'https://creai.mx';

// Con EVIDENCE=1 se captura trace, video y screenshot de TODAS las pruebas
// (no solo ante fallos), util para generar evidencia de la ejecucion.
const EVIDENCE = !!process.env.EVIDENCE;

/**
 * Configuracion del Smoke Test para la homepage de creai.mx.
 *
 * - `baseURL` permite usar rutas relativas (page.goto('/')) en los tests.
 * - Se generan trace, video y screenshot ante fallos para facilitar el debug
 *   y servir como evidencia/entregable opcional.
 * - Se definen dos proyectos: escritorio (Chromium) y movil (emulando iPhone X).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: EVIDENCE ? 'on' : 'on-first-retry',
    screenshot: EVIDENCE ? 'on' : 'only-on-failure',
    video: EVIDENCE ? 'on' : 'retain-on-failure',
  },

  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: 'mobile-iphone-x',
      // Emulacion de iPhone X (375x812, mobile, touch, deviceScaleFactor 3).
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
      },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
});
