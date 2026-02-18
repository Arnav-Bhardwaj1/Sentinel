import React, { useState, useEffect } from 'react';
import ollamaService from '../services/ollamaService';

const ImpactTooltip = ({ amount, campaignData, visible }) => {
  const [impactMessage, setImpactMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible || !amount || parseFloat(amount) <= 0) return;

    const timer = setTimeout(() => {
      generateImpact();
    }, 600);

    return () => clearTimeout(timer);
  }, [amount, visible, campaignData]);

  const generateImpact = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const message = await ollamaService.generateImpactTranslation(amount, campaignData);
      setImpactMessage(message);
    } catch (err) {
      setError('Unable to generate impact message. Please ensure Ollama is running.');
      console.error('Impact generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!visible || !amount || parseFloat(amount) <= 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-[#f97316]/10 to-[#fb923c]/10 dark:from-[#f97316]/20 dark:to-[#fb923c]/20 rounded-xl border-2 border-[#f97316]/30 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="text-2xl">✨</div>
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-sm text-black dark:text-white mb-2">
            Your Impact
          </h4>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
              <p className="font-epilogue text-sm text-[#4d4d4d] dark:text-[#808191]">
                Calculating your impact...
              </p>
            </div>
          ) : error ? (
            <p className="font-epilogue text-sm text-red-500">{error}</p>
          ) : (
            <p className="font-epilogue text-sm text-[#4d4d4d] dark:text-[#808191] leading-relaxed">
              {impactMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImpactTooltip;
