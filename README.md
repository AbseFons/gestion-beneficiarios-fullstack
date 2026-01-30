# Stack tecnológico:
Frontend: React + Vite + TypeScript + TailwindCSS
Backend: ASP.NET Core Web API (C#)
Base de datos: SQL Server (Stored Procedures)

URLs en entorno local:
Frontend: http://localhost:5173/

Backend (Swagger): http://localhost:5069/swagger/



# REQUISITOS PREVIOS

- Node.js (versión LTS recomendada)
- .NET SDK
- SQL Server (Express es suficiente)
- SQL Server Management Studio (SSMS)

# BASE DE DATOS

1. Abrir SQL Server Management Studio (SSMS).
2. Abrir el archivo:
3. db/setup.sql
4. Ejecutar el script con F5.

Este script crea la base de datos GestionBeneficiariosDB, las tablas, los datos de ejemplo para DocumentoIdentidad y los Stored Procedures necesarios.

# BACKEND (ASP.NET CORE WEB API)

1. Ubicarse en la carpeta del backend y ejecutar:

dotnet restore
dotnet run

El backend quedará disponible en:
http://localhost:5069/swagger/

Endpoints principales:

GET /api/documentos-identidad

GET /api/beneficiarios

GET /api/beneficiarios/{id}

POST /api/beneficiarios

PUT /api/beneficiarios/{id}

DELETE /api/beneficiarios/{id}

FRONTEND (REACT + VITE)

Ubicarse en la carpeta del frontend y ejecutar:

npm install
npm run dev

Abrir en el navegador:
http://localhost:5173/

Nota:
El frontend no utiliza archivo .env.
El cliente HTTP apunta directamente al backend local.