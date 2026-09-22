import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';
import { Skill } from '@/lib/models/Skill';
import { Certification } from '@/lib/models/Certification';
import { Experience } from '@/lib/models/Experience';
import { defaultProjects } from '@/lib/defaultProjects';
import { defaultSkills } from '@/lib/defaultSkills';
import { defaultCertifications } from '@/lib/defaultCertifications';

export interface ServerExperienceItem {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  location?: string;
  period: string;
  description: string;
  technologies?: string[];
  order?: number;
}

export interface ServerProjectItem {
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
  order?: number;
}

export interface ServerSkillItem {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  order: number;
}

export interface ServerCertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  imageUrl: string;
  order: number;
}

const defaultExperiences: ServerExperienceItem[] = [
  {
    id: '1',
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

export async function getPortfolioServerData() {
  try {
    await connectToDatabase();

    const [projectsDoc, skillsDoc, certsDoc, expDoc] = await Promise.all([
      Project.find().sort({ order: 1, createdAt: -1 }).lean(),
      Skill.find().sort({ order: 1, createdAt: 1 }).lean(),
      Certification.find().sort({ order: 1, createdAt: -1 }).lean(),
      Experience.find().sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    const projects: ServerProjectItem[] =
      projectsDoc && projectsDoc.length > 0
        ? projectsDoc.map((p: any) => ({
            id: p._id?.toString() || p.id,
            title: p.title,
            description: p.description,
            tags: Array.isArray(p.tags) ? p.tags : [],
            image: p.image || '',
            imageAlt: p.imageAlt || '',
            github: p.github || '',
            live: p.live || '',
            featured: Boolean(p.featured),
            highlight: p.highlight || '',
            order: p.order ?? 0,
          }))
        : defaultProjects.map((p, i) => ({ id: String(i + 1), ...p, order: p.order ?? 0 }));

    const skills: ServerSkillItem[] =
      skillsDoc && skillsDoc.length > 0
        ? skillsDoc.map((s: any) => ({
            id: s._id?.toString() || s.id,
            name: s.name,
            level: s.level,
            category: s.category,
            icon: s.icon || 'CpuChipIcon',
            order: s.order ?? 0,
          }))
        : defaultSkills.map((s, i) => ({ id: String(i + 1), ...s, order: s.order ?? 0 }));

    const certifications: ServerCertificationItem[] =
      certsDoc && certsDoc.length > 0
        ? certsDoc.map((c: any) => ({
            id: c._id?.toString() || c.id,
            title: c.title,
            issuer: c.issuer,
            year: c.year,
            description: c.description,
            imageUrl: c.imageUrl || '',
            order: c.order ?? 0,
          }))
        : defaultCertifications.map((c, i) => ({ id: String(i + 1), ...c, order: c.order ?? 0 }));

    const experiences: ServerExperienceItem[] =
      expDoc && expDoc.length > 0
        ? expDoc.map((e: any) => ({
            id: e._id?.toString() || e.id,
            title: e.title,
            company: e.company,
            companyUrl: e.companyUrl || '',
            location: e.location || '',
            period: e.period,
            description: e.description,
            technologies: Array.isArray(e.technologies) ? e.technologies : [],
            order: e.order ?? 0,
          }))
        : defaultExperiences;

    return {
      projects,
      skills,
      certifications,
      experiences,
    };
  } catch (err) {
    console.error('Failed to load server data:', err);
    return {
      projects: defaultProjects.map((p, i) => ({ id: String(i + 1), ...p, order: p.order ?? 0 })),
      skills: defaultSkills.map((s, i) => ({ id: String(i + 1), ...s, order: s.order ?? 0 })),
      certifications: defaultCertifications.map((c, i) => ({
        id: String(i + 1),
        ...c,
        order: c.order ?? 0,
      })),
      experiences: defaultExperiences,
    };
  }
}
