import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, Heart, Trophy, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DonorLevel {
  name: string;
  minAmount: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
}

export const DONOR_LEVELS: DonorLevel[] = [
  {
    name: 'Supporter',
    minAmount: 0,
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    description: 'New supporter'
  },
  {
    name: 'Fan',
    minAmount: 500,
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Regular supporter'
  },
  {
    name: 'VIP',
    minAmount: 2000,
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'VIP supporter'
  },
  {
    name: 'Champion',
    minAmount: 5000,
    icon: Crown,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Top supporter'
  },
  {
    name: 'Legend',
    minAmount: 10000,
    icon: Trophy,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Legendary supporter'
  },
  {
    name: 'Diamond',
    minAmount: 25000,
    icon: Gem,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    description: 'Diamond supporter'
  }
];

export function getDonorLevel(totalTips: number): DonorLevel {
  // Find the highest level the user qualifies for
  let level = DONOR_LEVELS[0]; // Default to Supporter
  for (const donorLevel of DONOR_LEVELS) {
    if (totalTips >= donorLevel.minAmount) {
      level = donorLevel;
    } else {
      break;
    }
  }
  return level;
}

interface DonorBadgeProps {
  totalTips: number;
  className?: string;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function DonorBadge({ 
  totalTips, 
  className, 
  showDescription = false, 
  size = 'md' 
}: DonorBadgeProps) {
  const level = getDonorLevel(totalTips);
  const Icon = level.icon;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        'flex items-center gap-1.5 font-medium',
        level.color,
        level.bgColor,
        className
      )}
    >
      <Icon className={sizeClasses[size]} />
      <span>{level.name}</span>
      {showDescription && (
        <span className="text-xs opacity-75">({level.description})</span>
      )}
    </Badge>
  );
}

interface DonorProgressProps {
  totalTips: number;
  className?: string;
}

export function DonorProgress({ totalTips, className }: DonorProgressProps) {
  const currentLevel = getDonorLevel(totalTips);
  const nextLevel = DONOR_LEVELS.find(level => level.minAmount > totalTips);
  
  if (!nextLevel) {
    // User has reached the highest level
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <DonorBadge totalTips={totalTips} size="sm" />
        <span className="text-xs text-muted-foreground">Max level reached!</span>
      </div>
    );
  }

  const progress = ((totalTips - currentLevel.minAmount) / (nextLevel.minAmount - currentLevel.minAmount)) * 100;
  const remaining = nextLevel.minAmount - totalTips;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <DonorBadge totalTips={totalTips} size="sm" />
        <span className="text-xs text-muted-foreground">
          ${remaining.toFixed(0)} to {nextLevel.name}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
