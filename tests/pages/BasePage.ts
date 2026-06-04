import type { Page, Response } from '@playwright/test';

/**
 * Clase base para todos los Page Objects.
 * Centraliza utilidades comunes: navegacion y cierre del banner de cookies.
 */
export abstract class BasePage {
  /** Ruta relativa de la pagina (se resuelve contra el `baseURL` del config). */
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  /**
   * Navega a la pagina y cierra el banner de cookies si aparece.
   * Devuelve la respuesta HTTP de la navegacion principal.
   */
  async goto(): Promise<Response | null> {
    const response = await this.page.goto(this.path, { waitUntil: 'networkidle' });
    await this.dismissCookieBanner();
    return response;
  }

  /**
   * Cierra el banner de cookies (Cookiebot) si aparece. Mientras esta abierto, su
   * overlay intercepta los clics, por lo que conviene aceptarlo antes de interactuar.
   * Es best-effort: si no aparece o cambia el markup, no rompe el test.
   */
  async dismissCookieBanner(): Promise<void> {
    const acceptButton = this.page
      .locator(
        [
          '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
          '#CybotCookiebotDialogBodyButtonAccept',
          '#CybotCookiebotDialogBodyLevelButtonAccept',
        ].join(', '),
      )
      .first();

    try {
      await acceptButton.click({ timeout: 4000 });
      return;
    } catch {
      // El banner pudo no aparecer; como respaldo ocultamos el overlay.
    }

    await this.page
      .addStyleTag({
        content:
          '#CybotCookiebotDialog, #CybotCookiebotDialogBodyUnderlay { display: none !important; }',
      })
      .catch(() => {
        /* sin banner que ocultar */
      });
  }
}
