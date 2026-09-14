'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import PragatiLogo from '@/components/ui/PragatiLogo';

const NAV_LINKS = [
  { name: 'Why PRAGATI', href: '#why-pragati' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Intelligence', href: '#intelligence' },
  { name: 'Impact', href: '#impact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-subtle">
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
            <span className="sr-only">PRAGATI</span>
            <PragatiLogo variant="compact" />
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {NAV_LINKS.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-medium leading-6 text-neutral-600 hover:text-primary transition-fast outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1">
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/projects" tabIndex={-1}>
            <Button variant="primary">Open Workspace</Button>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-neutral-900/80 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-neutral-900/10 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  <span className="sr-only">PRAGATI</span>
                  <PragatiLogo variant="compact" />
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-border-default">
                  <div className="space-y-2 py-6">
                    {NAV_LINKS.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-neutral-900 hover:bg-neutral-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <Link href="/projects" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-neutral-900 hover:bg-neutral-50" onClick={() => setMobileMenuOpen(false)}>
                      Open Workspace
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
