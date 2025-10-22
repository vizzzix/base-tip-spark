import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReferralCheck, useReferralSystem } from '@/hooks/useReferralSystem';

interface DemoPaymentProps {
  creatorName: string;
  onPaymentSuccess: (amount: number) => void;
  onReferralEarning?: (amount: number) => void;
}

export function DemoPayment({ creatorName, onPaymentSuccess, onReferralEarning }: DemoPaymentProps) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const referralCode = useReferralCheck();
  const { processReferralEarning } = useReferralSystem();

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const tipAmount = parseFloat(amount);
    console.log('DemoPayment - calling onPaymentSuccess with amount:', tipAmount);
    onPaymentSuccess(tipAmount);
    
    // Handle referral earning if user came from a referral link
    if (referralCode && onReferralEarning) {
      const referralEarning = tipAmount * 0.05; // 5% of donation
      console.log('DemoPayment - processing referral earning:', referralEarning);
      onReferralEarning(referralEarning);
      
      // Process referral earning for the referrer
      processReferralEarning(referralCode, tipAmount);
      
      toast.success(`Referral bonus: +$${referralEarning.toFixed(2)}!`);
    }
    
    toast.success(`Successfully sent $${tipAmount.toFixed(2)} to ${creatorName}!`);
    setAmount('');
    setMessage('');
    setIsProcessing(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Demo Payment via Coinbase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USD)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="10.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message (optional)</Label>
          <Input
            id="message"
            placeholder="Great content!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <Button 
          onClick={handlePayment} 
          className="w-full" 
          disabled={isProcessing || !amount}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Send ${amount || '0.00'}
            </>
          )}
        </Button>

        {referralCode && (
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300 text-center">
              🎉 You came from a referral link! You'll earn 5% bonus on this donation.
            </p>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          This is a demo payment. No real money will be charged.
        </p>
      </CardContent>
    </Card>
  );
}
