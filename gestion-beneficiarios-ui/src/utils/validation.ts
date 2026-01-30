import type { DocumentoIdentidad } from "../models/DocumentoIdentidad";

export function validarNumeroDocumento(
  valor: string,
  doc?: DocumentoIdentidad
): string | null {
  const v = valor.trim();

  if (!doc) return "Seleccione un documento de identidad.";

  if (v.length === 0) return "Ingrese el número de documento.";

  if (doc.soloNumeros && !/^\d+$/.test(v)) {
    return "Solo se permiten números.";
  }

  if (v.length !== doc.longitud) {
    return `Debe tener exactamente ${doc.longitud} caracteres.`;
  }

  return null;
}
