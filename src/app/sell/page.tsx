
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrgInquiry } from '@/hooks/use-org-inquiry';
import { getSiteConfig } from '@/lib/api';
import { getEffectiveAgencySlug, resolveAgencySlugFromPathname } from '@/lib/agency-routing';
import type { SiteConfig } from '@/lib/types';
import { MapPin, Users, CalendarClock } from 'lucide-react';
import { Award, Handshake, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Accurate, Market-Led Valuations',
    description: 'Our valuations are based on real-time data and deep market knowledge, ensuring you list at the right price to attract serious buyers.'
  },
  {
    icon: Users,
    title: 'Serious Buyers, Ready to Move',
    description: "Gain exclusive access to one of Dubai's largest networks of pre-qualified buyers who are actively looking for properties like yours."
  },
  {
    icon: Award,
    title: 'Marketing That Makes an Impact',
    description: 'We utilize professional photography, premium listings, and targeted digital campaigns to make your property stand out from the crowd.'
  },
  {
    icon: Handshake,
    title: 'Personal Service, Start to Sold',
    description: 'Your dedicated agent handles everything from viewings to negotiations, providing expert guidance and regular updates every step of the way.'
  }
];

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

export default function SellPage() {
  const pathname = usePathname();
  const agencySlug = getEffectiveAgencySlug(resolveAgencySlugFromPathname(pathname));
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [offeringType, setOfferingType] = useState('sale');
  const { isSubmitting, submitInquiry } = useOrgInquiry();

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      const config = await getSiteConfig(agencySlug);
      if (active) setSiteConfig(config);
    }

    void loadConfig();

    return () => {
      active = false;
    };
  }, [agencySlug]);

  const displayName =
    siteConfig?.branding?.displayName || siteConfig?.organization.name || 'Agency Website';
  const agentsCount = siteConfig?.stats?.activeAgents || 300;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = getFormValue(formData, 'firstName');
    const lastName = getFormValue(formData, 'lastName');
    const address = getFormValue(formData, 'address');
    const preferredDate = getFormValue(formData, 'preferredDate');
    const preferredTime = getFormValue(formData, 'preferredTime');

    const result = await submitInquiry(
      {
        name: `${firstName} ${lastName}`.trim(),
        email: getFormValue(formData, 'email'),
        phone: getFormValue(formData, 'phone'),
        propertyType: offeringType,
        message: [
          `Valuation request for a property listed ${offeringType === 'rent' ? 'for rent' : 'for sale'}.`,
          address ? `Address: ${address}.` : null,
          preferredDate ? `Preferred date: ${preferredDate}.` : null,
          preferredTime ? `Preferred time: ${preferredTime}.` : null,
        ]
          .filter(Boolean)
          .join(' '),
      },
      {
        successTitle: 'Valuation request sent',
        successDescription: 'Our team will contact you to confirm the next steps.',
      }
    );

    if (result.ok) {
      form.reset();
      setOfferingType('sale');
    }
  }

  return (
    <div className="bg-background">
      {/* Section 1: The Valuation Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Column A: The Pitch */}
          <div className="lg:pr-8">
            <AnimateOnScroll>
              <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground mb-6 text-balance">
                List Your Property with {displayName}
              </h1>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Knowing your property's true value is the smartest place to start when considering a sale. At {displayName}, we combine market data with local expertise to provide an accurate, obligation-free valuation.
                </p>
                <p>
                  Our process is quick, straightforward, and designed to give you the clarity you need to make informed decisions. Let us show you what your property is worth today.
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <div className="mt-12 flex flex-col sm:flex-row justify-start gap-8 text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start gap-2">
                  <MapPin className="w-8 h-8 text-accent" />
                  <p className="font-bold">Unrivalled Local Knowledge</p>
                </div>
                <div className="flex flex-col items-center sm:items-start gap-2">
                  <Users className="w-8 h-8 text-accent" />
                  <p className="font-bold">{agentsCount}+ Community Experts</p>
                </div>
                <div className="flex flex-col items-center sm:items-start gap-2">
                  <CalendarClock className="w-8 h-8 text-accent" />
                  <p className="font-bold">Available 24/7</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Column B: The Valuation Form */}
          <AnimateOnScroll delay={200}>
            <form className="bg-white dark:bg-muted p-8 rounded-xl shadow-xl border border-border" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" name="firstName" type="text" placeholder="John" required />
                </div>
                <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" name="lastName" type="text" placeholder="Doe" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+971 50 123 4567" />
                    </div>
                </div>
                 <div>
                    <Label htmlFor="offering-type">Offering Type</Label>
                     <Select value={offeringType} onValueChange={setOfferingType}>
                        <SelectTrigger id="offering-type">
                            <SelectValue placeholder="Select offering type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sale">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="address">Property Address</Label>
                    <Input id="address" name="address" type="text" placeholder="Dubai Marina, Palm Jumeirah, Downtown..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input id="date" name="preferredDate" type="date" />
                    </div>
                    <div>
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input id="time" name="preferredTime" type="time" />
                    </div>
                </div>
                <Button type="submit" size="lg" className="w-full uppercase tracking-wide font-bold" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Request...' : 'Book Your Valuation'}
                </Button>
              </div>
            </form>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Section 2: "Why Sell With Us?" */}
      <section className="bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <AnimateOnScroll className="text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">Why Sell With Us?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
              At {displayName}, selling your property is more than a transaction: it is a partnership built on live market insight, responsive communication, and organization-managed branding that keeps every public touchpoint current.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center md:text-left">
                  <feature.icon className="w-10 h-10 text-accent mb-4 mx-auto md:mx-0" />
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
