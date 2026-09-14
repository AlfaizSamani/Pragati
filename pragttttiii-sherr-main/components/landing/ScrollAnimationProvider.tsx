'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const emptySubscribe = () => () => {};

export default function ScrollAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    // Register GSAP ScrollTrigger on client side
    gsap.registerPlugin(ScrollTrigger);

    return () => {
      // Cleanup ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Avoid hydration mismatch by rendering children without GSAP initially
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
