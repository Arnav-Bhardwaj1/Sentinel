// Ollama AI Service for all AI-powered features
import axios from 'axios';

const OLLAMA_BASE = '/ollama';
const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || `${OLLAMA_BASE}/api/generate`;
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'qwen2:0.5b';

class OllamaService {
  constructor() {
    this.baseURL = OLLAMA_URL;
    this.model = MODEL;
    this.cache = new Map();
  }

  async checkHealth() {
    try {
      const res = await axios.get(`${OLLAMA_BASE}/api/tags`, { timeout: 4000 });
      const models = res.data?.models ?? [];
      const available = models.some((m) => m.name?.startsWith(MODEL.split(':')[0]));
      return { online: true, modelReady: available, models };
    } catch {
      return { online: false, modelReady: false, models: [] };
    }
  }

  async generateResponse(prompt, useCache = true) {
    // Check cache first
    if (useCache && this.cache.has(prompt)) {
      return this.cache.get(prompt);
    }

    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: this.model,
          prompt: prompt,
          stream: false,
        },
        {
          timeout: 120000,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // Ollama may return an error payload with HTTP 200
      if (response.data?.error) {
        throw new Error(`Ollama error: ${response.data.error}`);
      }

      const result = response.data?.response;
      if (!result) {
        throw new Error(`Unexpected Ollama response: ${JSON.stringify(response.data)}`);
      }

      if (useCache) {
        this.cache.set(prompt, result);
      }

      return result;
    } catch (error) {
      const detail = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;
      console.error('Ollama API Error:', detail);
      throw new Error(detail);
    }
  }

  async generateImpactTranslation(amount, campaignData) {
    const prompt = `You are an AI assistant for Sentinel, a decentralized crowdfunding platform. A donor is contributing ${amount} ETH to a campaign titled "${campaignData.title}" in the ${campaignData.category} category.

Campaign Description: ${campaignData.description}
Target Amount: ${campaignData.target} ETH

Generate a short, inspiring message (max 2 sentences) that explains the tangible impact of this ${amount} ETH donation. Be specific and use relevant emojis. Focus on what this exact amount can accomplish.

Example format: "Your ${amount} ETH contribution will provide 3 solar lamps for the student dormitory! ☀️ This brings us closer to lighting up the entire facility."

Generate the impact message now:`;

    return await this.generateResponse(prompt, true);
  }

  async generateMilestoneReport(campaignData, milestone, totalDonors) {
    const prompt = `You are an AI content creator for Sentinel, a decentralized crowdfunding platform. Generate a compelling progress report for the following milestone achievement:

Campaign: ${campaignData.title}
Category: ${campaignData.category}
Milestone Reached: ${milestone.name} (${milestone.percentage}% of total goal)
Amount Raised: ${milestone.amountRaised} ETH
Total Donors: ${totalDonors}
Campaign Description: ${campaignData.description}

Create an engaging progress report (3-4 paragraphs) that:
1. Celebrates the milestone achievement
2. Thanks the donors for their contributions
3. Explains what this milestone means for the project
4. Builds excitement for the next phase

Use an inspiring and grateful tone. Include relevant emojis.`;

    return await this.generateResponse(prompt, false);
  }

  async answerDonorQuestion(question, campaignData) {
    const prompt = `INSTRUCTIONS: Reply in English only. Be factual, direct, and concise (1-3 sentences). Use only the data provided. No disclaimers.

Campaign: ${campaignData.title}
Goal: ${campaignData.target} ETH
Raised: ${campaignData.amountCollected} ETH
Days left: ${campaignData.daysLeft}
Description: ${campaignData.description}

Question: ${question}
English answer:`;

    return await this.generateResponse(prompt, false);
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new OllamaService();
