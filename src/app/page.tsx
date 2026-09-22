import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import ProjectsSection from '@/app/components/ProjectsSection';
import SkillsSection from '@/app/components/SkillsSection';
import ExperienceSection from '@/app/components/ExperienceSection';
import ContactSection from '@/app/components/ContactSection';
import CursorGlow from '@/app/components/CursorGlow';
import VisitorTracker from '@/app/components/VisitorTracker';
import { getPortfolioServerData } from '@/lib/serverData';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { projects, skills, certifications, experiences } = await getPortfolioServerData();

  return (
    <main className="relative bg-background min-h-screen">
      <div className="grain-overlay" aria-hidden="true" />
      <CursorGlow />
      <VisitorTracker />
      <Header />

      <HeroSection />

      <section id="projects" className="scroll-mt-20">
        <ProjectsSection initialProjects={projects} />
      </section>

      <section id="skills" className="scroll-mt-20">
        <SkillsSection initialSkills={skills} initialCertifications={certifications} />
      </section>

      <section id="experience" className="scroll-mt-20">
        <ExperienceSection initialExperiences={experiences} />
      </section>

      <section id="contact" className="scroll-mt-20">
        <ContactSection />
      </section>

      <Footer />
    </main>
  );
}
