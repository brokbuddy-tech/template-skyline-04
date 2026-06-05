'use client';

import { useContext, useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Banknote, Check, ChevronRight, Clock, FileDown, HandHelping, LandPlot, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import type { Property } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CurrencyContext } from '@/context/currency-context';
import { useOrgInquiry } from '@/hooks/use-org-inquiry';
import { toSocialUrl } from '@/lib/api';
import { AmenityIcon } from '@/components/amenity-icon';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DownloadBrochureModal } from './download-brochure-modal';
import dynamic from 'next/dynamic';
import { prefixAgencyPath, resolveAgencySlugFromPathname } from '@/lib/agency-routing';
import { usePathname } from 'next/navigation';

const DynamicLocationMap = dynamic(
  () => import('./location-map').then(mod => ({ default: mod.LocationMap })),
  { ssr: false, loading: () => <div className="leaflet-property-map relative h-96 w-full overflow-hidden rounded-lg border border-border bg-muted/35 animate-pulse" /> }
);
import { OffPlanHeroGallery } from './off-plan-hero-gallery';
import { PropertyDescriptionDisplay } from './property-description-display';

type PaymentCard = {
  label: string;
  value: string;
  note: string;
};

type TimelineStep = {
  label: string;
  date: string;
  completed: boolean;
};

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function getString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function getPercent(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (value && typeof value === 'object') {
    const candidate = value as Record<string, unknown>;
    return (
      getPercent(candidate.percentage) ||
      getPercent(candidate.percent) ||
      getPercent(candidate.value) ||
      getPercent(candidate.amount)
    );
  }
  return null;
}

function summarizeInstallments(value: unknown) {
  if (!Array.isArray(value)) {
    return {
      total: getPercent(value),
      count: null as number | null,
    };
  }

  const total = value.reduce((sum, item) => sum + (getPercent(item) || 0), 0);
  return {
    total: total > 0 ? total : null,
    count: value.length,
  };
}

function formatProjectDate(
  value?: string | null,
  options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' }
) {
  if (!value) return 'To be announced';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', options);
}

function getPaymentPlanCards(property: Property): PaymentCard[] {
  const plan = (property.paymentPlanData || {}) as Record<string, unknown>;
  const constructionPayments = summarizeInstallments(plan.construction_linked_payments);
  const cards: PaymentCard[] = [];

  const downPayment = getPercent(plan.down_payment);
  if (downPayment !== null) {
    cards.push({
      label: 'Down payment',
      value: `${downPayment}%`,
      note: 'At booking',
    });
  }

  if (constructionPayments.total !== null) {
    cards.push({
      label: 'During construction',
      value: `${constructionPayments.total}%`,
      note:
        constructionPayments.count && constructionPayments.count > 1
          ? `${constructionPayments.count} installments`
          : 'Construction-linked',
    });
  }

  const handoverPayment = getPercent(plan.handover_payment);
  if (handoverPayment !== null) {
    cards.push({
      label: 'On handover',
      value: `${handoverPayment}%`,
      note: formatProjectDate(property.handoverDate),
    });
  }

  const postHandoverPayment = getPercent(plan.post_handover_payment);
  if (postHandoverPayment !== null) {
    cards.push({
      label: 'Post handover',
      value: `${postHandoverPayment}%`,
      note: 'After completion',
    });
  }

  if (cards.length > 0) return cards;

  return [
    {
      label: 'Payment plan',
      value: 'Flexible',
      note: 'Contact us for the latest schedule',
    },
  ];
}

