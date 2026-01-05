
'use client';

import type { Property } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { EmaarLogo } from '@/components/shared/developer-logos';
import {
  ChevronRight,
  Check,
  HelpCircle,
  FileDown,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface OffPlanPropertyPageProps {
  property: Property;
}

export function OffPlanPropertyPage({ property }: { property: Property }) {
  const timelineSteps = [
    {
      label: 'Project Announcement',
      date: 'May 20, 2025',
      completed: true,
    },
    {
      label: 'Booking Started',
      date: 'June 10, 2025',
      completed: true,
    },
    {
      label: 'Construction Started',
      date: 'June 11, 2025',
      completed: true,
    },
    {
      label: 'Expected Completion',
      date: 'July 31, 2029',
      completed: false,
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-12 gap-x-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8">
          {/* Section A: Header & Developer Info */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[#1E1E2C] mb-2">
              Launch Price 1.9M AED*
            </h1>
            <p className="text-xs text-gray-500">
              *Prices and availability subject to change without notice.
            </p>

            <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-md border border-gray-200">
                  <EmaarLogo className="w-16 h-auto" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E1E2C]">
                    Emaar Properties
                  </p>
                  <Link
                    href="#"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View developer details
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Key Information Grid */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">
              Key information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Delivery Date
                </p>
                <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                  July 2029
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Sale Starts
                </p>
                <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                  June 10, 2025
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Location
                </p>
                <p className="text-base text-blue-600 font-semibold mt-1 hover:underline cursor-pointer">
                  Dubai, Dubai Creek Harbour...
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Payment Plan
                </p>
                <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                  10/70/20
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Buildings
                </p>
                <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                  1
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Property Types
                </p>
                <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                  Apartment, Townhouse
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Govt Fee
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Government fees and taxes</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                  4%
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Ownership
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ownership type</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                  Freehold
                </p>
              </div>
            </div>
          </div>

          {/* Section C: Payment Plan Visualization */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">
              Payment plan
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-gray-50 rounded-xl p-6 flex-1 text-center border border-gray-100 min-w-[140px] w-full">
                <p className="text-3xl font-bold text-[#1E1E2C]">10%</p>
                <p className="text-sm font-semibold text-[#1E1E2C] mt-1">
                  Down payment
                </p>
                <p className="text-xs text-gray-500 mt-1">At sales launch</p>
              </div>
              <ChevronRight className="text-gray-300 hidden md:block" />
              <div className="bg-gray-50 rounded-xl p-6 flex-1 text-center border border-gray-100 min-w-[140px] w-full">
                <p className="text-3xl font-bold text-[#1E1E2C]">70%</p>
                <p className="text-sm font-semibold text-[#1E1E2C] mt-1">
                  During construction
                </p>
                <p className="text-xs text-gray-500 mt-1">7 Installments</p>
              </div>
              <ChevronRight className="text-gray-300 hidden md:block" />
              <div className="bg-gray-50 rounded-xl p-6 flex-1 text-center border border-gray-100 min-w-[140px] w-full">
                <p className="text-3xl font-bold text-[#1E1E2C]">20%</p>
                <p className="text-sm font-semibold text-[#1E1E2C] mt-1">
                  On handover
                </p>
                <p className="text-xs text-gray-500 mt-1">July 2029</p>
              </div>
            </div>
          </div>

          {/* Section D: Project Timeline */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">
              Project timeline
            </h2>
            <div className="bg-[#F8FAFC] rounded-2xl p-8">
              <div className="relative">
                {timelineSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-6 pb-8 last:pb-0"
                  >
                    <div className="relative">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-blue-600'
                            : 'bg-white border-2 border-gray-300'
                        }`}
                      >
                        {step.completed && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 h-full w-0.5 ${
                            step.completed
                              ? 'bg-blue-600'
                              : 'border-l-2 border-dashed border-gray-300'
                          }`}
                          style={{ top: '1.25rem' }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E1E2C]">
                        {step.label}
                      </p>
                      <p className="text-sm text-gray-500">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-24">
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-[#1E1E2C] mb-4">
                Interested in Lyvia?
              </h3>
              <form className="space-y-4">
                <Input placeholder="Name" />
                <Input placeholder="Phone" type="tel" />
                <Input placeholder="Email" type="email" />
                <ToggleGroup type="single" defaultValue="end-user" className="w-full">
                  <ToggleGroupItem value="investor" className="w-full">I am an Investor</ToggleGroupItem>
                  <ToggleGroupItem value="end-user" className="w-full">I am an End User</ToggleGroupItem>
                </ToggleGroup>
                <Button className="w-full bg-[#1E1E2C] hover:bg-[#1E1E2C]/90 text-white">
                  Register Interest
                </Button>
                <Button variant="outline" className="w-full">
                  <FileDown className="w-4 h-4 mr-2" />
                  Download Brochure
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp Agent
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
