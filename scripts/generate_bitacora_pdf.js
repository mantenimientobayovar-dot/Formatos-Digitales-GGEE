const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth(); // 210
const pageHeight = doc.internal.pageSize.getHeight(); // 297
const margin = 14;
const contentWidth = pageWidth - (margin * 2);

let y = 16;

function checkPage(needed) {
  if (y + needed > pageHeight - 18) {
    doc.addPage();
    y = 16;
    drawHeaderBar();
  }
}

function drawHeaderBar() {
  doc.setFillColor(11, 66, 76); // #0b424c
  doc.rect(0, 0, pageWidth, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('COPEINCA — REPORTE TÉCNICO & REGISTRO DE DESARROLLO', margin, 5.5);
  doc.text('SEDE BAYÓVAR', pageWidth - margin - 24, 5.5);
}

// Draw initial top bar
drawHeaderBar();

// Title Banner
doc.setFillColor(243, 246, 249);
doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');
doc.setDrawColor(203, 213, 225);
doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'D');

doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(11, 66, 76);
doc.text('BITÁCORA INTEGRAL DE DESARROLLO Y DESPLIEGUE', margin + 6, y + 8);

doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(71, 85, 105);
doc.text('Sistema de Formatos Digitales GGEE & Casa de Fuerza — Next.js 14 + Supabase + Vercel', margin + 6, y + 15);
doc.setFontSize(8);
doc.text('Repositorio: github.com/mantenimientobayovar-dot/Formatos-Digitales-GGEE | Fecha: 18/11/2026', margin + 6, y + 21);

y += 31;

