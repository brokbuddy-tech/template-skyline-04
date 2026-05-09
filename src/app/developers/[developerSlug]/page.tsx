import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getSiteConfig } from '@/lib/api';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { getSkylineDeveloperContent } from '@/lib/marketing-pages';

export async function DeveloperDetailPageContent({
  developerSlug,
  agencySlug,
}: {
  developerSlug: string;
  agencySlug?: string | null;
}) {
  const developer = getSkylineDeveloperContent(developerSlug);
  if (!developer) {
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
            Developer Spotlight
          </p>
          <h1 className="mt-5 text-5xl font-headline font-semibold text-foreground sm:text-6xl">
            {developer.name}
          </h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {developer.specialty}
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {developer.summary}
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
            The route is now available inside the public template flow for {agencyName}, so
            developer-led discovery pages no longer dead-end in the navigation.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="container mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {developer.highlights.map((highlight) => (
            <article key={highlight} className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
              <p className="text-sm leading-7 text-muted-foreground">{highlight}</p>
            </article>
          ))}
        </div>

        <div className="container mx-auto mt-10 flex max-w-5xl flex-wrap gap-4">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link href={prefixAgencyPath('/off-plan', agencySlug)}>Browse Off-Plan</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-7">
            <Link href={prefixAgencyPath('/developers', agencySlug)}>All Developers</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ developerSlug: string }>;
}) {
  const { developerSlug } = await params;
  return <DeveloperDetailPageContent developerSlug={developerSlug} />;
}
