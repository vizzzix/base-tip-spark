import { useParams, Link } from 'react-router-dom';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { useState, useEffect } from 'react';
import { ExternalLink, Twitter, Github, Globe, Edit, DollarSign, Users, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { NetworkWarning } from '@/components/NetworkWarning';
import { useCreatorBySlug } from '@/hooks/useOnChainCreators';
import { creatorsStore } from '@/lib/creators-store';
import { DemoPayment } from '@/components/DemoPayment';
import { useDemoDonorStats } from '@/hooks/useDemoDonorStats';
import { CONTRACT_ADDR, USDC_ADDR, BASESCAN_TX, CREATOR_RECEIVES_PERCENTAGE, APP_CHAIN_ID } from '@/lib/config';
import { ERC20_ABI, BASETIP_ABI } from '@/lib/abi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { parseUnits, formatUnits } from 'viem';

const Creator = () => {
  const { slug } = useParams<{ slug: string }>();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { creator: blockchainCreator, isLoading: creatorLoading, error: creatorError } = useCreatorBySlug(slug || '');
  
  // Also check demo creators (handle both regular and demo- prefixed slugs)
  const originalSlug = slug?.startsWith('demo-') ? slug.replace('demo-', '') : slug;
  const demoCreator = creatorsStore.getBySlug(originalSlug || '');
  
  // Use blockchain creator if available, otherwise use demo creator
  const creator = blockchainCreator || (demoCreator ? {
    wallet: demoCreator.payoutAddress,
    name: demoCreator.name,
    bio: demoCreator.bio || '',
    avatar: demoCreator.avatarUrl,
    isActive: true, // Demo creators are always active
    totalTipsReceived: BigInt(Math.floor(demoCreator.metrics.totalTipsUSD * 1000000)), // Convert to wei
    supporterCount: BigInt(demoCreator.metrics.supporters),
    totalTipsUSD: demoCreator.metrics.totalTipsUSD,
    supporters: demoCreator.metrics.supporters,
    slug: demoCreator.slug,
    category: demoCreator.category,
    suggestedAmounts: demoCreator.suggestedAmounts,
    payoutAddress: demoCreator.payoutAddress,
    ownerAddress: demoCreator.ownerAddress,
    createdAt: demoCreator.createdAt,
    socials: demoCreator.socials,
  } : null);
  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isTipping, setIsTipping] = useState(false);
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  
  // Demo donor stats
  const { stats: demoStats, addDonation, addReferralEarning } = useDemoDonorStats();
  const [isRegistering, setIsRegistering] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Update last updated time when creator data changes
  useEffect(() => {
    if (creator) {
      setLastUpdatedTime(new Date().toLocaleTimeString());
    }
  }, [creator]);

  // Refetch function for after transactions
  const refetchCreator = () => {
    // This will be handled by React Query's refetch
  };

  // Read USDC balance
  const { data: usdcBalance, isLoading: isUsdcBalanceLoading, error: usdcBalanceError } = useReadContract({
    address: USDC_ADDR as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address && chainId === APP_CHAIN_ID ? [address] : undefined,
  });

  // Read allowance
  const { data: allowance } = useReadContract({
    address: USDC_ADDR as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && CONTRACT_ADDR ? [address, CONTRACT_ADDR as `0x${string}`] : undefined,
  });

  // Read supporter total tipped
  const { data: supporterTotal } = useReadContract({
    address: CONTRACT_ADDR as `0x${string}`,
    abi: BASETIP_ABI,
    functionName: 'getSupporterTotalTipped',
    args: address ? [address] : undefined,
  });

  // Write contracts
  const { writeContract: writeApprove } = useWriteContract();
  const { writeContract: writeTip } = useWriteContract();

  // Wait for transaction receipts
  const { isLoading: isApprovePending, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: undefined, // Will be set when transaction is submitted
  });

  const { isLoading: isTipPending, isSuccess: isTipSuccess } = useWaitForTransactionReceipt({
    hash: undefined, // Will be set when transaction is submitted
  });

  // No need for useEffect since we're using the hook

  if (creatorLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading creator from blockchain...</span>
            </div>
            <p className="text-muted-foreground">
              Fetching creator data from Base Sepolia
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (creatorError || !creator) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Creator Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              {creatorError ? 'Failed to load creator from blockchain' : 'This creator page doesn\'t exist yet.'}
            </p>
            {creatorError && (
              <p className="mb-4 text-sm text-red-500">
                {creatorError.message || 'Unknown error'}
              </p>
            )}
            <Link to="/leaderboard">
              <Button>Explore Creators</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = address?.toLowerCase() === creator.ownerAddress?.toLowerCase();
  const platformFee = tipAmount ? (Number(tipAmount) * 0.5) / 100 : 0;
  const creatorReceives = tipAmount ? Number(tipAmount) - platformFee : 0;
  const tipAmountWei = tipAmount ? parseUnits(tipAmount, 6) : 0n; // USDC has 6 decimals
  const hasEnoughAllowance = allowance && tipAmountWei ? allowance >= tipAmountWei : false;
  const hasEnoughBalance = usdcBalance && tipAmountWei ? usdcBalance >= tipAmountWei : false;

  // Debug logging
  console.log('=== USDC Balance Debug ===');
  console.log('Is Connected:', isConnected);
  console.log('Address:', address);
  console.log('Chain ID:', chainId);
  console.log('Expected Chain ID:', APP_CHAIN_ID);
  console.log('USDC Address:', USDC_ADDR);
  console.log('USDC Balance Raw:', usdcBalance?.toString());
  console.log('USDC Balance Formatted:', usdcBalance ? formatUnits(usdcBalance, 6) : 'undefined');
  console.log('Is USDC Balance Loading:', isUsdcBalanceLoading);
  console.log('USDC Balance Error:', usdcBalanceError);
  console.log('Error Details:', usdcBalanceError?.message);
  console.log('Error Stack:', usdcBalanceError?.stack);
  console.log('Tip Amount:', tipAmount);
  console.log('Tip Amount Wei:', tipAmountWei.toString());
  console.log('Has Enough Balance:', hasEnoughBalance);
  console.log('========================');

  const handleApprove = async () => {
    if (!tipAmount || Number(tipAmount) <= 0) {
      toast.error('Please enter a valid tip amount');
      return;
    }

    if (!hasEnoughBalance) {
      toast.error('Insufficient USDC balance');
      return;
    }

    setIsApproving(true);
    try {
      console.log('=== Approve Transaction Debug ===');
      console.log('USDC Address:', USDC_ADDR);
      console.log('Contract Address:', CONTRACT_ADDR);
      console.log('Tip Amount Wei:', tipAmountWei.toString());
      console.log('User Address:', address);
      console.log('===============================');

      const hash = await writeApprove({
        address: USDC_ADDR as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDR as `0x${string}`, tipAmountWei],
      });

      console.log('Approve transaction hash:', hash);
      toast.success('Approval transaction submitted', {
        action: {
          label: 'View on BaseScan',
          onClick: () => window.open(BASESCAN_TX(hash), '_blank'),
        },
      });
    } catch (error: any) {
      console.error('Approve error:', error);
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction rejected by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient ETH for gas fees');
      } else {
        toast.error(`Failed to approve USDC: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsApproving(false);
    }
  };

  const handleTip = async () => {
    if (!tipAmount || Number(tipAmount) <= 0) {
      toast.error('Please enter a valid tip amount');
      return;
    }

    if (!hasEnoughBalance) {
      toast.error('Insufficient USDC balance');
      return;
    }

    if (!hasEnoughAllowance) {
      toast.error('Please approve USDC spending first');
      return;
    }

    // Check if creator is registered on-chain
    if (!creator.isActive) {
      toast.error('Creator is not registered on-chain. Please register first.');
      return;
    }

    setIsTipping(true);
    try {
      console.log('=== Tip Transaction Debug ===');
      console.log('Contract Address:', CONTRACT_ADDR);
      console.log('Creator Address:', creator.payoutAddress);
      console.log('Tip Amount Wei:', tipAmountWei.toString());
      console.log('Tip Message:', tipMessage || '');
      console.log('User Address:', address);
      console.log('============================');

      const hash = await writeTip({
        address: CONTRACT_ADDR as `0x${string}`,
        abi: BASETIP_ABI,
        functionName: 'sendTip',
        args: [creator.payoutAddress as `0x${string}`, tipAmountWei, tipMessage || ''],
      });

      console.log('Tip transaction hash:', hash);
      toast.success('Tip transaction submitted!', {
        action: {
          label: 'View on BaseScan',
          onClick: () => window.open(BASESCAN_TX(hash), '_blank'),
        },
      });

      // Reset form
      setTipAmount('');
      setTipMessage('');
      
      // Refresh data
      refetchCreator();
    } catch (error: any) {
      console.error('Tip error:', error);
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction rejected by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient ETH for gas fees');
      } else if (error.message?.includes('execution reverted')) {
        toast.error('Transaction failed: Creator may not be registered or other contract error');
      } else {
        toast.error(`Failed to send tip: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsTipping(false);
    }
  };

  const handleTipWithCard = () => {
    toast.info('Card payments via Coinbase Commerce coming soon!');
  };

  const handleRegisterCreator = async () => {
    if (!isOwner) {
      toast.error('Only the creator can register this profile');
      return;
    }

    setIsRegistering(true);
    try {
      console.log('=== Register Creator Debug ===');
      console.log('Contract Address:', CONTRACT_ADDR);
      console.log('Creator Name:', creator.name);
      console.log('Creator Bio:', creator.bio);
      console.log('Creator Avatar:', creator.avatarUrl);
      console.log('User Address:', address);
      console.log('=============================');

      const hash = await writeTip({
        address: CONTRACT_ADDR as `0x${string}`,
        abi: BASETIP_ABI,
        functionName: 'registerCreator',
        args: [creator.name, creator.bio || '', creator.avatarUrl || ''],
      });

      console.log('Register creator transaction hash:', hash);
      toast.success('Creator registration submitted!', {
        action: {
          label: 'View on BaseScan',
          onClick: () => window.open(BASESCAN_TX(hash), '_blank'),
        },
      });

      // Refresh data
      refetchCreator();
    } catch (error: any) {
      console.error('Register creator error:', error);
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction rejected by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient ETH for gas fees');
      } else {
        toast.error(`Failed to register creator: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Creator data is already from on-chain, no need to merge
  const displayCreator = creator;

  return (
    <div className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Network Warning */}
        <NetworkWarning />
        {/* Creator Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <img
                  src={creator.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={creator.name}
                  className="h-24 w-24 rounded-full border-4 border-primary/20"
                />
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-bold">{creator.name}</h1>
                    <Badge variant="secondary">{creator.category}</Badge>
                    <Badge variant="outline" className="gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Base Sepolia
                    </Badge>
                    {creator.isActive && (
                      <Badge variant="default" className="gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="mb-4 text-muted-foreground">{creator.bio}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 font-medium">
                      <DollarSign className="h-4 w-4 text-primary" />
                      ${displayCreator.totalTipsUSD.toLocaleString()} total tips
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Users className="h-4 w-4 text-primary" />
                      {displayCreator.supporters} supporters
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {creator.socials?.x && (
                      <a
                        href={`https://twitter.com/${creator.socials.x.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        title="Twitter"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {creator.socials?.website && (
                      <a
                        href={creator.socials.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        title="Website"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {/* Registration Status */}
                  {isOwner && (
                    <div className="mt-4">
                      {creator.isActive ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          Registered on-chain
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-amber-600">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            Not registered on-chain
                          </div>
                          <Button
                            onClick={handleRegisterCreator}
                            disabled={isRegistering}
                            size="sm"
                            variant="outline"
                          >
                            {isRegistering ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registering...
                              </>
                            ) : (
                              'Register on-chain'
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Tip Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardContent className="space-y-6 p-6">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Send a Tip</h2>
                  
                  {/* Demo Payment Toggle */}
                  <div className="mb-4 flex gap-2">
                    <Button
                      variant={showDemoPayment ? "default" : "outline"}
                      onClick={() => setShowDemoPayment(true)}
                      size="sm"
                    >
                      Demo Payment
                    </Button>
                    <Button
                      variant={!showDemoPayment ? "default" : "outline"}
                      onClick={() => setShowDemoPayment(false)}
                      size="sm"
                    >
                      Real Payment
                    </Button>
                  </div>

                  {showDemoPayment ? (
                    <DemoPayment 
                      creatorName={creator.name}
                      onPaymentSuccess={addDonation}
                      onReferralEarning={addReferralEarning}
                    />
                  ) : (
                    <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount (USDC)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="10"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(e.target.value)}
                        className="mt-1.5"
                        disabled={isApproving || isTipping}
                        aria-describedby="amount-help"
                        aria-label="Tip amount in USDC"
                      />
                      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Suggested tip amounts">
                        {creator.suggestedAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setTipAmount(amount.toString())}
                            disabled={isApproving || isTipping}
                            aria-label={`Set tip amount to $${amount}`}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <p id="amount-help" className="sr-only">
                        Enter the amount you want to tip in USDC, or select from the suggested amounts above.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="message">Message (optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a message..."
                        value={tipMessage}
                        onChange={(e) => setTipMessage(e.target.value)}
                        className="mt-1.5"
                        disabled={isApproving || isTipping}
                        aria-label="Optional message to include with your tip"
                      />
                    </div>

                    {tipAmount && (
                      <div className="rounded-lg bg-muted/50 p-4 text-sm">
                        <div className="mb-1 flex justify-between">
                          <span className="text-muted-foreground">Platform fee (0.5%):</span>
                          <span className="font-medium">${platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Creator receives:</span>
                          <span className="text-primary">${creatorReceives.toFixed(2)} USDC</span>
                        </div>
                      </div>
                    )}

                    {!isConnected ? (
                      <div className="space-y-2">
                        <Button disabled className="w-full" size="lg">
                          Connect Wallet to Tip
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                          Please connect your wallet to send tips
                        </p>
                      </div>
                    ) : !hasEnoughBalance ? (
                      <div className="space-y-2">
                        <Button disabled className="w-full" size="lg">
                          Insufficient USDC Balance
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                          You need USDC to send tips
                        </p>
                        {isUsdcBalanceLoading ? (
                          <p className="text-center text-xs text-muted-foreground">
                            Loading USDC balance...
                          </p>
                        ) : usdcBalance !== undefined ? (
                          <p className="text-center text-xs text-muted-foreground">
                            Your USDC balance: {formatUnits(usdcBalance, 6)} USDC
                          </p>
                        ) : usdcBalanceError ? (
                          <div className="text-center text-xs text-red-500">
                            <p>Error loading USDC balance</p>
                            <p className="text-xs opacity-75">
                              {chainId !== APP_CHAIN_ID 
                                ? 'Please switch to Base Sepolia network' 
                                : usdcBalanceError.message || 'Unknown error'}
                            </p>
                          </div>
                        ) : (
                          <p className="text-center text-xs text-muted-foreground">
                            No USDC balance found
                          </p>
                        )}
                      </div>
                    ) : !hasEnoughAllowance ? (
                      <div className="space-y-2">
                        <Button 
                          onClick={handleApprove} 
                          className="w-full" 
                          size="lg"
                          disabled={isApproving}
                        >
                          {isApproving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            'Approve USDC Spending'
                          )}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                          First, approve USDC spending for the contract
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          onClick={handleTip} 
                          className="w-full" 
                          size="lg"
                          disabled={isTipping}
                        >
                          {isTipping ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending Tip...
                            </>
                          ) : (
                            'Tip with Wallet'
                          )}
                        </Button>
                        <Button 
                          onClick={handleTipWithCard} 
                          variant="outline" 
                          className="w-full" 
                          size="lg"
                          disabled={isTipping}
                        >
                          Pay with Card
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                          Card processing via Coinbase — additional fees may apply
                        </p>
                      </div>
                    )}
                  </div>
                  )}
                </div>

                {isOwner && (
                  <div className="border-t pt-4">
                    <Link to="/create">
                      <Button variant="outline" className="w-full gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Page
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Your Supporter Stats */}
            {isConnected && supporterTotal !== undefined && supporterTotal !== null && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-bold">Your Supporter Stats</h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ${Number(formatUnits(supporterTotal, 6)).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total tipped
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Demo Supporter Stats */}
            {isConnected && demoStats.totalDonated > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-bold">Your Demo Stats</h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ${demoStats.totalDonated.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total demo tips
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {demoStats.totalDonations} donations
                    </div>
                    {demoStats.badges.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Badges earned:</div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {demoStats.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Supporters */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-bold">Recent Supporters</h3>
                <div className="space-y-3">
                  {[
                    { address: '0x1234...5678', amount: 10, time: '2 hours ago' },
                    { address: '0xabcd...ef01', amount: 5, time: '5 hours ago' },
                    { address: '0x9876...5432', amount: 25, time: '1 day ago' },
                  ].map((supporter, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">{supporter.address}</div>
                        <div className="text-xs text-muted-foreground">{supporter.time}</div>
                      </div>
                      <div className="font-bold text-primary">${supporter.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Data sync info */}
        {lastUpdatedTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-400">
              Data synced from Base Sepolia · Last update: {lastUpdatedTime}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Creator;