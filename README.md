

# 📚 Biblioteca API - NestJS

Una API RESTful desarrollada con NestJS para la gestión de una biblioteca digital, incluyendo autores, libros, usuarios y funcionalidades de exportación a Excel.

---

## 🚀 Tecnologías Utilizadas

- **Backend**: NestJS (Node.js + TypeScript)
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Documentación**: Swagger/OpenAPI
- **Autenticación**: JWT (JSON Web Tokens)
- **Exportación**: XLSX (Excel)
- **Eventos**: EventEmitter para jobs asíncronos

---

## 📋 Características Principales

- ✅ Gestión completa de **Autores** y **Libros**
- ✅ Sistema de **Usuarios** con autenticación JWT
- ✅ **Exportación a Excel** (autores, libros, datos combinados)
- ✅ **Jobs asíncronos** para tareas en segundo plano
- ✅ **Documentación automática** con Swagger
- ✅ **Validación de datos** con class-validator
- ✅ **Relaciones de base de datos** bien definidas

---

## 🛠️ Instalación y Configuración

### 1️⃣ Prerrequisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 2️⃣ Clonar el Repositorio

```bash
git clone https://github.com/MrZhongli/my-intelli-backend.git
cd my-intelli-backend
````

### 3️⃣ Instalar Dependencias

```bash
npm install
```

### 4️⃣ Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/biblioteca_db"
```

> ⚠️ Cambia `username`, `password`, y `biblioteca_db` por tus credenciales reales.

### 5️⃣ Configuración de la Base de Datos

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6️⃣ Iniciar la Aplicación

```bash
npm run start:dev
```

Accede a: [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentación de la API

Accede a [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 👤 Gestión de Usuarios

### Crear un Usuario

**POST** `/users`

```json
{
  "email": "alice@example.com",
  "username": "alice_w",
  "password": "123456",
  "firstName": "Alice",
  "lastName": "Walker",
  "role": "USER"
}
```

Roles disponibles:

* `USER`
* `ADMIN`

---

## 📚 Endpoints Principales

### Autores

* `GET /authors`
* `GET /authors/:id`
* `POST /authors`
* `PUT /authors/:id`
* `DELETE /authors/:id`

### Libros

* `GET /books`
* `GET /books/:id`
* `POST /books`
* `PUT /books/:id`
* `DELETE /books/:id`

### Usuarios

* `GET /users`
* `GET /users/:id`
* `POST /users`
* `PUT /users/:id`
* `DELETE /users/:id`

---

## 📊 Exportación a Excel

### Endpoints

* `GET /export/authors/excel`
* `GET /export/books/excel`
* `GET /export/combined/excel`
* `GET /export/info`

Los archivos se descargan automáticamente en navegador, Swagger, o herramientas como Postman.

---

## 🗄️ Esquema de Base de Datos

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  firstName String
  lastName  String
  role      String   @default("USER")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Author {
  id         String   @id @default(cuid())
  firstName  String
  lastName   String
  booksCount Int      @default(0)
  books      Book[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Book {
  id          String   @id @default(cuid())
  title       String
  isbn        String?  @unique
  description String?
  authorId    String
  author      Author   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🔧 Comandos Útiles

```bash
npx prisma studio        # Ver base de datos
npx prisma migrate reset # Resetear la base
npm run start:dev        # Iniciar app en desarrollo
```

---

## 📝 Scripts Disponibles

* `npm run build`
* `npm run start`
* `npm run start:dev`

---

## 🌱 Mejoras Futuras

* [ ] Autenticación completa con roles
* [ ] Filtros avanzados en exportaciones
* [ ] Paginación
* [ ] Subida de archivos
* [ ] Logs de auditoría

---

## 🤝 Contribución

1. Fork del proyecto
2. Crea una rama (`git checkout -b feature/lo-que-sea`)
3. Commit (`git commit -m 'Agrega feature'`)
4. Push (`git push origin feature/lo-que-sea`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT. Ver archivo [LICENSE](LICENSE).

---

## 📞 Soporte

* Ver Swagger UI
* Revisar logs (`npm run start:dev`)
* Verifica archivo `.env`
* Asegúrate que PostgreSQL esté activo


