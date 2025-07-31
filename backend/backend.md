# Sistema de Presupuestos - Prestor

Sistema de gestión de presupuestos de productos desarrollado con Spring Boot y Spring Security.

## Características

- **Autenticación JWT**: Sistema de login y registro seguro
- **Gestión de Usuarios y Personas**: Registro y CRUD de clientes (personas) y usuarios
- **Control de Acceso**: Solo usuarios ADMIN pueden gestionar usuarios, personas y presupuestos
- **Gestión de Productos**: CRUD completo de productos con códigos únicos
- **Sistema de Presupuestos**: Creación de presupuestos con múltiples productos por cliente
- **Cálculos Automáticos**: Base imponible, IVA (19%) y precio líquido total
- **Códigos Únicos**: Cada presupuesto tiene un código tipo Mxxxxx (M + 5 dígitos)

## Tecnologías Utilizadas

- **Spring Boot 3.5.3**
- **Spring Security** con JWT
- **Spring Data JPA**
- **MySQL**
- **Lombok**
- **Maven**

## Requisitos Previos

- Java 24 o superior
- MySQL 8.0 o superior
- Maven 3.6 o superior

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd prestor
   ```

2. **Configurar la base de datos**
   - Crear una base de datos MySQL llamada `prestor`
   - Modificar las credenciales en `src/main/resources/application.properties`:
     ```properties
     spring.datasource.username=tu_usuario
     spring.datasource.password=tu_password
     ```

3. **Ejecutar la aplicación**
   ```bash
   mvn spring-boot:run
   ```

La aplicación estará disponible en `http://localhost:8080`

## Estructura de la Base de Datos

### Tablas Principales

- **users**: Información de autenticación
- **persons**: Datos personales (nombre, dirección, ciudad, país, RUT)
- **products**: Productos disponibles (código, nombre, precio)
- **presupuestos**: Presupuestos con códigos únicos (formato: Mxxxxx)
- **presupuesto_items**: Items individuales de cada presupuesto

## API Endpoints

### Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```
- **Campos requeridos:**
  - `username`: string, obligatorio
  - `password`: string, obligatorio

**Respuesta exitosa:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN"
  }
}
```

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario123",
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "direccion": "Av. Principal 123",
  "ciudad": "Santiago",
  "pais": "Chile",
  "rut": "12.345.678-9",
  "role": "ADMIN",
  "acceptedTerms": true
}
```
- **Campos requeridos:**
  - `username`: string, entre 3 y 50 caracteres, obligatorio
  - `email`: string, email válido, obligatorio
  - `password`: string, mínimo 6 caracteres, obligatorio
  - `nombre`: string, obligatorio
  - `direccion`: string, obligatorio
  - `ciudad`: string, obligatorio
  - `pais`: string, obligatorio
  - `rut`: string, formato XX.XXX.XXX-X, obligatorio
  - `role`: (opcional, por defecto ADMIN)
  - `acceptedTerms`: boolean, obligatorio (debe ser `true`)

> **Nota:** El campo `acceptedTerms` es obligatorio. Si no se acepta, el registro será rechazado.
> Solo usuarios con rol ADMIN pueden registrar nuevos usuarios después del primer registro.

---

### Cerrar Sesión (Logout)

Ahora el backend cuenta con un endpoint para cerrar sesión de forma segura invalidando el token JWT:

#### Logout (Cerrar sesión)
```http
POST /api/auth/logout
Authorization: Bearer <token>
```
- **Requiere:** Header `Authorization` con el token JWT actual.
- **Respuesta exitosa:**
  ```json
  { "message": "Sesión cerrada correctamente" }
  ```
- **Funcionamiento:** El token enviado se almacena en una lista negra (blacklist) y no podrá ser usado de nuevo, aunque no haya expirado.
- **Nota:** Si intentas usar un token deslogueado, recibirás un error 401 "Token inválido: sesión cerrada".

> **Importante:** La blacklist se almacena en memoria, por lo que si el servidor se reinicia, los tokens deslogueados podrían volver a ser válidos hasta que expiren. Para máxima seguridad, puedes complementar eliminando el token del almacenamiento del cliente (localStorage, sessionStorage, etc).

**Nota:** Solo los usuarios con rol ADMIN pueden registrar nuevos usuarios. Todos los usuarios tienen rol ADMIN por defecto.

### Usuarios (Solo ADMIN)

* !!Solo usuarios registrados en la pagina!!

#### Listar Usuarios
```http
GET /api/user/list
Authorization: Bearer <admin_token>
```

#### Obtener Perfil
```http
GET /api/user/profile
Authorization: Bearer <token>
```

### Personas (Clientes)

#### Listar Personas (Solo ADMIN)
```http
GET /api/presupuestos/personas
Authorization: Bearer <admin_token>
```
- **Requiere:** Header `Authorization` con el token JWT de un usuario ADMIN.
- **Respuesta exitosa:**
  ```json
  [
    {
      "id": 1,
      "nombre": "Cliente 1",
      "rut": "12345678-9",
      "direccion": "Calle 1",
      "ciudad": "Ciudad",
      "pais": "País"
      // ...otros campos
    },
    {
      "id": 2,
      "nombre": "Cliente 2",
      "rut": "98765432-1",
      // ...
    }
  ]
  ```
