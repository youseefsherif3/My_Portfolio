'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  github: string;
  live: string;
  featured?: boolean;
  highlight?: string;
  colSpan?: string;
  rowSpan?: string;
}

const projects: Project[] = [
{
  id: 1,
  title: 'Saraha App Backend API',
  description: 'A secure and scalable RESTful API for a Saraha-style anonymous messaging platform. Includes JWT authentication, email verification, role-based authorization, message privacy controls, and clean modular architecture.',
  tags: ['Node.js', 'Express', 'MongoDB', 'Google Auth'],
  image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
  imageAlt: 'Dark server terminal screen showing Node.js API code with green syntax highlighting',
  github: 'https://github.com/youseefsherif3/Saraha-App',
  live: '#',
  featured: true,
  highlight: '10K+ req/min',
  colSpan: 'md:col-span-2',
  rowSpan: 'row-span-1'
},
{
  id: 2,
  title: 'Social Media App API',
  description: 'A scalable social media application backend built with TypeScript and OOP principles. Delivers clean architecture, modular services, and production-focused APIs for users, posts, interactions, and secure authentication.',
  tags: ['TypeScript', 'Node.js', 'MongoDB', 'Zod'],
  image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
  imageAlt: 'Dark abstract social network visualization with glowing connection nodes on black background',
  github: 'https://github.com/youseefsherif3/Social-Media-App',
  live: '#',
  highlight: 'In Development',
  colSpan: 'md:col-span-1',
  rowSpan: 'md:row-span-2'
},
{
  id: 3,
  title: 'Birthday Project',
  description: 'A celebratory interactive web experience designed to deliver a joyful birthday flow with polished visuals, smooth interactions, and responsive behavior across devices.',
  tags: ['JavaScript', 'HTML5', 'CSS3'],
  image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
  imageAlt: 'Colorful birthday celebration with confetti and balloons on a festive background',
  github: '#',
  live: 'https://youseefsherif3.github.io/Birthday_Project/',
  highlight: 'Live Demo',
  colSpan: 'md:col-span-1',
  rowSpan: 'row-span-1'
},
{
  id: 4,
  title: 'Figma UI/UX Graduation Project',
  description: 'A complete UI/UX design project crafted in Figma, from user flow mapping to high-fidelity screens. Focuses on clean visual hierarchy, consistent components, and accessible interactions.',
  tags: ['Figma', 'UI/UX', 'Design System'],
  image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
  imageAlt: 'Clean UI design mockup on a laptop screen showing a modern app interface in Figma',
  github: '#',
  live: 'https://www.figma.com/design/E2ODQZ8venRSnWNlvyUjYI/Final-Graduation-Project?node-id=0-1&t=Fi8stbAHbZcUAZ2R-1',
  highlight: 'Prototype Ready',
  colSpan: 'md:col-span-2',
  rowSpan: 'row-span-1'
}];


const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(projects);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = projects.filter((p) => {
      const matchesTag = activeFilter === 'All' || p.tags.includes(activeFilter);
      const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTag && matchesSearch;
    });
    setVisibleProjects(filtered);
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('.project-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [visibleProjects]);

  return (
    <div ref={sectionRef} id="projects" className="py-8 sm:py-24 px-4 sm:px-6 relative">
      {/* Background depth */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="blob-secondary absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 text-center md:text-left">
          <div>
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.4em] font-bold block mb-3">
              02 // Work
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-section-heading font-extrabold text-foreground">
              Things I&apos;ve<br />
              <span className="gradient-text">Built.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed mx-auto md:mx-0 md:text-right">
            Real projects solving real problems — from anonymous messaging APIs to full UI/UX design systems.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col gap-4 mb-8 sm:mb-10">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Filter tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {allTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-3 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-wide transition-all duration-200 ${
                  activeFilter === tag ? 'filter-btn-active' : 'filter-btn'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {visibleProjects.map((project, index) => (
              <div
                key={project.id}
                className={`project-card bento-card group relative opacity-100 translate-y-0 transition-all duration-700`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <AppImage
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="skill-tag">{tag}</span>
                      ))}
                    </div>
                    {project.highlight && project.highlight !== '' && (
                      <span className="font-mono text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full whitespace-nowrap shrink-0">
                        {project.highlight}
                      </span>
                    )}
                  </div>

                  {/* Bottom */}
                  <div>
                    {project.featured && (
                      <span className="font-mono text-[9px] text-accent uppercase tracking-widest font-bold mb-2 block">
                        Featured Project
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-snug line-clamp-3 mb-2 sm:mb-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-3">
                      {project.github && project.github !== '#' && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon name="CodeBracketIcon" size={12} />
                          GitHub
                        </a>
                      )}
                      {project.live && project.live !== '#' && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon name="ArrowTopRightOnSquareIcon" size={12} />
                          {project.id === 2 ? 'Docs' : project.id === 4 ? 'Figma' : 'Live Demo'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <Icon name="MagnifyingGlassIcon" size={32} className="text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">No projects match your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
              className="font-mono text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
