'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  FolderGit2, 
  Activity, 
  AlertTriangle, 
  Target, 
  PieChart, 
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const NAVIGATION = [
  { name: 'Projects', href: '/projects', icon: FolderGit2 },
  { name: 'Risk Monitor', href: '/risk-monitor', icon: Activity },
  { name: 'Early Warnings', href: '/early-warnings', icon: AlertTriangle },
  { name: 'Intervention Priority', href: '/intervention-priority', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'PRAGATI Intelligence', href: '/intelligence', icon: BrainCircuit },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        className="-m-2.5 p-2.5 text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/80 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white px-6 pb-4 pt-5 shadow-xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <Link href="/" className="flex items-center gap-2 outline-none" onClick={() => setIsOpen(false)}>
                  <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-lg leading-none tracking-tighter">P</span>
                  </div>
                  <span className="font-bold text-royal text-xl tracking-tight">PRAGATI</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="mt-6 flow-root flex-1 overflow-y-auto">
                <nav className="space-y-1">
                  {NAVIGATION.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'group flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-fast outline-none',
                          isActive 
                            ? 'bg-primary-50 text-primary-700' 
                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-royal'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'shrink-0 w-5 h-5',
                            isActive ? 'text-primary-600' : 'text-neutral-400'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
