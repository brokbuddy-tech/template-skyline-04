
'use client';

import type { FormEvent } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrgInquiry } from '@/hooks/use-org-inquiry';
import type { Property } from '@/lib/types';
import { X } from 'lucide-react';

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

export function DownloadBrochureModal({
  property,
  onSuccess,
}: {
  property: Property;
  onSuccess?: () => void;
}) {
  const { isSubmitting, submitInquiry } = useOrgInquiry();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = await submitInquiry(
      {
        name: getFormValue(formData, 'name'),
        email: getFormValue(formData, 'email'),
        phone: getFormValue(formData, 'phone'),
        message: `Please share the brochure for ${property.title}.`,
        listingId: property.id,
        propertyType: property.type,
        budget: property.price,
      },
      {
        successTitle: 'Brochure request sent',
        successDescription: `Our team will share details for ${property.title} shortly.`,
      }
    );

    if (result.ok) {
      form.reset();
      onSuccess?.();
    }
  }

  return (
    <DialogContent className="bg-white text-slate-900 rounded-xl p-8 shadow-lg max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-slate-900 text-left">
          Download the Brochure
        </DialogTitle>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogHeader>
      <p className="mt-4 text-sm text-slate-600">
        Share your details and our team will send the brochure for {property.title}.
      </p>
      <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Enter your full name"
            className="bg-gray-50 border-gray-200 rounded-md focus:ring-blue-950 focus:border-blue-950"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="bg-gray-50 border-gray-200 rounded-md focus:ring-blue-950 focus:border-blue-950"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex">
            <div className="flex items-center justify-center bg-gray-50 border border-r-0 border-gray-200 rounded-l-md px-3">
              <span role="img" aria-label="UAE Flag">🇦🇪</span>
              <span className="text-sm ml-2 text-gray-600">+971</span>
            </div>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+971 50 123 4567"
              className="bg-gray-50 border-gray-200 rounded-l-none rounded-r-md focus:ring-blue-950 focus:border-blue-950 z-10 -ml-px"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white rounded-md h-12 text-base hover:bg-slate-800"
        >
          {isSubmitting ? 'Sending...' : 'Request Brochure'}
        </Button>
      </form>
    </DialogContent>
  );
}
