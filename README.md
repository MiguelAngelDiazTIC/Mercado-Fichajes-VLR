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
│   └── staff/            (fotos de staff: /staff/…)
├── photos/
│   └── backgrounds/tarjetas/
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

### 🖼️ Añadir logos y fotos

1. Copia la imagen en su carpeta: `public/logos/`, `public/players/` o `public/staff/`.
2. Enlázala en el JSON con una ruta que empiece por `/`:

```json
{
  "name": "FNATIC",
  "logoUrl": "/logos/fnatic.png",
  "players": [
    { "name": "Boaster", "status": "confirmed", "flag": "🇬🇧", "igl": true, "photoUrl": "/players/boaster.jpg" }
  ],
  "staff": [
    { "role": "Head Coach", "name": "ENG", "flag": "🇷🇺", "photoUrl": "/staff/eng.jpg" }
  ]
}
```

- **Logos:** cuadrados, con fondo transparente (PNG o SVG). Se muestran antes del nombre del equipo en la tarjeta, en la vista grande y en el modo captura.
- **Fotos:** vertical 4:5 (por ejemplo 400×500), JPG o WebP. Se ven al hacer clic en un equipo.
- Sin imagen (o si la ruta falla) se muestran las iniciales, así que se pueden ir añadiendo poco a poco.

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
