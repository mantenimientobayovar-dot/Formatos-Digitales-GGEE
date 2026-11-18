import React, { useState, useEffect, useRef } from 'react'
import { HeaderCopeinca } from './components/HeaderCopeinca'
import { ToolbarCopeinca } from './components/ToolbarCopeinca'
import { RegistroPorHoraTab } from './components/RegistroPorHoraTab'
import { HojaConsolidadaTab } from './components/HojaConsolidadaTab'
import { GraficosPorHoraTab } from './components/GraficosPorHoraTab'
import { CasaFuerzaForm } from './components/CasaFuerzaForm'
import { GPPRegistroDia, CasaFuerzaRegistroDia } from './types'
import { 
  loadGPPRegistro, 
  saveGPPRegistro, 
  loadCasaFuerzaRegistro, 
  saveCasaFuerzaRegistro,
  getDefaultGPPRegistro,
  getDefaultCasaFuerzaRegistro
} from './services/storage'
import { exportGPPToPDF } from './services/pdfExport'
import { CheckCircle2, Building2, Zap } from 'lucide-react'

export function App() {
  const [currentTab, setCurrentTab] = useState<'registro' | 'consolidado' | 'graficos'>('registro')
  const [areaMode, setAreaMode] = useState<'ggee' | 'casafuerza'>('ggee')
  const [fecha, setFecha] = useState<string>(() => new Date().toISOString().split('T')[0])
  
  const [gppData, setGppData] = useState<GPPRegistroDia>(() => getDefaultGPPRegistro(fecha))
  const [cfData, setCfData] = useState<CasaFuerzaRegistroDia>(() => getDefaultCasaFuerzaRegistro(fecha))
  
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveNotice, setShowSaveNotice] = useState(false)
  const saveTimeoutRef = useRef<any>(null)

  // Cargar registros al cambiar la fecha
  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      const gpp = await loadGPPRegistro(fecha)
      const cf = await loadCasaFuerzaRegistro(fecha)
      if (isMounted) {
        setGppData(gpp)
        setCfData(cf)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [fecha])

  // Guardar GPP
  const handleGPPChange = (updated: GPPRegistroDia) => {
    setGppData(updated)
    triggerDebouncedSave(updated, cfData)
  }

  // Guardar Casa de Fuerza
  const handleCFChange = (updated: CasaFuerzaRegistroDia) => {
    setCfData(updated)
    triggerDebouncedSave(gppData, updated)
  }

  const triggerDebouncedSave = (currGPP: GPPRegistroDia, currCF: CasaFuerzaRegistroDia) => {
    setIsSaving(true)
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      await Promise.all([
        saveGPPRegistro(currGPP),
        saveCasaFuerzaRegistro(currCF)
      ])
      setIsSaving(false)
      setShowSaveNotice(true)
      setTimeout(() => setShowSaveNotice(false), 2000)
    }, 600)
  }

  // Guardado manual inmediato
  const handleManualSave = async () => {
    setIsSaving(true)
    await Promise.all([
      saveGPPRegistro(gppData),
      saveCasaFuerzaRegistro(cfData)
    ])
    setIsSaving(false)
    setShowSaveNotice(true)
    setTimeout(() => setShowSaveNotice(false), 2500)
  }

  // Descarga de PDF oficial
  const handleDownloadPDF = () => {
    exportGPPToPDF(gppData)
  }

  return (
    <div className="min-h-screen bg-[#f3f6f9] text-slate-800 flex flex-col font-sans antialiased selection:bg-[#0b424c] selection:text-white">
      {/* 1. Header Oficial Copeinca */}
      <HeaderCopeinca
        onGoToGraficos={() => setCurrentTab('graficos')}
        onToggleArea={() => setAreaMode(areaMode === 'ggee' ? 'casafuerza' : 'ggee')}
      />

      {/* Notificación flotante de autoguardado */}
      <div 
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#0b424c] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 pointer-events-none ${
          showSaveNotice ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <span>Registro de Operación guardado exitosamente</span>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto px-3 sm:px-6 py-5">
        {/* Banner de Área si está en Casa de Fuerza */}
        {areaMode === 'casafuerza' && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Modo Activo: Casa de Fuerza & Servicios Generales (SAP)
                </h3>
                <p className="text-xs text-slate-500">
                  Control de horómetros de 15 equipos y combustible diésel
                </p>
              </div>
            </div>
            <button
              onClick={() => setAreaMode('ggee')}
              className="text-xs font-bold bg-[#0b424c] text-white px-3 py-1.5 rounded-lg hover:bg-[#08333b]"
            >
              Volver a GPP-FOR-021 &rarr;
            </button>
          </div>
        )}

        {areaMode === 'casafuerza' ? (
          <CasaFuerzaForm
            data={cfData}
            onChange={handleCFChange}
          />
        ) : (
          <>
            {/* 2. Sub-Toolbar Copeinca (Volver, Fecha, Pestañas, Guardar, PDF) */}
            <ToolbarCopeinca
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              fecha={fecha}
              setFecha={setFecha}
              onSave={handleManualSave}
              onDownloadPDF={handleDownloadPDF}
              isSaving={isSaving}
            />

            {/* 3. Pestaña 1: Registro por Hora (Exacto a Imagen 1) */}
            {currentTab === 'registro' && (
              <RegistroPorHoraTab
                data={gppData}
                onChange={handleGPPChange}
              />
            )}

            {/* 4. Pestaña 2: Hoja Consolidada (Exacto a Imagen 2) */}
            {currentTab === 'consolidado' && (
              <HojaConsolidadaTab
                data={gppData}
                onDownloadPDF={handleDownloadPDF}
              />
            )}

            {/* 5. Pestaña 3: Gráficos por Hora (Exacto a Imagen 3) */}
            {currentTab === 'graficos' && (
              <GraficosPorHoraTab
                data={gppData}
                fecha={fecha}
                setFecha={setFecha}
                onGoToRegistro={() => setCurrentTab('registro')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer Operativo Corporativo */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-[1560px] mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">COPEINCA</span>
            <span>&bull;</span>
            <span>Planta Harina y Aceite &bull; Sede Bayóvar</span>
          </div>
          <span>GPP-FOR-021 Registro de Operaciones de Grupos Electrógenos &bull; Versión 01</span>
        </div>
      </footer>
    </div>
  )
}
