'use client';

import { useEffect, useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { signOut } from 'next-auth/react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  github: string;
  live: string;
  featured: boolean;
  highlight: string;
  order: number;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  order: number;
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  imageUrl: string;
  order: number;
}

interface ProjectFormState {
  title: string;
  description: string;
  tags: string;
  image: string;
  imageAlt: string;
  github: string;
  live: string;
  featured: boolean;
  highlight: string;
  order: string;
}

interface SkillFormState {
  name: string;
  level: string;
  category: string;
  icon: string;
  order: string;
}

interface CertificationFormState {
  title: string;
  issuer: string;
  year: string;
  description: string;
  imageUrl: string;
  order: string;
}

const blankForm: ProjectFormState = {
  title: '',
  description: '',
  tags: '',
  image: '',
  imageAlt: '',
  github: '',
  live: '',
  featured: false,
  highlight: '',
  order: '0',
};

const blankSkillForm: SkillFormState = {
  name: '',
  level: '80',
  category: '',
  icon: 'CpuChipIcon',
  order: '0',
};

const blankCertForm: CertificationFormState = {
  title: '',
  issuer: '',
  year: '',
  description: '',
  imageUrl: '',
  order: '0',
};

function mapProjectToForm(project: Project): ProjectFormState {
  return {
    title: project.title,
    description: project.description,
    tags: project.tags.join(', '),
    image: project.image,
    imageAlt: project.imageAlt,
    github: project.github,
    live: project.live,
    featured: project.featured,
    highlight: project.highlight,
    order: String(project.order ?? 0),
  };
}

function mapSkillToForm(skill: Skill): SkillFormState {
  return {
    name: skill.name,
    level: String(skill.level ?? 0),
    category: skill.category,
    icon: skill.icon || 'CpuChipIcon',
    order: String(skill.order ?? 0),
  };
}

function mapCertificationToForm(cert: Certification): CertificationFormState {
  return {
    title: cert.title,
    issuer: cert.issuer,
    year: cert.year,
    description: cert.description,
    imageUrl: cert.imageUrl || '',
    order: String(cert.order ?? 0),
  };
}

