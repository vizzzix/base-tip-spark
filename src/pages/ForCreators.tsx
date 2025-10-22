import { Link } from 'react-router-dom';
import { ArrowRight, Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const ForCreators = () => {
  return (
    <div className="py-12 sm:py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
            Accept tips on Base
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Create your page in minutes. Start receiving on-chain support from your community with
            transparent, low-fee transactions.
          </p>
          <Link to="/create">
            <Button size="lg" className="gap-2">
              Create your page
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Why BaseTip */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Why BaseTip?</h2>
            <p className="text-muted-foreground">Built for creators on Base</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Transparent Fees',
                description: 'Only 0.5% platform fee. No hidden costs or surprises.',
              },
              {
                title: 'Fast Settlements',
                description: 'Receive tips instantly to your wallet. No waiting periods.',
              },
              {
                title: 'Community Building',
                description: 'Engage supporters with collectible NFT badges and leaderboards.',
              },
              {
                title: 'Easy Setup',
                description: 'Create your page in under 5 minutes. No coding required.',
              },
              {
                title: 'On-chain Proof',
                description: 'Every tip is verifiable on Base. Full transparency.',
              },
              {
                title: 'Global Reach',
                description: 'Accept support from anyone, anywhere with a Web3 wallet.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">How it works</h2>
            <p className="text-muted-foreground">Get started in 4 simple steps</p>
          </motion.div>

          <div className="mx-auto max-w-3xl space-y-6">
            {[
              {
                step: '1',
                title: 'Connect Wallet',
                description:
                  'Connect your Web3 wallet to receive tips. Your address is prefilled as the payout destination.',
              },
              {
                step: '2',
                title: 'Create Page',
                description:
                  'Add your name, bio, avatar, category, and social links. Customize suggested tip amounts.',
              },
              {
                step: '3',
                title: 'Share Link',
                description:
                  'Get your unique BaseTip link (e.g., basetip.app/creator/yourname) and share it everywhere.',
              },
              {
                step: '4',
                title: 'Receive Tips',
                description:
                  'Tips go directly to your wallet. Track your supporters and total earnings in real-time.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="flex gap-6 p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Fees */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl"
          >
            <Card className="border-primary/20 bg-accent/50">
              <CardContent className="p-8 text-center">
                <h2 className="mb-4 text-3xl font-bold">Platform Fee: 0.5%</h2>
                <p className="mb-2 text-muted-foreground">
                  This fee is always included in the displayed amount. If a supporter tips $10,
                  you receive $9.95.
                </p>
                <p className="text-sm text-muted-foreground">
                  Covers infrastructure, development, and BaseTip growth.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">FAQ</h2>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                    Do I need to be on Base network?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Yes, BaseTip operates on Base Sepolia (testnet) and Base mainnet. Make sure your
                  wallet is connected to the correct network to create a page or receive tips.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                    What tokens can I accept?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Currently, BaseTip supports USDC and ETH on Base. Tips are recorded on-chain with
                  full transparency.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                    Do I need a Web3 wallet?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you need a Web3 wallet (like Coinbase Wallet, MetaMask, or Rainbow) to
                  create a page and receive tips. Supporters can also pay via card through Coinbase
                  Commerce (additional fees may apply).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                    Can I edit my page after creation?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Yes! If you're connected with the wallet that created the page, you'll see an
                  "Edit Page" option on your creator page.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                    What are Supporter Badges?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Supporter Badges are collectible ERC-1155 NFTs earned by tipping creators. Badge
                  tiers (Bronze, Silver, Gold, Diamond, Platinum) unlock based on total tip amount.
                  They're a way to show your support on-chain.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center sm:p-12"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            Create your BaseTip page today and start receiving on-chain support from your community.
          </p>
          <Link to="/create">
            <Button size="lg" className="gap-2">
              Create your page
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ForCreators;
