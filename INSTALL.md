# Installation Guide

## 🚀 Complete Installation Instructions

Follow these steps to install and run the AI-powered crowdfunding platform.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 16 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** (optional, for cloning)
- **Modern browser** (Chrome, Firefox, Edge, Safari)

## Step-by-Step Installation

### Step 1: Install Ollama

Ollama is required for all AI features.

#### Windows
1. Download installer from [https://ollama.ai/download/windows](https://ollama.ai/download/windows)
2. Run the installer
3. Follow the installation wizard

#### macOS
```bash
brew install ollama
```

Or download from [https://ollama.ai/download/mac](https://ollama.ai/download/mac)

#### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Step 2: Pull the AI Model

After installing Ollama, pull the required model:

```bash
ollama pull gpt-oss:120b-cloud
```

This will download the AI model (may take a few minutes depending on your internet speed).

### Step 3: Start Ollama Server

Open a terminal and start the Ollama server:

```bash
ollama serve
```

**Important**: Keep this terminal window open. The server must be running for AI features to work.

You should see output like:
```
Ollama is running on http://localhost:11434
```

### Step 4: Install Project Dependencies

Open a **new terminal** (keep Ollama running in the first one) and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

This will install:
- axios (for AI API calls)
- All existing dependencies

### Step 5: Start Development Server

Still in the client directory, start the development server:

```bash
npm run dev
```

You should see output like:
```
  VITE v3.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 6: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

## 🎯 Verify Installation

### Quick Test Checklist

1. **Ollama is running**:
   ```bash
   curl http://localhost:11434/api/generate -d '{"model":"gpt-oss:120b-cloud","prompt":"Hello","stream":false}'
   ```
   Should return a JSON response.

2. **App is running**:
   - Open http://localhost:5173
   - You should see the crowdfunding platform

3. **AI features work**:
   - Navigate to any campaign
   - Enter a donation amount
   - You should see an AI-generated impact message

4. **Chatbot works**:
   - Click the chat icon (💬) in bottom-right
   - Type a question
   - You should get an AI response

## 🔧 Alternative Installation Methods

### Method 1: Automated Script (Recommended)

#### Linux/Mac:
```bash
chmod +x install-ai-features.sh
./install-ai-features.sh
```

#### Windows:
```cmd
install-ai-features.bat
```

The script will:
1. Check if Ollama is installed
2. Pull the AI model
3. Install npm dependencies
4. Provide next steps

### Method 2: Manual Installation

If you prefer manual control:

1. **Install Ollama** (see Step 1 above)

2. **Pull model**:
   ```bash
   ollama pull gpt-oss:120b-cloud
   ```

3. **Start Ollama** (in terminal 1):
   ```bash
   ollama serve
   ```

4. **Install dependencies** (in terminal 2):
   ```bash
   cd client
   npm install
   ```

5. **Start dev server**:
   ```bash
   npm run dev
   ```

## 📦 What Gets Installed

### Ollama
- **Size**: ~500MB (model size varies)
- **Location**: System-dependent
  - Windows: `C:\Users\<username>\.ollama`
  - Mac: `~/.ollama`
  - Linux: `~/.ollama`

### npm Packages
New dependency:
- **axios**: ^1.6.0 (HTTP client for AI calls)

Existing dependencies remain unchanged.

## 🔍 Troubleshooting Installation

### Ollama Installation Issues

**Problem**: "ollama: command not found"

**Solution**:
- Ensure Ollama is installed correctly
- Restart your terminal
- Check PATH environment variable
- Try reinstalling Ollama

**Problem**: "Model not found"

**Solution**:
```bash
ollama pull gpt-oss:120b-cloud
```

### npm Installation Issues

**Problem**: "npm ERR! code EACCES"

**Solution**:
```bash
sudo npm install
# Or fix npm permissions:
# https://docs.npmjs.com/resolving-eacces-permissions-errors
```

**Problem**: "Dependency resolution failed"

**Solution**:
```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Port Already in Use

**Problem**: "Port 5173 is already in use"

**Solution**:
```bash
# Kill the process using the port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use a different port:
npm run dev -- --port 3000
```

### Ollama Server Issues

**Problem**: "Failed to connect to Ollama"

**Solution**:
1. Check if Ollama is running:
   ```bash
   curl http://localhost:11434
   ```

2. If not running, start it:
   ```bash
   ollama serve
   ```

3. Check firewall settings (allow port 11434)

## 🌐 Network Configuration

### Running on Different Port

To run Ollama on a different port:

```bash
OLLAMA_HOST=0.0.0.0:11435 ollama serve
```

Then update `client/src/services/ollamaService.js`:
```javascript
const OLLAMA_URL = 'http://localhost:11435/api/generate';
```

### Accessing from Network

To access the app from other devices on your network:

```bash
npm run dev -- --host
```

Then access via:
```
http://<your-ip>:5173
```

## 🔐 Security Notes

### Development
- Ollama runs locally (no external API calls)
- No API keys required
- Data stays on your machine

### Production
Before deploying to production:
1. Move Ollama to a backend server
2. Add authentication
3. Implement rate limiting
4. Use environment variables for configuration
5. Enable HTTPS

## 📊 System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, Linux (modern distro)

### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 5GB+ free space
- **GPU**: Optional (speeds up AI responses)

## 🎯 Post-Installation

After successful installation:

1. **Test all features** (use IMPLEMENTATION_CHECKLIST.md)
2. **Read documentation**:
   - SETUP_GUIDE.md - Quick start
   - AI_FEATURES_README.md - Technical details
   - FEATURES_SUMMARY.md - Feature overview
3. **Customize** (optional):
   - Adjust AI prompts in `ollamaService.js`
   - Modify milestone phases in `milestoneService.js`
   - Update styling in components

## 🔄 Updating

To update the AI model:

```bash
ollama pull gpt-oss:120b-cloud
```

To update npm dependencies:

```bash
cd client
npm update
```

## 🗑️ Uninstallation

To remove everything:

### Remove Ollama
```bash
# Windows: Use Control Panel > Uninstall Programs

# Mac:
brew uninstall ollama
rm -rf ~/.ollama

# Linux:
sudo rm /usr/local/bin/ollama
rm -rf ~/.ollama
```

### Remove npm packages
```bash
cd client
rm -rf node_modules
```

## 📞 Getting Help

If you encounter issues:

1. **Check documentation**:
   - SETUP_GUIDE.md
   - IMPLEMENTATION_CHECKLIST.md
   - QUICK_REFERENCE.md

2. **Check logs**:
   - Browser console (F12)
   - Terminal output
   - Ollama logs

3. **Common solutions**:
   - Restart Ollama server
   - Clear npm cache
   - Check firewall settings
   - Verify all prerequisites

## ✅ Installation Complete!

Once everything is installed and running:

1. ✅ Ollama server is running
2. ✅ AI model is downloaded
3. ✅ npm dependencies are installed
4. ✅ Dev server is running
5. ✅ App is accessible in browser

**You're ready to use the AI-powered crowdfunding platform!** 🎉

## 🚀 Next Steps

1. **Explore features**:
   - Create a campaign
   - Test donation flow
   - Try the chatbot
   - View visualizations

2. **Customize**:
   - Adjust AI prompts
   - Modify styling
   - Add your branding

3. **Deploy**:
   - Follow production checklist
   - Set up backend
   - Configure email service

---

**Need more help?** Check the other documentation files or review the troubleshooting section above.

Happy coding! 🚀
