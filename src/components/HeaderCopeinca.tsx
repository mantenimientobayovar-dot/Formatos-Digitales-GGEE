'use client'

import React from 'react'
import { FileText, TrendingUp, LayoutGrid, ArrowLeft, LogOut } from 'lucide-react'

interface HeaderCopeincaProps {
  onGoToGraficos: () => void
  onToggleArea?: () => void
}

export const HeaderCopeinca: React.FC<HeaderCopeincaProps> = ({ onGoToGraficos, onToggleArea }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Lado Izquierdo: Logo Copeinca + Badge Módulo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center">
            <img 
              src="/copeinca-logo.png" 
              alt="Copeinca" 
              className="h-8 sm:h-9 object-contain cursor-pointer"
            />
          </div>

          {/* Badge Módulo de Registros de Operación */}
          <div className="hidden md:flex items-center gap-2 bg-purple-50 text-purple-900 border border-purple-200/80 px-3 py-1.5 rounded-lg text-xs font-bold tracking-tight">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>MÓDULO DE REGISTROS DE OPERACIÓN</span>
          </div>
        </div>

        {/* Lado Derecho: Acciones y Usuario */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-700">
          <button
            onClick={onGoToGraficos}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition text-slate-600"
          >
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span>Comportamiento por Hora</span>
          </button>

          <button
            onClick={onToggleArea}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition text-slate-600"
          >
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Cambiar de Área</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Inicio</span>
          </button>

          <button
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Avatar Usuario */}
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
