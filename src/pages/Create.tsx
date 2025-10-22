import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ArrowRight, Check, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { WalletButton } from '@/components/WalletButton';
import { creatorsStore } from '@/lib/creators-store';
import { CONTRACT_ADDR } from '@/lib/config';
import { BASETIP_ABI } from '@/lib/abi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Create = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState(1);
  const [registerOnChain, setRegisterOnChain] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    bio: '',
    avatarUrl: '',
    category: 'Other' as 'Art' | 'Music' | 'Dev' | 'Gaming' | 'Other',
    payoutAddress: address || '',
    x: '',
    farcaster: '',
    website: '',
    suggestedAmounts: [5, 10, 25, 50],
  });

  const { writeContract: writeRegister } = useWriteContract();
  const { isLoading: isRegisterPending, isSuccess: isRegisterSuccess } = useWaitForTransactionReceipt({
    hash: undefined, // Will be set when transaction is submitted
  });

  const handleChange = (field: string, value: string | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, avatarUrl: base64String }));
      toast.success('Avatar uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRegisterOnChain = async () => {
    if (!formData.name || !formData.bio || !formData.avatarUrl) {
      toast.error('Please complete your profile first');
      return;
    }

    setIsRegistering(true);
    try {
      await writeRegister({
        address: CONTRACT_ADDR as `0x${string}`,
        abi: BASETIP_ABI,
        functionName: 'registerCreator',
        args: [formData.name, formData.bio, formData.avatarUrl],
      });
      toast.success('On-chain registration submitted!');
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Failed to register on-chain. Please try again.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.slug || !formData.bio) {
      toast.error('Please fill in all required fields');
      return;
    }

    const creator = {
      slug: formData.slug,
      name: formData.name,
      bio: formData.bio,
      avatarUrl: formData.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + formData.slug,
      category: formData.category,
      payoutAddress: formData.payoutAddress || address || '',
      suggestedAmounts: formData.suggestedAmounts,
      socials: {
        x: formData.x,
        farcaster: formData.farcaster,
        website: formData.website,
      },
      metrics: {
        totalTipsUSD: 0,
        supporters: 0,
      },
      ownerAddress: address || '',
      createdAt: new Date().toISOString(),
    };

    creatorsStore.add(creator);

    if (registerOnChain) {
      handleRegisterOnChain();
    } else {
      toast.success('Creator page created!');
      navigate(`/creator/${formData.slug}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Connect Your Wallet</h2>
            <p className="mb-6 text-muted-foreground">
              Please connect your wallet to create a creator page and receive tips.
            </p>
            <WalletButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-3 font-display text-3xl font-bold sm:text-4xl">Create Your Page</h1>
          <p className="text-muted-foreground">
            Set up your BaseTip profile in a few steps
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-16 rounded-full transition-all sm:w-20 ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <CardTitle className="font-display text-xl sm:text-2xl">
              {step === 1 && 'Connect Wallet'}
              {step === 2 && 'Profile Info'}
              {step === 3 && 'Social Links & Tips'}
              {step === 4 && 'Preview & Publish'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6 sm:p-8">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="rounded-xl bg-success/10 p-4">
                  <div className="flex items-center gap-2 text-success">
                    <Check className="h-5 w-5" />
                    <span className="font-medium text-sm sm:text-base">
                      Wallet: {address?.slice(0, 8)}...{address?.slice(-6)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutAddress" className="text-base">Payout Address</Label>
                  <Input
                    id="payoutAddress"
                    value={formData.payoutAddress}
                    onChange={(e) => handleChange('payoutAddress', e.target.value)}
                    placeholder="0x..."
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Tips will be sent here. Uses your connected wallet by default.
                  </p>
                </div>
                <Button onClick={() => setStep(2)} className="w-full gap-2" size="lg">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name" className="text-base">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="slug" className="text-base">URL Slug *</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground sm:text-sm">basetip.app/creator/</span>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        placeholder="your-name"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-base">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value as any)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Art">Art</option>
                      <option value="Music">Music</option>
                      <option value="Dev">Dev</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl" className="text-base">Avatar</Label>
                    {formData.avatarUrl ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar preview"
                          className="h-12 w-12 rounded-xl border-2 border-primary/20 object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Change
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={clearAvatar}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full gap-2"
                          size="sm"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Avatar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1" size="lg">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1 gap-2" size="lg">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <Label className="mb-3 block text-base font-semibold">Suggested Tip Amounts (USDC)</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {formData.suggestedAmounts.map((amount, index) => (
                      <div key={index} className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => {
                            const newAmounts = [...formData.suggestedAmounts];
                            newAmounts[index] = Number(e.target.value);
                            handleChange('suggestedAmounts', newAmounts);
                          }}
                          className="pl-7"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Social Links</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="x" className="text-sm">X (Twitter)</Label>
                      <Input
                        id="x"
                        value={formData.x}
                        onChange={(e) => handleChange('x', e.target.value)}
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farcaster" className="text-sm">Farcaster</Label>
                      <Input
                        id="farcaster"
                        value={formData.farcaster}
                        onChange={(e) => handleChange('farcaster', e.target.value)}
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="https://your-site.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1" size="lg">
                    Back
                  </Button>
                  <Button onClick={() => setStep(4)} className="flex-1 gap-2" size="lg">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="rounded-xl border-2 border-primary/20 bg-accent/30 p-6">
                  <h3 className="mb-4 font-display text-lg font-bold">Preview</h3>
                  <div className="flex items-start gap-4">
                    {formData.avatarUrl && (
                      <img
                        src={formData.avatarUrl}
                        alt={formData.name}
                        className="h-20 w-20 rounded-2xl border-2 border-primary/20 object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h4 className="font-display text-xl font-bold">{formData.name || 'Your Name'}</h4>
                        {formData.category && (
                          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                            {formData.category}
                          </span>
                        )}
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">{formData.bio || 'Your bio...'}</p>
                      {(formData.x || formData.website) && (
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {formData.x && <span>🐦 {formData.x}</span>}
                          {formData.farcaster && <span>🟣 {formData.farcaster}</span>}
                          {formData.website && <span>🌐 {formData.website}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <Checkbox
                    id="registerOnChain"
                    checked={registerOnChain}
                    onCheckedChange={(checked) => setRegisterOnChain(checked as boolean)}
                    disabled={isRegistering || isRegisterPending}
                  />
                  <div className="flex-1">
                    <Label htmlFor="registerOnChain" className="cursor-pointer text-sm font-medium">
                      Register on-chain (optional)
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Store your profile data on Base blockchain for permanent storage
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1" size="lg">
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1 gap-2" 
                    size="lg"
                    disabled={isRegistering || isRegisterPending}
                  >
                    {isRegistering || isRegisterPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {registerOnChain ? 'Registering...' : 'Publishing...'}
                      </>
                    ) : (
                      <>
                        Publish Page
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Create;