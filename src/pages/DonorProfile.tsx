import { DonorProfile } from '@/components/DonorProfile';
import { NetworkWarning } from '@/components/NetworkWarning';
import { useAccount } from 'wagmi';
import { WalletButton } from '@/components/WalletButton';
import { motion } from 'framer-motion';

const DonorProfilePage = () => {
  const { isConnected } = useAccount();

  return (
    <div className="relative">
      {/* Network Warning */}
      <div className="container mx-auto px-4 pt-4">
        <NetworkWarning />
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8 text-center">
            <h1 className="mb-3 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              Your Supporter Profile
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Track your donations and earned badges
            </p>
          </div>

          {!isConnected ? (
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-6">
                  Connect your wallet to view your supporter profile and earned badges.
                </p>
              </div>
              <WalletButton />
            </div>
          ) : (
            <DonorProfile />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DonorProfilePage;
