# 🎯 Mercado Fichajes VLR

> Aplicación web para seguir el mercado de fichajes competitivo de Valorant (VCT 2025/26), mostrando movimientos confirmados, probables y rumores organizados por región.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![Valorant](https://img.shields.io/badge/VCT-2025%2F26-red?style=for-the-badge)

---

## 📖 Descripción

**Mercado Fichajes VLR** es una aplicación Frontend desarrollada para visualizar de forma rápida y organizada los movimientos del mercado competitivo de Valorant.

La plataforma recopila información de equipos profesionales y muestra:

* ✅ Fichajes confirmados
* 📈 Movimientos probables
* 🤔 Posibles incorporaciones
* 📰 Rumores
* 🪑 Jugadores bencheados
* 🚪 Salidas confirmadas

Toda la información se organiza por regiones para facilitar la navegación y el seguimiento de cada escena competitiva.

---

## 🌍 Regiones disponibles

* 🇪🇺 EMEA
* 🌎 Americas
* 🌏 APAC
* 🇨🇳 China

---

## ✨ Características

### 📋 Gestión de equipos

* Visualización de plantillas completas.
* Información organizada por equipos.
* Soporte para jugadores y staff técnico.

### 🎨 Interfaz

* Diseño de estilo suizo: blanco, negro y un único acento rojo.
* Navegación entre regiones con transiciones animadas.
* Estado de cada jugador marcado por forma y color (accesible).
* Banderas en SVG y diseño adaptado a móvil.
* Modo captura en cada región: vista general con todos los equipos en una sola pantalla, lista para hacer captura.
* Buscador por región: equipo, jugador o staff, sin distinguir mayúsculas ni tildes.
* Vista grande de cada equipo al hacer clic, con fotos de jugadores y staff.

### ⚡ Rendimiento

* Sin frameworks externos.
* Datos servidos como archivos JSON estáticos (sin backend).
* Renderizado dinámico mediante TypeScript.

---

## 🛠️ Tecnologías utilizadas

| Tecnología   | Uso                     |
| ------------ | ----------------------- |
| TypeScript   | Lógica de la aplicación |
| HTML5        | Estructura              |
| CSS3         | Diseño e interfaz       |
| JSON         | Fuente de datos         |
| Google Fonts | Tipografía              |

---

## 📂 Estructura del proyecto

```text
Mercado-Fichajes-VLR/
├── css/
│   └── style.css
├── public/               (se publica tal cual en la raíz de la web)
│   ├── data/             (/data/teamsEmea.json…)
│   │   ├── teamsAmer.json
│   │   ├── teamsCN.json
│   │   ├── teamsEmea.json
│   │   └── teamsPACF.json
│   ├── logos/            (logos de equipo: /logos/…)
│   ├── players/          (fotos de jugadores: /players/…)
│   ├── regions/          (fotos del menú de regiones: emea.png, apac.jpg, amer.jpg, cn.jpg)
│   └── staff/            (fotos de staff: /staff/…)
├── src/
│   ├── main.ts           (carga de datos y tipos)
│   ├── RegionTable.ts    (render, navegación y animaciones)
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Para actualizar los datos basta con editar los JSON de `public/data/` y hacer push: Vercel vuelve a desplegar y la fecha de "Actualizado" se toma del último commit que tocó esa carpeta.

---

## ✏️ Gestionar equipos, jugadores, fotos y logos

Todo el contenido sale de los JSON de `public/data/`. No hace falta tocar código para añadir, cambiar o quitar nada.

**¿Se pueden meter más equipos en una región?** Sí, no hay límite. Todo lo que depende del número de equipos se calcula a partir del JSON: los contadores de la portada y de cada región, el buscador y el modo captura. El modo captura reorganiza las columnas para que sigan cabiendo todos en pantalla; con muchos equipos el texto de la captura será más pequeño.

### Qué archivo es cada región

| Archivo | Región |
| --- | --- |
| `public/data/teamsEmea.json` | EMEA |
| `public/data/teamsAmer.json` | AMER |
| `public/data/teamsPACF.json` | APAC |
| `public/data/teamsCN.json` | CN |

Cada archivo contiene una región con su lista `teams`. No cambies el `id` de la región (`emea`, `americas`, `pacific`, `china`): la web lo usa para saber qué pestaña es.

### Estructura de un equipo

```json
{
  "name": "FNATIC",
  "flag": "🇬🇧",
  "logoUrl": "/logos/fnatic.png",
  "note": null,
  "players": [
    { "name": "Boaster", "status": "confirmed", "flag": "🇬🇧", "igl": true, "photoUrl": "/players/boaster.jpg" },
    { "name": "Cyvoph", "status": "rumor", "flag": "🇫🇷", "igl": false, "photoUrl": null }
  ],
  "staff": [
    { "role": "Head Coach", "name": "ENG", "flag": "🇷🇺", "photoUrl": "/staff/eng.jpg" }
  ]
}
```

| Campo | Obligatorio | Qué es |
| --- | --- | --- |
| `name` | Sí | Nombre del equipo. Se muestra en mayúsculas. |
| `flag` | Sí | Bandera como emoji (🇪🇸). Se convierte sola en imagen y en el nombre del país. |
| `logoUrl` | No | Ruta del logo, o `null` si no hay. |
| `note` | No | Texto corto que aparece como "Nota /" en la tarjeta, o `null`. |
| `players[].name` | Sí | Nombre del jugador. |
| `players[].status` | Sí | Estado (ver tabla de abajo). |
| `players[].flag` | Sí | Bandera del jugador. |
| `players[].igl` | No | `true` si es el IGL: sale la etiqueta "IGL". |
| `players[].photoUrl` | No | Ruta de la foto, o `null`. |
| `staff[].role` | Sí | Cargo, p. ej. "Head Coach", "Assistant Coach", "Analista", "Manager". El que contenga "Head Coach" es el que aparece en el modo captura. |
| `staff[].name` / `flag` / `photoUrl` | Nombre sí | Igual que en jugadores. |

**Estados de jugador** (`status`):

| Valor | Se ve como | Columna |
| --- | --- | --- |
| `confirmed` | Confirmado (cuadro verde) | Roster |
| `likely` | Probable (cuadro rojo) | Roster |
| `possible` | Posible (cuadro hueco) | Roster |
| `rumor` | Rumor (cuadro punteado) | Subs · Rumores |
| `benched` | Benched / Sub (cuadro tachado) | Subs · Rumores |
| `out` | Fuera (cuadro tachado) | Roster |

### Añadir un equipo

1. Abre el JSON de la región.
2. Copia el bloque de un equipo entero (de su `{` a su `}`) y pégalo dentro de `"teams": [ ... ]`.
3. Separa los equipos con una coma: `}, {`. Después del último equipo **no** va coma.
4. Cambia nombre, bandera, jugadores y staff.

El orden de los equipos en el JSON es el orden en la web.

### Cambiar un equipo o un jugador

- **Nombre, bandera, estado o IGL:** edita el valor directamente.
- **Un jugador pasa a otro estado** (p. ej. de rumor a confirmado): cambia su `status`. La web lo mueve sola a la columna que toca.
- **Un jugador cambia de equipo:** corta su bloque `{ ... }` de un equipo y pégalo en `players` del otro (también puede ser de otra región, en otro archivo).
- **Staff:** igual que los jugadores, dentro de `staff`.

### Eliminar un equipo o un jugador

Borra su bloque completo `{ ... }` y revisa las comas: entre elementos va una coma y después del último no.

### Logos y fotos

**Añadir**
1. Copia la imagen en su carpeta: `public/logos/`, `public/players/` o `public/staff/`.
2. Pon su ruta en el JSON **empezando por `/`**: `"logoUrl": "/logos/fnatic.png"`, `"photoUrl": "/players/boaster.jpg"`.

**Formatos recomendados**
- **Logos:** cuadrados y con fondo transparente (PNG o SVG). Salen antes del nombre del equipo en la tarjeta, en la vista grande y en el modo captura.
- **Fotos:** verticales 4:5 (por ejemplo 400×500), JPG o WebP. Se ven al hacer clic en un equipo.
- Nombres de archivo en minúsculas y sin espacios ni tildes (`team-liquid.png`, no `Team Liquid.png`): Vercel distingue mayúsculas.

**Cambiar:** sustituye el archivo por otro con el mismo nombre, o pon la ruta del nuevo en el JSON. Si el navegador sigue mostrando la imagen antigua, recarga con Ctrl+F5.

**Quitar:** pon el campo a `null` (`"photoUrl": null`) y borra el archivo de la carpeta.

**Fotos del menú de regiones (portada):** están en `public/regions/` y las enlaza `css/style.css`. Para cambiar una, sustituye el archivo manteniendo el nombre (`emea.png`, `apac.jpg`, `amer.jpg`, `cn.jpg`). Si cambias el nombre o la extensión, actualiza también su línea en `css/style.css` (busca `/regions/`).

Sin imagen, o si la ruta está mal, la web muestra las iniciales en lugar de un icono roto, así que se pueden ir añadiendo poco a poco.

### Comprobar antes de publicar

1. `npm run dev` y revisa la región que has tocado.
2. Si las regiones salen con "No se pudieron cargar los equipos", algún JSON tiene un error de formato. Los cuatro archivos se cargan juntos, así que un error en uno deja sin datos a todas las regiones. Lo más habitual es una coma de más o de menos, o unas comillas sin cerrar. VS Code marca la línea en rojo.
3. `git add -A`, `git commit` y `git push`: Vercel publica los cambios en uno o dos minutos.

---

## 📊 Modelo de datos

### Region

```ts
interface Region {
  id: string;
  label: string;
  subtitle: string;
  accent: string;
  teams: Team[];
}
```

### Team

```ts
interface Team {
  flag: string;
  name: string;
  players: Player[];
  staff?: StaffMember[];
  note?: string | null;
}
```

### Player

```ts
interface Player {
  status: 'confirmed' | 'likely' | 'possible' | 'rumor' | 'benched' | 'out';
  name: string;
  flag: string;
  role?: string;
}
```

### StaffMember

```ts
interface StaffMember {
  role: string;
  name: string;
  flag?: string;
}
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/mercado-fichajes-vlr.git
cd mercado-fichajes-vlr
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Modo desarrollo

Arranca el servidor de desarrollo (Vite):

```bash
npm run dev
```

Esto lanza Vite y recarga en caliente para desarrollos rápidos.

### 4. Compilar para producción

Genera la carpeta `dist/` optimizada:

```bash
npm run build
```

### 5. Previsualizar la build de producción

Sirve la carpeta `dist/` en un servidor local (Vite preview):

```bash
npm run preview
```

---

## ⚙️ Scripts disponibles

```bash
npm run dev
```

Arranca Vite en modo desarrollo (hot-reload).

```bash
npm run build
```

Construye la aplicación y produce `dist/`.

```bash
npm run preview
```

Previsualiza la carpeta `dist/` con Vite.

---

## 🔄 Flujo de funcionamiento

1. `index.html` carga la aplicación.
2. `main.ts` obtiene los datos JSON.
3. `loadRegions()` carga las regiones disponibles.
4. `renderRegion()` genera las tarjetas de equipos.
5. `showPage()` controla la navegación.

---

## 📝 Notas

* Los datos se sirven como archivos JSON estáticos desde `public/data/`.
* El proyecto no usa frameworks; la única dependencia es `flag-icons` para las banderas.

---

## 🚧 Próximas mejoras

* [ ] Filtros avanzados para staff técnico.
* [ ] Persistencia de filtros.
* [ ] Consumo de API en tiempo real.
* [ ] Integración de un bot para actualización de API automáticamente.
* [ ] Actualizar todas las regiones con coaches y equipos actuales.
* [ ] Consumo de API en tiempo real.

---

## 👨‍💻 Autor

**Miguel Ángel Díaz Gutiérrez**

Desarrollador Frontend.

📍 Madrid, España

Si te gusta el proyecto, ¡no olvides dejar una ⭐ al repositorio!