export default function AdminDashboard({ adminEmail: _adminEmail }: { adminEmail: string }) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'skills' | 'certs' | 'settings'
  >('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [analyticsTotal, setAnalyticsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seedMessage, setSeedMessage] = useState('');
  const [seedLoading, setSeedLoading] = useState(false);
  const [skillsSeedMessage, setSkillsSeedMessage] = useState('');
  const [skillsSeedLoading, setSkillsSeedLoading] = useState(false);
  const [certSeedMessage, setCertSeedMessage] = useState('');
  const [certSeedLoading, setCertSeedLoading] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(blankForm);
  const [skillForm, setSkillForm] = useState<SkillFormState>(blankSkillForm);
  const [certForm, setCertForm] = useState<CertificationFormState>(blankCertForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<ProjectFormState>(blankForm);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillForm, setEditingSkillForm] = useState<SkillFormState>(blankSkillForm);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingCertForm, setEditingCertForm] = useState<CertificationFormState>(blankCertForm);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);
  const [uploadingCertImage, setUploadingCertImage] = useState(false);
  const [settingsEmail, setSettingsEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [projects]
  );

  const sortedSkills = useMemo(
    () =>
      [...skills].sort(
        (a, b) => a.category.localeCompare(b.category) || (a.order ?? 0) - (b.order ?? 0)
      ),
    [skills]
  );

  const sortedCertifications = useMemo(
    () => [...certifications].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [certifications]
  );

  const tagChartData = useMemo(() => {
    const map = new Map<string, number>();
    projects.forEach((project) => {
      project.tags.forEach((tag) => {
        map.set(tag, (map.get(tag) || 0) + 1);
      });
    });

    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [projects]);

  const skillChartData = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    skills.forEach((skill) => {
      const entry = map.get(skill.category) || { total: 0, count: 0 };
      entry.total += skill.level;
      entry.count += 1;
      map.set(skill.category, entry);
    });

    return Array.from(map.entries()).map(([category, data]) => ({
      category,
      average: Math.round(data.total / Math.max(1, data.count)),
    }));
  }, [skills]);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          projectsResponse,
          analyticsResponse,
          skillsResponse,
          certsResponse,
          settingsResponse,
        ] = await Promise.all([
          fetch('/api/admin/projects', { credentials: 'include' }),
          fetch('/api/admin/analytics', { credentials: 'include' }),
          fetch('/api/admin/skills', { credentials: 'include' }),
          fetch('/api/admin/certifications', { credentials: 'include' }),
          fetch('/api/admin/settings', { credentials: 'include' }),
        ]);

        if (!projectsResponse.ok) {
          throw new Error('Failed to load projects');
        }

        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);

        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setAnalyticsTotal(Number(analyticsData.total || 0));
        }

        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setSkills(skillsData.skills || []);
        }

        if (certsResponse.ok) {
          const certsData = await certsResponse.json();
          setCertifications(certsData.certifications || []);
        }

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettingsEmail(String(settingsData.email || ''));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateField = (
    setter: Dispatch<SetStateAction<ProjectFormState>>,
    field: keyof ProjectFormState,
    value: string | boolean
  ) => {
    setter((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateSkillField = (
    setter: Dispatch<SetStateAction<SkillFormState>>,
    field: keyof SkillFormState,
    value: string
  ) => {
    setter((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateCertField = (
    setter: Dispatch<SetStateAction<CertificationFormState>>,
    field: keyof CertificationFormState,
    value: string
  ) => {
    setter((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          tags: form.tags,
          order: Number(form.order || 0),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const data = await response.json();
      setProjects((current) => [data.project, ...current]);
      setForm(blankForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    }
  };

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditingForm(mapProjectToForm(project));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingForm(blankForm);
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingId) {
      return;
    }
    setError('');

    try {
      const response = await fetch(`/api/admin/projects/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...editingForm,
          tags: editingForm.tags,
          order: Number(editingForm.order || 0),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update project');
      }

      const data = await response.json();
      setProjects((current) =>
        current.map((project) => (project.id === editingId ? data.project : project))
      );
      cancelEditing();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    }
  };

  const handleDelete = async (projectId: string) => {
    setError('');

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      setProjects((current) => current.filter((project) => project.id !== projectId));
      if (editingId === projectId) {
        cancelEditing();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const handleSkillCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...skillForm,
          level: Number(skillForm.level || 0),
          order: Number(skillForm.order || 0),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create skill');
      }

      const data = await response.json();
      setSkills((current) => [data.skill, ...current]);
      setSkillForm(blankSkillForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create skill');
    }
  };

  const startSkillEditing = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setEditingSkillForm(mapSkillToForm(skill));
  };

  const cancelSkillEditing = () => {
    setEditingSkillId(null);
    setEditingSkillForm(blankSkillForm);
  };

  const handleSkillUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingSkillId) {
      return;
    }
    setError('');

    try {
      const response = await fetch(`/api/admin/skills/${editingSkillId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...editingSkillForm,
          level: Number(editingSkillForm.level || 0),
          order: Number(editingSkillForm.order || 0),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update skill');
      }

      const data = await response.json();
      setSkills((current) =>
        current.map((skill) => (skill.id === editingSkillId ? data.skill : skill))
      );
      cancelSkillEditing();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update skill');
    }
  };

  const handleSkillDelete = async (skillId: string) => {
    setError('');

    try {
      const response = await fetch(`/api/admin/skills/${skillId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete skill');
      }

      setSkills((current) => current.filter((skill) => skill.id !== skillId));
      if (editingSkillId === skillId) {
        cancelSkillEditing();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete skill');
    }
  };

  const handleCertCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...certForm,
          order: Number(certForm.order || 0),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create certification');
      }

      const data = await response.json();
      setCertifications((current) => [data.certification, ...current]);
      setCertForm(blankCertForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create certification');
    }
  };

  const startCertEditing = (cert: Certification) => {
    setEditingCertId(cert.id);
    setEditingCertForm(mapCertificationToForm(cert));
  };

  const cancelCertEditing = () => {
    setEditingCertId(null);
    setEditingCertForm(blankCertForm);
  };

  const handleCertUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingCertId) {
      return;
    }
    setError('');

    try {
      const response = await fetch(`/api/admin/certifications/${editingCertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...editingCertForm,
          order: Number(editingCertForm.order || 0),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update certification');
      }

      const data = await response.json();
      setCertifications((current) =>
        current.map((cert) => (cert.id === editingCertId ? data.certification : cert))
      );
      cancelCertEditing();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update certification');
    }
  };

  const handleCertDelete = async (certId: string) => {
    setError('');

    try {
      const response = await fetch(`/api/admin/certifications/${certId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete certification');
      }

      setCertifications((current) => current.filter((cert) => cert.id !== certId));
      if (editingCertId === certId) {
        cancelCertEditing();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete certification');
    }
  };

  const uploadImage = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Upload failed');
    }

    const data = await response.json();
    return String(data.url || '');
  };

  const handleProjectImageUpload = async (file?: File) => {
    if (!file) {
      return;
    }

    setUploadingProjectImage(true);
    setError('');

    try {
      const url = await uploadImage(file, 'portfolio/projects');
      setForm((current) => ({ ...current, image: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingProjectImage(false);
    }
  };

  const handleCertImageUpload = async (file?: File) => {
    if (!file) {
      return;
    }

    setUploadingCertImage(true);
    setError('');

    try {
      const url = await uploadImage(file, 'portfolio/certifications');
      setCertForm((current) => ({ ...current, imageUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingCertImage(false);
    }
  };

  const handleSeedDefaults = async () => {
    setSeedMessage('');
    setSeedLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/projects/seed', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to import defaults');
      }

      const data = await response.json();
      setProjects(data.projects || []);
      setSeedMessage(`Imported ${data.created ?? 0} project(s).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import defaults');
    } finally {
      setSeedLoading(false);
    }
  };

  const handleSeedSkills = async () => {
    setSkillsSeedMessage('');
    setSkillsSeedLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/skills/seed', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to import skills');
      }

      const data = await response.json();
      setSkills(data.skills || []);
      setSkillsSeedMessage(`Imported ${data.created ?? 0} skill(s).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import skills');
    } finally {
      setSkillsSeedLoading(false);
    }
  };

  const handleSeedCertifications = async () => {
    setCertSeedMessage('');
    setCertSeedLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/certifications/seed', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to import certifications');
      }

      const data = await response.json();
      setCertifications(data.certifications || []);
      setCertSeedMessage(`Imported ${data.created ?? 0} certification(s).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import certifications');
    } finally {
      setCertSeedLoading(false);
    }
  };

  const handleSaveSettings = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSettingsMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSettingsLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: settingsEmail,
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update settings');
      }

      const data = await response.json();
      setSettingsMessage('Settings updated successfully.');
      setSettingsEmail(String(data.email || settingsEmail));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="min-h-screen admin-shell text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Admin dashboard
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">Welcome back, Youseef.</h1>
          </div>
          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wide border border-border rounded-full hover:border-primary transition-colors"
          >
            Sign out
          </button>
        </header>

        <nav className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'projects', label: 'Projects' },
            { id: 'skills', label: 'Tech Stack' },
            { id: 'certs', label: 'Certifications' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wide admin-tab ${
                activeTab === tab.id ? 'admin-tab-active' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'overview' ? (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="bento-card p-6 text-left"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Total visits
              </p>
              <p className="text-4xl font-bold mt-3">{analyticsTotal}</p>
              <p className="text-xs text-muted-foreground mt-4">Unique per session.</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className="bento-card p-6 text-left"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Projects
              </p>
              <p className="text-4xl font-bold mt-3">{projects.length}</p>
              <button
                type="button"
                onClick={handleSeedDefaults}
                disabled={seedLoading}
                className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wide px-3 py-2 rounded-full border border-border hover:border-primary transition-colors disabled:opacity-60"
              >
                {seedLoading ? 'Importing...' : 'Import default projects'}
              </button>
              {seedMessage ? <p className="text-xs text-emerald-400 mt-2">{seedMessage}</p> : null}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className="bento-card p-6 text-left"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Tech stack
              </p>
              <p className="text-4xl font-bold mt-3">{skills.length}</p>
              <button
                type="button"
                onClick={handleSeedSkills}
                disabled={skillsSeedLoading}
                className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wide px-3 py-2 rounded-full border border-border hover:border-primary transition-colors disabled:opacity-60"
              >
                {skillsSeedLoading ? 'Importing...' : 'Import default skills'}
              </button>
              {skillsSeedMessage ? (
                <p className="text-xs text-emerald-400 mt-2">{skillsSeedMessage}</p>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('certs')}
              className="bento-card p-6 text-left"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Certifications
              </p>
              <p className="text-4xl font-bold mt-3">{certifications.length}</p>
              <button
                type="button"
                onClick={handleSeedCertifications}
                disabled={certSeedLoading}
                className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wide px-3 py-2 rounded-full border border-border hover:border-primary transition-colors disabled:opacity-60"
              >
                {certSeedLoading ? 'Importing...' : 'Import default certs'}
              </button>
              {certSeedMessage ? (
                <p className="text-xs text-emerald-400 mt-2">{certSeedMessage}</p>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className="bento-card p-6 text-left"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Top tags
              </p>
              {tagChartData.length > 0 ? (
                <div className="mt-4 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tagChartData}
                      margin={{ top: 5, right: 10, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                      <XAxis dataKey="tag" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip
                        cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                        contentStyle={{
                          background: '#0f172a',
                          border: '1px solid rgba(148,163,184,0.3)',
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="count" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-4">Add projects to see tag stats.</p>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className="bento-card p-6 text-left"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Skill averages
              </p>
              {skillChartData.length > 0 ? (
                <div className="mt-4 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillChartData}
                      margin={{ top: 5, right: 10, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                      <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip
                        cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                        contentStyle={{
                          background: '#0f172a',
                          border: '1px solid rgba(148,163,184,0.3)',
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="average" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-4">Add skills to see averages.</p>
              )}
            </button>
          </section>
        ) : null}

        {activeTab === 'projects' ? (
          <section className="bento-card p-6">
            <h2 className="text-xl font-bold mb-4">Add new project</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Title"
                value={form.title}
                onChange={(event) => updateField(setForm, 'title', event.target.value)}
                required
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(event) => updateField(setForm, 'tags', event.target.value)}
              />
              <textarea
                className="md:col-span-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm min-h-[120px]"
                placeholder="Description"
                value={form.description}
                onChange={(event) => updateField(setForm, 'description', event.target.value)}
                required
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                value={form.image}
                readOnly
              />
              <div className="flex items-center gap-3">
                <label className="px-4 py-3 rounded-full border border-border text-xs font-mono uppercase tracking-wide cursor-pointer hover:border-primary">
                  {uploadingProjectImage ? 'Uploading...' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleProjectImageUpload(event.target.files?.[0])}
                    disabled={uploadingProjectImage}
                  />
                </label>
                {form.image ? (
                  <span className="text-xs text-muted-foreground truncate">Image ready</span>
                ) : null}
              </div>
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Image alt"
                value={form.imageAlt}
                onChange={(event) => updateField(setForm, 'imageAlt', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="GitHub URL"
                value={form.github}
                onChange={(event) => updateField(setForm, 'github', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Live URL"
                value={form.live}
                onChange={(event) => updateField(setForm, 'live', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Highlight"
                value={form.highlight}
                onChange={(event) => updateField(setForm, 'highlight', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Order"
                value={form.order}
                onChange={(event) => updateField(setForm, 'order', event.target.value)}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => updateField(setForm, 'featured', event.target.checked)}
                />
                Featured
              </label>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wide"
                >
                  Save project
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {activeTab === 'projects' ? (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Your projects</h2>
            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <div className="grid grid-cols-1 gap-4">
              {sortedProjects.map((project) => (
                <div key={project.id} className="bento-card p-5 space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <p className="text-xs text-muted-foreground">{project.tags.join(', ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(project)}
                        className="px-3 py-1.5 rounded-full border border-border text-xs font-mono uppercase tracking-wide"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1.5 rounded-full border border-red-400/40 text-xs font-mono uppercase tracking-wide text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingId === project.id ? (
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Title"
                        value={editingForm.title}
                        onChange={(event) =>
                          updateField(setEditingForm, 'title', event.target.value)
                        }
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Tags (comma separated)"
                        value={editingForm.tags}
                        onChange={(event) =>
                          updateField(setEditingForm, 'tags', event.target.value)
                        }
                      />
                      <textarea
                        className="md:col-span-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm min-h-[120px]"
                        placeholder="Description"
                        value={editingForm.description}
                        onChange={(event) =>
                          updateField(setEditingForm, 'description', event.target.value)
                        }
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        value={editingForm.image}
                        readOnly
                      />
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-3 rounded-full border border-border text-xs font-mono uppercase tracking-wide cursor-pointer hover:border-primary">
                          {uploadingProjectImage ? 'Uploading...' : 'Upload image'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                              handleProjectImageUpload(event.target.files?.[0]).then(() => {
                                if (form.image) {
                                  setEditingForm((current) => ({ ...current, image: form.image }));
                                }
                              })
                            }
                            disabled={uploadingProjectImage}
                          />
                        </label>
                        {editingForm.image ? (
                          <span className="text-xs text-muted-foreground truncate">
                            Image ready
                          </span>
                        ) : null}
                      </div>
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Image alt"
                        value={editingForm.imageAlt}
                        onChange={(event) =>
                          updateField(setEditingForm, 'imageAlt', event.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="GitHub URL"
                        value={editingForm.github}
                        onChange={(event) =>
                          updateField(setEditingForm, 'github', event.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Live URL"
                        value={editingForm.live}
                        onChange={(event) =>
                          updateField(setEditingForm, 'live', event.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Highlight"
                        value={editingForm.highlight}
                        onChange={(event) =>
                          updateField(setEditingForm, 'highlight', event.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Order"
                        value={editingForm.order}
                        onChange={(event) =>
                          updateField(setEditingForm, 'order', event.target.value)
                        }
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={editingForm.featured}
                          onChange={(event) =>
                            updateField(setEditingForm, 'featured', event.target.checked)
                          }
                        />
                        Featured
                      </label>
                      <div className="md:col-span-2 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wide"
                        >
                          Update project
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-5 py-3 rounded-full border border-border text-xs font-mono uppercase tracking-wide"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === 'skills' ? (
          <section className="bento-card p-6">
            <h2 className="text-xl font-bold mb-4">Tech stack</h2>
            <form onSubmit={handleSkillCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Skill name"
                value={skillForm.name}
                onChange={(event) => updateSkillField(setSkillForm, 'name', event.target.value)}
                required
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Category"
                value={skillForm.category}
                onChange={(event) => updateSkillField(setSkillForm, 'category', event.target.value)}
                required
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Level (0-100)"
                value={skillForm.level}
                onChange={(event) => updateSkillField(setSkillForm, 'level', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Icon name (e.g. CpuChipIcon)"
                value={skillForm.icon}
                onChange={(event) => updateSkillField(setSkillForm, 'icon', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Order"
                value={skillForm.order}
                onChange={(event) => updateSkillField(setSkillForm, 'order', event.target.value)}
              />
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wide"
                >
                  Save skill
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {activeTab === 'skills' ? (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Your skills</h2>
            <div className="grid grid-cols-1 gap-4">
              {sortedSkills.map((skill) => (
                <div key={skill.id} className="bento-card p-5 space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{skill.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {skill.category} · {skill.level}%
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startSkillEditing(skill)}
                        className="px-3 py-1.5 rounded-full border border-border text-xs font-mono uppercase tracking-wide"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSkillDelete(skill.id)}
                        className="px-3 py-1.5 rounded-full border border-red-400/40 text-xs font-mono uppercase tracking-wide text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingSkillId === skill.id ? (
                    <form
                      onSubmit={handleSkillUpdate}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Skill name"
                        value={editingSkillForm.name}
                        onChange={(event) =>
                          updateSkillField(setEditingSkillForm, 'name', event.target.value)
                        }
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Category"
                        value={editingSkillForm.category}
                        onChange={(event) =>
                          updateSkillField(setEditingSkillForm, 'category', event.target.value)
                        }
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Level (0-100)"
                        value={editingSkillForm.level}
                        onChange={(event) =>
                          updateSkillField(setEditingSkillForm, 'level', event.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Icon name"
                        value={editingSkillForm.icon}
                        onChange={(event) =>
                          updateSkillField(setEditingSkillForm, 'icon', event.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Order"
                        value={editingSkillForm.order}
                        onChange={(event) =>
                          updateSkillField(setEditingSkillForm, 'order', event.target.value)
                        }
                      />
                      <div className="md:col-span-2 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wide"
                        >
                          Update skill
                        </button>
                        <button
                          type="button"
                          onClick={cancelSkillEditing}
                          className="px-5 py-3 rounded-full border border-border text-xs font-mono uppercase tracking-wide"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-muted-foreground">{skill.icon}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === 'certs' ? (
          <section className="bento-card p-6">
            <h2 className="text-xl font-bold mb-4">Certifications</h2>
            <form onSubmit={handleCertCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Title"
                value={certForm.title}
                onChange={(event) => updateCertField(setCertForm, 'title', event.target.value)}
                required
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Issuer"
                value={certForm.issuer}
                onChange={(event) => updateCertField(setCertForm, 'issuer', event.target.value)}
                required
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Year"
                value={certForm.year}
                onChange={(event) => updateCertField(setCertForm, 'year', event.target.value)}
                required
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                value={certForm.imageUrl}
                readOnly
              />
              <div className="flex items-center gap-3">
                <label className="px-4 py-3 rounded-full border border-border text-xs font-mono uppercase tracking-wide cursor-pointer hover:border-primary">
                  {uploadingCertImage ? 'Uploading...' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleCertImageUpload(event.target.files?.[0])}
                    disabled={uploadingCertImage}
                  />
                </label>
                {certForm.imageUrl ? (
                  <span className="text-xs text-muted-foreground truncate">Image ready</span>
                ) : null}
              </div>
              <textarea
                className="md:col-span-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm min-h-[120px]"
                placeholder="Description"
                value={certForm.description}
                onChange={(event) =>
                  updateCertField(setCertForm, 'description', event.target.value)
                }
                required
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Order"
                value={certForm.order}
                onChange={(event) => updateCertField(setCertForm, 'order', event.target.value)}
              />
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wide"
                >
                  Save certification
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {activeTab === 'certs' ? (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Your certifications</h2>
            <div className="grid grid-cols-1 gap-4">
              {sortedCertifications.map((cert) => (
                <div key={cert.id} className="bento-card p-5 space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{cert.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {cert.issuer} · {cert.year}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startCertEditing(cert)}
                        className="px-3 py-1.5 rounded-full border border-border text-xs font-mono uppercase tracking-wide"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCertDelete(cert.id)}
                        className="px-3 py-1.5 rounded-full border border-red-400/40 text-xs font-mono uppercase tracking-wide text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingCertId === cert.id ? (
                    <form
                      onSubmit={handleCertUpdate}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Title"
                        value={editingCertForm.title}
                        onChange={(event) =>
                          updateCertField(setEditingCertForm, 'title', event.target.value)
                        }
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Issuer"
                        value={editingCertForm.issuer}
                        onChange={(event) =>
                          updateCertField(setEditingCertForm, 'issuer', event.target.value)
                        }
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Year"
                        value={editingCertForm.year}
                        onChange={(event) =>
                          updateCertField(setEditingCertForm, 'year', event.target.value)
                        }
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        value={editingCertForm.imageUrl}
                        readOnly
                      />
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-3 rounded-full border border-border text-xs font-mono uppercase tracking-wide cursor-pointer hover:border-primary">
                          {uploadingCertImage ? 'Uploading...' : 'Upload image'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                              handleCertImageUpload(event.target.files?.[0]).then(() => {
                                if (certForm.imageUrl) {
                                  setEditingCertForm((current) => ({
                                    ...current,
                                    imageUrl: certForm.imageUrl,
                                  }));
                                }
                              })
                            }
                            disabled={uploadingCertImage}
                          />
                        </label>
                        {editingCertForm.imageUrl ? (
                          <span className="text-xs text-muted-foreground truncate">
                            Image ready
                          </span>
                        ) : null}
                      </div>
                      <textarea
                        className="md:col-span-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm min-h-[120px]"
                        placeholder="Description"
                        value={editingCertForm.description}
                        onChange={(event) =>
                          updateCertField(setEditingCertForm, 'description', event.target.value)
                        }
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        placeholder="Order"
                        value={editingCertForm.order}
                        onChange={(event) =>
                          updateCertField(setEditingCertForm, 'order', event.target.value)
                        }
                      />
                      <div className="md:col-span-2 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wide"
                        >
                          Update certification
                        </button>
                        <button
                          type="button"
                          onClick={cancelCertEditing}
                          className="px-5 py-3 rounded-full border border-border text-xs font-mono uppercase tracking-wide"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === 'settings' ? (
          <section className="bento-card p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold">Account settings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update your admin email or password.
              </p>
            </div>
            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Admin email"
                value={settingsEmail}
                onChange={(event) => setSettingsEmail(event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Current password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="New password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <div className="md:col-span-2 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-muted-foreground">
                  Leave password fields empty to keep your current password.
                </p>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wide disabled:opacity-60"
                >
                  {settingsLoading ? 'Saving...' : 'Save settings'}
                </button>
              </div>
              {settingsMessage ? (
                <p className="md:col-span-2 text-xs text-emerald-400">{settingsMessage}</p>
              ) : null}
            </form>
          </section>
        ) : null}
      </div>

      {showSignOutConfirm ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSignOutConfirm(false)}
          />
          <div className="relative z-10 w-full max-w-md bento-card p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold">Sign out</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Are you sure you want to sign out?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="px-4 py-2 rounded-full border border-border text-xs font-mono uppercase tracking-wide"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wide"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
