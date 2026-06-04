import { test, expect } from './fixtures';

/**
 * Caso opcional: validar la homepage en un viewport movil (emulando iPhone X).
 * Este archivo solo corre en el proyecto `mobile-iphone-x` (ver playwright.config.ts).
 */
test.describe('Smoke Test Mobile - Homepage creai.mx (iPhone X)', () => {
  test('Los elementos clave siguen visibles en viewport movil', async ({
    homePage,
    homeResponse,
    consoleErrors,
  }) => {
    expect(homeResponse?.status(), 'El sitio debe responder con HTTP 200 en movil').toBe(200);

    await expect(homePage.logo, 'El logo debe ser visible en movil').toBeVisible();

    // En movil el CTA de contacto del navbar (.hide-desktop) se vuelve visible.
    await expect(
      homePage.firstVisibleContactCta,
      'El CTA de contacto debe ser visible en movil',
    ).toBeVisible();

    await expect(
      homePage.heroHeading,
      'El titulo principal (H1) debe ser visible en movil',
    ).toBeVisible();

    await expect(
      homePage.mobileMenuButton,
      'El boton de menu movil (hamburguesa) debe estar visible',
    ).toBeVisible();

    expect(
      consoleErrors,
      `Se encontraron errores en consola (movil):\n${consoleErrors.join('\n')}`,
    ).toEqual([]);
  });
});
