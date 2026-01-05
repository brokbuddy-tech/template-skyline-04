
'use client';

import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, CalendarClock } from 'lucide-react';
import { Award, Handshake, Search, TrendingUp } from 'lucide-react';

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

export default function SellPage() {
  return (
    <div className="bg-background">
      {/* Section 1: The Valuation Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Column A: The Pitch */}
          <div className="lg:pr-8">
            <AnimateOnScroll>
              <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground mb-6 text-balance">
                List Your Property with Monks Estate
              </h1>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Knowing your property's true value is the smartest place to start when considering a sale. At Monks Estate, we combine cutting-edge data with our team's deep market expertise to provide you with an accurate, obligation-free valuation.
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
                  <p className="font-bold">300+ Community Experts</p>
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
            <form className="bg-white dark:bg-muted p-8 rounded-xl shadow-xl border border-border">
              <div className="grid grid-cols-1 gap-6">
                <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" type="text" placeholder="John" />
                </div>
                <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" type="text" placeholder="Doe"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 234 567 8900" />
                    </div>
                </div>
                 <div>
                    <Label htmlFor="offering-type">Offering Type</Label>
                     <Select>
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
                    <Input id="address" type="text" placeholder="123 Luxury Lane, Beverly Hills, CA"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input id="date" type="date" />
                    </div>
                    <div>
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input id="time" type="time" />
                    </div>
                </div>
                <Button type="submit" size="lg" className="w-full uppercase tracking-wide font-bold">
                  Book Your Valuation
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
              At Monks Estate, selling your property is more than a transaction—it's a partnership. We dedicate ourselves to achieving your goals with personalized service and unparalleled market expertise.
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
