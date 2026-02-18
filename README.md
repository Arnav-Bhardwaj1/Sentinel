# Sentinel 🛡️

Sentinel lets anyone create and fund campaigns directly on the Ethereum blockchain — no intermediaries, no central authority. Every transaction is on-chain and fully transparent. ⛓️

On top of the Web3 foundation, Sentinel adds a local AI layer (via [Ollama](https://ollama.ai)) that makes campaigns more engaging for donors: instant impact previews, automatic milestone reports, and a 24/7 campaign chatbot — all running on your own machine with no external API keys.

---

## Features


| Feature                         | Description                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------- |
| **On-chain Campaigns**          | Create, fund, update, and delete campaigns via Ethereum smart contracts         |
| **AI Impact Translation**       | See the real-world impact of your exact ETH donation before you send it         |
| **Milestone Tracking**          | Campaigns auto-progress through phases; AI generates a milestone report at each |
| **AI Campaign Chatbot**         | Ask anything about a campaign and get an instant answer, 24/7                   |
| **Thermometer Chart**           | Animated liquid-fill progress bar showing funding progress                      |
| **Circular Milestone Gauges**   | Phase-by-phase visual breakdown of campaign milestones                          |
| **Featured Campaign**           | Home page spotlights the highest-funded active campaign                         |
| **Dark / Light / System theme** | Full theme support persisted to localStorage                                    |
| **Wallet connect**              | MetaMask and all thirdweb-supported wallets                                     |


---

## Tech Stack


| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| Frontend        | React 18, Vite, Tailwind CSS             |
| Web3            | thirdweb SDK, ethers.js                  |
| Smart contracts | Solidity 0.8, Ethereum (Sepolia testnet) |
| AI              | Ollama (local, no external API)          |
| HTTP client     | axios                                    |


---

## Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- [MetaMask](https://metamask.io) browser extension
- [Ollama](https://ollama.ai) installed and running

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/sentinel.git
cd sentinel/client
npm install
```

### 2. Set up Ollama

```bash
# Pull a model that fits your available RAM:
ollama pull qwen2:0.5b   # ~400 MB RAM  (recommended for most machines)
# ollama pull tinyllama  # ~600 MB RAM  (fallback)
# ollama pull llama3.2:1b               # ~1.3 GB RAM

# Ollama starts automatically on install.
# If it's not running, start it manually:
ollama serve
```

> **Note:** Sentinel proxies all Ollama requests through the Vite dev server (`/ollama/`*), so no CORS configuration is needed.

### 3. Start the dev server

```bash
# inside client/
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
sentinel/
├── client/                  # React frontend
│   ├── src/
│   │   ├── assets/          # Icons, images, fonts
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Global state (campaigns, wallet, theme)
│   │   ├── pages/           # Route-level page components
│   │   └── services/        # ollamaService.js, milestoneService.js
│   ├── vite.config.js       # Vite + Ollama proxy config
│   └── tailwind.config.js
└── web3/                    # Hardhat project
    ├── contracts/
    │   └── CrowdFunding.sol  # Main smart contract
    └── hardhat.config.js
```

---

## Smart Contract

The `CrowdFunding` contract is deployed on the **Sepolia testnet**:

```
0x5CaD357cBb507f27121ba1B414d198b6C04b69fD
```

Key functions:


| Function                  | Description                    |
| ------------------------- | ------------------------------ |
| `createCampaign(...)`     | Create a new campaign          |
| `donateToCampaign(id)`    | Donate ETH to a campaign       |
| `withdrawDonations(id)`   | Campaign owner withdraws funds |
| `updateCampaign(id, ...)` | Edit an existing campaign      |
| `deleteCampaign(id)`      | Remove a campaign              |
| `getCampaigns()`          | Fetch all campaigns            |
| `getDonators(id)`         | Get donor list for a campaign  |


---

## AI Features

All AI features run locally through Ollama — no accounts, no API keys, no data leaves your machine.

### Changing the model

The default model is `qwen2:0.5b`. To use a different one, set the environment variable before starting the dev server:

```bash
VITE_OLLAMA_MODEL=llama3.2:1b npm run dev
```

Or update the default directly in `client/src/services/ollamaService.js`.

### How the proxy works

Vite forwards `/ollama/*` → `http://localhost:11434` at the dev-server level, so the browser never makes a cross-origin request:

```js
// vite.config.js
proxy: {
  '/ollama': {
    target: 'http://localhost:11434',
    rewrite: (path) => path.replace(/^\/ollama/, ''),
  }
}
```

---

## Troubleshooting

**Chatbot shows "AI offline"**

```bash
# Check Ollama is running
ollama list

# Start it if not
ollama serve
```

**"model requires more system memory"**

Your machine doesn't have enough free RAM for the selected model. Pull a smaller one:

```bash
ollama pull qwen2:0.5b
```

Then update `VITE_OLLAMA_MODEL` or the default in `ollamaService.js`.

**Blank campaign image**

Campaigns with missing or broken image URLs automatically fall back to the platform's featured background image.

`**campaigns.reduce is not a function`**

The blockchain contract hasn't loaded yet. This is now guarded in the codebase — `campaigns` always defaults to `[]` before the contract responds.

---

## Contributing

1. Fork the repo and create a feature branch
2. Follow the existing component and service patterns
3. Test against the Sepolia testnet
4. Open a pull request

---

## License

[MIT](client/LICENSE.md)