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

export default function HomePage() {
  return (
    <main className="relative bg-background min-h-screen">
      <div className="grain-overlay" aria-hidden="true" />
      <CursorGlow />
      <VisitorTracker />
      <Header />

      <HeroSection />

      <section id="projects" className="scroll-mt-20">
        <ProjectsSection />
      </section>

      <section id="skills" className="scroll-mt-20">
        <SkillsSection />
      </section>

      <section id="experience" className="scroll-mt-20">
        <ExperienceSection />
      </section>

      <section id="contact" className="scroll-mt-20">
        <ContactSection />
      </section>

      <Footer />
    </main>
  );
}
