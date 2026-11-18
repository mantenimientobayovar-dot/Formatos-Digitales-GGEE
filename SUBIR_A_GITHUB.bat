@echo off
title Subir Formatos Digitales GGEE a GitHub
echo ========================================================
echo   SUBIENDO PROYECTO A GITHUB
echo   Repositorio: mantenimientobayovar-dot/Formatos-Digitales-GGEE
echo ========================================================
echo.
cd /d "C:\Users\Hans\Desktop\FORMATOS DIGITALES GGEE"
set PATH=C:\Users\Hans\.gemini\antigravity\scratch\mingit\cmd;%PATH%

git branch -M main
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   EXITO: Proyecto subido correctamente a GitHub!
    echo ========================================================
) else (
    echo Hubo un inconveniente al conectar con GitHub.
    echo Si te solicita credenciales, recuerda que GitHub requiere un Personal Access Token.
)
pause
