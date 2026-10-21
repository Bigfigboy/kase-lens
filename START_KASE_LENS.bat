@echo off
chcp 65001 > nul
title KASE Lens - Local AI
cd /d "%~dp0"
where node > nul 2>&1
if errorlevel 1 (
  echo Node.js не найден. Установите Node.js LTS с https://nodejs.org/
  pause
  exit /b 1
)
echo.
echo ===============================================
echo       KASE LENS - COMPETITION EDITION
echo ===============================================
echo Требуется: Ollama и модель qwen3:1.7b
 echo Сервер: http://localhost:5173
 echo Закройте окно, чтобы остановить сайт.
 echo.
start "" "http://localhost:5173"
npm run dev
pause
