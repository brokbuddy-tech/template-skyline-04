'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import { Phone, MessageSquare, Link as LinkIcon, Facebook, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import type { Property, PropertyAgent, SiteAgent } from "@/lib/types"
import { resolveImage } from "@/lib/property-media"
import { toSocialUrl } from "@/lib/api"
import { prefixAgencyPath, resolveAgencySlugFromPathname } from "@/lib/agency-routing"
import { usePathname } from "next/navigation"

function getAgentName(agent?: PropertyAgent | SiteAgent | null) {
  return agent?.name || 'Assigned Agent';
}

function getAgentSubtitle(agent?: PropertyAgent | SiteAgent | null) {
  if (!agent) return null;
  if ('tagline' in agent && agent.tagline) return agent.tagline;
  if ('title' in agent && agent.title) return agent.title;
  return null;
}

export function AgentSidebar({
  agent,
  property,
}: {
  agent?: PropertyAgent | SiteAgent | null;
  property?: Pick<Property, 'id' | 'title'>;
}) {
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const agentImage = resolveImage((agent as PropertyAgent | undefined)?.avatarUrl || (agent as SiteAgent | undefined)?.avatar || 'founder-photo', 'founder-photo');
  const phone = agent?.phone || undefined;
  const whatsapp = agent?.whatsapp || phone || undefined;
  const subtitle = getAgentSubtitle(agent);
  const socials = [
    { name: 'Copy Link', icon: LinkIcon, href: property ? prefixAgencyPath(`/properties/${property.id}`, agencySlug) : null },
    { name: 'WhatsApp', icon: MessageSquare, href: toSocialUrl('whatsapp', whatsapp) },
    { name: 'Facebook', icon: Facebook, href: null },
    { name: 'X', icon: Twitter, href: toSocialUrl('twitter', agent?.twitter) },
    { name: 'LinkedIn', icon: Linkedin, href: toSocialUrl('linkedin', agent?.linkedin) },
  ].filter(item => item.href);

  return (
    <div className="flex flex-col gap-3">
      {/* Top Card */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
        {/* Banner */}
        <div className="relative z-0 h-[72px] w-full overflow-hidden bg-[#1E88E5]">
          {/* Subtle circles in background as seen in design */}
          <div className="absolute top-2 left-6 w-[80px] h-[80px] bg-black/5 rounded-full"></div>
          <div className="absolute top-0 -right-8 w-28 h-28 bg-black/5 rounded-full"></div>
        </div>

        {/* Profile Content */}
        <div className="relative z-10 flex flex-col items-center p-4 pt-0">
          <div className="relative z-10 -mt-[40px]">
            {agentImage ? (
              <Image
                src={agentImage.src}
                alt={getAgentName(agent)}
                width={104}
                height={104}
                className="h-[100px] w-[100px] rounded-full border-[5px] border-white bg-white object-cover object-top shadow-sm"
                data-ai-hint={agentImage.hint}
                unoptimized={agentImage.unoptimized}
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full border-[5px] border-white bg-slate-100 flex items-center justify-center shadow-sm">
                <span className="text-2xl text-slate-400">{getAgentName(agent).charAt(0)}</span>
              </div>
            )}
            <div className="absolute bottom-[6px] right-[6px] w-[14px] h-[14px] bg-[#22C55E] border-2 border-white rounded-full"></div>
          </div>

          <div className="text-center mt-2 w-full">
            <h3 className="text-lg font-bold text-[#1A1A24]">{getAgentName(agent)}</h3>
            {subtitle && <p className="text-[13px] text-slate-500 mt-0.5 font-light">{subtitle}</p>}
          </div>

          <div className="mt-4 flex flex-col gap-2 w-full">
            <Button size="sm" asChild className="w-full bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-[10px] h-10 font-semibold transition-colors shadow-sm">
              <a href={phone ? `tel:${phone}` : prefixAgencyPath('/contact', agencySlug)}>
                <Phone className="mr-2 h-4 w-4" /> CALL AGENT
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="w-full border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5]/5 rounded-[10px] h-10 font-semibold transition-colors">
              <a href={toSocialUrl('whatsapp', whatsapp) || prefixAgencyPath('/contact', agencySlug)} target="_blank" rel="noreferrer">
                <MessageSquare className="mr-2 h-4 w-4" /> WHATSAPP
              </a>
            </Button>
          </div>

          {socials.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4 w-full text-center">
              <p className="text-[10px] font-bold text-slate-400 mb-3 tracking-wider">CONNECT WITH {getAgentName(agent).split(' ')[0].toUpperCase()}</p>
              <div className="flex justify-center gap-2">
                {socials.map(social => (
                  <Button key={social.name} variant="ghost" size="icon" asChild className="h-9 w-9 text-[#1E88E5] bg-[#1E88E5]/5 hover:bg-[#1E88E5]/15 rounded-full transition-colors">
                    <a href={social.href!} target={social.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                      <social.icon className="h-4 w-4" />
                      <span className="sr-only">{social.name}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Card */}
      <div className="bg-[#1E88E5] rounded-[24px] p-4 text-white text-center shadow-[0_8px_30px_rgb(30,136,229,0.15)] flex flex-col justify-center">
        <p className="text-[14px] font-medium tracking-tight mb-3 px-2">
          Interested in this property? Request details below.
        </p>
        <Button size="sm" variant="outline" asChild className="w-full bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white rounded-[10px] h-10 font-semibold transition-colors">
          <Link href={property ? prefixAgencyPath(`/contact?listingId=${property.id}`, agencySlug) : prefixAgencyPath('/contact', agencySlug)}>
            REGISTER YOUR INTEREST
          </Link>
        </Button>
      </div>
    </div>
  )
}
