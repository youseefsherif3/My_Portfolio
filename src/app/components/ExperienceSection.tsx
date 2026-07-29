'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export interface ExperienceItem {
  id?: string;
  title: string;
  company: string;
  companyUrl?: string;
  location?: string;
  period: string;
  description: string;
  technologies?: string[];
  order?: number;
}

function formatUrl(url?: string): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const defaultExperiences: ExperienceItem[] = [
  {
    title: 'Summer Internship ( Back-End Developer .NET )',
    company: 'PROART | Microsoft Solutions Partner',
    companyUrl: 'https://proart-eg.com',
    location: 'Maadi, Egypt',
    period: 'July 2026 - Present',
    description:
      'Participating in a Back-End Development internship focused on the Microsoft technology stack, learning ASP.NET Core, C#, SQL Server, RESTful APIs, and modern backend development practices through hands-on projects.',
    technologies: ['ASP.NET Core', 'C#', 'SQL Server', 'RESTful APIs', '.NET'],
  },
];

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultExperiences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experiences')
      .then((res) => res.json())
      .then((data) => {
        if (data?.experiences && Array.isArray(data.experiences) && data.experiences.length > 0) {
          setExperiences(data.experiences);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="blob-secondary absolute top-1/2 left-1/4 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 text-center md:text-left">
          <div>
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.4em] font-bold block mb-3">
              04 // Career
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-section-heading font-extrabold text-foreground">
              Work
              <br />
              <span className="gradient-text">Experience.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed mx-auto md:mx-0 md:text-right">
            My professional journey, internships, and hands-on software development experience.
          </p>
        </div>

        {/* Timeline Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative pl-4 sm:pl-8 border-l border-primary/20 space-y-10 sm:space-y-12">
            {experiences.map((exp, index) => {
              const companyLink = formatUrl(exp.companyUrl);
              return (
                <div key={exp.id || index} className="relative group">
                  {/* Timeline node icon */}
                  <div className="absolute -left-[21px] sm:-left-[37px] top-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 border-primary group-hover:scale-125 group-hover:bg-primary transition-all duration-300 shadow-glow-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-primary-foreground transition-colors" />
                  </div>

                  {/* Card */}
                  <div className="bento-card p-6 sm:p-8 rounded-2xl hover:border-primary/40 transition-all duration-300 space-y-4 shadow-glow-sm">
                    {/* Top Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {exp.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                          {companyLink ? (
                            <a
                              href={companyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1.5 transition-colors group/link"
                              title={`Visit ${exp.company} website`}
                            >
                              <Icon name="BriefcaseIcon" size={16} />
                              <span>{exp.company}</span>
                              <Icon
                                name="ArrowTopRightOnSquareIcon"
                                size={14}
                                className="text-primary group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0"
                              />
                            </a>
                          ) : (
                            <span className="font-semibold text-primary/90 flex items-center gap-1.5">
                              <Icon name="BriefcaseIcon" size={16} />
                              {exp.company}
                            </span>
                          )}
                        {exp.location ? (
                          <>
                            <span className="text-border">•</span>
                            <span className="flex items-center gap-1 text-xs">
                              <Icon name="MapPinIcon" size={14} />
                              {exp.location}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {/* Period Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono font-bold tracking-wide w-fit shrink-0">
                      <Icon name="CalendarIcon" size={14} />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light whitespace-pre-line">
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 ? (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full border border-border/80 bg-muted/20 text-xs font-mono text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-glow-sm transition-all duration-300 cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
