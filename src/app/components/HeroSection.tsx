'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const codeLines = [
  { indent: 0, code: 'const developer = {', color: 'text-foreground' },
  { indent: 1, code: 'name: "Youseef Sherif",', color: 'text-primary' },
  { indent: 1, code: 'role: "Backend Developer",', color: 'text-primary' },
  { indent: 1, code: 'stack: ["Node.js", "Express.js", "NestJS", "MongoDB"],', color: 'text-primary' },
  { indent: 1, code: 'also: ["TypeScript", "React.js", "PostgreSQL"],', color: 'text-primary' },
  { indent: 1, code: 'status: "open_to_work",', color: 'text-accent' },
  { indent: 0, code: '};', color: 'text-foreground' },
  { indent: 0, code: '', color: '' },
  { indent: 0, code: 'developer.buildSomethingGreat();', color: 'text-muted-foreground' },
];

const stats = [
  { value: '4+', label: 'Projects Built' },
  { value: 'Node.js', label: 'Core Stack' },
  { value: 'REST', label: 'API Expert' },
  { value: '100%', label: 'Dedication' },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= codeLines.length) clearInterval(interval);
    }, 120);

    const buttons = document.querySelectorAll('.magnetic-btn');
    const handlers: Array<{ el: Element; move: (e: MouseEvent) => void; leave: () => void }> = [];

    buttons.forEach((btn) => {
      const move = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        (btn as HTMLElement).style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      };
      const leave = () => {
        (btn as HTMLElement).style.transform = 'translate(0, 0)';
        (btn as HTMLElement).style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      };
      btn.addEventListener('mousemove', move as EventListener);
      btn.addEventListener('mouseleave', leave);
      handlers.push({ el: btn, move: move as (e: MouseEvent) => void, leave });
    });

    const handleScroll = () => {
      if (textRef.current) {
        const scrollY = window.scrollY;
        textRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
        textRef.current.style.opacity = `${1 - scrollY / 600}`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move as EventListener);
        el.removeEventListener('mouseleave', leave);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="about"
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Atmospheric depth layers */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="blob-accent absolute top-1/4 right-1/4 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] opacity-60" />
        <div className="blob-secondary absolute bottom-1/3 left-1/3 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(14,207,207,1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,207,207,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="scan-line" />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div ref={textRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Hero Text */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 w-fit">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[9px] sm:text-[10px] font-bold text-primary tracking-[0.25em] sm:tracking-[0.35em] uppercase">
                Available for opportunities
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-hero font-extrabold text-foreground leading-tight">
              Backend<br />
              <span className="gradient-text glow-text">Developer.</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl font-light">
              I&apos;m Youseef Sherif — I architect and build high-performance, scalable backend systems with Node.js,
              specializing in RESTful APIs and real-time applications.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-1 sm:mt-2">
              <button
                onClick={scrollToProjects}
                className="magnetic-btn w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full font-bold text-xs sm:text-sm tracking-wide hover:shadow-glow-md transition-all duration-300"
              >
                View My Work
                <Icon name="ArrowDownIcon" size={14} />
              </button>
              <button
                onClick={scrollToContact}
                className="magnetic-btn w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-8 py-3 sm:py-4 border border-border text-foreground rounded-full font-bold text-xs sm:text-sm tracking-wide hover:border-primary/40 hover:text-primary transition-all duration-300"
              >
                Contact Me
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 mt-2 sm:mt-4 pt-4 sm:pt-6 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-lg sm:text-xl font-bold text-primary">{stat.value}</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Terminal Card */}
          <div className="lg:col-span-5 animate-float relative">
            <div className="terminal-bg rounded-2xl overflow-hidden shadow-glow-sm">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground ml-2 tracking-wider">
                  ~/developer.ts
                </span>
              </div>

              {/* Code content */}
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-6 sm:leading-7 min-h-[220px] sm:min-h-[280px] overflow-x-auto">
                {codeLines.map((line, i) => (
                  <div
                    key={i}
                    className={`transition-all duration-300 whitespace-nowrap ${
                      i < visibleLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {line.code ? (
                      <span>
                        <span className="text-muted-foreground/30 mr-3 sm:mr-4 select-none text-[9px] sm:text-[10px]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span style={{ paddingLeft: `${line.indent * 12}px` }} className={line.color}>
                          {line.code}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground/30 text-[9px] sm:text-[10px] select-none">{String(i + 1).padStart(2, '0')}</span>
                    )}
                  </div>
                ))}
                {visibleLines >= codeLines.length && (
                  <div className="mt-2">
                    <span className="text-muted-foreground/30 mr-3 sm:mr-4 text-[9px] sm:text-[10px] select-none">10</span>
                    <span className="text-primary typing-cursor" />
                  </div>
                )}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 glass-card rounded-xl px-3 sm:px-4 py-2 sm:py-3 animate-pulse-glow hidden lg:block">
              <div className="flex items-center gap-2">
                <Icon name="BoltIcon" size={14} className="text-primary" />
                <span className="font-mono text-[10px] text-primary font-bold">Node.js v20 LTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-100 sm:opacity-40">
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 sm:h-10 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>
    </section>
  );
}