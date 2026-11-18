import React from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Table, 
  TrendingUp, 
  Save, 
  FileDown 
} from 'lucide-react'

interface ToolbarCopeincaProps {
  currentTab: 'registro' | 'consolidado' | 'graficos'
  setCurrentTab: (tab: 'registro' | 'consolidado' | 'graficos') => void
  fecha: string
  setFecha: (fecha: string) => void
  onSave: () => void
  onDownloadPDF: () => void
  isSaving: boolean
}

export const ToolbarCopeinca: React.FC<ToolbarCopeincaProps> = ({
  currentTab,
  setCurrentTab,
  fecha,
  setFecha,
  onSave,
  onDownloadPDF,
  isSaving
}) => {
  // Manejador fecha anterior/siguiente
  const handlePrevDay = () => {
    const d = new Date(fecha)
    d.setDate(d.getDate() - 1)
    setFecha(d.toISOString().split('T')[0])
  }

  const handleNextDay = () => {
    const d = new Date(fecha)
    d.setDate(d.getDate() + 1)
    setFecha(d.toISOString().split('T')[0])
  }

  const handleSetToday = () => {
    setFecha(new Date().toISOString().split('T')[0])
  }

  // Formato visual DD/MM/YYYY
  const formatDisplayDate = (isoStr: string) => {
    if (!isoStr) return ''
    const parts = isoStr.split('-')
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return isoStr
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Lado Izquierdo: Botón Volver + Navegador de Fecha */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>Volver</span>
          </button>

          {/* Navegador de Fecha */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-1.5 py-1">
            <button
              onClick={handlePrevDay}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition"
              title="Día anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2 relative cursor-pointer">
              <Calendar className="w-4 h-4 text-slate-400 pointer-events-none" />
              <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                {formatDisplayDate(fecha)}
              </span>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
            </div>

            <button
              onClick={handleNextDay}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition"
              title="Día siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSetToday}
              className="ml-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-lg transition"
            >
              Hoy
            </button>
          </div>
        </div>

        {/* Centro: Selector de Pestañas Principales */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setCurrentTab('registro')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              currentTab === 'registro'
                ? 'bg-[#0b424c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Registro por Hora</span>
          </button>

          <button
            onClick={() => setCurrentTab('consolidado')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              currentTab === 'consolidado'
                ? 'bg-[#0b424c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Hoja Consolidada</span>
          </button>

          <button
            onClick={() => setCurrentTab('graficos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              currentTab === 'graficos'
                ? 'bg-[#0b424c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Gráficos por Hora</span>
          </button>
        </div>

        {/* Lado Derecho: Acciones (Guardar y Descargar PDF) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b424c] hover:bg-[#08333b] text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-900/10 transition active:scale-[0.98]"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Registro'}</span>
          </button>

          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition shadow-sm"
            title="Descargar documento PDF oficial GPP-FOR-021"
          >
            <FileDown className="w-4 h-4 text-red-600" />
            <span className="hidden sm:inline">Descargar PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}
