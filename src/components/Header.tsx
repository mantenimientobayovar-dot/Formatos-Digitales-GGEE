import React from 'react'
import { 
  Zap, 
  Calendar, 
  Database, 
  FileSpreadsheet, 
  Layers, 
  Gauge, 
  Building2,
  HardDrive
} from 'lucide-react'
import { isSupabaseConfigured } from '../services/supabase'

interface HeaderProps {
  currentTab: 'gpp' | 'casafuerza' | 'dashboard'
  setCurrentTab: (tab: 'gpp' | 'casafuerza' | 'dashboard') => void
  fecha: string
  setFecha: (fecha: string) => void
  sede: string
  setSede: (sede: string) => void
  onExportExcel: () => void
  isSaving: boolean
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  fecha,
  setFecha,
  sede,
  setSede,
  onExportExcel,
  isSaving
}) => {
  const setHoy = () => {
    const today = new Date().toISOString().split('T')[0]
    setFecha(today)
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Plant Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
                GGEE DIGITAL
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Planta
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Control de Grupos Electrógenos & Casa de Fuerza
            </p>
          </div>
        </div>

        {/* Date and Sede Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Sede Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={sede}
              onChange={(e) => setSede(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 outline-none cursor-pointer"
            >
              <option value="BAYOVAR" className="bg-slate-800">Sede Bayóvar</option>
              <option value="CHIMBOTE" className="bg-slate-800">Sede Chimbote</option>
              <option value="PISCO" className="bg-slate-800">Sede Pisco</option>
              <option value="TODAS" className="bg-slate-800">Todas las Sedes</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-slate-200 outline-none cursor-pointer"
            />
            <button
              onClick={setHoy}
              type="button"
              className="text-[10px] font-bold uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded hover:bg-amber-400 transition ml-1"
              title="Ir al día de hoy"
            >
              Hoy
            </button>
          </div>

          {/* Cloud / Local Status Pill */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
            style={{
              backgroundColor: isSupabaseConfigured ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              borderColor: isSupabaseConfigured ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)',
              color: isSupabaseConfigured ? '#4ade80' : '#60a5fa'
            }}
            title={isSupabaseConfigured ? 'Conectado a Base de Datos Supabase' : 'Modo Local (Offline-first)'}
          >
            {isSupabaseConfigured ? (
              <Database className="w-3 h-3" />
            ) : (
              <HardDrive className="w-3 h-3" />
            )}
            <span className="hidden md:inline">
              {isSupabaseConfigured ? 'Supabase Nube' : 'Local (Offline)'}
            </span>
            {isSaving && (
              <span className="animate-spin w-2.5 h-2.5 border-2 border-amber-400 border-t-transparent rounded-full ml-1" />
            )}
          </div>

          {/* Export to Excel Button */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-md transition"
            title="Descargar archivo Excel oficial"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex space-x-1 sm:space-x-4 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setCurrentTab('gpp')}
          className={`flex items-center gap-2 py-2.5 px-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
            currentTab === 'gpp'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>GPP-FOR-021 (Registro 24h)</span>
        </button>

        <button
          onClick={() => setCurrentTab('casafuerza')}
          className={`flex items-center gap-2 py-2.5 px-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
            currentTab === 'casafuerza'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Casa de Fuerza (Horómetros & SAP)</span>
        </button>

        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex items-center gap-2 py-2.5 px-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
            currentTab === 'dashboard'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Monitoreo & Dashboard</span>
        </button>
      </div>
    </header>
  )
}
