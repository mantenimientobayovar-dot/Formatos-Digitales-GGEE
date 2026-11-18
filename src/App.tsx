import React, { useState, useEffect, useRef } from 'react'
import { Header } from './components/Header'
import { GPPForm } from './components/GPPForm'
import { CasaFuerzaForm } from './components/CasaFuerzaForm'
import { DashboardView } from './components/DashboardView'
import { GPPRegistroDia, CasaFuerzaRegistroDia } from './types'
import { 
  loadGPPRegistro, 
  saveGPPRegistro, 
  loadCasaFuerzaRegistro, 
  saveCasaFuerzaRegistro,
  getDefaultGPPRegistro,
  getDefaultCasaFuerzaRegistro
} from './services/storage'
import { exportGPPToExcel, exportCasaFuerzaToExcel } from './services/excelExport'
import { CheckCircle2 } from 'lucide-react'

export function App() {
  const [currentTab, setCurrentTab] = useState<'gpp' | 'casafuerza' | 'dashboard'>('gpp')
  const [fecha, setFecha] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [sede, setSede] = useState<string>('BAYOVAR')
  
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
        if (gpp.sede) setSede(gpp.sede)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [fecha])

  // Actualizar datos de GPP con auto-guardado debounced
  const handleGPPChange = (updated: GPPRegistroDia) => {
    setGppData(updated)
    triggerDebouncedSave(updated, cfData)
  }

  // Actualizar datos de Casa de Fuerza con auto-guardado debounced
  const handleCFChange = (updated: CasaFuerzaRegistroDia) => {
    setCfData(updated)
    triggerDebouncedSave(gppData, updated)
  }

  const handleSedeChange = (nuevaSede: string) => {
    setSede(nuevaSede)
    const updatedGPP = { ...gppData, sede: nuevaSede }
    const updatedCF = { ...cfData, sede: nuevaSede }
    setGppData(updatedGPP)
    setCfData(updatedCF)
    triggerDebouncedSave(updatedGPP, updatedCF)
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

  // Exportar Excel según la pestaña activa
  const handleExportExcel = () => {
    if (currentTab === 'gpp' || currentTab === 'dashboard') {
      exportGPPToExcel(gppData)
    } else {
      exportCasaFuerzaToExcel(cfData)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Header Fijo */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        fecha={fecha}
        setFecha={setFecha}
        sede={sede}
        setSede={handleSedeChange}
        onExportExcel={handleExportExcel}
        isSaving={isSaving}
      />

      {/* Notificación flotante de autoguardado */}
      <div 
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-emerald-600/95 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl transition-all duration-300 pointer-events-none ${
          showSaveNotice ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 text-white" />
        <span>Cambios guardados localmente</span>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {currentTab === 'gpp' && (
          <GPPForm
            data={gppData}
            onChange={handleGPPChange}
          />
        )}

        {currentTab === 'casafuerza' && (
          <CasaFuerzaForm
            data={cfData}
            onChange={handleCFChange}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            gppData={gppData}
            cfData={cfData}
            onGoToGPP={() => setCurrentTab('gpp')}
            onGoToCF={() => setCurrentTab('casafuerza')}
          />
        )}
      </main>

      {/* Footer Operativo */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>Sistema Digital de Casa de Fuerza & GGEE &bull; Versión 1.0</span>
          <span>Desarrollado para Operadores de Planta &bull; Responsive & Multiplataforma</span>
        </div>
      </footer>
    </div>
  )
}
