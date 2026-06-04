# Evidencia de ejecución

Esta carpeta contiene evidencia de una corrida real de la suite contra
`https://creai.mx` (7/7 pruebas en verde).

- **`screenshots/`** — captura final de cada caso (versionada en el repo).

Los **videos**, **traces** y el **reporte HTML** completos no se versionan por su
tamaño, pero se regeneran fácilmente:

```bash
npm run test:evidence       # crea test-results/ con video + trace + screenshot
npm run report              # abre el reporte HTML interactivo
```

Para inspeccionar el trace paso a paso de un caso:

```bash
npx playwright show-trace test-results/<carpeta-del-caso>/trace.zip
```
