'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CallToAction() {
  return (
    <section className="bg-royal py-16 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-royal-light opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-primary opacity-20 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From Monitoring Infrastructure to Anticipating Risk.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-300">
            Turn project data into earlier warnings, clearer evidence, and better intervention decisions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/projects" tabIndex={-1}>
              <Button className="bg-accent hover:bg-accent-dark text-white border-0 shadow-md h-12 px-8 text-base font-semibold">
                Explore Projects Workspace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
