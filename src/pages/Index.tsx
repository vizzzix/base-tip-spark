import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Zap, Award, TrendingUp, Users, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreatorCard } from '@/components/creator/CreatorCard';
import { NetworkWarning } from '@/components/NetworkWarning';
import { LiveIndicator } from '@/components/LiveIndicator';
import { useAllCreators, useGlobalStats } from '@/hooks/useOnChainCreators';
import { useCreatorEvents } from '@/hooks/useCreatorEvents';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { creatorsStore } from '@/lib/creators-store';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

const Index = () => {
  const [forceRefresh, setForceRefresh] = useState(false);
  const { data: allCreators, isLoading: creatorsLoading, error: creatorsError, refetch: refetchCreators } = useAllCreators(forceRefresh);
  const { data: creatorEvents, isLoading: eventsLoading, error: eventsError } = useCreatorEvents();
  const { data: globalStats, isLoading: statsLoading, refetch: refetchStats } = useGlobalStats(forceRefresh);
  const { isListening } = useRealTimeUpdates();
  
  // Get demo creators from store
  let demoCreators = creatorsStore.getAll();
  
  // Force initialize if no data
  if (demoCreators.length === 0) {
    console.log('No demo creators found, force initializing...');
    creatorsStore.forceInitialize();
    demoCreators = creatorsStore.getAll();
    console.log('Force initialized creators length:', demoCreators.length);
  }
  
  // Debug demo creators
  console.log('=== Demo Creators Debug ===');
  console.log('Demo creators length:', demoCreators.length);
  console.log('First demo creator:', demoCreators[0]);
  console.log('==========================');
  
  // Use creator events if available, otherwise fall back to allCreators
  // Limit blockchain creators to prevent too many from being loaded
  const rawBlockchainCreators = creatorEvents && creatorEvents.length > 0 ? creatorEvents : allCreators || [];
  const blockchainCreators = rawBlockchainCreators.slice(0, 50); // Limit to 50 blockchain creators
  
  // Combine blockchain creators with demo creators
  // Convert demo creators to match the expected format
  const demoCreatorsFormatted = demoCreators.map(creator => ({
    slug: `demo-${creator.slug}`, // Add demo prefix to avoid conflicts
    name: creator.name,
    bio: creator.bio || '',
    avatar: creator.avatarUrl,
    category: creator.category,
    totalTipsUSD: creator.metrics.totalTipsUSD,
    supporters: creator.metrics.supporters,
    address: creator.payoutAddress, // Add address for compatibility
  }));
  
  // Merge blockchain and demo creators, prioritizing blockchain data
  const allCreatorsCombined = [...blockchainCreators];
  
  // Add demo creators that are not already in blockchain (limit to 20)
  demoCreatorsFormatted.slice(0, 20).forEach(demoCreator => {
    const existsInBlockchain = blockchainCreators.some(bc => 
      bc.slug === demoCreator.slug || 
      bc.address === demoCreator.address ||
      bc.name === demoCreator.name
    );
    if (!existsInBlockchain) {
      allCreatorsCombined.push(demoCreator);
    }
  });
  
  const creators = useMemo(() => allCreatorsCombined, [allCreatorsCombined]);
  const featuredCreators = useMemo(() => creators.slice(0, 6), [creators]);
  
  // Calculate stats from combined data
  const totalTips = creators?.reduce((sum, c) => {
    const tips = 'totalTipsUSD' in c ? c.totalTipsUSD : 0;
    return sum + tips;
  }, 0) || 0;
  const totalSupporters = creators?.reduce((sum, c) => {
    const supporters = 'supporters' in c ? c.supporters : 0;
    return sum + supporters;
  }, 0) || 0;
  const totalCreatorsCount = creators?.length || 0;
  
  // Debug logging
  console.log('=== Index Stats Debug ===');
  console.log('Creators length:', creators?.length);
  console.log('Total tips:', totalTips);
  console.log('Total supporters:', totalSupporters);
  console.log('First creator:', creators?.[0]);
  console.log('Demo creators from store:', demoCreators.length);
  console.log('First demo creator from store:', demoCreators[0]);
  console.log('Global stats:', globalStats);
  console.log('========================');
  
  // Use blockchain stats if available and non-zero, otherwise use calculated stats
  const displayStats = (globalStats && globalStats.totalTips > 0) ? {
    totalCreators: globalStats.totalCreators,
    totalTips: globalStats.totalTips,
    totalSupporters: globalStats.totalSupporters,
  } : {
    totalCreators: totalCreatorsCount,
    totalTips: totalTips,
    totalSupporters: totalSupporters,
  };
  const debugMode = window.location.search.includes("debug=true");

  const handleRefresh = () => {
    setForceRefresh(true);
    refetchCreators();
    refetchStats();
    // Reset force refresh after a short delay
    setTimeout(() => setForceRefresh(false), 1000);
  };

  const handleClearData = () => {
    console.log('Clearing all data and reinitializing...');
    localStorage.removeItem('basetip.creators');
    window.location.reload();
  };

  // Auto refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchCreators();
      refetchStats();
    }, 60000);
    return () => clearInterval(interval);
  }, [refetchCreators, refetchStats]);

  // Show loading state if either creators or events are loading
  const isLoading = creatorsLoading || eventsLoading;
  const hasError = creatorsError || eventsError;

  return (
    <div className="relative">
      {/* Network Warning */}
      <div className="container mx-auto px-4 pt-4">
        <NetworkWarning />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Support creators
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                on-chain
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl">
              Send tips on Base and earn collectible badges. Transparent, low-fee, community-first.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link to="/leaderboard">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Start tipping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/for-creators">
                <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                  For Creators
                </Button>
              </Link>
              {debugMode && (
                <Button size="lg" variant="destructive" onClick={handleClearData} className="w-full gap-2 sm:w-auto">
                  Clear Data & Reload
                </Button>
              )}
            </div>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 grid grid-cols-3 gap-8 text-center"
            >
              <div>
                <div className="text-2xl font-bold text-primary sm:text-3xl">
                  {statsLoading ? (
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  ) : (
                    displayStats.totalCreators
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Creators</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary sm:text-3xl">
                  {statsLoading ? (
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  ) : (
                    `$${displayStats.totalTips.toLocaleString()}`
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Tips</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary sm:text-3xl">
                  {statsLoading ? (
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  ) : (
                    displayStats.totalSupporters.toLocaleString()
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Supporters</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">How it works</h2>
            <p className="text-base text-muted-foreground sm:text-lg">Simple, transparent, on-chain</p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Choose Creator',
                description: 'Browse creators on Base',
              },
              {
                icon: Heart,
                title: 'Send Tip',
                description: 'Support with USDC/ETH',
              },
              {
                icon: Award,
                title: 'Earn Badges',
                description: 'Unlock NFT badges and climb levels',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
                    <div className="mb-4 rounded-2xl bg-accent p-3.5">
                      <step.icon className="h-7 w-7 text-accent-foreground" />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold sm:text-xl">{step.title}</h3>
                    <p className="text-sm text-muted-foreground sm:text-base">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="bg-muted/30 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Featured Creators</h2>
                  {debugMode && <LiveIndicator isLive={isListening} />}
                </div>
                <p className="text-base text-muted-foreground sm:text-lg">
                  Support amazing creators on Base
                </p>
              </div>
              {debugMode && (
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={creatorsLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${creatorsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading creators from blockchain...
              </div>
            </div>
          ) : hasError ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Failed to load creators from blockchain
              </p>
              <p className="text-sm text-muted-foreground">
                {hasError.message || 'Unknown error'}
              </p>
            </div>
          ) : featuredCreators.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No creators registered yet. Be the first to register!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCreators.map((creator, index) => (
                <CreatorCard key={creator.slug || creator.address} creator={creator} index={index} />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link to="/leaderboard">
              <Button variant="outline" size="lg" className="gap-2">
                View All Creators
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Badge System */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Earn Badges</h2>
            <p className="text-base text-muted-foreground sm:text-lg">Support creators to unlock NFT badges and climb supporter levels</p>
            <div className="mt-6">
              <Link to="/profile">
                <Button size="lg" variant="outline">
                  View My Profile
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { level: 'Supporter', amount: '$0+', icon: '❤️', color: 'bg-pink-100 text-pink-600' },
              { level: 'Fan', amount: '$500+', icon: '⭐', color: 'bg-blue-100 text-blue-600' },
              { level: 'VIP', amount: '$2,000+', icon: '⚡', color: 'bg-purple-100 text-purple-600' },
              { level: 'Champion', amount: '$5,000+', icon: '👑', color: 'bg-yellow-100 text-yellow-600' },
              { level: 'Legend', amount: '$10,000+', icon: '🏆', color: 'bg-orange-100 text-orange-600' },
              { level: 'Diamond', amount: '$25,000+', icon: '💎', color: 'bg-cyan-100 text-cyan-600' },
            ].map((badge, index) => (
              <motion.div
                key={badge.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md transition-shadow hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${badge.color}`}>
                      {badge.icon}
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold">{badge.level}</h3>
                    <p className="text-sm text-muted-foreground">{badge.amount} total tips</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Why BaseTip?</h2>
            <p className="text-base text-muted-foreground sm:text-lg">Built for Base</p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Transparent',
                description: 'Every transaction verifiable on Base',
              },
              {
                icon: Zap,
                title: 'Low Fees',
                description: '0.5% platform fee, fast L2 transactions',
              },
              {
                icon: Award,
                title: 'NFT Badges',
                description: 'Earn unique badges as you support',
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-md transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
                    <div className="mb-4 rounded-2xl bg-primary/10 p-3.5">
                      <benefit.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold sm:text-xl">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground sm:text-base">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