const hitos = [
  {
    num: "1",
    titulo: "Digitalización del Formato Excel y Replicación Visual",
    mensaje: "QUIERO QUE EL FORMATO 'GPP-FOR-021 Registro de Operaciones de Grupos Electrógenos v01.xlsx' TENGA LA ESTRUCTURA DE LAS IMAGENES QUE ESTOY COMPARTIENDO, QUE SEA SIMILAR EN DONDE SE PUEDA SELECCIONAR EL OPERADOR DE TURNO, LAS 24 HORAS UNA A UNA, QUE TENGA LAS MISMAS IMAGENES, AGREGA ICONOS INTERACTIVOS, MANTÉN LOS COLORES, QUE EL LOGO DE COPEINCA TAMBIÉN ESTE TAL CUAL...",
    acciones: [
      "Extracción y mapeo de variables operativas: Presión Aceite (PSI), T° Agua (°C), RPM, Frecuencia (Hz), Amperaje (A), Cos φ y Energía (kWh).",
      "Adopción de la paleta oficial de Copeinca (Teal #0b424c, fondos neutros #f3f6f9 y cabeceras #152336).",
      "Estructuración de las 3 vistas troncales: Registro por Hora (24h), Hoja Consolidada (matriz) y Gráficos por Hora con KPIs.",
      "Motor de generación de PDF oficial con membrete y cuadros de VoBo."
    ]
  },
  {
    num: "2",
    titulo: "Migración a Arquitectura Next.js 14 y Tarjetas Compactas",
    mensaje: "QUIERO QUE USES NEXT.JS PARA QUE HAGAS UNA INTERFACE MÁS DINÁMICA COPIANDO TAL CUAL LO DE LA IMAGENA DJUNTA Y QUE LOS FORMULARIOS S EVEAN COMPACTOS COMO LA IMAGEN",
    acciones: [
      "Inicialización de Next.js 14 (App Router) con TypeScript y Tailwind CSS.",
      "Diseño de tarjetas de medición compactas con formato pastilla (pill inputs), insignias 'Operando' y unidades flotantes a la derecha."
    ]
  },
  {
    num: "3",
    titulo: "Logo Corporativo Copeinca en Alta Resolución y Fondo Transparente",
    mensaje: "QUIERO QUE EL LOGO SEA MÁS GRANDE Y LE QUITES EL FONDO ,",
    acciones: [
      "Procesamiento con Pillow (Python) para remoción de fondo blanco y recorte perimetral alfa (RGBA).",
      "Integración como PNG nítido en el header web y cabecera de reportes PDF oficiales."
    ]
  },
  {
    num: "4",
    titulo: "Definición del Catálogo Oficial de los 9 Grupos Electrógenos",
    mensaje: "EN LO QUE CORRESPONDE A LA CANTIDAD DE GRUPOS ELECTROGENOS SON 9. QUIERO QUE EN VEZ DE 3 APAREZCAN LOS 9 Y SOLO DEBA SELECIONAR CUALQUIERA DE ELLOS: G1 BURMEISTER, G3 BURMEISTER, G4 KTA 19, G5 CAT C18, G6 KTA 50, G7 CAT 3306, G9 PERKINS, G10 CAT 3512 (PIS), G11 CAT 3512 B",
    acciones: [
      "Definición de constantes tipadas GRUPOS_OFICIALES en src/types/index.ts.",
      "Matriz de botones táctiles con checkmark para activar grupos por cada hora.",
      "Adaptación de la matriz consolidada de 24 horas y exportador PDF para los 9 grupos."
    ]
  },
  {
    num: "5",
    titulo: "Solución al Error de Caché de Webpack (138.js)",
    mensaje: "Error: Cannot find module './138.js' Require stack: C:\\Users\\Hans\\Desktop\\FORMATOS DIGITALES GGEE\\.next\\server\\webpack-runtime.js...",
    acciones: [
      "Diagnóstico: Desincronización de caché en caliente de Webpack en .next.",
      "Solución: Purga completa de .next y creación del script robusto INICIAR_SISTEMA_LOCAL.bat."
    ]
  },
  {
    num: "6",
    titulo: "Exclusión Definitiva del Grupo 2",
    mensaje: "QUITAR ESTE GRUPO 2, YA QUE NO ESTA EN EL LISTADO DE SELECCIÓN DE MIS 9 GRUPOS",
    acciones: [
      "Remoción de toda referencia a Grupo 2 en almacenamiento local, componentes visuales y reportes."
    ]
  },
  {
    num: "7",
    titulo: "Guardado 100% Manual Accionado por el Operador",
    mensaje: "OBSERVO QUE CUANDO SELECCIONÓ UN GRUPO EN AUTOMATICO SE GUARDA, Y ESO ES UN ERROR NO DEBERIA SER ASI, EL DAR CLICK EN GUARDAR SE HARÁ CUANDO SE COMPLETE EL LLENADO DE INFORMACIÓN Y ACCIONADO POR EL OPERADOR",
    acciones: [
      "Eliminación de hooks de auto-guardado reactivo (debounce).",
      "Control estricto condicionado al clic del botón 'Guardar Registro' en ToolbarCopeinca con feedback visual verde."
    ]
  },
  {
    num: "8",
    titulo: "Publicación en el Repositorio GitHub",
    mensaje: "SUBE EL PROYECTO A ESTE REPOSITORIO https://github.com/mantenimientobayovar-dot/Formatos-Digitales-GGEE.git MI CUENTA ESTA ASOCIADA A ESTE CORREO mantenimiento.bayovar@gmail.com",
    acciones: [
      "Configuración de Git con usuario 'Mantenimiento Bayovar'.",
      "Vinculación con origin/main y creación del script SUBIR_A_GITHUB.bat."
    ]
  },
  {
    num: "9",
    titulo: "Preparación para Vercel: Esquema SQL y Variables de Entorno",
    mensaje: "VOY HACER EL DEPLOY EN VERCEL Y QUIERO QUE GENERES EL CODIGO SQL PARA LAS TABLAS DE DATOS Y AYUDAME CON LAS VARIABLES DE ENTORNO",
    acciones: [
      "Generación de supabase/schema.sql con tablas JSONB (gpp_registros_dia y casa_fuerza_registros_dia), triggers y RLS.",
      "Configuración de variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY con fallback offline seguro."
    ]
  },
  {
    num: "10",
    titulo: "Resolución del Error de Build en Vercel y Despliegue Exitoso",
    mensaje: "01:42:34.117 Running build in Washington... Failed to compile. ./src/components/GPPForm.tsx:74:7 Type error: Property 'codigoCorto' is missing in type... Error: Command 'npm run build' exited with 1",
    acciones: [
      "Diagnóstico: El archivo prototipo preliminar GPPForm.tsx contenía tipos obsoletos y fallaba en el chequeo estricto de Next.js.",
      "Depuración: Eliminación de prototipos obsoletos (GPPForm.tsx, Header.tsx, DashboardView.tsx).",
      "Validación: Ejecución local de 'npm run build' completada con 0 errores y 0 advertencias.",
      "Push a GitHub y activación del nuevo build en Vercel."
    ]
  }
];

