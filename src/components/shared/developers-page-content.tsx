import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSiteConfig } from '@/lib/api';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { SKYLINE_DEVELOPER_PAGES } from '@/lib/marketing-pages';

export async function DevelopersPageContent({
  agencySlug,
}: {
  agencySlug?: string | null;
}) {
  const siteConfig = await getSiteConfig(agencySlug);
  const agencyName =
    siteConfig.branding?.displayName
    || siteConfig.organization.name
    || 'Agency Website';

  return (
    <div className="bg-background">
      <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.14),transparent_36%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.35)_100%)] px-6 py-20 sm:px-8">
        <div className="container mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Developers
          </p>
          <h1 className="mt-5 text-5xl font-headline font-semibold text-foreground sm:text-6xl">
            Developer partners featured by {agencyName}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            These branded developer landing routes now resolve cleanly instead of falling into
            a template 404, while still keeping organization branding and CTAs organization-aware.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="container mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {SKYLINE_DEVELOPER_PAGES.map((developer) => (
            <article key={developer.slug} className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {developer.specialty}
              </p>
              <h2 className="mt-4 text-3xl font-headline font-semibold text-foreground">
                {developer.name}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {developer.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="sm" className="rounded-full px-5">
                  <Link href={prefixAgencyPath(`/developers/${developer.slug}`, agencySlug)}>
                    View Developer
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded-full px-5">
                  <Link href={prefixAgencyPath('/off-plan', agencySlug)}>Explore Projects</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

