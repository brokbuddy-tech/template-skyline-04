
'use client'

import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Button } from "../ui/button"
import { Phone, MessageSquare, Link as LinkIcon, Instagram, Facebook, Twitter, Linkedin, FileDown } from "lucide-react"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { DownloadBrochureModal } from "./download-brochure-modal"

export function AgentSidebar() {
  const agentImage = PlaceHolderImages.find((img) => img.id === 'founder-photo');
  
  const socialLinks = [
    { name: 'Copy Link', icon: LinkIcon },
    { name: 'WhatsApp', icon: MessageSquare },
    { name: 'Facebook', icon: Facebook },
    { name: 'Instagram', icon: Instagram },
    { name: 'X', icon: Twitter },
    { name: 'LinkedIn', icon: Linkedin },
  ]

  return (
    <Dialog>
      <div className="lg:absolute lg:top-0 lg:w-full">
        <div className="border rounded-lg p-6">
          <div className="flex flex-col items-center text-center">
              {agentImage && (
                  <Image 
                      src={agentImage.imageUrl}
                      alt="Agent"
                      width={120}
                      height={120}
                      className="rounded-full object-cover mb-4"
                  />
              )}
              <h3 className="text-xl font-bold">Alex Monks</h3>
              <p className="text-muted-foreground">Lead Agent</p>
          </div>
          
          <div className="mt-6 space-y-3">
              <Button size="lg" className="w-full bg-[#ff3223] hover:bg-[#ff3223]/90">
                  <Phone className="mr-2 h-4 w-4"/> Call Agent
              </Button>
              <Button size="lg" variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <MessageSquare className="mr-2 h-4 w-4"/> Message
              </Button>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="w-full">
                    <FileDown className="mr-2 h-4 w-4"/> Download Brochure
                </Button>
              </DialogTrigger>
          </div>
          
          <div className="mt-6 text-center">
              <p className="text-sm font-medium mb-3">Share this property</p>
              <div className="flex justify-center gap-3">
                  {socialLinks.map(social => (
                       <Button key={social.name} variant="outline" size="icon" className="h-10 w-10">
                          <social.icon className="h-4 w-4" />
                          <span className="sr-only">{social.name}</span>
                      </Button>
                  ))}
              </div>
          </div>
        </div>
      </div>
      <DownloadBrochureModal />
    </Dialog>
  )
}
