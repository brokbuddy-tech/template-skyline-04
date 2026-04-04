
'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import { Phone, MessageSquare, Link as LinkIcon, Facebook, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import type { Property, PropertyAgent, SiteAgent } from "@/lib/types"
import { resolveImage } from "@/lib/property-media"
import { toSocialUrl } from "@/lib/api"

function getAgentName(agent?: PropertyAgent | SiteAgent | null) {
  return agent?.name || 'Skyline Agent';
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
  const agentImage = resolveImage((agent as PropertyAgent | undefined)?.avatarUrl || (agent as SiteAgent | undefined)?.avatar || 'founder-photo', 'founder-photo');
  const phone = agent?.phone || undefined;
  const whatsapp = agent?.whatsapp || phone || undefined;
  const subtitle = getAgentSubtitle(agent);
  const socials = [
    { name: 'Copy Link', icon: LinkIcon, href: property ? `/properties/${property.id}` : null },
    { name: 'WhatsApp', icon: MessageSquare, href: toSocialUrl('whatsapp', whatsapp) },
    { name: 'Facebook', icon: Facebook, href: null },
    { name: 'X', icon: Twitter, href: toSocialUrl('twitter', agent?.twitter) },
    { name: 'LinkedIn', icon: Linkedin, href: toSocialUrl('linkedin', agent?.linkedin) },
  ].filter(item => item.href);
  
  return (
    <div className="flex flex-col gap-4">
      {/* Top Card */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
        {/* Banner */}
        <div className="h-[104px] bg-[#1E88E5] w-full relative overflow-hidden">
          {/* Subtle circles in background as seen in design */}
          <div className="absolute top-3 left-8 w-[100px] h-[100px] bg-black/5 rounded-full"></div>
          <div className="absolute top-2 -right-8 w-32 h-32 bg-black/5 rounded-full"></div>
        </div>
        
        {/* Profile Content */}
        <div className="p-6 pt-0 relative flex flex-col items-center">
          <div className="relative -mt-[52px]">
            {agentImage ? (
              <Image 
                  src={agentImage.src}
                  alt={getAgentName(agent)}
                  width={104}
                  height={104}
                  className="rounded-full border-[5px] border-white object-cover bg-white shadow-sm w-[104px] h-[104px]"
                  data-ai-hint={agentImage.hint}
                  unoptimized={agentImage.unoptimized}
              />
            ) : (
              <div className="w-[104px] h-[104px] rounded-full border-[5px] border-white bg-slate-100 flex items-center justify-center shadow-sm">
                 <span className="text-2xl text-slate-400">{getAgentName(agent).charAt(0)}</span>
              </div>
            )}
            <div className="absolute bottom-[6px] right-[6px] w-[14px] h-[14px] bg-[#22C55E] border-2 border-white rounded-full"></div>
          </div>
          
          <div className="text-center mt-3 w-full">
            <h3 className="text-xl font-bold text-[#1A1A24]">{getAgentName(agent)}</h3>
            {subtitle && <p className="text-[14px] text-slate-500 mt-0.5 font-light">{subtitle}</p>}
          </div>
          
          <div className="mt-6 flex flex-col gap-[10px] w-full">
            <Button size="lg" asChild className="w-full bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-[10px] h-11 font-semibold transition-colors shadow-sm">
                <a href={phone ? `tel:${phone}` : '/contact'}>
                <Phone className="mr-2 h-[18px] w-[18px]"/> CALL AGENT
                </a>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5]/5 rounded-[10px] h-11 font-semibold transition-colors">
                <a href={toSocialUrl('whatsapp', whatsapp) || '/contact'} target="_blank" rel="noreferrer">
                <MessageSquare className="mr-2 h-[18px] w-[18px]"/> WHATSAPP
                </a>
            </Button>
          </div>
          
          {socials.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-6 w-full text-center">
              <p className="text-[11px] font-bold text-slate-400 mb-4 tracking-wider">CONNECT WITH {getAgentName(agent).split(' ')[0].toUpperCase()}</p>
              <div className="flex justify-center gap-3">
                  {socials.map(social => (
                      <Button key={social.name} variant="ghost" size="icon" asChild className="h-10 w-10 text-[#1E88E5] bg-[#1E88E5]/5 hover:bg-[#1E88E5]/15 rounded-full transition-colors">
                        <a href={social.href!} target={social.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                          <social.icon className="h-[18px] w-[18px]" />
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
      <div className="bg-[#1E88E5] rounded-[24px] p-6 text-white text-center shadow-[0_8px_30px_rgb(30,136,229,0.15)] flex flex-col justify-center">
          <p className="text-[15px] font-medium tracking-tight mb-5 px-2">
            Interested in this property? Request details below.
          </p>
          <Button size="lg" variant="outline" asChild className="w-full bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white rounded-[10px] h-11 font-semibold transition-colors">
            <Link href={property ? `/contact?listingId=${property.id}` : '/contact'}>
              REGISTER YOUR INTEREST
            </Link>
          </Button>
      </div>
    </div>
  )
}
