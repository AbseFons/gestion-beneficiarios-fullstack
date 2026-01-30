import axios from 'axios'
import type { DocumentoIdentidad } from '../models/DocumentoIdentidad'
import type { Beneficiario, BeneficiarioCreate } from '../models/Beneficiario'

const apiClient = axios.create({
  baseURL: 'http://localhost:5069/api', 
})

export const getDocumentosIdentidad = async (): Promise<DocumentoIdentidad[]> => {
  const res = await apiClient.get('/documentos-identidad')
  return res.data
}

export const getBeneficiarios = async (): Promise<Beneficiario[]> => {
  const res = await apiClient.get('/beneficiarios')
  return res.data
}

export const createBeneficiario = async (data: BeneficiarioCreate): Promise<Beneficiario> => {
  const res = await apiClient.post('/beneficiarios', data)
  return res.data
}

export const updateBeneficiario = async (id: number, data: BeneficiarioCreate) => {
    const response = await apiClient.put<Beneficiario>(`/beneficiarios/${id}`, data)
    return response.data
}

export const deleteBeneficiario = async (id: number): Promise<void> => {
  await apiClient.delete(`/beneficiarios/${id}`)
}

export default apiClient;
