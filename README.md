# Smoke Test – Homepage de creai.mx

[![Smoke Test creai.mx](https://github.com/apurango12/Prueba-tecnica-QA-Andres-Perez-CreAI/actions/workflows/ci.yml/badge.svg)](https://github.com/apurango12/Prueba-tecnica-QA-Andres-Perez-CreAI/actions/workflows/ci.yml)

Automatización de un **Smoke Test** para validar el correcto funcionamiento de la
homepage pública de [https://creai.mx](https://creai.mx).

## Quick start (clonar y correr)

```bash
git clone https://github.com/apurango12/Prueba-tecnica-QA-Andres-Perez-CreAI.git
cd Prueba-tecnica-QA-Andres-Perez-CreAI
npm install          # instala dependencias y, vía postinstall, el navegador Chromium
npm test             # ejecuta las 7 pruebas (escritorio + móvil iPhone X)
```

> No necesitas crear el `.env` para correrlo: si falta, la URL base usa
> `https://creai.mx` por defecto. Para apuntar a otro entorno, crea un `.env`
> (ver sección [Variables de entorno](#variables-de-entorno)).

## Herramienta y lenguaje

- **Herramienta:** [Playwright](https://playwright.dev/) (`@playwright/test`)
- **Lenguaje:** TypeScript
- **Patrón de diseño:** **Page Object Model (POM)**
- **Navegador:** Chromium (escritorio) + emulación de **iPhone X** (móvil)
- **Configuración:** URL base externalizada en un archivo `.env` (`dotenv`)

Se eligió Playwright porque cubre de forma nativa todos los requisitos del smoke test:
captura del **status HTTP**, escucha de **errores de consola**, **emulación de
dispositivos** y generación automática de **trace, video y reporte HTML** como evidencia.

## Casos automatizados

| # | Caso | Validación |
|---|------|------------|
| 1 | Carga de página | El sitio responde **HTTP 200** y la respuesta es exitosa |
| 2 | Consola | **No hay errores** visibles en la consola del navegador |
| 3 | Logo | El logo de la marca está **visible** |
| 4 | CTA | Existe al menos un **botón/CTA de contacto** visible (`a[href="/contact"]`) |
| 5 | Secciones | Hay **≥ 3 secciones** y se muestran 3 bloques clave (hero, partners, servicios) |
| 6 | Navegación | Clic en el menú **"Success stories"** → redirige a `/success-stories` |
| 7 | Mobile (opcional) | En viewport **iPhone X**, los elementos clave siguen visibles |

## Requisitos previos

- **Node.js** >= 18 (probado con Node 25)
- **npm**

## Dependencias necesarias

Se instalan automáticamente con `npm install`:

| Dependencia | Tipo | Para qué se usa |
|---|---|---|
| `@playwright/test` | dev | Framework de pruebas E2E/automatización (runner, asserts, navegadores) |
| `dotenv` | prod | Carga la `BASE_URL` desde el archivo `.env` |
| `typescript` | dev | Tipado estático y `npm run typecheck` |
| `@types/node` | dev | Tipos de Node.js para TypeScript |

Además, Playwright necesita el navegador **Chromium**, que se descarga
automáticamente mediante el script `postinstall` (o manualmente con
`npm run install:browsers`).

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar el navegador Chromium para Playwright
npm run install:browsers
# (equivale a: npx playwright install chromium)

# 3. Crear el archivo .env a partir del ejemplo
cp .env.example .env
```

### Variables de entorno

La URL del sitio bajo prueba se define en `.env` (no se versiona):

```bash
BASE_URL=https://creai.mx
```

`playwright.config.ts` la carga con `dotenv` y la usa como `baseURL`. Para apuntar a
otro entorno basta con cambiar este valor (por ejemplo `BASE_URL=https://www.creai.mx/es-mx`).

## Ejecución

```bash
# Ejecutar todos los tests (escritorio + móvil), modo headless
npm test

# Ejecutar con navegador visible (headed)
npm run test:headed

# Modo interactivo (UI mode de Playwright)
npm run test:ui

# Ver el último reporte HTML
npm run report

# Validar tipos (TypeScript) sin ejecutar las pruebas
npm run typecheck
```

### Ejecutar un subconjunto

```bash
# Solo escritorio
npx playwright test --project=desktop-chromium

# Solo móvil (iPhone X)
npx playwright test --project=mobile-iphone-x

# Un caso por nombre
npx playwright test -g "HTTP 200"
```

## Estructura del proyecto

```
.
├── .env                    # URL base del sitio (no se versiona)
├── .env.example            # Plantilla del .env
├── .github/workflows/      # CI en GitHub Actions (ci.yml)
├── evidence/               # Evidencia de ejecución (screenshots versionados)
├── tsconfig.json           # Configuración de TypeScript (typecheck)
├── package.json            # Dependencias y scripts
├── playwright.config.ts    # Config: baseURL desde .env, proyectos (desktop/mobile), trace/video
├── tests/
│   ├── pages/              # Page Object Model
│   │   ├── BasePage.ts     # Navegación + cierre de banner de cookies (común)
│   │   └── HomePage.ts     # Locators y acciones de la homepage
│   ├── fixtures.ts         # Fixtures: homePage, homeResponse, consoleErrors
│   ├── helpers.ts          # Captura de errores de consola (+ patrones ignorados)
│   ├── smoke.spec.ts       # Casos 1–6 (escritorio)
│   └── mobile.spec.ts      # Caso 7 (viewport iPhone X)
└── README.md
```

### Arquitectura (Page Object Model)

- **`BasePage`**: clase abstracta con la navegación (`goto`) y el cierre del banner de
  cookies, reutilizable por cualquier página.
- **`HomePage`**: extiende `BasePage` y expone los locators (logo, CTA, secciones,
  encabezados, menú) y acciones (`clickMenuItem`, conteos) de la homepage. Los specs no
  contienen selectores: si cambia la UI, solo se toca esta clase.
- **`fixtures.ts`**: provee `homePage` (Page Object ya navegado), `homeResponse` (respuesta
  HTTP) y `consoleErrors`, garantizando que los listeners de consola se activen antes de navegar.

## Evidencia / reportes

Tras cada ejecución se genera:

- **Reporte HTML** en `playwright-report/` (`npm run report` para abrirlo).
- Ante fallos: **screenshot**, **video** y **trace** en `test-results/`.

El trace se puede inspeccionar con:

```bash
npx playwright show-trace test-results/<carpeta-del-test>/trace.zip
```

## Notas de implementación

- Los **errores de consola** se capturan con `page.on('console')` y `page.on('pageerror')`.
  Se filtra ruido de terceros (analytics, autoplay de video, favicon) mediante una lista
  de patrones en `tests/helpers.ts` (`IGNORED_CONSOLE_ERRORS`) para evitar falsos negativos.
- El sitio muestra un **banner de cookies (Cookiebot)** cuyo overlay intercepta los clics;
  se cierra automáticamente antes de interactuar (`BasePage.dismissCookieBanner`).
- El navbar de Webflow está **duplicado y superpuesto** en el DOM; para la navegación se
  apunta al navbar pintado encima (último en el DOM) para evitar clics interceptados.
- La **emulación de iPhone X** se define en `playwright.config.ts` (viewport 375×812,
  `isMobile`, `hasTouch`, `deviceScaleFactor` 3).

## Integración continua (CI)

El repositorio incluye un workflow de **GitHub Actions** (`.github/workflows/ci.yml`)
que, en cada `push`/`pull_request` a `main` (y bajo demanda), instala dependencias,
ejecuta `typecheck` y corre la suite completa en Ubuntu, publicando el **reporte HTML**
como artefacto descargable.

## Solución de problemas

- **`browserType.launch: Executable doesn't exist`**: ejecuta `npm run install:browsers`.
- **Timeouts por red lenta**: los timeouts de navegación/acción están configurados en
  `playwright.config.ts` (`navigationTimeout`, `actionTimeout`); ajústalos si es necesario.
