import { test as base, expect, type Response } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { captureConsoleErrors } from './helpers';

/**
 * Fixtures personalizadas para el smoke test:
 *  - `consoleErrors`: engancha la captura de errores ANTES de navegar.
 *  - `homePage`: instancia el Page Object de la home, navega y cierra cookies.
 *  - `homeResponse`: respuesta HTTP de la navegacion inicial a la home.
 */
type SmokeFixtures = {
  consoleErrors: string[];
  homePage: HomePage;
  homeResponse: Response | null;
};

export const test = base.extend<SmokeFixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors = captureConsoleErrors(page);
    await use(errors);
  },
  homePage: async ({ page, consoleErrors }, use) => {
    // `consoleErrors` se inyecta primero para garantizar que los listeners
    // ya esten activos cuando ocurra la navegacion dentro de goto().
    void consoleErrors;
    const homePage = new HomePage(page);
    await use(homePage);
  },
  homeResponse: async ({ homePage }, use) => {
    const response = await homePage.goto();
    await use(response);
  },
});

export { expect };
