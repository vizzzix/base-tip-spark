import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DonorBadge, DONOR_LEVELS } from '@/components/DonorBadge';
import { useDemoDonorStats } from '@/hooks/useDemoDonorStats';
import { ReferralSection } from '@/components/ReferralSection';
import { DollarSign, Heart, Trophy, Calendar, Users, Star, Zap, Crown, Gem, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function DonorProfile() {
  const { stats: donorStats } = useDemoDonorStats();
  
  console.log('DonorProfile - donorStats:', donorStats);


  if (!donorStats || donorStats.totalDonated === 0) {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mb-3 text-2xl font-bold">Welcome to BaseTip!</h2>
              <p className="mb-6 text-muted-foreground max-w-md mx-auto">
                Start your journey as a supporter! Send tips to creators and earn exclusive NFT badges that showcase your support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/leaderboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="w-full sm:w-auto">
                      <Heart className="mr-2 h-4 w-4" />
                      Explore Creators
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0.4)",
                        "0 0 0 10px rgba(59, 130, 246, 0)",
                        "0 0 0 0 rgba(59, 130, 246, 0)"
                      ]
                    }}
                    transition={{ 
                      boxShadow: { 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Send First Tip
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Badge Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Earn Badges by Supporting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DONOR_LEVELS.slice(0, 6).map((level, index) => {
                const Icon = level.icon;
                return (
                  <motion.div
                    key={level.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md ${
                      level.name === 'Supporter' 
                        ? `${level.bgColor} ${level.color} border-current` 
                        : 'bg-muted/50 text-muted-foreground border-muted'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${level.name === 'Supporter' ? '' : 'opacity-50'}`} />
                    <div className="flex-1">
                      <div className="font-medium">{level.name}</div>
                      <div className="text-sm opacity-75">
                        {level.name === 'Supporter' ? 'Start here!' : `$${level.minAmount.toLocaleString()}+`}
                      </div>
                    </div>
                    {level.name === 'Supporter' && (
                      <Badge variant="secondary" className="text-xs">
                        First Badge
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Each badge represents your journey as a supporter. The more you give, the higher you climb!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span>Start with any amount to earn your first Supporter badge</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
              <p className="text-sm text-muted-foreground">Be part of the growing BaseTip ecosystem</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">19+</div>
                <div className="text-xs text-muted-foreground">Creators</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">$50K+</div>
                <div className="text-xs text-muted-foreground">Tips Sent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Supporters</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Find Creators</h3>
                <p className="text-sm text-muted-foreground">
                  Browse the leaderboard to discover amazing creators
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Send Tips</h3>
                <p className="text-sm text-muted-foreground">
                  Support creators with USDC or try our demo mode
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Earn Badges</h3>
                <p className="text-sm text-muted-foreground">
                  Unlock exclusive NFT badges as you support more
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Section */}
        <ReferralSection />
      </div>
    );
  }

  const currentLevel = DONOR_LEVELS.find(level => 
    donorStats.totalDonated >= level.minAmount
  ) || DONOR_LEVELS[0];

  const nextLevel = DONOR_LEVELS.find(level => 
    level.minAmount > donorStats.totalDonated
  );

  const progress = nextLevel 
    ? ((donorStats.totalDonated - currentLevel.minAmount) / (nextLevel.minAmount - currentLevel.minAmount)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Supporter Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                ${donorStats.totalDonated.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Donated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {donorStats.totalDonations}
              </div>
              <div className="text-sm text-muted-foreground">Total Tips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                +${donorStats.referralEarnings.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Referral Earnings</div>
            </div>
          </div>

          {/* Current Badge */}
          <div className="flex justify-center">
            <DonorBadge totalTips={donorStats.totalDonated} size="lg" />
          </div>

          {/* Progress to Next Level */}
          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextLevel.name}</span>
                <span>${(nextLevel.minAmount - donorStats.totalDonated).toFixed(0)} to go</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div 
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Last Donation */}
          {donorStats.lastDonation && donorStats.lastDonation instanceof Date && !isNaN(donorStats.lastDonation.getTime()) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last tip: {donorStats.lastDonation.toLocaleDateString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {DONOR_LEVELS.map((level) => {
              const isEarned = donorStats.badges.includes(level.name);
              const Icon = level.icon;
              
              return (
                <motion.div
                  key={level.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isEarned 
                      ? `${level.bgColor} ${level.color} border-current` 
                      : 'bg-muted/50 text-muted-foreground border-muted'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isEarned ? '' : 'opacity-50'}`} />
                  <div className="flex-1">
                    <div className="font-medium">{level.name}</div>
                    <div className="text-xs opacity-75">
                      {isEarned ? 'Earned!' : `$${level.minAmount}+`}
                    </div>
                  </div>
                  {isEarned && (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-green-900 dark:text-green-100">
                  {donorStats.totalDonations} {donorStats.totalDonations === 1 ? 'Tip' : 'Tips'} Sent
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  You've supported {donorStats.totalDonations} {donorStats.totalDonations === 1 ? 'creator' : 'creators'}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-blue-900 dark:text-blue-100">
                  ${donorStats.totalDonated.toFixed(2)} Total
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {donorStats.referralEarnings > 0 && `+$${donorStats.referralEarnings.toFixed(2)} from referrals`}
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Section */}
      <ReferralSection />
    </div>
  );
}
