import { Link } from 'react-router-dom';
import { Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Creator } from '@/lib/types';
import { CreatorFromEvent } from '@/hooks/useCreatorEvents';
import { DonorBadge } from '@/components/DonorBadge';
import { motion } from 'framer-motion';

interface CreatorCardProps {
  creator: Creator | CreatorFromEvent;
  index?: number;
}

export const CreatorCard = ({ creator, index = 0 }: CreatorCardProps) => {
  // Check if creator is from events (has address) or from contract (has metrics)
  const isFromEvent = 'address' in creator;
  
  const avatarUrl = creator.avatar || creator.avatarUrl;
  const category = creator.category || 'Creator';
  const totalTips = 'totalTipsUSD' in creator ? creator.totalTipsUSD : (creator.metrics?.totalTipsUSD || 0);
  const supporters = 'supporters' in creator ? creator.supporters : (creator.metrics?.supporters || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl h-full">
        <CardContent className="p-5 sm:p-6 h-full flex flex-col">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <img
              src={avatarUrl}
              alt={creator.name}
              className="h-14 w-14 flex-shrink-0 rounded-2xl border-2 border-primary/20 object-cover sm:h-16 sm:w-16"
            />
            <div className="min-w-0 flex-1 flex flex-col">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="truncate font-display text-base font-bold sm:text-lg">{creator.name}</h3>
                <Badge variant="secondary" className="flex-shrink-0 text-xs">
                  {category}
                </Badge>
              </div>
              <p className="mb-3 line-clamp-2 text-xs text-muted-foreground sm:text-sm flex-1">
                {creator.bio}
              </p>
              <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="font-medium">${totalTips.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{supporters}</span>
                </div>
              </div>
              <Link to={`/creator/${creator.slug}`} className="block mt-auto">
                <Button className="w-full" size="sm">
                  Tip Creator
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
