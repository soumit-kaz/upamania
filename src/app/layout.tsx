import type { Metadata, Viewport } from 'next';
import { Inter, Dancing_Script } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dancingScript = Dancing_Script({ 
  subsets: ['latin'], 
  variable: '--font-dancing',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'In A World of 8 Billion, I Found You 💕',
  description: 'A special interactive experience made with love',
  keywords: ['love', 'romantic', 'interactive', 'gift'],
  authors: [{ name: 'With Love' }],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1a2e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dancingScript.variable}`}>
      <body className={`${inter.className} antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
