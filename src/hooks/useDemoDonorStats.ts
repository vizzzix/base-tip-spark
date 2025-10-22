import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface DemoDonorStats {
  totalDonated: number;
  totalDonations: number;
  lastDonation: Date | null;
  badges: string[];
  referralEarnings: number;
  totalEarnings: number; // totalDonated + referralEarnings
}

const STORAGE_KEY = 'basetip.demo.donorStats';

function calculateBadges(totalDonated: number): string[] {
  const badges: string[] = [];
  
  if (totalDonated >= 0) badges.push('Supporter');
  if (totalDonated >= 500) badges.push('Fan');
  if (totalDonated >= 2000) badges.push('VIP');
  if (totalDonated >= 5000) badges.push('Champion');
  if (totalDonated >= 10000) badges.push('Legend');
  if (totalDonated >= 25000) badges.push('Diamond');
  
  return badges;
}

export function useDemoDonorStats() {
  const { address } = useAccount();
  const [stats, setStats] = useState<DemoDonorStats>({
    totalDonated: 0,
    totalDonations: 0,
    lastDonation: null,
    badges: [],
    referralEarnings: 0,
    totalEarnings: 0
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    if (!address) return;

    const stored = localStorage.getItem(`${STORAGE_KEY}.${address}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert lastDonation string back to Date object
        if (parsed.lastDonation) {
          parsed.lastDonation = new Date(parsed.lastDonation);
        }
        // Ensure new fields exist for backward compatibility
        parsed.referralEarnings = parsed.referralEarnings || 0;
        parsed.totalEarnings = (parsed.totalDonated || 0) + (parsed.referralEarnings || 0);
        setStats(parsed);
      } catch (error) {
        console.error('Error loading demo donor stats:', error);
      }
    }
  }, [address]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    if (!address) return;

    localStorage.setItem(`${STORAGE_KEY}.${address}`, JSON.stringify(stats));
  }, [address, stats]);

  const addDonation = (amount: number) => {
    console.log('useDemoDonorStats - addDonation called with amount:', amount);
    setStats(prev => {
      const newTotal = prev.totalDonated + amount;
      const newDonations = prev.totalDonations + 1;
      const newBadges = calculateBadges(newTotal);
      
      const newStats = {
        totalDonated: newTotal,
        totalDonations: newDonations,
        lastDonation: new Date(),
        badges: newBadges,
        referralEarnings: prev.referralEarnings,
        totalEarnings: newTotal + prev.referralEarnings
      };
      
      console.log('useDemoDonorStats - new stats:', newStats);
      return newStats;
    });
  };

  const addReferralEarning = (amount: number) => {
    console.log('useDemoDonorStats - addReferralEarning called with amount:', amount);
    setStats(prev => {
      const newReferralEarnings = prev.referralEarnings + amount;
      const newStats = {
        ...prev,
        referralEarnings: newReferralEarnings,
        totalEarnings: prev.totalDonated + newReferralEarnings
      };
      
      console.log('useDemoDonorStats - new referral stats:', newStats);
      return newStats;
    });
  };

  const resetStats = () => {
    setStats({
      totalDonated: 0,
      totalDonations: 0,
      lastDonation: null,
      badges: [],
      referralEarnings: 0,
      totalEarnings: 0
    });
  };

  return {
    stats,
    addDonation,
    addReferralEarning,
    resetStats
  };
}
