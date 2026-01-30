# QA_BACKEND.md  
## Pruebas de Calidad – Backend  
Proyecto: Gestión de Beneficiarios  
Tecnologías: ASP.NET Core Web API · SQL Server Express · ADO.NET · Stored Procedures  

---

## 1. Objetivo

El presente documento describe las pruebas de calidad realizadas sobre el backend del sistema de Gestión de Beneficiarios, con el objetivo de garantizar:

- Correcto funcionamiento del CRUD
- Integridad de datos en base de datos
- Cumplimiento de los requisitos funcionales del reto técnico
- Consistencia en las respuestas del API
- Preparación del backend para su consumo desde el frontend

---

## 2. Alcance

Las pruebas se realizaron sobre los siguientes componentes:

- Endpoints REST del API
- Stored Procedures en SQL Server
- Integridad referencial entre tablas
- Validaciones básicas a nivel backend
- Consistencia de contratos de datos (DTOs)

No se incluyen pruebas de interfaz gráfica ni pruebas automatizadas unitarias, ya que el enfoque del reto es funcional y estructural.

---

## 3. Entorno de Pruebas

- Sistema Operativo: Windows
- Motor de Base de Datos: SQL Server Express
- Framework Backend: ASP.NET Core Web API
- Acceso a pruebas: Swagger UI
- Base de Datos: `GestionBeneficiariosDB`

---

## 4. Pruebas Funcionales

### 4.1 DocumentoIdentidad – Listado

**Endpoint:**  
`GET /api/documentos-identidad`

**Casos verificados:**
- El endpoint devuelve únicamente documentos con `Activo = 1`
- Cada registro contiene los campos necesarios para validación en frontend:
  - `Id`
  - `Nombre`
  - `Abreviatura`
  - `Pais`
  - `Longitud`
  - `SoloNumeros`
- No se retornan documentos inactivos

**Resultado:** ✅ Aprobado

---

### 4.2 Beneficiario – Creación (CREATE)

**Endpoint:**  
`POST /api/beneficiarios`

**Casos positivos:**
- Inserción correcta con `DocumentoIdentidadId` válido
- Respuesta HTTP `201 Created`
- Retorno del objeto creado incluyendo datos del documento de identidad

**Casos negativos:**
- `DocumentoIdentidadId` inexistente → error controlado
- Campos requeridos faltantes → `400 BadRequest`
- Valor inválido para `Sexo` → `400 BadRequest`

**Resultado:** ✅ Aprobado

---

### 4.3 Beneficiario – Lectura (READ)

**Endpoints:**  
- `GET /api/beneficiarios`  
- `GET /api/beneficiarios/{id}`

**Casos verificados:**
- El listado devuelve todos los beneficiarios registrados
- Los datos incluyen información del documento de identidad (JOIN)
- Consulta por ID inexistente devuelve `404 NotFound`
- Estructura de respuesta consistente entre listado y detalle

**Resultado:** ✅ Aprobado

---

### 4.4 Beneficiario – Actualización (UPDATE)

**Endpoint:**  
`PUT /api/beneficiarios/{id}`

**Casos verificados:**
- Actualización correcta de los campos del beneficiario
- Respuesta `204 NoContent` al actualizar exitosamente
- ID inexistente devuelve `404 NotFound`

**Resultado:** ✅ Aprobado

---

### 4.5 Beneficiario – Eliminación (DELETE)

**Endpoint:**  
`DELETE /api/beneficiarios/{id}`

**Casos verificados:**
- Eliminación correcta del registro
- Respuesta `204 NoContent`
- El beneficiario eliminado no aparece en listados posteriores
- ID inexistente devuelve `404 NotFound`

**Resultado:** ✅ Aprobado

---

## 5. Pruebas de Integridad de Datos

### 5.1 Integridad Referencial

- Se verificó que no es posible insertar un beneficiario con un `DocumentoIdentidadId` inexistente.
- La clave foránea `FK_Beneficiario_DocumentoIdentidad` protege la consistencia de los datos.

**Resultado:** ✅ Aprobado

---

### 5.2 Tipos de Datos

Se validó que:
- `FechaNacimiento` se almacena como `DATE`
- `Sexo` se restringe a `CHAR(1)` con valores permitidos (`M`, `F`)
- `NumeroDocumento` respeta la longitud definida en base de datos

**Resultado:** ✅ Aprobado

---

## 6. Validaciones Backend

Aunque la validación principal del número de documento se realiza en el frontend, el backend implementa:

- Validaciones por DataAnnotations (`[Required]`, `[RegularExpression]`)
- Rechazo de requests mal formados
- Manejo adecuado de IDs inexistentes

**Resultado:** ✅ Aprobado

---

## 7. Consistencia y Estabilidad

- Todos los endpoints REST devuelven códigos HTTP apropiados
- La estructura de los DTOs es consistente en todas las operaciones
- El backend se encuentra estable y listo para ser consumido por el frontend

---

## 8. Conclusión

El backend del sistema de Gestión de Beneficiarios cumple satisfactoriamente con los requisitos funcionales y técnicos del reto propuesto.  
Las pruebas realizadas garantizan un comportamiento estable, datos consistentes y una base sólida para el desarrollo del frontend.

✔ Backend validado  
✔ Integridad de datos asegurada  
✔ Listo para integración con frontend  

---
