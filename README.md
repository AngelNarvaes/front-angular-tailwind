# Frontend Angular + Tailwind CSS - Panel de Anuncios

Copia del proyecto **frontend_angular** con **Angular 22** (standalone components + signals) y **Tailwind CSS v4** integrado, que consume la API de anuncios clasificados del backend Express/Sequelize.

## Requisitos

- Node.js 20 o superior
- Backend corriendo (Docker en el puerto `89` o `npm start` en el `3000`)

## Puesta en marcha

1. Levanta el backend:

   ```bash
   cd ../backend_node
   docker compose up -d
   # o bien: npm start
   ```

2. Instala dependencias y arranca el frontend:

   ```bash
   npm install
   npm start
   ```

3. Abre `http://localhost:4200`.

El backend tiene `cors()` habilitado, pero en desarrollo se usa un proxy para evitar problemas de origen.

## Configuración de la API

El frontend llama a la ruta relativa `/api` y en desarrollo se redirige con un proxy (`proxy.conf.json`) a tu backend:

```json
{
  "/api": {
    "target": "http://127.0.0.1:89",
    "secure": false,
    "changeOrigin": true
  }
}
```

- Si usas **Docker Compose**, el backend queda expuesto en el puerto `89` (configuración actual).
- Si ejecutas el backend con `npm start`, cambia el `target` a `http://127.0.0.1:3000`.

En producción, sirve la build de Angular detrás del mismo origen que la API (o ajusta `apiUrl` en `src/environments/environment.ts`).

## Funcionalidades

- **Publicaciones**
  - Listado en tarjetas con categoría, precio, estado y fecha.
  - Búsqueda por título/descripción y filtros por categoría y estado.
  - Crear, editar y eliminar con confirmación.
- **Categorías**
  - Listado en tabla con estado y fecha de creación.
  - Búsqueda y filtro por estado.
  - Crear, editar y eliminar (muestra el error del backend si tiene publicaciones asociadas).
- Notificaciones tipo toast para éxito y error.
- Validaciones de formulario alineadas con las reglas del backend.
- Diseño responsive (sidebar en escritorio, barra superior en móvil).

## Endpoints consumidos

| Método | Endpoint                     | Uso                     |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/api/publicaciones`         | Listar publicaciones    |
| GET    | `/api/publicaciones/:id`     | Obtener publicación     |
| POST   | `/api/publicaciones`         | Crear publicación       |
| PUT    | `/api/publicaciones/:id`     | Actualizar publicación  |
| DELETE | `/api/publicaciones/:id`     | Eliminar publicación    |
| GET    | `/api/categorias`            | Listar categorías       |
| GET    | `/api/categorias/:id`        | Obtener categoría       |
| POST   | `/api/categorias`            | Crear categoría         |
| PUT    | `/api/categorias/:id`        | Actualizar categoría    |
| DELETE | `/api/categorias/:id`        | Eliminar categoría      |

## Scripts

```bash
npm start        # servidor de desarrollo en http://localhost:4200
npm run build    # build de producción en dist/
npm test         # tests unitarios (Vitest)
```

## Estructura

```
src/app/
├── core/
│   ├── models/          # Interfaces Categoria y Publicacion
│   ├── services/        # Servicios HTTP y notificaciones
│   └── api-error.ts     # Extracción de mensajes de error de la API
├── features/
│   ├── categorias/      # Listado y formulario de categorías
│   └── publicaciones/   # Listado y formulario de publicaciones
├── shared/
│   ├── confirm-dialog/  # Diálogo de confirmación reutilizable
│   └── notificacion/    # Toasts de éxito/error
├── app.config.ts        # HttpClient, router y locale es
├── app.routes.ts        # Rutas lazy-loaded
└── app.ts               # Shell con sidebar
```
