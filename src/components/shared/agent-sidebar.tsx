
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
    <div className="bg-[#1E1E24] rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
            {agentImage && (
                <div className="mb-4 inline-block">
                    <Image 
                        src={agentImage.src}
                        alt={getAgentName(agent)}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                        data-ai-hint={agentImage.hint}
                        unoptimized={agentImage.unoptimized}
                    />
                </div>
            )}
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">{getAgentName(agent)}</h3>
            {subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
            
            <div className="mt-6 grid grid-cols-2 gap-3">
                <Button size="lg" asChild className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                    <a href={phone ? `tel:${phone}` : '/contact'}>
                    <Phone className="mr-2 h-4 w-4"/> CALL AGENT
                    </a>
                </Button>
                <Button size="lg" asChild className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                    <a href={toSocialUrl('whatsapp', whatsapp) || '/contact'} target="_blank" rel="noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4"/> WHATSAPP
                    </a>
                </Button>
            </div>
            
            {socials.length > 0 && (
            <div className="mt-8">
                <p className="text-sm text-white mb-4">CONNECT WITH {getAgentName(agent).split(' ')[0].toUpperCase()}</p>
                <div className="flex justify-center gap-4">
                    {socials.map(social => (
                        <Button key={social.name} variant="outline" size="icon" asChild className="h-10 w-10 rounded-full border-[#FFC107] bg-transparent hover:bg-[#FFC107]/10">
                          <a href={social.href!} target={social.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                            <social.icon className="h-5 w-5 text-white" />
                            <span className="sr-only">{social.name}</span>
                          </a>
                        </Button>
                    ))}
                </div>
            </div>
            )}
        </div>

        <div className="border-t border-[#FFC107]/20 my-4" />

        <div className="p-6 text-white text-center">
            <h3 className="text-base font-semibold">
              Interested in this property? Request details below.
            </h3>
            <Button size="lg" asChild className="w-full mt-4 bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-white rounded-full font-bold hover:opacity-90 transition-opacity">
              <Link href={property ? `/contact?listingId=${property.id}` : '/contact'}>
                REGISTER YOUR INTEREST
              </Link>
            </Button>
        </div>
    </div>
  )
}
