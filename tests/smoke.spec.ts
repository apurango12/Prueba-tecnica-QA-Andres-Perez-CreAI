import { test, expect } from './fixtures';

test.describe('Smoke Test - Homepage creai.mx', () => {
  test('1. La pagina carga correctamente y responde HTTP 200', async ({ homeResponse }) => {
    expect(homeResponse, 'Se esperaba una respuesta de navegacion').not.toBeNull();
    expect(homeResponse!.status(), 'El sitio debe responder con HTTP 200').toBe(200);
    expect(homeResponse!.ok(), 'La respuesta debe ser exitosa (2xx)').toBeTruthy();
  });

  test('2. No hay errores visibles en la consola del navegador', async ({
    homeResponse,
    consoleErrors,
  }) => {
    void homeResponse;
    expect(
      consoleErrors,
      `Se encontraron errores en consola:\n${consoleErrors.join('\n')}`,
    ).toEqual([]);
  });

  test('3. El logo de la marca esta visible', async ({ homePage, homeResponse }) => {
    void homeResponse;
    await expect(homePage.logo, 'El logo del navbar debe estar visible').toBeVisible();
  });

  test('4. Existe un boton/CTA de contacto visible', async ({ homePage, homeResponse }) => {
    void homeResponse;
    await expect(
      homePage.firstVisibleContactCta,
      'Debe existir al menos un CTA de contacto visible',
    ).toBeVisible();
    expect(
      await homePage.visibleContactCtaCount(),
      'Debe haber al menos un enlace de contacto visible',
    ).toBeGreaterThanOrEqual(1);
  });

  test('5. Cargan al menos 3 secciones/elementos clave visibles', async ({
    homePage,
    homeResponse,
  }) => {
    void homeResponse;

    expect(await homePage.sectionCount(), 'La home debe tener al menos 3 <section>').toBeGreaterThanOrEqual(3);
    expect(
      await homePage.visibleSectionCount(),
      'Debe haber al menos 3 secciones visibles',
    ).toBeGreaterThanOrEqual(3);

    // Tres bloques de contenido representativos de secciones distintas (visibles en desktop).
    await expect(homePage.heroHeading, 'El titulo principal (H1) debe estar visible').toBeVisible();

    await homePage.partnersText.scrollIntoViewIfNeeded();
    await expect(
      homePage.partnersText,
      'La seccion de clientes/partners debe estar visible',
    ).toBeVisible();

    await homePage.servicesHeading.scrollIntoViewIfNeeded();
    await expect(
      homePage.servicesHeading,
      'La seccion de servicios debe estar visible',
    ).toBeVisible();
  });

  test('6. La navegacion del menu redirige a otra seccion', async ({
    page,
    homePage,
    homeResponse,
  }) => {
    void homeResponse;

    await homePage.clickMenuItem('Success stories');

    await expect(page, 'Debe redirigir a la pagina de Success stories').toHaveURL(
      /\/success-stories\/?$/,
    );
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
