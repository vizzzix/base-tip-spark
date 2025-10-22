import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { 
  Share2, 
  Copy, 
  Check, 
  Users, 
  DollarSign, 
  TrendingUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function ReferralSection() {
  const { 
    referralData, 
    getReferralLink, 
    copyReferralLink, 
    generateNewReferralCode 
  } = useReferralSystem();
  
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyReferralLink();
    if (success) {
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy referral link');
    }
  };

  const handleGenerateNewCode = async () => {
    setIsGenerating(true);
    generateNewReferralCode();
    toast.success('New referral code generated!');
    setTimeout(() => setIsGenerating(false), 1000);
  };

  const handleShare = async () => {
    const link = getReferralLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join BaseTip - Support Creators',
          text: 'Join me on BaseTip and start supporting amazing creators!',
          url: link
        });
      } catch (error) {
        console.error('Error sharing:', error);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-6">
      {/* Referral Code & Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg font-mono px-3 py-1">
              {referralData.referralCode}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateNewCode}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Referral Link</label>
            <div className="flex gap-2">
              <Input
                value={getReferralLink()}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                disabled={copied}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>How it works:</strong> Share your referral link with friends. 
              When they make their first donation, you'll earn 5% of their donation amount!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referral Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Referral Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-4 bg-primary/5 rounded-lg"
            >
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">
                {referralData.totalReferrals}
              </div>
              <div className="text-sm text-muted-foreground">Total Referrals</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg"
            >
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                ${referralData.totalReferralEarnings.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Earnings</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">
                {referralData.totalReferrals > 0 
                  ? (referralData.totalReferralEarnings / referralData.totalReferrals).toFixed(2)
                  : '0.00'
                }
              </div>
              <div className="text-sm text-muted-foreground">Avg. per Referral</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      {Object.keys(referralData.referralStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(referralData.referralStats)
                .sort(([,a], [,b]) => (b.lastReferral?.getTime() || 0) - (a.lastReferral?.getTime() || 0))
                .slice(0, 5)
                .map(([code, stats], index) => (
                  <motion.div
                    key={code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-mono">
                        {code}
                      </Badge>
                      <div>
                        <div className="text-sm font-medium">
                          {stats.count} donation{stats.count !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stats.lastReferral?.toLocaleDateString() || 'No donations yet'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        +${stats.totalEarnings.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Your earnings
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
