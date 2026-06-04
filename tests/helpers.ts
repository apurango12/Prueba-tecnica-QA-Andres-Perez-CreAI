import type { Page } from '@playwright/test';

/**
 * Patrones de errores de consola que NO deben hacer fallar el smoke test.
 * Son ruido tipico de terceros (analytics, video autoplay, recursos opcionales)
 * que no representan un fallo funcional de la pagina.
 */
export const IGNORED_CONSOLE_ERRORS: RegExp[] = [
  /favicon/i,
  /the play\(\) request was interrupted/i,
  /play\(\) failed/i,
  /googletagmanager|google-analytics|gtag|hotjar|facebook|fbevents|clarity/i,
  /net::ERR_BLOCKED_BY_CLIENT/i,
];

/**
 * Engancha listeners para capturar errores de consola y errores no controlados
 * de la pagina. Debe llamarse ANTES de navegar para no perder eventos tempranos.
 */
export function captureConsoleErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!IGNORED_CONSOLE_ERRORS.some((pattern) => pattern.test(text))) {
        errors.push(`[console.error] ${text}`);
      }
    }
  });

  page.on('pageerror', (error) => {
    const text = error.message;
    if (!IGNORED_CONSOLE_ERRORS.some((pattern) => pattern.test(text))) {
      errors.push(`[pageerror] ${text}`);
    }
  });

  return errors;
}
