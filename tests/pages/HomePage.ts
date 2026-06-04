import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object de la homepage de creai.mx.
 * Encapsula los locators y las acciones de la pagina para que los specs
 * permanezcan legibles y un cambio de UI solo afecte a esta clase.
 */
export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly logo: Locator;
  readonly contactCtas: Locator;
  readonly sections: Locator;
  readonly heroHeading: Locator;
  readonly partnersText: Locator;
  readonly servicesHeading: Locator;
  readonly mobileMenuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.navbar11_logo').first();
    this.contactCtas = page.locator('a[href="/contact"]:visible');
    this.sections = page.locator('section');
    this.heroHeading = page.getByRole('heading', { level: 1 });
    this.partnersText = page.getByText('Drive your business forward', { exact: false });
    this.servicesHeading = page.getByRole('heading', {
      name: /Evolve and optimize your operations/i,
    });
    this.mobileMenuButton = page.locator('.navbar11_menu-button').first();
  }

  /** Primer CTA de contacto visible. */
  get firstVisibleContactCta(): Locator {
    return this.contactCtas.first();
  }

  /** Cantidad de CTAs de contacto visibles. */
  async visibleContactCtaCount(): Promise<number> {
    return this.contactCtas.count();
  }

  /** Total de elementos <section> en el DOM. */
  async sectionCount(): Promise<number> {
    return this.sections.count();
  }

  /** Cantidad de secciones visibles. */
  async visibleSectionCount(): Promise<number> {
    return this.page.locator('section:visible').count();
  }

  /**
   * Hace clic en un enlace del menu por su texto y navega a su seccion.
   * El navbar de Webflow esta duplicado y superpuesto en el DOM; se usa el
   * ultimo (pintado encima por z-order) para evitar clics interceptados.
   */
  async clickMenuItem(name: string): Promise<void> {
    const link = this.page
      .locator('.navbar11_component')
      .last()
      .locator('a.navbar11_link', { hasText: name })
      .first();
    await link.click();
  }
}