- **Notas:**
  - El campo `id` es el identificador único de cada persona/cliente.
  - Si el usuario no es ADMIN, la respuesta será 403 (prohibido).

#### Buscar Personas por Nombre (Solo ADMIN)
```http
GET /api/presupuestos/personas/buscar?nombre=cliente
Authorization: Bearer <admin_token>
```
- **Parámetros:**
  - `nombre` (obligatorio): Texto a buscar en los nombres (búsqueda parcial insensible a mayúsculas/minúsculas)
- **Requiere:** Header `Authorization` con el token JWT de un usuario ADMIN.
- **Respuesta exitosa:**
  ```json
  [
    {
      "id": 1,
      "nombre": "Cliente 1",
      "rut": "12345678-9",
      "direccion": "Calle 1",
      "ciudad": "Ciudad",
      "pais": "País"
    }
  ]
  ```
- **Notas:**
  - Devuelve todas las personas cuyo nombre contenga el texto de búsqueda (insensible a mayúsculas/minúsculas).
  - Si no se encuentran coincidencias, devuelve un array vacío `[]`.
  - Si el usuario no es ADMIN, la respuesta será 403 (prohibido).

#### Eliminar Persona (Solo ADMIN)
```http
DELETE /api/presupuestos/personas/{id}
Authorization: Bearer <admin_token>
```
- **Parámetros de ruta:**
  - `id` (obligatorio): ID de la persona a eliminar
- **Requiere:** Header `Authorization` con el token JWT de un usuario ADMIN.
- **Respuesta exitosa (200 OK):**
  ```json
  {
    "message": "Persona eliminada exitosamente"
  }
  ```
- **Posibles errores:**
  - `403 Forbidden`: Si el usuario no es administrador
  - `404 Not Found`: Si no existe una persona con el ID proporcionado
  - `400 Bad Request`: Si la persona tiene presupuestos asociados o hay un error en la operación
- **Notas:**
  - No se puede eliminar una persona que tenga presupuestos asociados
  - Solo usuarios con rol ADMIN pueden realizar esta operación

### Productos

#### Listar Productos
```http
GET /api/products
Authorization: Bearer <token>
```

#### Crear Producto
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "productCode": "123456789-A",
  "productName": "Laptop HP",
  "price": 500000.00,
  "description": "Laptop HP Pavilion"
}
```

#### Buscar por Código
```http
GET /api/products/codigo/123456789-A
Authorization: Bearer <token>
```

### Presupuestos

#### Crear Presupuesto
```http
POST /api/presupuestos
Authorization: Bearer <token>
Content-Type: application/json

{
  "descripcion": "Presupuesto para oficina",
  "items": [
    {
      "productCode": "123456789-A",
      "cantidad": 2
    },
    {
      "productCode": "123456790-B",
      "cantidad": 1
    }
  ]
}
```

#### Buscar por Código
```http
GET /api/presupuestos/codigo/M1234
Authorization: Bearer <token>
```

#### Listar por Persona
```http
GET /api/presupuestos/persona/1
Authorization: Bearer <token>
```

#### Listar Todos
```http
GET /api/presupuestos
Authorization: Bearer <token>
```

## Cálculos Automáticos

El sistema calcula automáticamente:

1. **Precio Total por Item**: `precio_unitario × cantidad`
2. **Base Imponible**: Suma de todos los precios totales de los items
3. **IVA**: `base_imponible × 0.19` (19%)
4. **Precio Líquido**: `base_imponible + iva`

## Códigos de Presupuesto

- Cada presupuesto recibe automáticamente un código único con formato Mxxxx (M + 4 dígitos)
- Los códigos se generan aleatoriamente y se verifica que sean únicos
- Se pueden buscar presupuestos usando estos códigos

## Seguridad

- **JWT Tokens**: Autenticación stateless
- **BCrypt**: Encriptación de contraseñas
- **Validación**: Validación de datos de entrada
- **Autorización**: Control de acceso basado en rol ADMIN

## Ejemplo de Uso

1. **Hacer login como administrador** (usuario por defecto: admin/admin123)
2. **Registrar nuevos usuarios** (solo administradores pueden hacer esto)
3. **Crear productos** (todos los usuarios son administradores)
4. **Crear presupuestos** con los productos disponibles
5. **Buscar presupuestos** por código o listar por persona

### Usuario Administrador por Defecto
- **Username:** admin
- **Password:** admin123
- **Email:** admin@prestor.com
- **Rol:** ADMIN

## Configuración Adicional

### Variables de Entorno

Puedes configurar las siguientes variables en `application.properties`:

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/prestor
spring.datasource.username=root
spring.datasource.password=password

# JWT
jwt.secret=tu_clave_secreta_jwt
jwt.expiration=86400000

# Servidor
server.port=8080
```

## Desarrollo

### Estructura del Proyecto

```
src/main/java/com/fotrix/prestor/prestor/
├── Config/           # Configuraciones (Security, JWT)
├── Controllers/      # Controladores REST
├── DTOs/            # Objetos de transferencia de datos
├── Models/          # Entidades JPA
├── Repositories/    # Repositorios de datos
└── Services/        # Lógica de negocio
```

### Comandos Útiles

```bash
# Compilar el proyecto
mvn compile

# Ejecutar tests
mvn test

# Crear JAR ejecutable
mvn package

# Ejecutar con perfil específico
mvn spring-boot:run -Dspring.profiles.active=dev
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 