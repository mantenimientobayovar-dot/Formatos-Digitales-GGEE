@echo off
title Sistema Digital GGEE - Next.js Copeinca
echo ========================================================
echo   INICIANDO SISTEMA DIGITAL GGEE & CASA DE FUERZA (NEXT.JS)
echo ========================================================
echo.
set PATH=C:\Users\Hans\.gemini\antigravity\tools\node;%PATH%
cd /d "C:\Users\Hans\Desktop\FORMATOS DIGITALES GGEE"
echo Abriendo aplicacion en el navegador (http://localhost:3000)...
start http://localhost:3000
npm run dev
pause
