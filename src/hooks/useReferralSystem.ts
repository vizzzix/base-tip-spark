import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalReferralEarnings: number;
  referralStats: {
    [referralCode: string]: {
      count: number;
      totalEarnings: number;
      lastReferral: Date | null;
    };
  };
}

const REFERRAL_STORAGE_KEY = 'basetip.referralSystem';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function useReferralSystem() {
  const { address } = useAccount();
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: '',
    totalReferrals: 0,
    totalReferralEarnings: 0,
    referralStats: {}
  });

  // Load referral data from localStorage on mount
  useEffect(() => {
    if (!address) return;

    const stored = localStorage.getItem(`${REFERRAL_STORAGE_KEY}.${address}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert dates back to Date objects
        Object.keys(parsed.referralStats || {}).forEach(code => {
          if (parsed.referralStats[code].lastReferral) {
            parsed.referralStats[code].lastReferral = new Date(parsed.referralStats[code].lastReferral);
          }
        });
        setReferralData(parsed);
      } catch (error) {
        console.error('Error loading referral data:', error);
        // Generate new referral code if loading fails
        generateNewReferralCode();
      }
    } else {
      // Generate new referral code for new users
      generateNewReferralCode();
    }
  }, [address]);

  // Save referral data to localStorage whenever it changes
  useEffect(() => {
    if (!address || !referralData.referralCode) return;

    localStorage.setItem(`${REFERRAL_STORAGE_KEY}.${address}`, JSON.stringify(referralData));
  }, [address, referralData]);

  const generateNewReferralCode = () => {
    const newCode = generateReferralCode();
    setReferralData(prev => ({
      ...prev,
      referralCode: newCode
    }));
  };

  const getReferralLink = () => {
    if (!referralData.referralCode) return '';
    return `${window.location.origin}/?ref=${referralData.referralCode}`;
  };

  const addReferralEarning = (referralCode: string, donationAmount: number) => {
    const referralEarning = donationAmount * 0.05; // 5% of donation
    
    setReferralData(prev => {
      const newStats = { ...prev.referralStats };
      
      if (!newStats[referralCode]) {
        newStats[referralCode] = {
          count: 0,
          totalEarnings: 0,
          lastReferral: null
        };
      }
      
      newStats[referralCode] = {
        ...newStats[referralCode],
        count: newStats[referralCode].count + 1,
        totalEarnings: newStats[referralCode].totalEarnings + referralEarning,
        lastReferral: new Date()
      };
      
      return {
        ...prev,
        totalReferrals: prev.totalReferrals + 1,
        totalReferralEarnings: prev.totalReferralEarnings + referralEarning,
        referralStats: newStats
      };
    });
  };

  // Function to process referral earning for the referrer
  const processReferralEarning = (referralCode: string, donationAmount: number) => {
    // Find the referrer by their code and add earnings
    // This would typically involve finding the referrer's address and updating their stats
    // For demo purposes, we'll just log it
    console.log(`Processing referral earning for code ${referralCode}: $${donationAmount * 0.05}`);
    
    // In a real app, you'd find the referrer's address and update their stats
    // For now, we'll just add to current user's stats if they have this referral code
    if (referralData.referralCode === referralCode) {
      addReferralEarning(referralCode, donationAmount);
    }
  };

  const copyReferralLink = async () => {
    const link = getReferralLink();
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        return true;
      } catch (error) {
        console.error('Failed to copy referral link:', error);
        return false;
      }
    }
    return false;
  };

  return {
    referralData,
    getReferralLink,
    addReferralEarning,
    processReferralEarning,
    copyReferralLink,
    generateNewReferralCode
  };
}

// Hook to check if current user came from a referral link
export function useReferralCheck() {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferralCode(ref);
      // Store referral code in session storage for this session
      sessionStorage.setItem('referralCode', ref);
    }
  }, []);

  return referralCode;
}
