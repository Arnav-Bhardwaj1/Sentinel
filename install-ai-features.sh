#!/bin/bash

echo "🚀 Installing AI-Powered Crowdfunding Features"
echo "=============================================="
echo ""

# Check if Ollama is installed
echo "📦 Checking for Ollama..."
if command -v ollama &> /dev/null; then
    echo "✅ Ollama is installed"
else
    echo "❌ Ollama is not installed"
    echo "Please install Ollama from: https://ollama.ai"
    echo ""
    echo "Installation commands:"
    echo "  Mac:     brew install ollama"
    echo "  Linux:   curl -fsSL https://ollama.ai/install.sh | sh"
    echo "  Windows: Download from https://ollama.ai/download/windows"
    exit 1
fi

# Pull the AI model
echo ""
echo "🤖 Pulling AI model (gpt-oss:120b-cloud)..."
echo "This may take a few minutes..."
ollama pull gpt-oss:120b-cloud

if [ $? -eq 0 ]; then
    echo "✅ AI model downloaded successfully"
else
    echo "❌ Failed to download AI model"
    exit 1
fi

# Install npm dependencies
echo ""
echo "📦 Installing npm dependencies..."
cd client
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "=============================================="
echo "✅ Installation Complete!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Start Ollama server:"
echo "   ollama serve"
echo ""
echo "2. In a new terminal, start the dev server:"
echo "   cd client"
echo "   npm run dev"
echo ""
echo "3. Open your browser and test the features:"
echo "   - AI Impact Translation (donation form)"
echo "   - Milestone Visualizations (campaign page)"
echo "   - AI Chatbot (click 💬 icon)"
echo ""
echo "📖 For more details, see SETUP_GUIDE.md"
echo ""
