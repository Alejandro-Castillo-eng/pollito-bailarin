@echo off
rem Abre la pagina de Pollito Bailarin en un servidor local (necesario para el 3D y los videos)
cd /d "%~dp0"
echo Abriendo Pollito Bailarin en http://localhost:8080  (cierra esta ventana para detenerlo)
start "" http://localhost:8080
python -m http.server 8080
