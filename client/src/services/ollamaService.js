// Ollama AI Service for all AI-powered features
import axios from 'axios';

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434/api/generate';
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2:3b';

class OllamaService {
  constructor() {
    this.baseURL = OLLAMA_URL;
    this.model = MODEL;
    this.cache = new Map();
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
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = response.data.response;
      
      // Cache the result
      if (useCache) {
        this.cache.set(prompt, result);
      }

      return result;
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw new Error('Failed to generate AI response. Please ensure Ollama is running.');
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
    const prompt = `You are a 24/7 AI assistant for a Sentinel campaign. Answer the donor's question based on the campaign information provided.

Campaign: ${campaignData.title}
Category: ${campaignData.category}
Target: ${campaignData.target} ETH
Amount Raised: ${campaignData.amountCollected} ETH
Days Left: ${campaignData.daysLeft}
Description: ${campaignData.description}

Donor Question: ${question}

Provide a helpful, concise answer (2-3 sentences max). If you cannot answer based on the available information, politely say so and suggest contacting the campaign creator.

Answer:`;

    return await this.generateResponse(prompt, false);
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new OllamaService();
