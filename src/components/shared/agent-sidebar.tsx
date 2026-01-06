
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white p-6">
            <div className="flex flex-col items-center text-center">
                {agentImage && (
                    <Image 
                        src={agentImage.imageUrl}
                        alt="Agent"
                        width={120}
                        height={120}
                        className="rounded-full object-cover mb-4 border-4 border-white shadow-md"
                        data-ai-hint="professional agent portrait"
                    />
                )}
                <h3 className="text-xl font-bold uppercase tracking-wider">SAIF REHAM</h3>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
                <Button size="lg" className="w-full bg-[#fdfbf5] hover:bg-[#e0e0ca] text-black">
                    <Phone className="mr-2 h-4 w-4"/> PHONE
                </Button>
                <Button size="lg" className="w-full bg-[#fdfbf5] hover:bg-[#e0e0ca] text-black">
                    <MessageSquare className="mr-2 h-4 w-4"/> WHATSAPP
                </Button>
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-sm uppercase font-semibold tracking-wider mb-3">Share this property</p>
                <div className="flex justify-center gap-3">
                    {socialLinks.map(social => (
                        <Button key={social.name} variant="default" size="icon" className="h-10 w-10 rounded-full bg-[#fdfbf5] hover:bg-[#e0e0ca] text-black">
                            <social.icon className="h-4 w-4" />
                            <span className="sr-only">{social.name}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
        <div className="bg-white p-6 text-black text-center">
            <h3 className="text-lg font-bold">Register Your Interest</h3>
            <p className="text-sm mt-2 mb-4">For more information or to view the full brochure, fill out the form.</p>
            <Button variant="outline" className="w-full uppercase border-black text-black hover:bg-black hover:text-white">
                Register Interest
            </Button>
        </div>
    </div>
  )
}
