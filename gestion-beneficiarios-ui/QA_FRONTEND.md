# QA_FRONTEND.md
## Pruebas de Calidad – Frontend
Proyecto: Gestión de Beneficiarios  
Stack: React + Vite + TypeScript + Tailwind CSS (UI minimalista “softcards”)  
Alcance UI: Single Page (registro + directorio/listado) + Modal para edición

---

## 1. Objetivo

Validar que el frontend cumple correctamente con:
- Registro, consulta, edición y eliminación de beneficiarios (CRUD)
- Validación condicional del campo **Número de documento** según el tipo de documento
- Consumo correcto de endpoints del backend
- Comportamiento consistente de UI/UX (estado, feedback, control de errores)

---

## 2. Alcance

Incluye pruebas de:
- Funcionalidad (CRUD)
- Validaciones (incluyendo reglas dinámicas)
- UI/UX (estados deshabilitados, feedback, modal)
- Integración con API (peticiones y manejo de fallos)

No incluye:
- Pruebas automatizadas unitarias/e2e
- Accesibilidad avanzada (a11y) más allá de lo básico
- Pruebas de performance a gran escala

---

## 3. Entorno de Pruebas

- Navegador: Chrome / Edge
- Frontend: Vite dev server
- Backend: ASP.NET Core Web API en localhost
- Base de datos: SQL Server Express
- Fuente de DocumentosIdentidad: Backend (solo registros activos)

---

## 4. Arquitectura revisada (estructura del proyecto)

src/
├── api/
│   └── apiClient.ts
├── components/
│   ├── BeneficiarioForm.tsx
│   ├── BeneficiariosTable.tsx
│   └── Modal.tsx
├── models/
│   ├── Beneficiario.ts
│   └── DocumentoIdentidad.ts
├── pages/
│   └── BeneficiariosPage.tsx
├── utils/
│   └── validation.ts
├── App.tsx
├── index.css
└── main.tsx

---

## 5. Casos de Prueba (Funcionales)

### 5.1 Carga inicial
**Objetivo:** Verificar que la página carga y obtiene datos base.

- [x] La página carga sin errores.
- [x] Se consulta la lista de DocumentosIdentidad desde backend.
- [x] Se consulta el listado de Beneficiarios desde backend.
- [x] El directorio/listado muestra “N de N registros” (conteo consistente).

**Resultado esperado:** Página operativa con datos visibles.

---

### 5.2 Registro de beneficiario (CREATE)
**Objetivo:** Validar creación de beneficiarios.

**Pasos:**
1. Ingresar Nombres y Apellidos.
2. Seleccionar País (si aplica) y Tipo de Documento.
3. Ingresar Número de Documento válido.
4. Seleccionar Fecha de nacimiento.
5. Seleccionar Sexo (M/F).
6. Presionar “Registrar”.

- [x] El botón “Registrar” está deshabilitado si falta algún campo requerido.
- [x] Al completar correctamente, permite enviar.
- [x] Tras registrar, el beneficiario aparece en el directorio sin recargar la página.
- [x] El formulario se limpia tras operación exitosa (si aplica).

**Resultado esperado:** Beneficiario creado y visible en listado.

---

### 5.3 Lectura/consulta (READ)
**Objetivo:** Validar visualización y búsqueda.

- [x] El listado muestra: Beneficiario, Documento, País, Acciones.
- [x] El campo de búsqueda filtra por nombre o documento (según UI).
- [x] Al limpiar el search, se restablece el listado completo.
- [x] El conteo “Viendo X de Y” se actualiza de forma consistente.

**Resultado esperado:** Listado y filtro funcionan correctamente.

---

### 5.4 Edición por Modal (UPDATE)
**Objetivo:** Validar edición desde modal.

**Pasos:**
1. Seleccionar acción “Editar” (o equivalente).
2. Se abre modal con datos precargados.
3. Modificar campos.
4. Guardar.

- [x] Modal muestra información actual del beneficiario.
- [x] Validaciones se mantienen en edición (especialmente documento).
- [x] Guardar actualiza el registro en el listado.
- [x] Modal se cierra tras éxito (si aplica) y el estado queda consistente.

**Resultado esperado:** Registro actualizado correctamente.

---

### 5.5 Eliminación (DELETE)
**Objetivo:** Validar eliminación de beneficiario.

- [x] Eliminar remueve el beneficiario del listado.
- [x] Si hay confirmación, evita eliminaciones accidentales (si aplica).
- [x] El conteo del directorio se actualiza tras eliminar.

**Resultado esperado:** Registro eliminado y UI consistente.

---

## 6. Casos de Prueba (Validaciones Condicionales)

### 6.1 Documentos activos
- [x] En el dropdown de tipo de documento solo aparecen documentos activos (backend filtra activos).

### 6.2 Validación dinámica del Número de Documento
**Reglas:**
- Longitud exacta según `DocumentoIdentidad.Longitud`
- Si `DocumentoIdentidad.SoloNumeros = true`, solo acepta dígitos
- Se muestra feedback de formato esperado en UI

**Casos:**
- [x] Si longitud no coincide → muestra mensaje y deshabilita “Registrar”.
- [x] Si solo números y se ingresan letras → mensaje y deshabilita “Registrar”.
- [x] Si cumple reglas → permite registrar.
- [x] Feedback visible: “(N dígitos, numérico)” o equivalente.

### 6.3 Dependencias País ↔ Documento (UX)
- [x] Al seleccionar País, el dropdown de documento muestra solo los documentos del país.
- [x] Al seleccionar Documento, el País se autocompleta con el país del documento (si se implementó).
- [x] Al cambiar País, se limpia Documento y Número para evitar estados inválidos (si se implementó).

---

## 7. Casos de Prueba (Errores y Resiliencia)

### 7.1 Backend no disponible
- [x] Si la API está caída, se muestra feedback de error al usuario (mensaje o banner) y la UI no colapsa.

### 7.2 Respuestas inesperadas
- [x] Si el backend retorna error 4xx/5xx, se muestra mensaje y no se pierde el estado principal de la página.

### 7.3 CORS / configuración
- [x] El frontend puede consumir la API desde localhost (CORS configurado).

---

## 8. Checklist final de aprobación

- [x] CRUD completo funcional
- [x] Validación condicional del documento implementada y visible
- [x] Filtro/búsqueda en directorio funcional
- [x] Modal de edición funcional
- [x] UI/UX consistente (botones deshabilitados, feedback claro)
- [x] Integración con API estable

---

## 9. Evidencia sugerida (para entrega)

- Captura de pantalla del sistema (registro + directorio)
- Captura del modal de edición
- Video corto (30–60s) mostrando:
  - Validación de documento
  - Registro
  - Edición
  - Eliminación

--