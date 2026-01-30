import { useEffect, useState } from 'react'
import { getBeneficiarios, getDocumentosIdentidad, createBeneficiario, deleteBeneficiario, updateBeneficiario } from '../api/apiClient' // Importar update
import type { DocumentoIdentidad } from '../models/DocumentoIdentidad'
import type { Beneficiario, BeneficiarioCreate } from '../models/Beneficiario'
import BeneficiarioForm from '../components/BeneficiarioForm'
import BeneficiariosTable from '../components/BeneficiariosTable'
import Modal from '../components/Modal'
import { LayoutDashboard } from 'lucide-react'

export default function BeneficiariosPage() {
  const [documentos, setDocumentos] = useState<DocumentoIdentidad[]>([])
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBeneficiario, setEditingBeneficiario] = useState<Beneficiario | null>(null)

  const loadAll = async () => {
    try {
      setError(null)
      setLoading(true)
      const [docs, bens] = await Promise.all([
        getDocumentosIdentidad(),
        getBeneficiarios(),
      ])
      setDocumentos(docs)
      setBeneficiarios(bens)
    } catch (e: any) {
      setError(e?.message ?? 'Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleCreate = async (payload: BeneficiarioCreate) => {
    await createBeneficiario(payload);
    loadAll(); 
};

  const handleDelete = async (id: number) => {
    await deleteBeneficiario(id)
    setBeneficiarios(prev => prev.filter(x => x.id !== id))
  }

  const handleEditClick = (b: Beneficiario) => {
    setEditingBeneficiario(b)
    setIsModalOpen(true)
  }

  const handleUpdate = async (id: number, payload: BeneficiarioCreate) => {
    await updateBeneficiario(id, payload)
    setIsModalOpen(false)
    setEditingBeneficiario(null)
    loadAll()
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Gestión de Beneficiarios</h1>
            <p className="text-xs text-slate-500 font-medium">Panel de Administración</p>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-8">

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit">
            <BeneficiarioForm
              documentos={documentos}
              onCreate={handleCreate}
            />
          </div>

          {/* Tabla */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <BeneficiariosTable
                beneficiarios={beneficiarios}
                onDelete={handleDelete}
                onEdit={handleEditClick}
              />
            )}
          </div>
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Editar Información"
      >
        <div className="p-2">
          <BeneficiarioForm
             documentos={documentos}
             initialData={editingBeneficiario} 
             onUpdate={handleUpdate}         
             onCancel={() => setIsModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  )
}