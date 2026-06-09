# Mercado Fichajes VLR

Proyecto front-end ligero para visualizar el mercado de fichajes competitivo de Valorant (VCT 2025/26). Incluye un panel de regiones, fichajes confirmados, probables, rumores y un dashboard estático de selecciones nacionales.

## Descripción

La aplicación muestra equipos y movimientos de transferencias organizados por región:
- EMEA
- APAC
- AMER
- CN
- Selecciones nacionales (ENC / Nations Cup)

La información principal se carga desde archivos JSON y se renderiza con TypeScript y HTML/CSS.

## Tecnologías

- TypeScript
- HTML5
- CSS3
- JSON
- Google Fonts

## Scripts

- `npm run build` — Compila los archivos TypeScript (`tsc --noEmitOnError`)
- `npm run watch` — Ejecuta `tsc --watch`

## Dependencias

- `typescript` ^5.5.4 (devDependency)

## Estructura del proyecto

- `html/index.html` — Punto de entrada visual de la aplicación.
- `css/style.css` — Estilos del dashboard y los componentes.
- `src/main.ts` — Carga los datos JSON de las regiones.
- `src/RegionTable.ts` — Renderiza las vistas de región, aplica filtros y maneja la navegación.
- `data/teamsEmea.json` — Datos de equipos y fichajes para EMEA.
- `data/teamsAmer.json` — Datos de equipos y fichajes para Americas.
- `data/teamsPACF.json` — Datos de equipos y fichajes para APAC.
- `data/teamsCN.json` — Datos de equipos y fichajes para China.
- `data/teamsSEL.json` — Datos adicionales de selecciones nacionales (no cargado dinámicamente por `loadRegions`).

## Modelo de datos

### `Region`

- `id: string`
- `label: string`
- `subtitle: string`
- `accent: string`
- `teams: Team[]`

### `Team`

- `flag: string`
- `name: string`
- `players: Player[]`
- `staff?: StaffMember[]`
- `note?: string | null`

### `Player`

- `status: 'confirmed' | 'likely' | 'possible' | 'rumor' | 'benched' | 'out'`
- `name: string`
- `flag: string`
- `role?: string`

### `StaffMember`

- `role: string`
- `name: string`
- `flag?: string`

## Qué hace la aplicación

- Carga datos de las regiones EMEA, AMER, APAC y CN desde archivos JSON.
- Muestra tarjetas de equipos con sus listas de jugadores.
- Clasifica jugadores según el estado del movimiento:
  - Confirmado
  - Probable
  - Posible
  - Rumor
  - Benched
  - Out
- Aplica filtros de búsqueda por nombre, rol o equipo.
- Permite navegar entre páginas de región y la página principal.
- Página de selecciones nacionales con disposición estática de países.

## Flujo de ejecución

1. `html/index.html` carga `../dist/RegionTable.js` como módulo.
2. `RegionTable.js` importa `./main.js`.
3. `loadRegions()` carga los archivos JSON de datos.
4. `renderRegion()` construye las tarjetas de equipos y jugadores.
5. `showPage()` cambia entre páginas.
6. `filterPlayers()` y `filterStatus()` aplican filtros dinámicos en la vista.

## Notas importantes

- La página de selecciones nacionales (`page-nats`) está estructurada en HTML estático y no depende directamente de `data/teamsSEL.json`.
- El botón en `page-nats` lanza un `alert` de ejemplo a través de `sendPrompt()`.
- `src/RegionTable.ts` asume que los archivos JSON se resuelven correctamente desde la ruta de la página.

## Cómo trabajar con el proyecto

1. Instalar dependencias:
```bash
npm install
```
2. Compilar TypeScript:
```bash
npm run build
```
3. Abrir `html/index.html` en un servidor local o directamente en el navegador.

## Mejora futura sugerida

- Conectar `data/teamsSEL.json` con la página de selecciones nacionales.
- Agregar filtros específicos para staff y notas.
- Incluir contenidos dinámicos en la página de inicio.
- Añadir un proceso de construcción más completo con bundler / servidor local.

---

Créditos: interfaz y contenido inspirado en el mercado de transferencias de VCT. `@MiikaElVAL` aparece en la UI como referencia de autor.