function getTimelineSteps(property: Property): TimelineStep[] {
  const timeline = (property.constructionTimelineData || {}) as Record<string, unknown>;
  const steps: TimelineStep[] = [];
  const startDate = getString(timeline.start_date);
  const currentStatus = getString(timeline.current_status);
  const expectedCompletion =
    getString(timeline.expected_completion) || property.handoverDate || null;

  if (startDate) {
    steps.push({
      label: 'Construction started',
      date: formatProjectDate(startDate, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      completed: true,
    });
  }

  if (currentStatus) {
    steps.push({
      label: 'Current status',
      date: currentStatus,
      completed: true,
    });
  }

  if (expectedCompletion) {
    steps.push({
      label: 'Expected completion',
      date: formatProjectDate(expectedCompletion, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      completed: false,
    });
  }

  if (steps.length > 0) return steps;

  return [
    {
      label: 'Launch details',
      date: 'Available on request',
      completed: true,
    },
  ];
}

function getPaymentSummary(cards: PaymentCard[]) {
  const summary = cards
    .map(card => card.value.replace('%', '').trim())
    .filter(Boolean)
    .join(' / ');

  return summary || 'Flexible plan';
}

export function LiveOffPlanPropertyPage({ property }: { property: Property }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [buyerType, setBuyerType] = useState('end-user');
  const { formatPrice } = useContext(CurrencyContext);
  const { isSubmitting, submitInquiry } = useOrgInquiry();
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const masterplanImage = PlaceHolderImages.find(image => image.id === 'masterplan');
  const paymentPlanCards = getPaymentPlanCards(property);
  const timelineSteps = getTimelineSteps(property);
  const developerName =
    property.developerName || property.organizationName || 'Developer details on request';
  const currentStatus = getString(
    (property.constructionTimelineData as Record<string, unknown> | null)?.current_status
  );
  const whatsappHref = toSocialUrl(
    'whatsapp',
    property.agent?.whatsapp || property.agent?.phone
  );
  const nearbyPlaces = property.nearby || [];
  const keyInformation = [
    { label: 'Delivery Date', value: formatProjectDate(property.handoverDate) },
    { label: 'Construction Status', value: currentStatus || 'Available now' },
    { label: 'Location', value: property.location, accent: true },
    { label: 'Payment Plan', value: getPaymentSummary(paymentPlanCards) },
    { label: 'Transaction', value: property.transactionType },
    { label: 'Property Type', value: property.type },
    { label: 'Reference', value: property.referenceId || 'On request' },
    { label: 'Developer', value: developerName },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setQrCodeUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        window.location.href
      )}`
    );
  }, []);

  async function handleRegisterInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const notes = getFormValue(formData, 'message');
    const result = await submitInquiry(
      {
        name: getFormValue(formData, 'name'),
        email: getFormValue(formData, 'email'),
        phone: getFormValue(formData, 'phone'),
        message: [
          `Register interest for ${property.title}.`,
          `Buyer profile: ${buyerType}.`,
          notes ? `Notes: ${notes}` : null,
        ]
          .filter(Boolean)
          .join(' '),
        listingId: property.id,
        propertyType: property.type,
        budget: property.price,
      },
      {
        successTitle: 'Interest registered',
        successDescription: `We will contact you about ${property.title} shortly.`,
      }
    );

    if (result.ok) {
      form.reset();
      setBuyerType('end-user');
    }
  }

  return (
    <Dialog open={isBrochureOpen} onOpenChange={setIsBrochureOpen}>
      <div className="bg-background">
        <OffPlanHeroGallery property={property} />
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-12 gap-x-8">
            <div className="col-span-12 lg:col-span-8">
              <div className="mb-12">
                <h1 className="mb-2 text-4xl font-bold text-foreground">
                  Launch Price {formatPrice(property.price)}*
                </h1>
                <p className="text-xs text-muted-foreground">
                  *Prices and availability are subject to change without notice.
                </p>

                <div className="mt-6 flex items-center justify-between rounded-xl border bg-muted p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-md border bg-background px-4 py-3">
                      <p className="text-sm font-semibold text-foreground">
                        {developerName}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{property.title}</p>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="mb-6 text-xl font-bold text-foreground">Key information</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                  {keyInformation.map(item => (
                    <div key={item.label}>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </p>
                      <p
                        className={`mt-1 text-base font-semibold ${
                          item.accent ? 'text-accent' : 'text-foreground'
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="mb-6 text-xl font-bold text-foreground">Payment plan</h2>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                  {paymentPlanCards.map((card, index) => (
                    <div key={card.label} className="flex w-full flex-1 items-center gap-4">
                      <div className="min-w-[140px] flex-1 rounded-xl border bg-muted p-6 text-center">
                        <p className="text-3xl font-bold text-foreground">{card.value}</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {card.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{card.note}</p>
                      </div>
                      {index < paymentPlanCards.length - 1 && (
                        <ChevronRight className="hidden text-muted-foreground md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="mb-6 text-xl font-bold text-foreground">Project timeline</h2>
                <div className="rounded-2xl border bg-muted p-8">
                  <div className="relative">
                    {timelineSteps.map((step, index) => (
                      <div key={`${step.label}-${index}`} className="flex items-start gap-6 pb-8 last:pb-0">
                        <div className="relative">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full ${
                              step.completed ? 'bg-accent' : 'border-2 bg-background'
                            }`}
                          >
                            {step.completed && (
                              <Check className="h-3 w-3 text-accent-foreground" />
                            )}
                          </div>
                          {index < timelineSteps.length - 1 && (
                            <div
                              className={`absolute left-1/2 h-full w-0.5 -translate-x-1/2 ${
                                step.completed ? 'bg-accent' : 'border-l-2 border-dashed'
                              }`}
                              style={{ top: '1.25rem' }}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{step.label}</p>
                          <p className="text-sm text-muted-foreground">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <div className="flex flex-col items-start justify-between gap-6 rounded-lg border p-4 sm:flex-row">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                      <ShieldCheck className="h-5 w-5 text-accent" />
                      Regulatory Information
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <HandHelping className="mt-0.5 h-4 w-4" />
                        <strong>Reference ID:</strong> {property.referenceId || 'N/A'}
                      </li>
                      <li className="flex gap-2">
                        <Banknote className="mt-0.5 h-4 w-4" />
                        <strong>Trakheesi:</strong> {property.trakheesi || 'N/A'}
                      </li>
                      <li className="flex gap-2">
                        <LandPlot className="mt-0.5 h-4 w-4" />
                        <strong>RERA Permit:</strong> {property.reraPermit || 'N/A'}
                      </li>
                    </ul>
                  </div>
                  <div className="w-full text-center sm:w-auto">
                    <p className="mb-2 text-sm font-bold">DLD Permit</p>
                    {qrCodeUrl ? (
                      <Image
                        src={qrCodeUrl}
                        alt="DLD Permit QR Code"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div className="h-[100px] w-[100px] animate-pulse bg-muted" />
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-12" />

              <div className="mb-12">
                <h2 className="mb-4 text-xl font-bold text-foreground">About This Project</h2>
                <div className="prose max-w-none line-clamp-3 dark:prose-invert">
                  <PropertyDescriptionDisplay description={property.description} />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="mt-2 p-0 text-accent">
                      Read Full Description
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] sm:max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-headline">
                        {property.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto pr-2 prose max-w-full dark:prose-invert">
                      <PropertyDescriptionDisplay description={property.description} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {property.amenities.length > 0 && (
                <>
                  <Separator className="my-12" />
                  <div className="mb-12">
                    <h2 className="mb-6 text-xl font-bold text-foreground">Amenities</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {property.amenities.map(amenity => (
                        <Badge
                          key={amenity}
                          variant="outline"
                          className="flex items-center justify-center gap-2 rounded-lg border bg-muted p-3 text-sm"
                        >
                          <AmenityIcon name={amenity} className="h-4 w-4" />
                          <span>{amenity}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator className="my-12" />

              {masterplanImage && (
                <div className="mb-12">
                  <h2 className="mb-6 text-xl font-bold text-foreground">Masterplan</h2>
                  <div className="overflow-hidden rounded-xl border">
                    <Image
                      src={masterplanImage.imageUrl}
                      alt={masterplanImage.description}
                      width={1600}
                      height={900}
                      className="h-auto w-full object-cover"
                      data-ai-hint={masterplanImage.imageHint}
                    />
                  </div>
                </div>
              )}

              <Separator className="my-12" />

              <div className="mb-12">
                <h2 className="mb-6 text-xl font-bold text-foreground">Location</h2>
                <DynamicLocationMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  locationLabel={property.location}
                  addressLabel={property.mapAddress}
                />
              </div>

              {nearbyPlaces.length > 0 && (
                <>
                  <Separator className="my-12" />
                  <div className="mb-12">
                    <h2 className="mb-6 text-xl font-bold text-foreground">
                      Nearby Places
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {nearbyPlaces.map(place => (
                        <Card
                          key={place.name}
                          className="flex items-center gap-4 border bg-muted p-4"
                        >
                          <div className="rounded-lg border bg-background p-3">
                            <MapPin className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{place.name}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{place.time} away</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="sticky top-24">
                <div className="rounded-2xl border bg-white p-6 shadow-xl dark:bg-muted">
                  <h3 className="mb-4 text-xl font-bold text-foreground">
                    Interested in {property.title}?
                  </h3>
                  <form className="space-y-4" onSubmit={handleRegisterInterest}>
                    <Input name="name" placeholder="Name" required />
                    <Input name="phone" placeholder="Phone" type="tel" />
                    <Input name="email" placeholder="Email" type="email" required />
                    <Textarea
                      name="message"
                      rows={3}
                      placeholder="Questions, budget goals, or move-in timeline"
                    />
                    <ToggleGroup
                      type="single"
                      value={buyerType}
                      onValueChange={value => {
                        if (value) setBuyerType(value);
                      }}
                      className="w-full rounded-md border dark:border-white"
                    >
                      <ToggleGroupItem
                        value="investor"
                        className="w-full data-[state=on]:bg-foreground data-[state=on]:text-background dark:data-[state=on]:bg-white dark:data-[state=on]:text-black"
                      >
                        I am an Investor
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="end-user"
                        className="w-full data-[state=on]:bg-foreground data-[state=on]:text-background dark:data-[state=on]:bg-white dark:data-[state=on]:text-black"
                      >
                        I am an End User
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <Button
                      type="submit"
                      className="w-full bg-foreground text-background hover:bg-foreground/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Register Interest'}
                    </Button>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" className="w-full">
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Brochure
                      </Button>
                    </DialogTrigger>
                    <Button asChild className="w-full bg-green-500 text-white hover:bg-green-600">
                      <a
                        href={whatsappHref || prefixAgencyPath(`/contact?listingId=${property.id}`, agencySlug)}
                        target={whatsappHref ? '_blank' : undefined}
                        rel={whatsappHref ? 'noreferrer' : undefined}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {whatsappHref ? 'WhatsApp Agent' : 'Contact Agent'}
                      </a>
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DownloadBrochureModal
        property={property}
        onSuccess={() => setIsBrochureOpen(false)}
      />
    </Dialog>
  );
}
