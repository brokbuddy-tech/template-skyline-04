
'use client'

import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Button } from "../ui/button"
import { Phone, MessageSquare, Link as LinkIcon, Instagram, Facebook, Twitter, Linkedin } from "lucide-react"

export function AgentSidebar() {
  const agentImage = PlaceHolderImages.find((img) => img.id === 'founder-photo');
  
  const socialLinks = [
    { name: 'Copy Link', icon: LinkIcon },
    { name: 'WhatsApp', icon: MessageSquare },
    { name: 'Facebook', icon: Facebook },
    { name: 'X', icon: Twitter },
    { name: 'LinkedIn', icon: Linkedin },
  ]

  return (
    <div className="bg-[#1E1E24] rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
            {agentImage && (
                <div className="mb-4 inline-block">
                    <Image 
                        src={agentImage.imageUrl}
                        alt="Agent Saif Reham"
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                        data-ai-hint="professional agent portrait"
                    />
                </div>
            )}
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">SAIF REHAM</h3>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
                <Button size="lg" className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                    <Phone className="mr-2 h-4 w-4"/> CALL AGENT
                </Button>
                <Button size="lg" className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                    <MessageSquare className="mr-2 h-4 w-4"/> WHATSAPP
                </Button>
            </div>
            
            <div className="mt-8">
                <p className="text-sm text-white mb-4">CONNECT WITH SAIF</p>
                <div className="flex justify-center gap-4">
                    {socialLinks.map(social => (
                        <Button key={social.name} variant="outline" size="icon" className="h-10 w-10 rounded-full border-[#FFC107] bg-transparent hover:bg-[#FFC107]/10">
                            <social.icon className="h-5 w-5 text-white" />
                            <span className="sr-only">{social.name}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>

        <div className="border-t border-[#FFC107]/20 my-4" />

        <div className="p-6 text-white text-center">
            <h3 className="text-base font-semibold">Interested in this property? Request details below.</h3>
            <Button size="lg" className="w-full mt-4 bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                REGISTER YOUR INTEREST
            </Button>
        </div>
    </div>
  )
}
