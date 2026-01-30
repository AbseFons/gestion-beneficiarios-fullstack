export interface Beneficiario {
  id: number
  nombres: string
  apellidos: string
  documentoIdentidadId: number
  numeroDocumento: string
  fechaNacimiento: string
  sexo: 'M' | 'F'
  documentoNombre?: string
  documentoAbreviatura?: string
  pais?: string
}

export type BeneficiarioCreate = Omit<Beneficiario, 'id'>
