'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SkillCategory {
  label: string;
  icon: string;
  skills: Array<{ name: string; level: number }>;
}

const skillCategories: SkillCategory[] = [
  {
    label: 'Backend Development',
    icon: 'ServerStackIcon',
    skills: [
      { name: 'Node.js', level: 90 },
      { name: 'Express.js', level: 90 },
      { name: 'NestJS', level: 80 },
      { name: 'Fastify', level: 72 },
      { name: 'Socket.io', level: 78 },
    ],
  },
  {
    label: 'APIs & Architecture',
    icon: 'CubeTransparentIcon',
    skills: [
      { name: 'RESTful APIs', level: 92 },
      { name: 'GraphQL', level: 70 },
      { name: 'Microservices', level: 72 },
      { name: 'Event-Driven Arch.', level: 68 },
      { name: 'JWT & OAuth2', level: 88 },
    ],
  },
  {
    label: 'Databases',
    icon: 'CircleStackIcon',
    skills: [
      { name: 'MongoDB', level: 88 },
      { name: 'MySQL', level: 82 },
      { name: 'PostgreSQL', level: 78 },
      { name: 'Redis', level: 70 },
      { name: 'Elasticsearch', level: 65 },
    ],
  },
  {
    label: 'Languages',
    icon: 'CpuChipIcon',
    skills: [
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Python', level: 72 },
      { name: 'C++', level: 68 },
    ],
  },
  {
    label: 'Frontend Development',
    icon: 'ComputerDesktopIcon',
    skills: [
      { name: 'React.js', level: 78 },
      { name: 'HTML5 & CSS3', level: 85 },
      { name: 'Tailwind CSS', level: 82 },
      { name: 'Bootstrap', level: 80 },
      { name: 'Responsive Design', level: 82 },
    ],
  },
  {
    label: 'UI/UX Design',
    icon: 'PaintBrushIcon',
    skills: [
      { name: 'Figma', level: 80 },
      { name: 'User Research', level: 72 },
      { name: 'Prototyping', level: 78 },
      { name: 'Wireframing', level: 80 },
      { name: 'Design Systems', level: 75 },
    ],
  },
];

const certifications = [
  {
    title: 'Front-End Development',
    issuer: 'Route Academy',
    year: '2025',
    description: 'Comprehensive front-end training focused on React framework fundamentals, reusable components, state management, and building responsive user interfaces.',
    files: ['Front-End.jpg'],
  },
  {
    title: 'UI/UX Design Essentials',
    issuer: 'Mahara Tech',
    year: '2026',
    description: 'Hands-on design certification covering user research, wireframing, prototyping, and interface design best practices using Figma.',
    files: ['UX Design_page-0001.jpg'],
  },
];

function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && barRef.current) {
            setTimeout(() => {
              if (barRef.current) {
                barRef.current.style.width = `${level}%`;
              }
            }, index * 80);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [level, index]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-mono text-xs text-foreground/80 truncate">{name}</span>
          <span className="font-mono text-[10px] text-primary ml-2 shrink-0">{level}%</span>
        </div>
        <div className="h-0.5 bg-border rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="progress-bar h-full transition-all duration-700"
            style={{ width: '0%', transitionDelay: `${index * 80}ms` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certFiles, setCertFiles] = useState<Array<{ name: string; url: string }>>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCertTitle, setActiveCertTitle] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('.skill-card');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (showCertModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCertModal]);

  return (
    <div ref={sectionRef} id="skills" className="py-24 px-4 relative bg-secondary/30">
      {/* Depth */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="blob-accent absolute bottom-0 left-1/4 w-[400px] h-[400px] opacity-40" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(14,207,207,0.5) 40px, rgba(14,207,207,0.5) 41px)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.4em] font-bold block mb-3">
              03 // Skills
            </span>
            <h2 className="text-section-heading font-extrabold text-foreground">
              Tech<br />
              <span className="gradient-text">Stack.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed md:text-right">
            Full-stack depth from backend APIs to frontend interfaces and UI/UX design.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((category, catIndex) => (
            <div
              key={category.label}
              className="skill-card bento-card p-6 opacity-100 translate-y-0 transition-all duration-700"
              style={{ transitionDelay: `${catIndex * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Icon name={category.icon as 'CpuChipIcon'} size={18} />
                </div>
                <h3 className="font-bold text-sm text-foreground">{category.label}</h3>
              </div>

              <div className="flex flex-col gap-3.5">
                {category.skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    index={skillIndex + catIndex * 5}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional tools row */}
        <div className="mt-10 glass-card rounded-2xl p-6">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-4 font-bold">
            Also worked with
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Git', 'GitHub', 'Zod', 'JWT', 'Passport.js',
              'Mongoose', 'Sequelize', 'Adobe XD', 'SQL Server', 'Xampp',
              'Postman', 'Swagger', 'PM2', 'Nodemailer', 'Multer',
            ].map(tool => (
              <span key={tool} className="skill-tag">{tool}</span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-10">
          <p className="font-mono text-[10px] text-primary uppercase tracking-[0.4em] font-bold mb-6">
            Certifications
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {certifications.map((cert, i) => (
              <div
                key={cert.title}
                role="button"
                tabIndex={0}
                  onClick={() => {
                    const fileNames: string[] = (cert as any).files || [];
                    const list = fileNames.map((name) => ({ name, url: `/api/certifications/${encodeURIComponent(name)}` }));
                    setCertFiles(list);
                    setActiveIndex(list.length > 0 ? 0 : null);
                    setActiveCertTitle(cert.title || null);
                    setShowCertModal(true);
                  }}
                onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLElement).click(); } }}
                className="bento-card p-5 flex flex-col gap-3 transition-all duration-700 cursor-pointer hover:scale-[1.01]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-foreground leading-snug">{cert.title}</h4>
                  <span className={`font-mono text-[9px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
                    cert.year === 'In Progress' ?'text-accent bg-accent/10 border border-accent/20' :'text-primary bg-primary/10 border border-primary/20'
                  }`}>
                    {cert.year}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-primary uppercase tracking-wider">{cert.issuer}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{cert.description}</p>
                <div className="mt-2 text-[11px] font-mono text-primary flex items-center gap-2">
                  <span className="underline">View Certificates</span>
                  <Icon name="ArrowTopRightOnSquareIcon" size={12} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      {showCertModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setShowCertModal(false)} />
          <div className="relative z-[10000] w-full flex items-center justify-center">
            <div className="w-full max-w-5xl bg-card rounded-2xl p-6 shadow-2xl border border-primary/10" style={{ borderWidth: '1px' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{activeCertTitle}</h3>
                  <p className="text-[12px] text-muted-foreground mt-1">Certificates</p>
                </div>
                <button
                  onClick={() => setShowCertModal(false)}
                  className="text-muted-foreground bg-transparent border border-transparent px-3 py-1 rounded-md hover:text-primary transition-colors"
                >
                  Close
                </button>
              </div>

              {certFiles && certFiles.length > 0 && activeIndex !== null ? (
                <div className="w-full flex items-center justify-center">
                  <div className="w-full bg-[#0b1116] rounded-lg overflow-hidden flex items-center justify-center p-6">
                    <img
                      src={certFiles[activeIndex].url}
                      alt={certFiles[activeIndex].name}
                      className="object-contain max-h-[72vh] max-w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">No certificate files available.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}