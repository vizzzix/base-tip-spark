import { Link } from 'react-router-dom';
import { Heart, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAccount } from 'wagmi';
import { WalletButton } from '@/components/WalletButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NetworkChip } from '@/components/NetworkChip';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { address, isConnected } = useAccount();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-md">
            <Heart className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">BaseTip</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/for-creators" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            For Creators
          </Link>
          <Link to="/leaderboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Leaderboard
          </Link>
          {isConnected && (
            <Link to="/profile" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              My Profile
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <NetworkChip />
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </motion.nav>
  );
};
