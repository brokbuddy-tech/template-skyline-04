'use client';
import { cn } from '@/lib/utils';
import { Instagram, Twitter, Linkedin, MessageSquare } from 'lucide-react';

const socialLinks = [
  { href: '#', icon: Instagram, name: 'Instagram', hoverColor: 'group-hover:bg-[#d62976]' },
  { href: '#', icon: Twitter, name: 'Twitter', hoverColor: 'group-hover:bg-[#00acee]' },
  { href: '#', icon: Linkedin, name: 'LinkedIn', hoverColor: 'group-hover:bg-[#0072b1]' },
  { href: '#', icon: MessageSquare, name: 'WhatsApp', hoverColor: 'group-hover:bg-[#128C7E]' },
];

export function SocialIcons() {
  return (
    <div className="flex items-center justify-start gap-4 p-2">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          aria-label={social.name}
          className={cn(
            'group relative w-14 h-14 bg-background border border-[#EAEAEA] rounded-lg',
            'flex items-center justify-center overflow-hidden transition-all duration-300'
          )}
        >
          <div className={cn(
            "absolute inset-0 -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out",
            social.hoverColor
          )}></div>
          <social.icon className="w-6 h-6 text-black dark:text-white transition-colors duration-300 ease-in-out group-hover:text-white z-10" />
        </a>
      ))}
    </div>
  );
}
