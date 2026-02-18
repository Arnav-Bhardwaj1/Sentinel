// Milestone tracking and notification service
import ollamaService from './ollamaService';

class MilestoneService {
  constructor() {
    this.milestoneCache = new Map();
  }

  // Define default milestones for a campaign
  getDefaultMilestones(target) {
    return [
      {
        name: 'Phase 1: Planning & Logistics',
        percentage: 25,
        target: (parseFloat(target) * 0.25).toFixed(4),
        current: 0,
        reached: false,
      },
      {
        name: 'Phase 2: Foundation & Setup',
        percentage: 50,
        target: (parseFloat(target) * 0.5).toFixed(4),
        current: 0,
        reached: false,
      },
      {
        name: 'Phase 3: Implementation',
        percentage: 75,
        target: (parseFloat(target) * 0.75).toFixed(4),
        current: 0,
        reached: false,
      },
      {
        name: 'Phase 4: Completion',
        percentage: 100,
        target: parseFloat(target).toFixed(4),
        current: 0,
        reached: false,
      },
    ];
  }

  // Calculate milestone progress
  calculateMilestones(campaign) {
    const milestones = this.getDefaultMilestones(campaign.target);
    const currentAmount = parseFloat(campaign.amountCollected);

    return milestones.map((milestone) => ({
      ...milestone,
      current: Math.min(currentAmount, parseFloat(milestone.target)).toFixed(4),
      reached: currentAmount >= parseFloat(milestone.target),
    }));
  }

  // Check if a new milestone was reached
  checkMilestoneReached(campaignId, previousAmount, newAmount, target) {
    const milestones = this.getDefaultMilestones(target);
    const prevPercent = (parseFloat(previousAmount) / parseFloat(target)) * 100;
    const newPercent = (parseFloat(newAmount) / parseFloat(target)) * 100;

    for (const milestone of milestones) {
      if (prevPercent < milestone.percentage && newPercent >= milestone.percentage) {
        // New milestone reached!
        return milestone;
      }
    }

    return null;
  }

  // Generate milestone report using Ollama
  async generateMilestoneReport(campaignData, milestone, donors) {
    try {
      const report = await ollamaService.generateMilestoneReport(
        campaignData,
        {
          name: milestone.name,
          percentage: milestone.percentage,
          amountRaised: campaignData.amountCollected,
        },
        donors.length
      );

      return report;
    } catch (error) {
      console.error('Error generating milestone report:', error);
      return `🎉 Milestone Achieved: ${milestone.name}!\n\nThanks to ${donors.length} amazing donors, we've reached ${milestone.percentage}% of our goal! Your contributions are making a real difference. Stay tuned for updates as we continue toward our next milestone!`;
    }
  }

  // Simulate email notification (in production, this would call a backend API)
  async notifyDonors(donors, report, campaignTitle, milestoneName) {
    console.log('📧 Sending milestone notifications to donors...');
    console.log(`Campaign: ${campaignTitle}`);
    console.log(`Milestone: ${milestoneName}`);
    console.log(`Recipients: ${donors.length} donors`);
    console.log(`Report:\n${report}`);

    // In production, this would be an API call to your backend
    // which would handle actual email sending
    return {
      success: true,
      sent: donors.length,
      message: `Milestone notifications sent to ${donors.length} donors`,
    };
  }
}

export default new MilestoneService();
