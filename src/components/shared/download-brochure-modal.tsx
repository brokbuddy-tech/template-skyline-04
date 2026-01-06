
'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

export function DownloadBrochureModal() {
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
      <form className="space-y-6 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            className="bg-gray-50 border-gray-200 rounded-md focus:ring-blue-950 focus:border-blue-950"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
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
              type="tel"
              placeholder="50 123 4567"
              className="bg-gray-50 border-gray-200 rounded-l-none rounded-r-md focus:ring-blue-950 focus:border-blue-950 z-10 -ml-px"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-slate-900 text-white rounded-md h-12 text-base hover:bg-slate-800"
        >
          Download Now
        </Button>
      </form>
    </DialogContent>
  );
}
