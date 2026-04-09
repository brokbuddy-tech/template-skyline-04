
import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ClientLayout } from '@/components/layout/client-layout';
import { ThemeProvider } from '@/components/theme-provider';
import { CurrencyProvider } from '@/context/currency-context';
import { MobileNav } from '@/components/layout/mobile-nav';
import { navConfig } from '@/lib/nav-config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'SkyLines',
  description: 'Minimalist editorial real estate website.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} font-body antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <ClientLayout>
              <div className="lg:hidden fixed top-4 right-4 z-50">
                <MobileNav navLinks={navConfig} />
              </div>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </ClientLayout>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
