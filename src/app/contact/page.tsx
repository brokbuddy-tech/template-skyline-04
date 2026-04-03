
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { SocialIcons } from '@/components/shared/social-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOrgInquiry } from '@/hooks/use-org-inquiry';
import { getPropertyById, getSiteConfig, toSocialUrl } from '@/lib/api';
import type { Property, SiteConfig } from '@/lib/types';

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

export default function ContactPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId') || undefined;
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { isSubmitting, submitInquiry } = useOrgInquiry();

  useEffect(() => {
    let active = true;

    async function loadPageData() {
      const [config, property] = await Promise.all([
        getSiteConfig(),
        listingId ? getPropertyById(listingId) : Promise.resolve(null),
      ]);

      if (!active) return;
      setSiteConfig(config);
      setSelectedProperty(property);
    }

    void loadPageData();

    return () => {
      active = false;
    };
  }, [listingId]);

  const displayName =
    siteConfig?.branding?.displayName || siteConfig?.organization.name || 'Skyline Realty';
  const contactEmail =
    siteConfig?.branding?.publicEmail ||
    siteConfig?.leadAgent?.email ||
    'hello@skyline-realty.com';
  const contactPhone =
    siteConfig?.branding?.publicPhone ||
    siteConfig?.leadAgent?.phone ||
    siteConfig?.leadAgent?.whatsapp ||
    '';
  const whatsappLink =
    toSocialUrl(
      'whatsapp',
      siteConfig?.branding?.whatsapp || siteConfig?.leadAgent?.whatsapp || contactPhone
    ) || null;
  const directLink =
    whatsappLink || (contactPhone ? `tel:${contactPhone}` : `mailto:${contactEmail}`);
  const directLabel = whatsappLink
    ? 'Start WhatsApp Chat'
    : contactPhone
      ? 'Call Our Team'
      : 'Email Our Team';
  const featuredAreas = siteConfig?.featuredAreas?.slice(0, 3).join(', ');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = getFormValue(formData, 'message');

    const result = await submitInquiry(
      {
        name: getFormValue(formData, 'name'),
        email: getFormValue(formData, 'email'),
        phone: getFormValue(formData, 'phone'),
        message: selectedProperty
          ? `Inquiry for ${selectedProperty.title}. ${message}`
          : message,
        listingId: selectedProperty?.id,
        propertyType: selectedProperty?.type,
        budget: selectedProperty?.price,
      },
      {
        successTitle: 'Message sent',
        successDescription: selectedProperty
          ? `We will reach out about ${selectedProperty.title} shortly.`
          : 'We will get back to you shortly.',
      }
    );

    if (result.ok) {
      form.reset();
    }
  }

  return (
    <div className="bg-background">
      <section className="py-24 md:py-32">
        <div className="container mx-auto text-center">
          <AnimateOnScroll>
            <h1 className="text-6xl md:text-8xl font-headline font-medium text-balance">
              Get in Touch
            </h1>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="pt-0">
        <AnimateOnScroll>
          <div className="container mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
            <div className="space-y-8">
              <AnimateOnScroll>
                <h2 className="text-3xl md:text-4xl font-bold font-body">
                  Send Us a Message
                </h2>
                {selectedProperty && (
                  <p className="mt-4 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                    You are contacting {displayName} about{' '}
                    <span className="font-semibold text-foreground">
                      {selectedProperty.title}
                    </span>
                    .
                  </p>
                )}
              </AnimateOnScroll>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <AnimateOnScroll delay={100} className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your Name"
                    className="border-foreground/20 focus-visible:ring-accent"
                  />
                </AnimateOnScroll>

                <AnimateOnScroll delay={150} className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="border-foreground/20 focus-visible:ring-accent"
                  />
                </AnimateOnScroll>

                <AnimateOnScroll delay={200} className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Phone
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+971 50 123 4567"
                    className="border-foreground/20 focus-visible:ring-accent"
                  />
                </AnimateOnScroll>

                <AnimateOnScroll delay={250} className="space-y-2">
                  <Label htmlFor="message" className="text-base">
                    Reason for Contact
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="border-foreground/20 focus-visible:ring-accent"
                  />
                </AnimateOnScroll>

                <AnimateOnScroll delay={300}>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </Button>
                </AnimateOnScroll>
              </form>
            </div>

            <div className="space-y-8">
              <AnimateOnScroll>
                <h2 className="text-3xl md:text-4xl font-bold font-body">
                  Contact Details
                </h2>
                <div className="mt-4 space-y-3 text-base text-muted-foreground">
                  <p>
                    <strong>{displayName}</strong>
                  </p>
                  <p>
                    <strong>Email:</strong> {contactEmail}
                  </p>
                  {contactPhone && (
                    <p>
                      <strong>Phone:</strong> {contactPhone}
                    </p>
                  )}
                  {featuredAreas && (
                    <p>
                      <strong>Areas:</strong> {featuredAreas}
                    </p>
                  )}
                  {siteConfig?.organization.country && (
                    <p>
                      <strong>Country:</strong> {siteConfig.organization.country}
                    </p>
                  )}
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={100}>
                <h3 className="text-xl font-bold font-body">Follow Us</h3>
                <div className="mt-4">
                  <SocialIcons
                    links={{
                      instagram:
                        siteConfig?.branding?.instagram || siteConfig?.leadAgent?.instagram,
                      linkedin:
                        siteConfig?.branding?.linkedin || siteConfig?.leadAgent?.linkedin,
                      twitter: siteConfig?.branding?.twitter || siteConfig?.leadAgent?.twitter,
                      whatsapp:
                        siteConfig?.branding?.whatsapp || siteConfig?.leadAgent?.whatsapp,
                    }}
                  />
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <section>
        <AnimateOnScroll className="container mx-auto text-center">
          <h2 className="mb-6 text-2xl md:text-3xl font-body text-balance">
            Prefer to speak with us directly?
          </h2>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <a
              href={directLink}
              target={directLink.startsWith('http') ? '_blank' : undefined}
              rel={directLink.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {directLabel}
            </a>
          </Button>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
