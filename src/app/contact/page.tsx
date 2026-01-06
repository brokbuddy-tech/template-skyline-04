
'use client';

import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SocialIcons } from '@/components/shared/social-icons';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="bg-background">
      {/* 1. Page Hero */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto text-center">
          <AnimateOnScroll>
            <h1 className="text-6xl md:text-8xl font-headline font-medium text-balance">
              Get in Touch
            </h1>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="pt-0">
        <AnimateOnScroll>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {/* A) Left Column: The Contact Form */}
            <div className="space-y-8">
              <AnimateOnScroll>
                <h2 className="text-3xl md:text-4xl font-bold font-body">Send Us a Message</h2>
              </AnimateOnScroll>
              <form className="space-y-6">
                <AnimateOnScroll delay={100} className="space-y-2">
                  <Label htmlFor="name" className="text-base">Name</Label>
                  <Input type="text" id="name" placeholder="Your Name" className="border-foreground/20 focus-visible:ring-accent" />
                </AnimateOnScroll>
                <AnimateOnScroll delay={200} className="space-y-2">
                  <Label htmlFor="reason" className="text-base">Reason for Contact</Label>
                  <Textarea id="reason" placeholder="Tell us how we can help..." rows={6} className="border-foreground/20 focus-visible:ring-accent" />
                </AnimateOnScroll>
                <AnimateOnScroll delay={300}>
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    Submit
                  </Button>
                </AnimateOnScroll>
              </form>
            </div>

            {/* B) Right Column: Details & Socials */}
            <div className="space-y-8">
              <AnimateOnScroll>
                <h2 className="text-3xl md:text-4xl font-bold font-body">Contact Details</h2>
                <div className="mt-4 space-y-3 text-muted-foreground text-base">
                  <p><strong>Email:</strong> hello@skylines.com</p>
                  <p><strong>Phone:</strong> +1 (234) 567-8900</p>
                  <p><strong>Address:</strong> 123 Luxury Lane, Beverly Hills, CA 90210</p>
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll delay={100}>
                <h3 className="text-xl font-bold font-body">Follow Us</h3>
                <div className="mt-4">
                  <SocialIcons />
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* 3. "Book a Meeting" Section */}
      <section>
        <AnimateOnScroll className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-body mb-6 text-balance">
            Prefer to speak with us directly?
          </h2>
          <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <Link href="https://calendly.com" target="_blank" rel="noopener noreferrer">
              Book a Meeting
            </Link>
          </Button>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
