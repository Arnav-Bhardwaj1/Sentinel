// AI Service for Impact Translation and Milestone Storytelling
import { ethers } from "ethers";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

class AIService {
  constructor() {
    this.cache = new Map();
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  // Generate impact translation for donation amount
  async generateImpactTranslation(amount, campaign) {
    const cacheKey = `impact_${campaign.id}_${amount}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const prompt = `You are helping donors understand the tangible impact of their donation.

Campaign: ${campaign.title}
Category: ${campaign.category}
Description: ${campaign.description}
Donation Amount: ${amount} ETH

Generate a short, inspiring message (max 2 sentences) that explains what this specific donation amount will accomplish. Be concrete and specific. Include a relevant emoji. Focus on real-world impact.

Example format: "Your ${amount} ETH contribution will provide 3 solar lamps for the student dormitory, bringing light to evening study sessions! ☀️"`;

    try {
      const response = await this.callAI(prompt);
      this.cache.set(cacheKey, response);
      return response;
    } catch (error) {
      console.error("Error generating impact translation:", error);
      return `Your ${amount} ETH donation will make a meaningful difference in ${campaign.category}! 🌟`;
    }
  }

  // Generate milestone progress report
  async generateMilestoneReport(campaign, milestone, donors) {
    const prompt = `You are creating an a