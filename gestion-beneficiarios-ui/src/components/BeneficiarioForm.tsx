import { useMemo, useState, useEffect } from 'react'
import type { DocumentoIdentidad } from '../models/DocumentoIdentidad'
import type { BeneficiarioCreate, Beneficiario } from '../models/Beneficiario'
import { User, CreditCard, Calendar, Hash, Save, Eraser, CheckCircle2, AlertCircle, Globe, Pencil } from 'lucide-react'

type Props = {
  documentos: DocumentoIdentidad[]
  onCreate?: (payload: BeneficiarioCreate) => Promise<void>
  onUpdate?: (id: number, payload: BeneficiarioCreate) => Promise<void>
  initialData?: Beneficiario | null
  onCancel?: () => void
}

type FormState = {
  nombres: string
  apellidos: string
  paisSeleccionado: string
  documentoIdentidadId: number | ''
  numeroDocumento: string
  fechaNacimiento: string
  sexo: 'M' | 'F'
}

const initialState: FormState = {
  nombres: '',
  apellidos: '',
  paisSeleccionado: '',
  documentoIdentidadId: '',
  numeroDocumento: '',
  fechaNacimiento: '',
  sexo: 'F',
}

function validarNumeroDocumento(valor: string, doc?: DocumentoIdentidad): string | null {
  if (!doc) return 'Seleccione un documento'
  if (valor.length !== doc.longitud) return `Debe tener ${doc.longitud} caracteres`
  if (doc.soloNumeros && !/^\d+$/.test(valor)) return 'Solo se permiten números'
  return null
}

