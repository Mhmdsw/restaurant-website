import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { CartProvider } from '@/components/cart/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'La Maison – Luxury Restaurant',
  description:
    'Experience fine dining with exquisite flavors and elegant ambiance.',
  openGraph: {
    title: 'La Maison – Luxury Restaurant',
    description:
      'Experience fine dining with exquisite flavors and elegant ambiance.',
    url: 'https://yourdomain.com',
    siteName: 'La Maison',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Maison – Luxury Restaurant',
    description:
      'Experience fine dining with exquisite flavors and elegant ambiance.',
    images: ['https://yourdomain.com/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ClientWrapper>
            <CartProvider>
              <Navbar />

              <main className="min-h-screen">
                {children}
              </main>

              <Footer />

              <Toaster
                position="top-right"
                richColors
                closeButton
              />
            </CartProvider>
          </ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}