hitos.forEach((h) => {
  checkPage(38);

  // Hito Header Badge
  doc.setFillColor(11, 66, 76);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`HITO ${h.num}: ${h.titulo.toUpperCase()}`, margin + 3, y + 4.2);
  y += 6;

  // User Message Box
  const splitMsg = doc.splitTextToSize(`" ${h.mensaje} "`, contentWidth - 10);
  const msgBoxHeight = (splitMsg.length * 3.7) + 5;
  checkPage(msgBoxHeight + 22);

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, msgBoxHeight, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, msgBoxHeight, 'D');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(splitMsg, margin + 4, y + 4);
  y += msgBoxHeight + 2;

  // Actions bullets
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Acciones Técnicas Implementadas:', margin + 2, y + 3.5);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  h.acciones.forEach((acc) => {
    const splitAcc = doc.splitTextToSize(`• ${acc}`, contentWidth - 8);
    checkPage((splitAcc.length * 3.5) + 2);
    doc.text(splitAcc, margin + 4, y);
    y += (splitAcc.length * 3.5) + 0.8;
  });

  y += 3.5;
});

// Final Deployment Guide Page
checkPage(50);
doc.setFillColor(21, 35, 54); // #152336
doc.rect(margin, y, contentWidth, 6.5, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(255, 255, 255);
doc.text('GUÍA RÁPIDA: ACCESO AL LINK DE DESPLIEGUE EN VERCEL', margin + 3, y + 4.5);
y += 9.5;

const guideLines = [
  "1. Ingresar al Dashboard de Vercel (vercel.com/dashboard) con tu cuenta.",
  "2. Seleccionar el proyecto 'Formatos-Digitales-GGEE'.",
  "3. En la sección 'Deployments', el estado del commit más reciente estará marcado en verde como 'Ready'.",
  "4. Tu enlace de producción público estará visible en la tarjeta superior (ej: https://formatos-digitales-ggee.vercel.app).",
  "5. Variables en Vercel: En 'Settings > Environment Variables', ingresa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  "6. Nuevos cambios: Para publicar futuras actualizaciones, ejecuta SUBIR_A_GITHUB.bat y Vercel se actualizará automáticamente."
];

guideLines.forEach((line) => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(line, margin + 3, y);
  y += 4.8;
});

// Page Numbers Footer
const totalPages = doc.internal.getNumberOfPages();
for (let i = 1; i <= totalPages; i++) {
  doc.setPage(i);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Copeinca Sede Bayóvar — Sistema de Operación de Grupos Electrógenos y Casa de Fuerza', margin, pageHeight - 8);
  doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 18, pageHeight - 8);
}

// Save outputs
const outProject = 'C:\\Users\\Hans\\Desktop\\FORMATOS DIGITALES GGEE\\BITACORA_DESARROLLO_Y_DESPLIEGUE_COPEINCA.pdf';
const outDesktop = 'C:\\Users\\Hans\\Desktop\\BITACORA_DESARROLLO_Y_DESPLIEGUE_COPEINCA.pdf';

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outProject, pdfBuffer);
fs.writeFileSync(outDesktop, pdfBuffer);

console.log('PDF generado exitosamente en:');
console.log('1.', outProject);
console.log('2.', outDesktop);
