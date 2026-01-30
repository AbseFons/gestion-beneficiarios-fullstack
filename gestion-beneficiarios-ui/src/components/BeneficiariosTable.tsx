import { useState } from 'react'
import type { Beneficiario } from '../models/Beneficiario'
import { Trash2, Search, UserCircle2, Pencil } from 'lucide-react'

type Props = {
  beneficiarios: Beneficiario[]
  onDelete: (id: number) => Promise<void>
  onEdit: (beneficiario: Beneficiario) => void
}

export default function BeneficiariosTable({ beneficiarios, onDelete, onEdit }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBeneficiarios = beneficiarios.filter(b => {
     const term = searchTerm.toLowerCase()
     return (
        b.nombres.toLowerCase().includes(term) ||
        b.apellidos.toLowerCase().includes(term) ||
        b.numeroDocumento.toLowerCase().includes(term)
     )
  })

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      {/* Header de la Tabla */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center flex-wrap gap-4">
        <div>
           <h2 className="text-lg font-bold text-slate-800">Directorio</h2>
           <p className="text-sm text-slate-500">
             Viendo {filteredBeneficiarios.length} de {beneficiarios.length} registros
           </p>
        </div>
        
        {/* BUSCADOR*/}
        <div className="relative w-full sm:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
           <input 
             placeholder="Buscar por nombre o DNI..." 
             className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Beneficiario</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Documento</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">País</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredBeneficiarios.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="py-4 px-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                         <UserCircle2 size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-medium text-slate-900">{b.nombres} {b.apellidos}</p>
                         <p className="text-xs text-slate-400">{b.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                      </div>
                   </div>
                </td>
                <td className="py-4 px-6">
                   <div className="flex flex-col items-start">
                     <span className="text-sm text-slate-700 font-mono tracking-tight">{b.numeroDocumento}</span>
                     <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        {b.documentoAbreviatura}
                     </span>
                   </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                   {b.pais}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    <button
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Editar registro"
                        onClick={() => onEdit(b)}
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar registro"
                        onClick={() => {
                        if (confirm(`¿Eliminar a ${b.nombres}?`)) onDelete(b.id)
                        }}
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBeneficiarios.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
             <div className="bg-slate-50 p-4 rounded-full mb-3">
                <Search size={32} className="opacity-50" />
             </div>
             <p className="text-sm font-medium">No se encontraron resultados</p>
             <p className="text-xs mt-1">
                {beneficiarios.length === 0 ? "La base de datos está vacía." : "Intenta con otro término de búsqueda."}
             </p>
          </div>
        )}
      </div>
    </section>
  )
}