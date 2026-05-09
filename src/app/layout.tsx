
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
import { getSiteConfig } from '@/lib/api';
import { buildAgencyThemeStyle } from '@/lib/agency-theme';
import { navConfig } from '@/lib/nav-config';
import { getRequestAgencySlug } from '@/lib/server-agency';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export async function generateMetadata(): Promise<Metadata> {
  const agencySlug = await getRequestAgencySlug();
  const siteConfig = await getSiteConfig(agencySlug);
  const displayName =
    siteConfig.branding?.displayName || siteConfig.organization.name || 'Agency Website';
  const description =
    siteConfig.profile?.aboutCompany
    || siteConfig.branding?.bio
    || siteConfig.branding?.tagline
    || `Explore the public website for ${displayName}.`;

  return {
    title: {
      default: displayName,
      template: `%s | ${displayName}`,
    },
    description,
    openGraph: {
      title: displayName,
      description,
      url: siteConfig.organization.publicAgencyUrl || undefined,
      siteName: displayName,
      images: siteConfig.profile?.logo ? [{ url: siteConfig.profile.logo }] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const agencySlug = await getRequestAgencySlug();
  const siteConfig = await getSiteConfig(agencySlug);

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
              <div style={buildAgencyThemeStyle(siteConfig.profile)}>
                <div className="lg:hidden fixed top-4 right-4 z-50">
                  <MobileNav navLinks={navConfig} />
                </div>
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
              </div>
            </ClientLayout>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
