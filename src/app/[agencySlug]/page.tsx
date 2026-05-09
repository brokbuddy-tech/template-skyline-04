import { HomePageContent } from '../page';

export default async function AgencyHomePage({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  return <HomePageContent agencySlug={agencySlug} />;
}
