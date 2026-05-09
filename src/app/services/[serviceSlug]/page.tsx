import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getSiteConfig } from '@/lib/api';
import { getSkylineServiceContent } from '@/lib/marketing-pages';
import { prefixAgencyPath } from '@/lib/agency-routing';

export async function ServiceDetailPageContent({
  serviceSlug,
  agencySlug,
}: {
  serviceSlug: string;
  agencySlug?: string | null;
}) {
  const service = getSkylineServiceContent(serviceSlug);
  if (!service) {
    notFound();
  }

  const siteConfig = await getSiteConfig(agencySlug);
  const agencyName =
    siteConfig.branding?.displayName
    || siteConfig.organization.name
    || 'Agency Website';

  return (
    <div className="bg-background">
      <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)/0.12),transparent_34%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.4)_100%)] px-6 py-20 sm:px-8">
        <div className="container mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {service.eyebrow}
          </p>
          <h1 className="mt-5 text-5xl font-headline font-semibold text-foreground sm:text-6xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {service.summary}
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
            {agencyName} can surface this service dynamically alongside organization branding,
            live contact details, and Broker OS managed public data.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href={prefixAgencyPath('/contact', agencySlug)}>Speak With The Team</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link href={prefixAgencyPath('/agents', agencySlug)}>View Agents</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="container mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {service.highlights.map((highlight) => (
            <article key={highlight} className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
              <p className="text-sm leading-7 text-muted-foreground">{highlight}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceSlug: string }>;
}) {
  const { serviceSlug } = await params;
  return <ServiceDetailPageContent serviceSlug={serviceSlug} />;
}
