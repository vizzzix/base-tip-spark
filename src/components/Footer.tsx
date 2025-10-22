import { Github, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="border-t py-8 sm:py-10"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:gap-4">
          <span className="font-medium">Built on Base</span>
          <span className="hidden sm:inline">•</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">Open Source on GitHub</span>
            <span className="sm:hidden">GitHub</span>
          </a>
          <span className="hidden sm:inline">•</span>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Join Discord</span>
            <span className="sm:hidden">Discord</span>
          </a>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          © 2025 BaseTip • On-chain tipping made simple
        </p>
      </div>
    </motion.footer>
  );
};
