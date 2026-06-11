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
* 🏆 Selecciones Nacionales (ENC / Nations Cup)

---

## ✨ Características

### 📋 Gestión de equipos

* Visualización de plantillas completas.
* Información organizada por equipos.
* Soporte para jugadores y staff técnico.

### 🔍 Sistema de filtros

* Búsqueda por jugador.
* Búsqueda por equipo.
* Filtrado por rol.
* Filtrado por estado del movimiento.

### 🎨 Interfaz

* Diseño limpio y ligero.
* Navegación entre regiones.
* Dashboard dedicado para selecciones nacionales.
* Colores personalizados por región.

### ⚡ Rendimiento

* Sin frameworks externos.
* Datos cargados desde archivos JSON.
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
├── .git/
├── node_modules/
├── css/
│   └── style.css
├── data/
│   ├── teamsAmer.json
│   ├── teamsCN.json
│   ├── teamsEmea.json
│   ├── teamsPACF.json
│   └── teamsSEL.json
├── dist/
│   ├── assets/
│   │   ├── index-DjZN0phc.css
│   │   └── index-tzrnkB1X.js
│   ├── index.html
│   └── teams*.json  (copias públicas de los JSON usados en `src`)
├── src/
│   ├── main.ts
│   └── RegionTable.ts
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

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
6. `filterPlayers()` y `filterStatus()` aplican los filtros dinámicos.

---

## 📝 Notas

* La sección de selecciones nacionales utiliza contenido HTML estático.
* `teamsSEL.json` aún no está conectado dinámicamente.
* Los datos se cargan localmente desde archivos JSON.
* El proyecto no requiere frameworks ni librerías Frontend externas.

---

## 🚧 Próximas mejoras

* [ ] Integrar dinámicamente `teamsSEL.json`.
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
