'use client';

import {
  cloneElement,
  useMemo,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Building2, Loader2, Mail, MapPin, Phone, Square } from 'lucide-react';
import type { PropertyAgent, PropertyImage, SiteAgent } from '@/lib/types';

type BrochureButtonProps = {
  property: {
    title: string;
    location: string;
    price: number;
    sqft: number;
    type: string;
    description: string;
    images: PropertyImage[];
  };
  agent?: PropertyAgent | SiteAgent | null;
  children: ReactElement<{
    disabled?: boolean;
    children?: ReactNode;
  }>;
};

function getImageSrc(image?: PropertyImage | null) {
  if (!image) return null;
  return typeof image === 'string' ? image : image.src || image.originalSrc || image.thumbnailSrc || null;
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export function PropertyBrochureButton({ property, agent, children }: BrochureButtonProps) {
  const [isPreparing, setIsPreparing] = useState(false);
  const heroImage = useMemo(() => getImageSrc(property.images[0]), [property.images]);
  const galleryImages = useMemo(
    () =>
      property.images
        .map(image => getImageSrc(image))
        .filter((image): image is string => Boolean(image))
        .slice(0, 4),
    [property.images],
  );
  const summary = truncateText(property.description || 'Property details available on request.', 850);
  const phone = agent?.phone?.trim() || null;
  const email = agent?.email?.trim() || null;
  const company =
    (agent && 'company' in agent && typeof agent.company === 'string' ? agent.company.trim() : '') || 'Property Advisory';

  function handleDownload(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsPreparing(true);

    setTimeout(() => {
      window.print();
      setIsPreparing(false);
    }, 800);
  }

  return (
    <>
      <div onClick={handleDownload} className="w-full cursor-pointer">
        {cloneElement(children, {
          disabled: isPreparing,
          children: isPreparing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              PREPARING...
            </span>
          ) : (
            children.props.children
          ),
        })}
      </div>

      <div
        id="skyline-brochure-print-root"
        className="hidden print:block fixed inset-0 z-[99999] overflow-hidden bg-white text-slate-900"
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 0 !important;
                }
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 210mm !important;
                  height: 297mm !important;
                  overflow: hidden !important;
                  background: white !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                body > *:not(#skyline-brochure-print-root) {
                  display: none !important;
                }
                #skyline-brochure-print-root {
                  display: block !important;
                  position: fixed !important;
                  inset: 0 !important;
                  width: 210mm !important;
                  height: 297mm !important;
                  background: white !important;
                  z-index: 999999 !important;
                }
              }
            `,
          }}
        />

        <div className="flex h-[297mm] w-[210mm] flex-col overflow-hidden bg-white">
          <div className="flex items-center justify-between bg-[#1E88E5] px-10 py-6 text-white">
            <div>
              <p className="text-[9px] font-bold tracking-[0.45em] text-white/70 uppercase">Listing Brochure</p>
              <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight">{property.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold tracking-[0.3em] text-white/70 uppercase">Property Value</p>
              <p className="mt-2 text-2xl font-bold">AED {property.price.toLocaleString()}</p>
            </div>
          </div>

          <div className="relative h-[96mm] w-full bg-slate-100">
            {heroImage ? (
              <img src={heroImage} alt={property.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-10 pb-8 text-white">
              <div className="max-w-[62%]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
                <p className="mt-4 text-3xl font-bold uppercase tracking-tight">{property.type}</p>
              </div>
              <div className="rounded-2xl bg-white/12 px-5 py-4 text-right backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/70">Size</p>
                <p className="mt-2 flex items-center gap-2 text-xl font-bold">
                  <Square className="h-4 w-4" />
                  {property.sqft.toLocaleString()} sq.ft
                </p>
              </div>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-[1.5fr_0.9fr]">
            <div className="flex flex-col gap-8 px-10 py-8">
              {galleryImages.length > 1 ? (
                <div className="grid grid-cols-3 gap-3">
                  {galleryImages.slice(1).map((image, index) => (
                    <div key={`${image}-${index}`} className="h-[54mm] overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={image}
                        alt={`${property.title} view ${index + 2}`}
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#1E88E5]">Property Overview</p>
                <p className="mt-4 whitespace-pre-line text-[11px] leading-6 text-slate-600">
                  {summary}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-slate-50 px-8 py-8">
              <div>
                <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 text-center shadow-sm">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1E88E5]/10 text-[#1E88E5]">
                    <Building2 className="h-9 w-9" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-slate-900">{agent?.name || 'Listing Specialist'}</h2>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                    {agent?.title || 'Property Consultant'}
                  </p>
                </div>

                <div className="mt-8 space-y-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">Agency</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">{company}</p>
                  </div>
                  {phone ? (
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                        <Phone className="h-3.5 w-3.5" />
                        Contact
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-700">{phone}</p>
                    </div>
                  ) : null}
                  {email ? (
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </p>
                      <p className="mt-2 break-all text-sm font-semibold text-slate-700">{email}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[24px] bg-[#1E88E5] px-6 py-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/70">Why This Listing</p>
                <p className="mt-4 text-sm leading-6 text-white/90">
                  A polished presentation with live pricing, curated visuals, and direct advisor access for faster follow-up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
