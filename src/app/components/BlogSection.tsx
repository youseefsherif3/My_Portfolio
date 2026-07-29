'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  readTime: string;
  date: string;
  image: string;
  imageAlt: string;
  href: string;
}

const posts: BlogPost[] = [
  {
    id: 1,
    title: 'Building a Secure Anonymous Messaging API with Node.js and JWT',
    excerpt:
      'How I designed the Saraha App backend — from JWT authentication and email verification to role-based authorization and message privacy controls with a clean modular architecture.',
    tag: 'Backend',
    readTime: '7 min read',
    date: 'May 2025',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
    imageAlt: 'Dark terminal screen showing Node.js server code with JWT authentication logic',
    href: 'https://github.com/youseefsherif3/Saraha-App',
  },
  {
    id: 2,
    title: 'TypeScript + OOP: Building a Scalable Social Media Backend',
    excerpt:
      'Why I chose TypeScript and Object-Oriented Programming for my social media API — clean architecture, modular services, and Zod schema validation for reliable, type-safe inputs.',
    tag: 'Architecture',
    readTime: '9 min read',
    date: 'Apr 2025',
    image: 'https://images.unsplash.com/photo-1593720217529-01f0a5d09aed',
    imageAlt:
      'Dark monitor showing TypeScript code with class definitions and interface declarations',
    href: 'https://github.com/youseefsherif3/Social-Media-App',
  },
  {
    id: 3,
    title: 'From Wireframes to Prototype: My UI/UX Design Process in Figma',
    excerpt:
      'A walkthrough of my graduation UI/UX project — defining personas, mapping user journeys, building a reusable design system, and delivering an interactive prototype ready for developer handoff.',
    tag: 'UI/UX Design',
    readTime: '6 min read',
    date: 'Mar 2025',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    imageAlt: 'Figma design tool open on a laptop showing UI wireframes and component library',
    href: 'https://www.figma.com/design/E2ODQZ8venRSnWNlvyUjYI/Final-Graduation-Project?node-id=0-1&t=Fi8stbAHbZcUAZ2R-1',
  },
];

export default function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('.blog-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} id="blog" className="py-8 sm:py-24 px-4 relative">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="blob-accent absolute top-1/2 right-0 w-[400px] h-[400px] opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
          <div>
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.4em] font-bold block mb-3">
              04 // Writing
            </span>
            <h2 className="text-section-heading font-extrabold text-foreground">
              Technical
              <br />
              <span className="gradient-text">Writing.</span>
            </h2>
          </div>
          <a
            href="https://github.com/youseefsherif3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-mono text-xs font-bold text-primary hover:text-accent transition-colors mx-auto md:mx-0"
          >
            View GitHub
            <Icon name="ArrowRightIcon" size={14} />
          </a>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <a
              key={post.id}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-card group bento-card flex flex-col opacity-100 translate-y-0 transition-all duration-700"
              style={{ transitionDelay: `${index * 100}ms` }}
              aria-label={`Read: ${post.title}`}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden rounded-t-[1.25rem]">
                <AppImage
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-spring"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <span className="absolute top-3 left-3 font-mono text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {post.tag}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                <h3 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-muted-foreground">{post.date}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <Icon
                    name="ArrowRightIcon"
                    size={14}
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
