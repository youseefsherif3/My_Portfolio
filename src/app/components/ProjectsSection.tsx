'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { defaultProjects } from '@/lib/defaultProjects';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  github: string;
  live: string;
  featured?: boolean;
  highlight?: string;
}

const fallbackProjects: Project[] = defaultProjects.map((project, index) => ({
  id: String(index + 1),
  ...project,
}));

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);

  const allTags = useMemo(
    () => ['All', ...Array.from(new Set(projects.flatMap((project) => project.tags)))],
    [projects]
  );

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load projects');
        }
        const data = await response.json();
        const incoming = Array.isArray(data.projects) ? data.projects : [];
        setProjects(incoming.length > 0 ? incoming : fallbackProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

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
  }, [activeFilter, searchQuery, projects]);

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
              Things I&apos;ve
              <br />
              <span className="gradient-text">Built.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed mx-auto md:mx-0 md:text-right">
            Real projects solving real problems — from anonymous messaging APIs to full UI/UX design
            systems.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col gap-4 mb-8 sm:mb-10">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Icon
              name="MagnifyingGlassIcon"
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
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

        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading projects...</div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-400">{error}</div>
        ) : visibleProjects.length > 0 ? (
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
                    alt={project.imageAlt || project.title}
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
                        <span key={tag} className="skill-tag">
                          {tag}
                        </span>
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
                          Live Demo
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
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
              }}
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
