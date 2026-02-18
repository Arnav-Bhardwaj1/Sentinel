@echo off
echo ========================================
echo Installing AI-Powered Crowdfunding Features
echo ========================================
echo.

REM Check if Ollama is installed
echo Checking for Ollama...
where ollama >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Ollama is installed
) else (
    echo [ERROR] Ollama is not installed
    echo Please install Ollama from: https://ollama.ai/download/windows
    pause
    exit /b 1
)

REM Pull the AI model
echo.
echo Pulling AI model (gpt-oss:120b-cloud)...
echo This may take a few minutes...
ollama pull gpt-oss:120b-cloud

if %ERRORLEVEL% EQU 0 (
    echo [OK] AI model downloaded successfully
) else (
    echo [ERROR] Failed to download AI model
    pause
    exit /b 1
)

REM Install npm dependencies
echo.
echo Installing npm dependencies...
cd client
call npm install

if %ERRORLEVEL% EQU 0 (
    echo [OK] Dependencies installed successfully
) else (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start Ollama server:
echo    ollama serve
echo.
echo 2. In a new terminal, start the dev server:
echo    cd client
echo    npm run dev
echo.
echo 3. Open your browser and test the features:
echo    - AI Impact Translation (donation form)
echo    - Milestone Visualizations (campaign page)
echo    - AI Chatbot (click chat icon)
echo.
echo For more details, see SETUP_GUIDE.md
echo.
pause
