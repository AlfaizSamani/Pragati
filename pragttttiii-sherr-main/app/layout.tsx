import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'PRAGATI — Predictive Infrastructure Intelligence',
  description:
    'Predictive infrastructure intelligence and decision-support platform for monitoring Central Sector projects. Predict, Explain, Prioritize, Intervene.',
  keywords: [
    'PRAGATI',
    'infrastructure',
    'predictive analytics',
    'risk intelligence',
    'PAIMANA',
    'MoSPI',
    'IPMD',
    'decision support',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