export default function BeneficiarioForm({ documentos, onCreate, onUpdate, initialData, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const isEditing = !!initialData

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (initialData) {
      const doc = documentos.find(d => d.id === initialData.documentoIdentidadId)

      setForm({
        nombres: initialData.nombres,
        apellidos: initialData.apellidos,
        paisSeleccionado: doc?.pais || '',
        documentoIdentidadId: initialData.documentoIdentidadId,
        numeroDocumento: initialData.numeroDocumento,
        fechaNacimiento: initialData.fechaNacimiento.split('T')[0],
        sexo: initialData.sexo as 'M' | 'F'
      })
    } else {
      setForm(initialState)
    }
  }, [initialData, documentos])

  const paises = useMemo(() => {
    const unique = Array.from(new Set(documentos.map(d => d.pais)))
    unique.sort((a, b) => a.localeCompare(b))
    return unique
  }, [documentos])

  const documentosFiltrados = useMemo(() => {
    if (!form.paisSeleccionado) return documentos
    return documentos.filter(d => d.pais === form.paisSeleccionado)
  }, [documentos, form.paisSeleccionado])

  const selectedDoc = useMemo(() => {
    if (form.documentoIdentidadId === '') return undefined
    return documentosFiltrados.find(d => d.id === form.documentoIdentidadId)
  }, [documentosFiltrados, form.documentoIdentidadId])

  const numeroDocumentoError = useMemo(() => {
    return validarNumeroDocumento(form.numeroDocumento.trim(), selectedDoc)
  }, [form.numeroDocumento, selectedDoc])

  const canSubmit =
    form.nombres.trim().length > 0 &&
    form.apellidos.trim().length > 0 &&
    form.documentoIdentidadId !== '' &&
    form.fechaNacimiento.trim().length > 0 &&
    form.fechaNacimiento <= today &&
    (form.sexo === 'M' || form.sexo === 'F') &&
    numeroDocumentoError === null

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg(null)
    setApiError(null)

    if (!canSubmit) return

    const payload: BeneficiarioCreate = {
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      documentoIdentidadId: Number(form.documentoIdentidadId),
      numeroDocumento: form.numeroDocumento.trim(),
      fechaNacimiento: form.fechaNacimiento,
      sexo: form.sexo,
    }

    try {
      setSubmitting(true)

      if (isEditing && onUpdate && initialData) {
        await onUpdate(initialData.id, payload)
        setSuccessMsg('Actualizado correctamente')
      } else if (onCreate) {
        await onCreate(payload)
        setSuccessMsg('Registrado correctamente')
        setForm(initialState)
      }
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err: any) {
      setApiError(err?.response?.data?.message ?? err?.message ?? 'Error en la operación')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5"
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none"

  return (
    <section className={`bg-white p-6 relative overflow-hidden ${!isEditing ? 'rounded-2xl shadow-sm border border-slate-100' : ''}`}>
      {!isEditing && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User className="text-blue-600" size={24} />
            Nuevo Registro
          </h2>
        </>
      )}

      {/* Mensajes de feedback */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 animate-pulse">
          <AlertCircle size={16} /> {apiError}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">

        {/* Nombres y Apellidos */}
        <div className="space-y-4">
          {/* Nombres */}
          <div>
            <label className={labelClass}>Nombres</label>
            <div className="relative">
              <User className={iconClass} />
              <input
                className={inputClass}
                placeholder="Ej. Juan Carlos"
                value={form.nombres}
                onChange={(e) => update('nombres', e.target.value)}
              />
            </div>
          </div>

          {/* Apellidos */}
          <div>
            <label className={labelClass}>Apellidos</label>
            <div className="relative">
              <User className={iconClass} />
              <input
                className={inputClass}
                placeholder="Ej. Pérez López"
                value={form.apellidos}
                onChange={(e) => update('apellidos', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN DOCUMENTO E IDENTIFICACIÓN */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CAMPO: PAÍS */}
            <div>
              <label className={labelClass}>País de Emisión</label>
              <div className="relative">
                <Globe className={iconClass} />
                <select
                  className={`${inputClass} appearance-none cursor-pointer`}
                  value={form.paisSeleccionado}
                  onChange={(e) => {
                    const newPais = e.target.value
                    update('paisSeleccionado', newPais)
                    update('documentoIdentidadId', '')
                    update('numeroDocumento', '')
                  }}
                >
                  <option value="">-- Todos --</option>
                  {paises.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {/* Flecha Custom */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* CAMPO: TIPO DOCUMENTO */}
            <div>
              <label className={labelClass}>Tipo Documento</label>
              <div className="relative">
                <CreditCard className={iconClass} />
                <select
                  className={`${inputClass} appearance-none cursor-pointer`}
                  value={form.documentoIdentidadId}
                  onChange={(e) => {
                    const newId = e.target.value === '' ? '' : Number(e.target.value)
                    update('documentoIdentidadId', newId)
                    update('numeroDocumento', '')
                    if (newId !== '') {
                      const doc = documentos.find(d => d.id === newId)
                      if (doc) update('paisSeleccionado', doc.pais)
                    }
                  }}
                >
                  <option value="">-- Seleccionar --</option>
                  {documentosFiltrados.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.pais} - {d.abreviatura} ({d.nombre})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* CAMPO: NÚMERO DE DOCUMENTO */}
          <div>
            <label className={labelClass}>
              Número Documento
              {selectedDoc && (
                <span className="text-blue-600 ml-2 normal-case tracking-normal font-normal">
                  ({selectedDoc.longitud} dígitos{selectedDoc.soloNumeros ? ', numérico' : ''})
                </span>
              )}
            </label>
            <div className="relative">
              <Hash className={iconClass} />
              <input
                className={`${inputClass} ${numeroDocumentoError ? 'border-red-300 bg-red-50 focus:ring-red-200' : ''}`}
                placeholder={selectedDoc ? `Ingrese ${selectedDoc.longitud} caracteres` : "Seleccione un documento primero"}
                value={form.numeroDocumento}
                disabled={!selectedDoc}
                maxLength={selectedDoc?.longitud}
                onChange={(e) => update('numeroDocumento', e.target.value.toUpperCase())}
              />
            </div>
            {numeroDocumentoError && (
              <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1 font-medium">
                <AlertCircle size={12} /> {numeroDocumentoError}
              </p>
            )}
          </div>
        </div>

        {/* Fecha y Sexo */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Nacimiento</label>
            <div className="relative">
              <Calendar className={iconClass} />
              <input
                type="date"
                className={`${inputClass}`}
                value={form.fechaNacimiento}
                max={today}
                onChange={(e) => update('fechaNacimiento', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Sexo</label>
            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 h-[42px]">
              {['F', 'M'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update('sexo', s as 'M' | 'F')}
                  className={`flex-1 text-sm rounded-md font-medium transition-all ${form.sexo === s
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {s === 'F' ? 'F' : 'M'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="pt-4 flex gap-3">
          {/* Botón Cancelar/Limpiar */}
          <button
            type="button"
            onClick={() => isEditing ? onCancel?.() : setForm(initialState)}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium text-sm transition-colors flex justify-center items-center gap-2"
          >
            {isEditing ? 'Cancelar' : <><Eraser size={18} /> Limpiar</>}
          </button>

          {/* Botón Guardar */}
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className={`flex-[2] px-4 py-2.5 text-white rounded-xl disabled:opacity-50 font-medium text-sm shadow-md transition-all flex justify-center items-center gap-2 ${isEditing ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              }`}
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isEditing ? <Pencil size={18} /> : <Save size={18} />}
                {isEditing ? 'Guardar Cambios' : 'Registrar'}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  )
}