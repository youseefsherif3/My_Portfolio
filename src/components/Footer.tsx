import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';


const socialLinks = [
  { icon: 'CodeBracketIcon', label: 'GitHub', href: 'https://github.com/youseefsherif3' },
  { icon: 'LinkIcon', label: 'LinkedIn', href: 'https://www.linkedin.com/in/youseef-sherif' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          <AppLogo size={22} />
          <span className="font-mono text-xs font-semibold text-muted-foreground tracking-tight">
            Youseef<span className="text-primary">.</span>Sherif
          </span>
        </div>

        {/* Copyright */}
        <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <span className="text-muted-foreground/60">© 2025 Youseef Sherif. All rights reserved.</span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
            >
              <Icon name={s.icon as 'CodeBracketIcon'} size={14} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}