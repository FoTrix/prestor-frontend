# Prestor Frontend

Frontend para el sistema Prestor, desarrollado en **React + TypeScript + Vite**. Este proyecto consume un backend en Spring Boot y provee un dashboard administrativo, gestión de clientes, presupuestos y productos.

---

## Tabla de Contenidos
- [Instalación y ejecución](#instalación-y-ejecución)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Principales componentes y páginas](#principales-componentes-y-páginas)
- [Flujo de autenticación](#flujo-de-autenticación)
- [Consumo de API y endpoints](#consumo-de-api-y-endpoints)
- [Modelos y tipado](#modelos-y-tipado)
- [Notas de desarrollo](#notas-de-desarrollo)

---

## Instalación y ejecución

```bash
npm install
npm run dev
```

Para producción:
```bash
npm run build
```

---

## Estructura de carpetas

- `src/pages/` — Páginas principales (Dashboard, ClientPage, ProductPage, etc)
- `src/components/` — Componentes reutilizables (layouts, formularios, etc)
- `src/services/` — Funciones para consumir la API REST
- `src/types/` — Definiciones TypeScript de modelos (Persona, User, Budget, etc)

---

## Principales componentes y páginas

- **Dashboard** (`src/pages/dashboard/Dashboard.tsx`)
  - Muestra bienvenida, botón de logout, lista de clientes (personas), últimos presupuestos y paginación.
  - Los clientes se obtienen de `/api/presupuestos/personas` y se navega a su detalle usando el id de persona.
- **ClientPage** (`src/pages/ClientPage.tsx`)
  - Muestra los detalles del cliente (persona) y sus presupuestos asociados.
  - Usa `/api/presupuestos/personas/{id}` para obtener datos completos.
  - Incluye paginación de presupuestos y botón para crear nuevo presupuesto.
- **ProductPage** (`src/pages/ProductPage.tsx`)
  - Gestión y visualización de productos (en desarrollo).
- **Auth (Login/Register)**
  - Flujo de autenticación con protección de rutas y redirecciones inteligentes.

---

## Flujo de autenticación
- El login exitoso guarda el token y redirige al dashboard.
- Si hay token, no se permite acceder a `/login` o `/register`.
- Logout limpia el token y redirige a login.

---

## Consumo de API y endpoints

- **Clientes (Personas):**
  - `GET /api/presupuestos/personas` — Lista de clientes
  - `GET /api/presupuestos/personas/{id}` — Detalle de cliente
  - `PUT /api/presupuestos/personas/{id}` — Actualizar cliente
- **Usuarios:**
  - `GET /api/user/profile` — Perfil autenticado (objeto bajo clave `user`)
  - `GET /api/user/list` — (No usado para clientes, solo usuarios)
- **Presupuestos:**
  - `GET /api/presupuestos` — Listado de presupuestos
  - `GET /api/presupuestos/{id}` — Detalle de presupuesto
- **Productos:**
  - `GET /api/productos` — Listado de productos

---

## Modelos y tipado

- **Persona** (`src/types/persona.ts`):
  ```ts
  export interface Persona {
    id: number;
    nombre?: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
    pais?: string;
    rut?: string;
    telefono?: string;
    // ...otros campos
  }
  ```
- **User** (`src/types/dashboard.ts`):
  ```ts
  export interface User {
    id: number;
    username: string;
    email: string;
    nombre?: string;
    // ...otros campos
  }
  ```
- **Budget** (`src/types/dashboard.ts`):
  ```ts
  export interface Budget {
    id: number;
    codigo: string;
    descripcion: string;
    personaId: number;
    // ...otros campos
  }
  ```

---

## Notas de desarrollo
- El dashboard y ClientPage ahora usan el id de persona para navegación y detalle, evitando errores de "persona no encontrada".
- Todos los modelos están tipados en TypeScript para autocompletado y seguridad.
- Si agregas campos nuevos en el backend, extiende la interfaz correspondiente en `/src/types/`.
- El código es modular y fácilmente extensible para nuevos endpoints y vistas.

---

Para dudas sobre la arquitectura o contribuciones, consulta los comentarios en los archivos fuente o comunícate con el equipo de desarrollo.
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
