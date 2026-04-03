'use client';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Instagram, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { toSocialUrl } from '@/lib/api';

type SocialIconLinks = {
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  whatsapp?: string | null;
};

export function SocialIcons({ links }: { links?: SocialIconLinks }) {
  const socialLinks = [
    {
      href: toSocialUrl('instagram', links?.instagram),
      icon: Instagram,
      name: 'Instagram',
      hoverColor: 'group-hover:bg-[#d62976]',
    },
    {
      href: toSocialUrl('twitter', links?.twitter),
      icon: Twitter,
      name: 'Twitter',
      hoverColor: 'group-hover:bg-[#00acee]',
    },
    {
      href: toSocialUrl('linkedin', links?.linkedin),
      icon: Linkedin,
      name: 'LinkedIn',
      hoverColor: 'group-hover:bg-[#0072b1]',
    },
    {
      href: toSocialUrl('whatsapp', links?.whatsapp),
      icon: MessageSquare,
      name: 'WhatsApp',
      hoverColor: 'group-hover:bg-[#128C7E]',
    },
  ].filter((social): social is {
    href: string;
    icon: LucideIcon;
    name: string;
    hoverColor: string;
  } => Boolean(social.href));

  if (socialLinks.length === 0) return null;

  return (
    <div className="flex items-center justify-start gap-4 p-2">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          aria-label={social.name}
          target="_blank"
          rel="noreferrer"
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
