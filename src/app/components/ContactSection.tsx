'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: FormState = { name: '', email: '', subject: '', message: '' };

const contactMethods = [
  {
    icon: 'EnvelopeIcon',
    label: 'Email',
    value: 'youseefsherif89@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=youseefsherif89@gmail.com',
  },
  {
    icon: 'CodeBracketIcon',
    label: 'GitHub',
    value: 'github.com/youseefsherif3',
    href: 'https://github.com/youseefsherif3',
  },
  {
    icon: 'LinkIcon',
    label: 'LinkedIn',
    value: 'linkedin.com/in/youseef-sherif',
    href: 'https://www.linkedin.com/in/youseef-sherif',
  },
];

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sendError, setSendError] = useState<string | null>(null);

  // Custom select component (inline) - placed here to avoid creating separate file
  function CustomSelect({ id, name, value, onChange, error }: { id: string; name: string; value: string; onChange: (val: string) => void; error?: boolean }) {
    const options = [
      { value: '', label: 'Select a topic...' },
      { value: 'backend-api', label: 'Backend API Development' },
      { value: 'auth-security', label: 'Authentication & Security' },
      { value: 'database-design', label: 'Database Design' },
      { value: 'full-consultation', label: 'Full Project Consultation' },
      { value: 'other', label: 'Other' },
    ];
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function onDoc(e: MouseEvent) {
        if (!ref.current) return;
        if (!ref.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener('click', onDoc);
      return () => document.removeEventListener('click', onDoc);
    }, []);

    useEffect(() => {
      function onKey(e: KeyboardEvent) {
        if (e.key === 'Escape') setOpen(false);
      }
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, []);

    const selected = options.find(o => o.value === value) || options[0];

    return (
      <div ref={ref} className={`relative w-full`}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          onKeyDown={(e) => { if (e.key === 'ArrowDown') setOpen(true); }}
          className={`w-full pl-4 pr-10 py-3 bg-input border ${error ? 'border-red-500/50' : 'border-border'} rounded-xl font-mono text-sm text-foreground text-left flex items-center justify-between focus:outline-none`}
        >
          <span className={`${selected.value === '' ? 'text-muted-foreground/40' : ''}`}>{selected.label}</span>
          <Icon name="ChevronDownIcon" size={16} className="text-muted-foreground" />
        </button>

        {open && (
          <ul role="listbox" tabIndex={-1} className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-xl p-2 max-h-56 overflow-auto z-50 shadow-lg">
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`px-3 py-2 rounded-md cursor-pointer font-mono text-sm ${opt.value === value ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-primary/5'}`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim() || form.message.length < 20) newErrors.message = 'Message must be at least 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSendError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Send failed');
      setSubmitted(true);
    } catch (err) {
      setSendError('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div id="contact" className="py-24 px-4 relative">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="blob-accent absolute bottom-0 left-0 w-[500px] h-[500px] opacity-40" />
        <div className="blob-secondary absolute top-0 right-0 w-[300px] h-[300px] opacity-60" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-mono text-[10px] text-primary uppercase tracking-[0.4em] font-bold block mb-3">
            05 // Contact
          </span>
          <h2 className="text-section-heading font-extrabold text-foreground mb-4">
            Let&apos;s <span className="gradient-text">Build Together.</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            I&apos;m always interested in hearing about new projects and opportunities. Whether you need a robust backend system, API development, or UI/UX Designs, I&apos;m here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Info */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Availability card */}
            <div className="bento-card p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-glow" />
                <span className="font-mono text-xs font-bold text-primary tracking-wide">Currently Available</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Open to full-time backend roles, freelance projects, and interesting technical collaborations.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Full-time', 'Freelance', 'Remote'].map(type => (
                  <span key={type} className="skill-tag">{type}</span>
                ))}
              </div>
            </div>

            {/* Contact methods */}
            <div className="flex flex-col gap-3">
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bento-card p-4 flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Icon name={method.icon as 'EnvelopeIcon'} size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">{method.label}</p>
                    <p className="font-mono text-xs text-foreground truncate group-hover:text-primary transition-colors">
                      {method.value}
                    </p>
                  </div>
                  <Icon name="ArrowTopRightOnSquareIcon" size={12} className="text-muted-foreground ml-auto shrink-0 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>

            {/* Response time */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="ClockIcon" size={14} className="text-primary" />
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Avg Response Time</span>
              </div>
              <span className="font-mono text-xl font-bold text-primary">&lt; 24h</span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-8">
            <div className="bento-card p-7">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse-glow">
                    <Icon name="CheckIcon" size={28} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm(initialForm); }}
                    className="mt-2 font-mono text-xs text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold block mb-2">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={`w-full px-4 py-3 bg-input border rounded-xl font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors ${
                          errors.name ? 'border-red-500/50' : 'border-border'
                        }`}
                      />
                      {errors.name && (
                        <p className="font-mono text-[10px] text-red-400 mt-1.5">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold block mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 bg-input border rounded-xl font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors ${
                          errors.email ? 'border-red-500/50' : 'border-border'
                        }`}
                      />
                      {errors.email && (
                        <p className="font-mono text-[10px] text-red-400 mt-1.5">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold block mb-2">
                      What do you need?
                    </label>
                    <CustomSelect
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={(val: string) => {
                        setForm(prev => ({ ...prev, subject: val }));
                        if (errors.subject) setErrors(prev => ({ ...prev, subject: undefined }));
                      }}
                      error={!!errors.subject}
                      />
                    {errors.subject && (
                      <p className="font-mono text-[10px] text-red-400 mt-1.5">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold block mb-2">
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell me about your project or what you're building..."
                      className={`w-full px-4 py-3 bg-input border rounded-xl font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none ${
                        errors.message ? 'border-red-500/50' : 'border-border'
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1.5">
                      {errors.message ? (
                        <p className="font-mono text-[10px] text-red-400">{errors.message}</p>
                      ) : (
                        <span />
                      )}
                      <span className={`font-mono text-[10px] ${form.message.length > 500 ? 'text-red-400' : 'text-muted-foreground/50'}`}>
                        {form.message.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="magnetic-btn w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-sm tracking-wide hover:shadow-glow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Icon name="PaperAirplaneIcon" size={16} />
                      </>
                    )}
                  </button>
                  {sendError && (
                    <p className="font-mono text-[10px] text-red-400 mt-2">{sendError}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}