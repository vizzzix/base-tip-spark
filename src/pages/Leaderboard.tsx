import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Users, DollarSign, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkWarning } from '@/components/NetworkWarning';
import { LiveIndicator } from '@/components/LiveIndicator';
import { useAllCreators, useGlobalStats } from '@/hooks/useOnChainCreators';
import { useCreatorEvents } from '@/hooks/useCreatorEvents';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { creatorsStore } from '@/lib/creators-store';
import { DonorBadge } from '@/components/DonorBadge';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

const Leaderboard = () => {
  const [forceRefresh, setForceRefresh] = useState(false);
  const { data: allCreators, isLoading: creatorsLoading, error: creatorsError, refetch: refetchCreators } = useAllCreators(forceRefresh);
  const { data: creatorEvents, isLoading: eventsLoading, error: eventsError } = useCreatorEvents();
  const { data: globalStats, isLoading: isStatsLoading, error: statsError, refetch: refetchStats } = useGlobalStats(forceRefresh);
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
  console.log('=== Leaderboard Demo Creators Debug ===');
  console.log('Demo creators length:', demoCreators.length);
  console.log('First demo creator:', demoCreators[0]);
  console.log('=======================================');
  
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
  const limitedDemoCreators = demoCreatorsFormatted.slice(0, 20);
  console.log('Limited demo creators count:', limitedDemoCreators.length);
  
  limitedDemoCreators.forEach(demoCreator => {
    const existsInBlockchain = blockchainCreators.some(bc => 
      bc.slug === demoCreator.slug || 
      bc.address === demoCreator.address ||
      bc.name === demoCreator.name
    );
    if (!existsInBlockchain) {
      allCreatorsCombined.push(demoCreator);
    } else {
      console.log('Demo creator already exists in blockchain:', demoCreator.name);
    }
  });
  
  console.log('Final creators count:', allCreatorsCombined.length);
  
  const creators = useMemo(() => allCreatorsCombined, [allCreatorsCombined]);
  const [filteredCreators, setFilteredCreators] = useState(creators);
  
  // Debug logging
  console.log('=== Leaderboard Debug ===');
  console.log('Blockchain creators:', blockchainCreators.length);
  console.log('Demo creators from store:', demoCreators.length);
  console.log('Demo creators formatted (limited to 20):', demoCreatorsFormatted.slice(0, 20).length);
  console.log('Total creators after merge:', creators.length);
  console.log('First 5 creators:', creators.slice(0, 5).map(c => ({ name: c.name, slug: c.slug, isDemo: c.slug?.startsWith('demo-') })));
  console.log('========================');
  const debugMode = window.location.search.includes("debug=true");

  const handleRefresh = () => {
    setForceRefresh(true);
    refetchCreators();
    refetchStats();
    // Reset force refresh after a short delay
    setTimeout(() => setForceRefresh(false), 1000);
  };

  // Auto refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchCreators();
      refetchStats();
    }, 60000);
    return () => clearInterval(interval);
  }, [refetchCreators, refetchStats]);


  useEffect(() => {
    if (creators && creators.length > 0) {
      const sortedCreators = [...creators].sort((a, b) => {
        const aTips = 'totalTipsUSD' in a ? a.totalTipsUSD : 0;
        const bTips = 'totalTipsUSD' in b ? b.totalTipsUSD : 0;
        return bTips - aTips;
      });
      setFilteredCreators(sortedCreators);
    }
  }, [creators.length]); // Only depend on length to prevent infinite loops

  const handleFilterChange = (value: string) => {
    // For now, just show all creators since we don't have time-based filtering
    // In a real implementation, you'd filter based on the selected time period
    if (creators && creators.length > 0) {
      const sortedCreators = [...creators].sort((a, b) => {
        const aTips = 'totalTipsUSD' in a ? a.totalTipsUSD : 0;
        const bTips = 'totalTipsUSD' in b ? b.totalTipsUSD : 0;
        return bTips - aTips;
      });
      setFilteredCreators(sortedCreators);
    }
  };

  const totalTips = creators?.reduce((sum, c) => {
    const tips = 'totalTipsUSD' in c ? c.totalTipsUSD : 0;
    return sum + tips;
  }, 0) || 0;
  const totalSupporters = creators?.reduce((sum, c) => {
    const supporters = 'supporters' in c ? c.supporters : 0;
    return sum + supporters;
  }, 0) || 0;
  const totalCreatorsCount = creators?.length || 0;
  
  // Debug stats calculation
  console.log('=== Stats Debug ===');
  console.log('Total tips calculated:', totalTips);
  console.log('Total supporters calculated:', totalSupporters);
  console.log('Total creators count:', totalCreatorsCount);
  console.log('Global stats:', globalStats);
  console.log('==================');
  
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

  return (
    <div className="py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Network Warning */}
        <NetworkWarning />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold sm:text-5xl">Leaderboard</h1>
                {debugMode && <LiveIndicator isLive={isListening} />}
              </div>
              <p className="text-lg text-muted-foreground">
                Top creators on BaseTip
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {isStatsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    displayStats.totalCreators
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Creators</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {isStatsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    `$${displayStats.totalTips.toLocaleString()}`
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Tips</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {isStatsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    displayStats.totalSupporters.toLocaleString()
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Supporters</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Tabs defaultValue="all" className="w-full" onValueChange={handleFilterChange}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Creator</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Category</th>
                      <th className="px-6 py-4 text-right text-sm font-medium">Total Tips</th>
                      <th className="px-6 py-4 text-right text-sm font-medium">Supporters</th>
                      <th className="px-6 py-4 text-right text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(creatorsLoading || eventsLoading) ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          Loading creators from blockchain...
                        </td>
                      </tr>
                    ) : (creatorsError || eventsError) ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          <p className="mb-2">Failed to load creators from blockchain</p>
                          <p className="text-sm text-red-500">{(creatorsError || eventsError)?.message || 'Unknown error'}</p>
                        </td>
                      </tr>
                    ) : filteredCreators.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          No creators registered yet. Be the first to register!
                        </td>
                      </tr>
                    ) : (
                      filteredCreators.map((creator, index) => {
                        const isFromEvent = creator.slug && !creator.slug.startsWith('demo-');
                        const avatarUrl = creator.avatar || creator.avatarUrl;
                        const category = creator.category || 'Creator';
                        const totalTips = creator.totalTipsUSD || 0;
                        const supporters = creator.supporters || 0;
                        
                        return (
                        <motion.tr
                          key={`${creator.slug || creator.address}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-muted/50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                              {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                              {index === 2 && <Trophy className="h-5 w-5 text-amber-600" />}
                              <span className="font-bold">#{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={avatarUrl}
                                alt={creator.name}
                                className="h-10 w-10 rounded-full border-2 border-primary/20"
                              />
                              <div>
                                <div className="font-medium">{creator.name}</div>
                                <div className="text-sm text-muted-foreground">@{creator.slug?.replace('demo-', '') || creator.address?.slice(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary">{category}</Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-primary">
                            ${totalTips.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">{supporters}</td>
                          <td className="px-6 py-4 text-right">
                            <Link to={`/creator/${creator.slug}`}>
                              <Button size="sm" variant="outline">
                                Tip
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {filteredCreators.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground mb-4">No creators found</p>
            <Link to="/create">
              <Button>Create Your Page</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;