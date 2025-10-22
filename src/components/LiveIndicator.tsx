import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Wifi } from 'lucide-react';

interface LiveIndicatorProps {
  isLive?: boolean;
  className?: string;
}

export function LiveIndicator({ isLive = true, className = '' }: LiveIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Badge 
        variant={isLive ? "default" : "secondary"} 
        className={`gap-1.5 ${isLive ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
      >
        <motion.div
          animate={isLive ? { 
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          } : {}}
          transition={isLive ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
          className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'}`}
        />
        <Wifi className="h-3 w-3" />
        {isLive ? 'LIVE ON-CHAIN' : 'OFFLINE'}
      </Badge>
    </motion.div>
  );
}
