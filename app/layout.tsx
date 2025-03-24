import '../styles/globals.scss';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Startup Names Generator',
  description: 'Generate unique domain names for your startup',
  keywords: ['domain names', 'startup', 'business', 'name generator', 'AI'],
  authors: [{ name: 'AI Domain Generator' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="component-content">
          {children}
        </div>
      </body>
    </html>
  );
} 