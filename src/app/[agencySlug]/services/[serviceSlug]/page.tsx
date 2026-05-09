import { ServiceDetailPageContent } from '../../../services/[serviceSlug]/page';

export default async function AgencyServiceDetailPage({
  params,
}: {
  params: Promise<{ agencySlug: string; serviceSlug: string }>;
}) {
  const { agencySlug, serviceSlug } = await params;
  return (
    <ServiceDetailPageContent
      agencySlug={agencySlug}
      serviceSlug={serviceSlug}
    />
  );
}
