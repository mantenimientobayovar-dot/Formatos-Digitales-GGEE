const fs = require('fs');
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

// Función para dibujar encabezado institucional en cada página
function drawHeader(doc) {
  // Barra superior Copeinca
  doc.setFillColor(11, 66, 76); // #0b424c
  doc.rect(0, 0, pageWidth, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('COPEINCA — REGISTRO DE DESARROLLO Y GESTIÓN OPERATIVA', margin, 6.8);
  doc.text('SEDE BAYÓVAR', pageWidth - margin - 25, 6.8);
}

// Banner de Título Principal en la Primera Página
drawHeader(doc);

doc.setFillColor(243, 246, 249);
doc.roundedRect(margin, 15, pageWidth - (margin * 2), 26, 2, 2, 'F');
doc.setDrawColor(180, 200, 215);
doc.setLineWidth(0.4);
doc.roundedRect(margin, 15, pageWidth - (margin * 2), 26, 2, 2, 'D');

doc.setFont('helvetica', 'bold');
doc.setFontSize(15);
doc.setTextColor(11, 66, 76);
doc.text('BITÁCORA INTEGRAL DE DESARROLLO Y DESPLIEGUE', margin + 6, 23.5);

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
doc.setTextColor(51, 65, 85);
doc.text('Sistema de Formatos Digitales GGEE & Casa de Fuerza (Next.js 14 + Supabase + Vercel)', margin + 6, 30);

doc.setFontSize(8.5);
doc.setTextColor(100, 116, 139);
doc.text('Repositorio: github.com/mantenimientobayovar-dot/Formatos-Digitales-GGEE  |  Fecha: 18/11/2026', margin + 6, 36);

const hitos = [
  {
    num: "1",
    titulo: "Digitalización del Formato Excel y Replicación Visual",
    mensaje: "QUIERO QUE EL FORMATO 'GPP-FOR-021 Registro de Operaciones de Grupos Electrógenos v01.xlsx' TENGA LA ESTRUCTURA DE LAS IMAGENES QUE ESTOY COMPARTIENDO, QUE SEA SIMILAR EN DONDE SE PUEDA SELECCIONAR EL OPERADOR DE TURNO, LAS 24 HORAS UNA A UNA, QUE TENGA LAS MISMAS IMAGENES, AGREGA ICONOS INTERACTIVOS, MANTÉN LOS COLORES, QUE EL LOGO DE COPEINCA TAMBIÉN ESTE TAL CUAL...",
    acciones: [
      "Extracción y mapeo de variables operativas: Presión Aceite (PSI), T° Agua (°C), RPM, Frecuencia (Hz), Amperaje (A), Cos φ y Energía (kWh).",
      "Adopción estricta de la paleta oficial de Copeinca (Teal #0b424c, fondos #f3f6f9 y cabeceras #152336).",
      "Estructuración de las 3 vistas: Registro por Hora (24h), Hoja Consolidada (matriz) y Gráficos por Hora con KPIs.",
      "Motor de generación de PDF oficial con membrete y cuadros de VoBo de Jefatura y Superintendencia."
    ]
  },
  {
    num: "2",
    titulo: "Migración a Arquitectura Next.js 14 y Tarjetas Compactas",
    mensaje: "QUIERO QUE USES NEXT.JS PARA QUE HAGAS UNA INTERFACE MÁS DINÁMICA COPIANDO TAL CUAL LO DE LA IMAGENA DJUNTA Y QUE LOS FORMULARIOS S EVEAN COMPACTOS COMO LA IMAGEN",
    acciones: [
      "Inicialización de Next.js 14 (App Router) con TypeScript y Tailwind CSS.",
      "Diseño de tarjetas de medición compactas con formato pastilla (pill inputs), insignias 'Operando' y unidades flotantes a la derecha (PSI, °C, RPM, Hz, A, Cos φ, kWh)."
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
      "Definición de constantes tipadas GRUPOS_OFICIALES en src/types/index.ts con los 9 motores oficiales.",
      "Matriz de botones táctiles con checkmark para activar grupos por cada hora.",
      "Adaptación de la matriz consolidada de 24 horas y exportador PDF para los 9 grupos."
    ]
  },
  {
    num: "5",
    titulo: "Solución al Error de Caché de Webpack (138.js)",
    mensaje: "Error: Cannot find module './138.js' Require stack: C:\\Users\\Hans\\Desktop\\FORMATOS DIGITALES GGEE\\.next\\server\\webpack-runtime.js...",
    acciones: [
      "Diagnóstico: Desincronización de caché en caliente de Webpack en la carpeta .next.",
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
      "Vinculación con origin/main y creación del script de subida rápida SUBIR_A_GITHUB.bat."
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

// Generar cada Hito como una tabla estructurada con autoTable
// Esto garantiza CERO solapamiento, cálculo automático de altura de texto,
// fuentes grandes y márgenes generosos.
let currentY = 46;

hitos.forEach((h) => {
  const tableBody = [
    [
      {
        content: `TU MENSAJE:\n"${h.mensaje}"`,
        styles: {
          fontStyle: 'italic',
          textColor: [51, 65, 85],
          fillColor: [248, 250, 252],
          fontSize: 9,
          cellPadding: 3.5,
          lineColor: [226, 232, 240],
          lineWidth: 0.3
        }
      }
    ],
    [
      {
        content: `ACCIONES TÉCNICAS IMPLEMENTADAS:\n` + h.acciones.map(a => `• ${a}`).join('\n'),
        styles: {
          textColor: [15, 23, 42],
          fillColor: [255, 255, 255],
          fontSize: 9.5,
          cellPadding: 4,
          lineColor: [226, 232, 240],
          lineWidth: 0.3
        }
      }
    ]
  ];

  doc.autoTable({
    startY: currentY,
    margin: { left: margin, right: margin, top: 14, bottom: 16 },
    head: [
      [
        {
          content: `HITO ${h.num}: ${h.titulo.toUpperCase()}`,
          styles: {
            fillColor: [11, 66, 76],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            cellPadding: 3.5
          }
        }
      ]
    ],
    body: tableBody,
    theme: 'grid',
    didDrawPage: function() {
      drawHeader(doc);
    }
  });

  currentY = doc.lastAutoTable.finalY + 6;
});

// Guía final de despliegue en Vercel
doc.autoTable({
  startY: currentY,
  margin: { left: margin, right: margin, top: 14, bottom: 16 },
  head: [
    [
      {
        content: 'GUÍA RÁPIDA: ACCESO AL LINK DE DESPLIEGUE EN VERCEL',
        styles: {
          fillColor: [21, 35, 54], // #152336
          textColor: [255, 255, 255],
          fontSize: 10.5,
          fontStyle: 'bold',
          cellPadding: 3.5
        }
      }
    ]
  ],
  body: [
    [
      {
        content: 
`1. Ingresar a tu panel de Vercel (vercel.com/dashboard).
2. Seleccionar el proyecto 'Formatos-Digitales-GGEE'.
3. En la pestaña 'Deployments', el estado del commit más reciente figurará como 'Ready' (círculo verde).
4. El enlace público estará disponible en la tarjeta principal (ej: https://formatos-digitales-ggee.vercel.app).
5. Variables en Vercel: En 'Settings > Environment Variables', registrar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.
6. Publicar cambios futuros: Para cualquier actualización posterior, ejecutar SUBIR_A_GITHUB.bat y Vercel se actualizará automáticamente.`,
        styles: {
          fontSize: 9.5,
          textColor: [15, 23, 42],
          cellPadding: 4.5,
          lineColor: [203, 213, 225],
          lineWidth: 0.3
        }
      }
    ]
  ],
  theme: 'grid',
  didDrawPage: function() {
    drawHeader(doc);
  }
});

// Pie de página con numeración en todas las hojas
const totalPages = doc.internal.getNumberOfPages();
for (let i = 1; i <= totalPages; i++) {
  doc.setPage(i);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Copeinca Sede Bayóvar — Formatos Digitales GGEE & Casa de Fuerza', margin, pageHeight - 7);
  doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 20, pageHeight - 7);
}

// Guardar archivos
const outProject = 'C:\\Users\\Hans\\Desktop\\FORMATOS DIGITALES GGEE\\BITACORA_DESARROLLO_Y_DESPLIEGUE_COPEINCA.pdf';
const outDesktop = 'C:\\Users\\Hans\\Desktop\\BITACORA_DESARROLLO_Y_DESPLIEGUE_COPEINCA.pdf';
const outArtifact = 'C:\\Users\\Hans\\.gemini\antigravity\\brain\\2d4ff5b9-081c-4862-957d-87f36eede712\\BITACORA_DESARROLLO_Y_DESPLIEGUE_COPEINCA.pdf';

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outProject, pdfBuffer);
fs.writeFileSync(outDesktop, pdfBuffer);

try {
  fs.writeFileSync('C:\\Users\\Hans\\.gemini\\antigravity\\brain\\2d4ff5b9-081c-4862-957d-87f36eede712\\BITACORA_DESARROLLO_Y_DESPLIEGUE_COPEINCA.pdf', pdfBuffer);
} catch(e) {}

console.log('PDF regenerado exitosamente con autoTable (sin solapamiento y tipografía ampliada).');
