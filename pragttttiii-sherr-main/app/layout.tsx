import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'PRAGATI — Predictive Risk & Governance Intelligence for Infrastructure',
  description:
    'PRAGATI brings predictive intelligence to infrastructure monitoring — turning monthly data into early warnings, deeper insights, and stronger decisions for a developed India.',
  keywords: [
    'PRAGATI',
    'infrastructure',
    'predictive analytics',
    'risk intelligence',
    'PAIMANA',
    'MoSPI',
    'IPMD',
    'Viksit Bharat',
    'decision support',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}

