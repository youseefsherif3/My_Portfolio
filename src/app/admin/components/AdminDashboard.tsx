'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Icon from '@/components/ui/AppIcon';

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

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  companyUrl: string;
  location: string;
  period: string;
  description: string;
  technologies: string[];
  order: number;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied?: boolean;
  createdAt: string;
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

interface ExperienceFormState {
  title: string;
  company: string;
  companyUrl: string;
  location: string;
  period: string;
  description: string;
  technologies: string;
  order: string;
}

const blankProjectForm: ProjectFormState = {
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
  category: 'Backend Development',
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

const blankExpForm: ExperienceFormState = {
  title: '',
  company: '',
  companyUrl: '',
  location: '',
  period: '',
  description: '',
  technologies: '',
  order: '0',
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const TOPIC_TITLES: Record<string, string> = {
  'backend-api': 'Backend API Development',
  'auth-security': 'Authentication & Security Systems',
  'database-design': 'Database Design & Optimization',
  'full-consultation': 'Full Project Consultation',
  'other': 'Inquiry & Collaboration',
};

function formatTopicSubject(rawSubject: string): string {
  if (!rawSubject) return 'Inquiry & Collaboration';
  const clean = rawSubject.trim();
  if (TOPIC_TITLES[clean.toLowerCase()]) {
    return TOPIC_TITLES[clean.toLowerCase()];
  }
  if (/^[a-z0-9-]+$/i.test(clean) && clean.includes('-')) {
    return clean
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return clean;
}

const YEARS_LIST = Array.from({ length: 25 }, (_, i) => String(new Date().getFullYear() - 15 + i));

function parsePeriodString(val: string) {
  if (!val) return { startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false };
  const isPresent = val.toLowerCase().includes('present');
  const parts = val.split('-').map((s) => s.trim());
  const startPart = parts[0] || '';
  const endPart = parts[1] || '';

  let startMonth = '';
  let startYear = '';
  if (startPart) {
    const tokens = startPart.split(' ');
    for (const t of tokens) {
      if (/^\d{4}$/.test(t)) {
        startYear = t;
      } else {
        const found = MONTH_NAMES.find((m) => m.toLowerCase().startsWith(t.toLowerCase()));
        if (found) startMonth = found;
      }
    }
  }

  let endMonth = '';
  let endYear = '';
  if (!isPresent && endPart) {
    const tokens = endPart.split(' ');
    for (const t of tokens) {
      if (/^\d{4}$/.test(t)) {
        endYear = t;
      } else {
        const found = MONTH_NAMES.find((m) => m.toLowerCase().startsWith(t.toLowerCase()));
        if (found) endMonth = found;
      }
    }
  }

  return { startMonth, startYear, endMonth, endYear, isPresent };
}

function DatePeriodPicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const parsed = useMemo(() => parsePeriodString(value), [value]);

  const [startMonth, setStartMonth] = useState(parsed.startMonth);
  const [startYear, setStartYear] = useState(parsed.startYear);
  const [endMonth, setEndMonth] = useState(parsed.endMonth);
  const [endYear, setEndYear] = useState(parsed.endYear);
  const [isPresent, setIsPresent] = useState(parsed.isPresent);

  useEffect(() => {
    setStartMonth(parsed.startMonth);
    setStartYear(parsed.startYear);
    setEndMonth(parsed.endMonth);
    setEndYear(parsed.endYear);
    setIsPresent(parsed.isPresent);
  }, [parsed]);

  const update = (sm: string, sy: string, em: string, ey: string, pres: boolean) => {
    let result = '';
    if (sy) {
      result += sm ? `${sm} ${sy}` : sy;
    }
    if (pres) {
      result += result ? ' - Present' : 'Present';
    } else if (ey) {
      const endFormatted = em ? `${em} ${ey}` : ey;
      result += result ? ` - ${endFormatted}` : endFormatted;
    }
    onChange(result);
  };

  return (
    <div className="p-4 sm:p-5 bg-[#080C10] border border-[#1E2D3D] rounded-2xl space-y-4 font-mono text-xs text-slate-300">
      <div className="text-slate-400 font-bold flex items-center gap-2">
        <Icon name="CalendarIcon" size={16} className="text-[#0ECFCF]" />
        <span>Duration Period Picker</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Start Month &amp; Year</label>
          <div className="flex gap-2">
            <select
              className="bg-[#0F1923] border border-[#1E2D3D] rounded-xl p-3 text-slate-200 text-xs w-full focus:border-[#0ECFCF] outline-none"
              value={startMonth}
              onChange={(e) => {
                setStartMonth(e.target.value);
                update(e.target.value, startYear, endMonth, endYear, isPresent);
              }}
            >
              <option value="">Select Month</option>
              {MONTH_NAMES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              className="bg-[#0F1923] border border-[#1E2D3D] rounded-xl p-3 text-slate-200 text-xs w-full focus:border-[#0ECFCF] outline-none"
              value={startYear}
              onChange={(e) => {
                setStartYear(e.target.value);
                update(startMonth, e.target.value, endMonth, endYear, isPresent);
              }}
            >
              <option value="">Select Year</option>
              {YEARS_LIST.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">End Month &amp; Year</label>
          <div className="flex gap-2">
            <select
              disabled={isPresent}
              className="bg-[#0F1923] border border-[#1E2D3D] rounded-xl p-3 text-slate-200 text-xs w-full focus:border-[#0ECFCF] outline-none disabled:opacity-40"
              value={endMonth}
              onChange={(e) => {
                setEndMonth(e.target.value);
                update(startMonth, startYear, e.target.value, endYear, isPresent);
              }}
            >
              <option value="">Select Month</option>
              {MONTH_NAMES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              disabled={isPresent}
              className="bg-[#0F1923] border border-[#1E2D3D] rounded-xl p-3 text-slate-200 text-xs w-full focus:border-[#0ECFCF] outline-none disabled:opacity-40"
              value={endYear}
              onChange={(e) => {
                setEndYear(e.target.value);
                update(startMonth, startYear, endMonth, e.target.value, isPresent);
              }}
            >
              <option value="">Select Year</option>
              {YEARS_LIST.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1E2D3D]/60">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isPresent}
            className="accent-[#0ECFCF] w-4 h-4 rounded"
            onChange={(e) => {
              setIsPresent(e.target.checked);
              update(startMonth, startYear, endMonth, endYear, e.target.checked);
            }}
          />
          <span className="text-slate-200 font-semibold">Currently working here (Present)</span>
        </label>

        {value ? (
          <div className="text-xs text-[#0ECFCF] font-bold font-mono bg-[#0ECFCF]/10 px-3 py-1 rounded-lg border border-[#0ECFCF]/30">
            Selected: {value}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'skills' | 'experience' | 'certifications' | 'messages' | 'settings' | 'analytics'
  >('overview');

  // Mobile Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Full Page Form View Mode States
  const [projectFormMode, setProjectFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(blankProjectForm);

  const [skillFormMode, setSkillFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState<SkillFormState>(blankSkillForm);

  const [expFormMode, setExpFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [expForm, setExpForm] = useState<ExperienceFormState>(blankExpForm);

  const [certFormMode, setCertFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certForm, setCertForm] = useState<CertificationFormState>(blankCertForm);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [sendingReply, setSendingReply] = useState<boolean>(false);
  const [analyticsTotal, setAnalyticsTotal] = useState<number>(0);
  const [analytics, setAnalytics] = useState<{
    totalPageViews: number;
    contactSubmissions: number;
    activeProjects: number;
    trendData: { date: string; views: number }[];
  }>({
    totalPageViews: 0,
    contactSubmissions: 0,
    activeProjects: 0,
    trendData: [],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [noticeMessage, setNoticeMessage] = useState<string>('');

  // Seeds & Reset loading
  const [seedLoading, setSeedLoading] = useState<boolean>(false);
  const [seedMessage, setSeedMessage] = useState<string>('');
  const [skillsSeedLoading, setSkillsSeedLoading] = useState<boolean>(false);
  const [skillsSeedMessage, setSkillsSeedMessage] = useState<string>('');
  const [certSeedLoading, setCertSeedLoading] = useState<boolean>(false);
  const [certSeedMessage, setCertSeedMessage] = useState<string>('');

  // Uploading state
  const [uploadingProjectImage, setUploadingProjectImage] = useState<boolean>(false);
  const [uploadingCertImage, setUploadingCertImage] = useState<boolean>(false);

  // Settings State
  const [settingsEmail, setSettingsEmail] = useState<string>(adminEmail || '');
  const [settingsCvUrl, setSettingsCvUrl] = useState<string>('/cv.pdf');
  const [uploadingCv, setUploadingCv] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [settingsMessage, setSettingsMessage] = useState<string>('');
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);

  // Quick dialogs & Custom Confirm Modal
  const [showSignOutConfirm, setShowSignOutConfirm] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: () => {},
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void, confirmText = 'Delete') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm,
    });
  };

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pRes, sRes, cRes, eRes, mRes, aRes, stRes] = await Promise.all([
        fetch('/api/admin/projects', { credentials: 'include' }),
        fetch('/api/admin/skills', { credentials: 'include' }),
        fetch('/api/admin/certifications', { credentials: 'include' }),
        fetch('/api/admin/experiences', { credentials: 'include' }),
        fetch('/api/admin/messages', { credentials: 'include' }),
        fetch('/api/admin/analytics', { credentials: 'include' }),
        fetch('/api/admin/settings', { credentials: 'include' }),
      ]);

      if (pRes.ok) {
        const data = await pRes.json();
        setProjects(data.projects || []);
      }
      if (sRes.ok) {
        const data = await sRes.json();
        setSkills(data.skills || []);
      }
      if (cRes.ok) {
        const data = await cRes.json();
        setCertifications(data.certifications || []);
      }
      if (eRes.ok) {
        const data = await eRes.json();
        setExperiences(data.experiences || []);
      }
      if (mRes.ok) {
        const data = await mRes.json();
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
      }
      if (aRes.ok) {
        const data = await aRes.json();
        setAnalyticsTotal(Number(data.total || 0));
        setAnalytics({
          totalPageViews: data.totalPageViews ?? data.total ?? 0,
          contactSubmissions: data.contactSubmissions ?? 0,
          activeProjects: data.activeProjects ?? projects.length,
          trendData: data.trendData || [],
        });
      }
      if (stRes.ok) {
        const data = await stRes.json();
        if (data.email) setSettingsEmail(data.email);
        if (data.cvUrl) setSettingsCvUrl(data.cvUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(''), 3000);
  };

  // Image Upload Handler
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
    if (!file) return;
    setUploadingProjectImage(true);
    try {
      const url = await uploadImage(file, 'portfolio/projects');
      setProjectForm((curr) => ({ ...curr, image: url }));
      showNotice('Project image uploaded!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingProjectImage(false);
    }
  };

  const handleCertImageUpload = async (file?: File) => {
    if (!file) return;
    setUploadingCertImage(true);
    try {
      const url = await uploadImage(file, 'portfolio/certifications');
      setCertForm((curr) => ({ ...curr, imageUrl: url }));
      showNotice('Certification image uploaded!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingCertImage(false);
    }
  };

  // Seed Handlers
  const handleSeedDefaults = async () => {
    setSeedLoading(true);
    try {
      const res = await fetch('/api/admin/projects/seed', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setSeedMessage(`Imported ${data.created ?? 0} project(s).`);
        showNotice('Default projects imported!');
      }
    } catch (err) {
      setError('Failed to import default projects');
    } finally {
      setSeedLoading(false);
    }
  };

  const handleSeedSkills = async () => {
    setSkillsSeedLoading(true);
    try {
      const res = await fetch('/api/admin/skills/seed', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills || []);
        setSkillsSeedMessage(`Imported ${data.created ?? 0} skill(s).`);
        showNotice('Default skills imported!');
      }
    } catch (err) {
      setError('Failed to import default skills');
    } finally {
      setSkillsSeedLoading(false);
    }
  };

  const handleSeedCertifications = async () => {
    setCertSeedLoading(true);
    try {
      const res = await fetch('/api/admin/certifications/seed', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCertifications(data.certifications || []);
        setCertSeedMessage(`Imported ${data.created ?? 0} cert(s).`);
        showNotice('Default certifications imported!');
      }
    } catch (err) {
      setError('Failed to import default certs');
    } finally {
      setCertSeedLoading(false);
    }
  };

  // Reset Database
  const handleResetDefaults = async () => {
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setShowResetConfirm(false);
        showNotice('Database reset to defaults successfully');
        fetchData();
      }
    } catch (err) {
      setError('Failed to reset database');
    }
  };

  // Analytics Tag & Skill charts
  const tagChartData = useMemo(() => {
    const map = new Map<string, number>();
    projects.forEach((p) => p.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [projects]);

  const skillChartData = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    skills.forEach((s) => {
      const entry = map.get(s.category) || { total: 0, count: 0 };
      entry.total += s.level;
      entry.count += 1;
      map.set(s.category, entry);
    });
    return Array.from(map.entries()).map(([category, data]) => ({
      category,
      average: Math.round(data.total / Math.max(1, data.count)),
    }));
  }, [skills]);

  // Messages handling
  const handleToggleReadMessage = async (msg: ContactMessage) => {
    try {
      const newReadState = !msg.read;
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg._id, read: newReadState }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, read: newReadState } : m)));
        setUnreadCount((prev) => (newReadState ? Math.max(0, prev - 1) : prev + 1));
        if (selectedMessage?._id === msg._id) {
          setSelectedMessage((prev) => (prev ? { ...prev, read: newReadState } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = (id: string) => {
    triggerConfirm(
      'Delete Inquiry Message',
      'Are you sure you want to permanently delete this contact message?',
      async () => {
        try {
          const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
          if (res.ok) {
            setMessages((prev) => prev.filter((m) => m._id !== id));
            if (selectedMessage?._id === id) setSelectedMessage(null);
            showNotice('Message deleted');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch('/api/admin/messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedMessage._id, replyText }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reply email');
      }

      setMessages((prev) =>
        prev.map((m) =>
          m._id === selectedMessage._id ? { ...m, replied: true, read: true } : m
        )
      );
      setSelectedMessage((prev) => (prev ? { ...prev, replied: true, read: true } : null));
      setUnreadCount((prev) => (!selectedMessage.read ? Math.max(0, prev - 1) : prev));
      setReplyText('');
      setIsReplying(false);
      showNotice(`Email reply sent successfully to ${selectedMessage.email}!`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to send reply email');
    } finally {
      setSendingReply(false);
    }
  };

  // Project CRUD
  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = projectFormMode === 'edit' && editingProject;
      const method = isEdit ? 'PATCH' : 'POST';
      const url = isEdit ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects';
      const body = {
        ...projectForm,
        tags: projectForm.tags.split(',').map((t) => t.trim()),
        order: Number(projectForm.order || 0),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showNotice(isEdit ? 'Project updated' : 'Project created');
        setProjectFormMode('list');
        setEditingProject(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = (id: string) => {
    triggerConfirm(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      async () => {
        try {
          const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE', credentials: 'include' });
          if (res.ok) {
            showNotice('Project deleted');
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Skill CRUD
  const handleSaveSkill = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = skillFormMode === 'edit' && editingSkill;
      const method = isEdit ? 'PATCH' : 'POST';
      const url = isEdit ? `/api/admin/skills/${editingSkill.id}` : '/api/admin/skills';
      const body = {
        ...skillForm,
        level: Number(skillForm.level || 80),
        order: Number(skillForm.order || 0),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showNotice(isEdit ? 'Skill updated' : 'Skill created');
        setSkillFormMode('list');
        setEditingSkill(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = (id: string) => {
    triggerConfirm(
      'Delete Skill',
      'Are you sure you want to delete this skill entry?',
      async () => {
        try {
          const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE', credentials: 'include' });
          if (res.ok) {
            showNotice('Skill deleted');
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Experience CRUD
  const handleSaveExperience = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = expFormMode === 'edit' && editingExp;
      const method = isEdit ? 'PATCH' : 'POST';
      const url = isEdit ? `/api/admin/experiences/${editingExp.id}` : '/api/admin/experiences';
      const body = {
        ...expForm,
        technologies: expForm.technologies.split(',').map((t) => t.trim()),
        order: Number(expForm.order || 0),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showNotice(isEdit ? 'Experience updated' : 'Experience created');
        setExpFormMode('list');
        setEditingExp(null);
        fetchData();
      } else {
        const data = await res.json().catch(() => null);
        showNotice(data?.error || 'Failed to save experience');
      }
    } catch (err) {
      console.error(err);
      showNotice('An unexpected error occurred while saving experience');
    }
  };

  const handleDeleteExperience = (id: string) => {
    triggerConfirm(
      'Delete Experience',
      'Are you sure you want to delete this experience entry?',
      async () => {
        try {
          const res = await fetch(`/api/admin/experiences/${id}`, { method: 'DELETE', credentials: 'include' });
          if (res.ok) {
            showNotice('Experience deleted');
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Certification CRUD
  const handleSaveCert = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = certFormMode === 'edit' && editingCert;
      const method = isEdit ? 'PATCH' : 'POST';
      const url = isEdit ? `/api/admin/certifications/${editingCert.id}` : '/api/admin/certifications';
      const body = {
        ...certForm,
        order: Number(certForm.order || 0),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showNotice(isEdit ? 'Certification updated' : 'Certification created');
        setCertFormMode('list');
        setEditingCert(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCert = (id: string) => {
    triggerConfirm(
      'Delete Certification',
      'Are you sure you want to delete this certification entry?',
      async () => {
        try {
          const res = await fetch(`/api/admin/certifications/${id}`, { method: 'DELETE', credentials: 'include' });
          if (res.ok) {
            showNotice('Certification deleted');
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const handleCvFileUpload = async (file?: File) => {
    if (!file) return;
    setUploadingCv(true);
    try {
      const url = await uploadImage(file, 'portfolio/cv');
      setSettingsCvUrl(url);
      showNotice('CV file uploaded!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'CV Upload failed');
    } finally {
      setUploadingCv(false);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setSettingsLoading(true);
    setSettingsMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: settingsEmail,
          currentPassword,
          newPassword,
          cvUrl: settingsCvUrl,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettingsMessage('Settings updated successfully.');
        setSettingsEmail(String(data.email || settingsEmail));
        if (data.cvUrl) setSettingsCvUrl(String(data.cvUrl));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showNotice('Account settings saved!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setError('Failed to update settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'Squares2X2Icon' },
    { id: 'projects', label: 'Projects', icon: 'FolderIcon' },
    { id: 'skills', label: 'Skills', icon: 'WrenchScrewdriverIcon' },
    { id: 'experience', label: 'Experience', icon: 'BriefcaseIcon' },
    { id: 'certifications', label: 'Certifications', icon: 'AcademicCapIcon' },
    { id: 'messages', label: 'Messages', icon: 'ChatBubbleLeftRightIcon', badge: unreadCount > 0 ? unreadCount : null },
    { id: 'settings', label: 'Settings', icon: 'Cog6ToothIcon' },
    { id: 'analytics', label: 'Analytics', icon: 'ChartBarIcon' },
  ];

  return (
    <div className="h-screen w-screen bg-[#080C10] text-[#E2E8F0] flex flex-col md:flex-row font-sans selection:bg-[#0ECFCF] selection:text-[#080C10] overflow-hidden">
      {/* Desktop Sidebar Navigation (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 h-full bg-[#0F1923] border-r border-[#1E2D3D] flex-col shrink-0 justify-between select-none">
        <div>
          <div className="p-5 border-b border-[#1E2D3D]">
            <div className="flex items-center gap-2">
              <span className="text-[#0ECFCF] font-mono font-bold text-lg">&gt;_</span>
              <span className="font-bold text-base text-white tracking-tight">Youseef Admin</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">v1.0 CMS</div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    setProjectFormMode('list');
                    setSkillFormMode('list');
                    setExpFormMode('list');
                    setCertFormMode('list');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#0ECFCF] text-[#080C10] font-bold shadow-[0_0_18px_rgba(14,207,207,0.4)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon name={tab.icon} size={18} className={isActive ? 'text-[#080C10]' : 'text-slate-400'} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge ? (
                    <span className="bg-amber-500 text-black font-bold font-mono text-[10px] px-1.5 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3.5 space-y-3 border-t border-[#1E2D3D]">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 bg-[#080C10] border border-[#1E2D3D] hover:border-[#0ECFCF]/50 rounded-xl text-xs font-mono text-slate-300 transition"
          >
            <span>View Public Site</span>
            <Icon name="ArrowTopRightOnSquareIcon" size={14} className="text-slate-500" />
          </Link>

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1A2535] border border-[#1E2D3D] flex items-center justify-center font-bold text-xs text-[#0ECFCF]">
                N
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-200 truncate">Youseef Sherif</div>
                <div className="text-[10px] font-mono text-slate-500 truncate">{settingsEmail || adminEmail}</div>
              </div>
            </div>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              title="Sign Out"
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <Icon name="ArrowRightOnRectangleIcon" size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header Bar */}
      <header className="flex md:hidden bg-[#0F1923] border-b border-[#1E2D3D] px-4 py-3 items-center justify-between shrink-0 z-30 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 bg-[#080C10] border border-[#1E2D3D] hover:border-[#0ECFCF] rounded-xl text-slate-300 transition cursor-pointer"
          >
            <Icon name="Bars3Icon" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[#0ECFCF] font-mono font-bold text-base">&gt;_</span>
            <span className="font-bold text-sm text-white">Youseef Admin</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-[#0ECFCF] bg-[#0ECFCF]/10 px-2.5 py-1 rounded-lg border border-[#0ECFCF]/30 uppercase font-bold">
          {activeTab}
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
          <aside className="w-72 h-full bg-[#0F1923] border-r border-[#1E2D3D] flex flex-col justify-between p-4 shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-[#1E2D3D] pb-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#0ECFCF] font-mono font-bold text-lg">&gt;_</span>
                  <span className="font-bold text-base text-white">Youseef Admin</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-1 text-xl font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as typeof activeTab);
                        setProjectFormMode('list');
                        setSkillFormMode('list');
                        setExpFormMode('list');
                        setCertFormMode('list');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-[#0ECFCF] text-[#080C10] font-bold shadow-[0_0_18px_rgba(14,207,207,0.4)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={tab.icon} size={18} className={isActive ? 'text-[#080C10]' : 'text-slate-400'} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge ? (
                        <span className="bg-amber-500 text-black font-bold font-mono text-[10px] px-1.5 py-0.5 rounded-full">
                          {tab.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#1E2D3D]">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#080C10] border border-[#1E2D3D] rounded-xl text-xs font-mono text-slate-300"
              >
                <span>View Public Site</span>
                <Icon name="ArrowTopRightOnSquareIcon" size={14} className="text-slate-500" />
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowSignOutConfirm(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-950/60 border border-red-800/40 text-red-400 rounded-xl text-xs font-mono font-bold"
              >
                <Icon name="ArrowRightOnRectangleIcon" size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 relative w-full max-w-full overflow-x-hidden">
        {/* Notice Toast */}
        {noticeMessage ? (
          <div className="fixed bottom-6 right-6 z-[99999] bg-[#0F1923] border border-[#0ECFCF]/60 text-white font-mono text-xs px-4 py-3 rounded-2xl shadow-2xl shadow-black/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-md">
            <div className="w-6 h-6 rounded-full bg-[#0ECFCF]/20 border border-[#0ECFCF]/40 flex items-center justify-center text-[#0ECFCF] shrink-0 font-bold">
              ✓
            </div>
            <span className="font-semibold text-slate-100">{noticeMessage}</span>
            <button
              onClick={() => setNoticeMessage('')}
              className="text-slate-400 hover:text-white p-1 text-sm font-bold ml-2 cursor-pointer"
            >
              &times;
            </button>
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800/40 rounded-xl text-xs font-mono text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-slate-400 hover:text-white font-bold">&times;</button>
          </div>
        ) : null}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">System Overview &amp; Control</h1>
              <p className="text-xs font-mono text-slate-400">Real-time database statistics and public portfolio metrics.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bento-card p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span>Total Projects</span>
                  <div className="w-8 h-8 rounded-lg bg-[#0ECFCF]/10 border border-[#0ECFCF]/30 flex items-center justify-center text-[#0ECFCF]">
                    <Icon name="FolderIcon" size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{projects.length}</div>
                <div className="text-xs font-mono text-[#0ECFCF]">{projects.filter(p => p.featured).length} Published + {projects.filter(p => !p.featured).length} Drafts</div>
              </div>

              <div className="bento-card p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span>Unread Inquiries</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/30 flex items-center justify-center text-amber-400">
                    <Icon name="ChatBubbleLeftRightIcon" size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{unreadCount}</div>
                <div className="text-xs font-mono text-slate-400">Requires response in inbox</div>
              </div>

              <div className="bento-card p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span>Total Page Views</span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/30 flex items-center justify-center text-cyan-400">
                    <Icon name="EyeIcon" size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{analyticsTotal || analytics.totalPageViews}</div>
                <div className="text-xs font-mono text-slate-400">Tracked analytics events</div>
              </div>

              <div className="bento-card p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span>Database Status</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/30 flex items-center justify-center text-emerald-400">
                    <Icon name="CheckIcon" size={16} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-400 mb-2">Connected</div>
                <div className="text-xs font-mono text-slate-400">MongoDB driver active</div>
              </div>
            </div>

            {/* Default Import Seeds Bar */}
            <div className="bento-card p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white">Default Data Importers</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">Quickly seed starter projects, skills, or certifications into database.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  disabled={seedLoading}
                  className="px-3.5 py-2 rounded-xl bg-[#1A2535] border border-[#1E2D3D] hover:border-[#0ECFCF] text-xs font-mono text-slate-200 transition disabled:opacity-50"
                >
                  {seedLoading ? 'Importing...' : 'Seed Projects'}
                </button>
                <button
                  type="button"
                  onClick={handleSeedSkills}
                  disabled={skillsSeedLoading}
                  className="px-3.5 py-2 rounded-xl bg-[#1A2535] border border-[#1E2D3D] hover:border-[#0ECFCF] text-xs font-mono text-slate-200 transition disabled:opacity-50"
                >
                  {skillsSeedLoading ? 'Importing...' : 'Seed Skills'}
                </button>
                <button
                  type="button"
                  onClick={handleSeedCertifications}
                  disabled={certSeedLoading}
                  className="px-3.5 py-2 rounded-xl bg-[#1A2535] border border-[#1E2D3D] hover:border-[#0ECFCF] text-xs font-mono text-slate-200 transition disabled:opacity-50"
                >
                  {certSeedLoading ? 'Importing...' : 'Seed Certs'}
                </button>
              </div>
            </div>

            {/* Analytics Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bento-card p-5">
                <div className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider font-bold">Top Tags Distribution</div>
                {tagChartData.length > 0 ? (
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tagChartData} margin={{ top: 5, right: 10, left: -16, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(148,163,184,0.1)" vertical={false} />
                        <XAxis dataKey="tag" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip
                          cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                          contentStyle={{ background: '#0F1923', border: '1px solid #1E2D3D', borderRadius: 12, fontSize: 12 }}
                        />
                        <Bar dataKey="count" fill="#0ECFCF" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-xs font-mono text-slate-500 py-10 text-center">Add projects to view tag stats.</p>
                )}
              </div>

              <div className="bento-card p-5">
                <div className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider font-bold">Skill Category Averages</div>
                {skillChartData.length > 0 ? (
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={skillChartData} margin={{ top: 5, right: 10, left: -16, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(148,163,184,0.1)" vertical={false} />
                        <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip
                          cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                          contentStyle={{ background: '#0F1923', border: '1px solid #1E2D3D', borderRadius: 12, fontSize: 12 }}
                        />
                        <Bar dataKey="average" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-xs font-mono text-slate-500 py-10 text-center">Add skills to view averages.</p>
                )}
              </div>
            </div>

            {/* Quick Management & Recent Inquiries Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <h2 className="text-base font-bold text-white">Quick Management</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="w-full bento-card p-4 flex items-center justify-between text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0ECFCF]/10 border border-[#0ECFCF]/30 flex items-center justify-center text-[#0ECFCF]">
                        <Icon name="FolderIcon" size={16} />
                      </div>
                      <span className="font-medium text-sm text-slate-200 group-hover:text-white">Manage Projects</span>
                    </div>
                    <Icon name="ArrowRightIcon" size={16} className="text-slate-500 group-hover:text-[#0ECFCF] transition" />
                  </button>

                  <button
                    onClick={() => setActiveTab('messages')}
                    className="w-full bento-card p-4 flex items-center justify-between text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/30 flex items-center justify-center text-amber-400">
                        <Icon name="ChatBubbleLeftRightIcon" size={16} />
                      </div>
                      <span className="font-medium text-sm text-slate-200 group-hover:text-white">Contact Inbox</span>
                    </div>
                    <Icon name="ArrowRightIcon" size={16} className="text-slate-500 group-hover:text-amber-400 transition" />
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full bento-card p-4 flex items-center justify-between text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/30 flex items-center justify-center text-cyan-400">
                        <Icon name="Cog6ToothIcon" size={16} />
                      </div>
                      <span className="font-medium text-sm text-slate-200 group-hover:text-white">Site &amp; Account Settings</span>
                    </div>
                    <Icon name="ArrowRightIcon" size={16} className="text-slate-500 group-hover:text-cyan-400 transition" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">Recent Inquiries</h2>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs font-mono text-[#0ECFCF] hover:underline transition cursor-pointer"
                  >
                    View All Messages &rarr;
                  </button>
                </div>
                <div className="bento-card p-6 min-h-[160px] flex items-center justify-center text-center">
                  {messages.length === 0 ? (
                    <span className="text-xs font-mono text-slate-500">No contact form submissions recorded yet.</span>
                  ) : (
                    <div className="w-full space-y-3">
                      {messages.slice(0, 3).map((m) => (
                        <div
                          key={m._id}
                          onClick={() => {
                            setSelectedMessage(m);
                            setActiveTab('messages');
                          }}
                          className="p-3.5 bg-[#080C10] border border-[#1E2D3D] hover:border-[#0ECFCF]/50 rounded-xl text-left transition cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{m.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">{m.email}</span>
                            </div>
                            <div className="text-xs font-mono text-slate-400 line-clamp-1 mt-0.5">{m.subject}</div>
                          </div>
                          {!m.read ? (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unread" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Projects */}
        {activeTab === 'projects' && (
          projectFormMode === 'list' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">Project Management</h1>
                  <p className="text-xs font-mono text-slate-400">Create, edit, feature, and publish portfolio projects.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm(blankProjectForm);
                    setProjectFormMode('add');
                  }}
                  className="bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] font-bold text-xs font-mono px-5 py-2.5 rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Icon name="PlusIcon" size={16} />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Mobile Cards List View (Mobile Only - Zero Horizontal Overflow) */}
              <div className="block md:hidden space-y-4">
                {projects.map((proj, idx) => (
                  <div key={proj.id} className="bento-card p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500 font-bold">#{proj.order ?? idx + 1}</span>
                          <h3 className="font-bold text-slate-100 text-sm font-sans">{proj.title}</h3>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        proj.featured ? 'bg-emerald-950/80 border border-emerald-800/60 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {proj.featured ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {proj.tags && proj.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.tags.map((t, i) => (
                          <span key={i} className="skill-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E2D3D]">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setProjectForm({
                            title: proj.title,
                            description: proj.description,
                            tags: proj.tags.join(', '),
                            image: proj.image,
                            imageAlt: proj.imageAlt || '',
                            github: proj.github,
                            live: proj.live,
                            featured: proj.featured,
                            highlight: proj.highlight || '',
                            order: String(proj.order ?? 0),
                          });
                          setProjectFormMode('edit');
                        }}
                        className="px-4 py-2 bg-[#1A2535] hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition flex items-center gap-1.5 cursor-pointer font-bold"
                      >
                        <Icon name="PencilSquareIcon" size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="px-4 py-2 bg-[#1A2535] hover:bg-red-950 hover:text-red-400 text-slate-400 text-xs font-mono rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Icon name="TrashIcon" size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (Desktop Only) */}
              <div className="hidden md:block bento-card overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1E2D3D] text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-[#080C10]/60">
                      <th className="p-4 pl-6">Order</th>
                      <th className="p-4">Project Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2D3D]/50 text-xs font-mono">
                    {projects.map((proj, idx) => (
                      <tr key={proj.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-4 pl-6 text-slate-500">#{proj.order ?? idx + 1}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-100 font-sans text-sm">{proj.title}</div>
                          <div className="text-[11px] text-slate-500">/projects/{proj.title.toLowerCase().replace(/\s+/g, '-')}</div>
                        </td>
                        <td className="p-4">
                          <span className="skill-tag">
                            {proj.tags[0] || 'Backend'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">Completed</td>
                        <td className="p-4">
                          <span className="text-emerald-400 flex items-center gap-1.5 font-semibold text-[11px]">
                            <Icon name="CheckIcon" size={14} />
                            {proj.featured ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 space-x-2">
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setProjectForm({
                                title: proj.title,
                                description: proj.description,
                                tags: proj.tags.join(', '),
                                image: proj.image,
                                imageAlt: proj.imageAlt || '',
                                github: proj.github,
                                live: proj.live,
                                featured: proj.featured,
                                highlight: proj.highlight || '',
                                order: String(proj.order ?? 0),
                              });
                              setProjectFormMode('edit');
                            }}
                            className="p-2 bg-[#1A2535] hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer inline-flex items-center"
                          >
                            <Icon name="PencilSquareIcon" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 bg-[#1A2535] hover:bg-red-950 hover:text-red-400 text-slate-400 rounded-xl transition cursor-pointer inline-flex items-center"
                          >
                            <Icon name="TrashIcon" size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Full Page Form for Project Add/Edit */
            <div className="space-y-6 w-full">
              <div className="flex items-center border-b border-[#1E2D3D] pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setProjectFormMode('list');
                      setEditingProject(null);
                    }}
                    className="p-2 bg-[#0F1923] border border-[#1E2D3D] hover:border-[#0ECFCF] text-slate-300 rounded-xl transition cursor-pointer flex items-center gap-2 text-xs font-mono shrink-0"
                  >
                    <Icon name="ArrowLeftIcon" size={16} />
                    <span>Back</span>
                  </button>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                      {projectFormMode === 'edit' ? `Edit Project: ${editingProject?.title}` : 'Add New Project'}
                    </h1>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">Fill out all project details and publish live.</p>
                  </div>
                </div>
              </div>

              <form id="project-full-form" onSubmit={handleSaveProject} className="bento-card p-4 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2D3D] pb-2">
                    <Icon name="FolderIcon" size={16} className="text-[#0ECFCF]" />
                    <span>Basic Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Project Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. E-Commerce Platform API"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Node.js, Express, MongoDB, Redis"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={projectForm.tags}
                        onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Highlight Badge Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Featured / High Scale"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={projectForm.highlight}
                        onChange={(e) => setProjectForm({ ...projectForm, highlight: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Display Order</label>
                      <input
                        type="number"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={projectForm.order}
                        onChange={(e) => setProjectForm({ ...projectForm, order: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Detailed Description *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write a comprehensive description of the project architecture, features, and tech stack..."
                      className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl p-4 text-xs font-mono text-slate-200 outline-none min-h-[120px]"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4 pt-4 border-t border-[#1E2D3D]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2D3D] pb-2">
                    <Icon name="PhotoIcon" size={16} className="text-[#0ECFCF]" />
                    <span>Media &amp; File Upload</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Image URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="px-5 py-3 rounded-xl bg-[#1A2535] border border-[#1E2D3D] hover:border-[#0ECFCF] text-xs font-mono uppercase tracking-wide cursor-pointer text-slate-200 transition font-bold">
                        {uploadingProjectImage ? 'Uploading Image...' : 'Upload Image File'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleProjectImageUpload(e.target.files?.[0])}
                          disabled={uploadingProjectImage}
                        />
                      </label>
                      {projectForm.image ? (
                        <span className="text-xs font-mono text-[#0ECFCF] font-bold">✓ Ready</span>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Image Alt Text</label>
                    <input
                      type="text"
                      placeholder="Project preview screenshot"
                      className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                      value={projectForm.imageAlt}
                      onChange={(e) => setProjectForm({ ...projectForm, imageAlt: e.target.value })}
                    />
                  </div>
                </div>

                {/* Links Section */}
                <div className="space-y-4 pt-4 border-t border-[#1E2D3D]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2D3D] pb-2">
                    <Icon name="LinkIcon" size={16} className="text-[#0ECFCF]" />
                    <span>Links &amp; Deployment</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">GitHub Repository URL</label>
                      <input
                        type="text"
                        placeholder="https://github.com/youseefsherif3/..."
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={projectForm.github}
                        onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Live Demo / Production URL</label>
                      <input
                        type="text"
                        placeholder="https://myproject.com"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={projectForm.live}
                        onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      className="accent-[#0ECFCF] w-5 h-5 rounded"
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    />
                    <span className="text-sm font-semibold text-slate-200">Featured / Published on Public Portfolio</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1E2D3D]">
                  <button
                    type="button"
                    onClick={() => {
                      setProjectFormMode('list');
                      setEditingProject(null);
                    }}
                    className="px-5 py-2.5 bg-[#1A2535] hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] text-xs font-mono font-bold rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] cursor-pointer"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          )
        )}

        {/* Tab 3: Skills */}
        {activeTab === 'skills' && (
          skillFormMode === 'list' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">Skills Matrix Management</h1>
                  <p className="text-xs font-mono text-slate-400">Manage core technologies and qualitative proficiency ratings.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setSkillForm(blankSkillForm);
                    setSkillFormMode('add');
                  }}
                  className="bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] font-bold text-xs font-mono px-5 py-2.5 rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Icon name="PlusIcon" size={16} />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Mobile Cards List View (Mobile Only) */}
              <div className="block md:hidden space-y-3">
                {skills.map((s, idx) => (
                  <div key={s.id} className="bento-card p-4 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">#{s.order ?? idx + 1}</span>
                        <h3 className="font-bold text-slate-100 text-sm font-sans">{s.name}</h3>
                      </div>
                      <div className="text-xs font-mono text-slate-400">{s.category}</div>
                      <div className="text-xs font-mono font-bold text-[#0ECFCF]">
                        {s.level >= 85 ? 'CORE' : s.level >= 70 ? 'STRONG' : 'WORKING'} ({s.level}%)
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingSkill(s);
                          setSkillForm({
                            name: s.name,
                            category: s.category,
                            level: String(s.level),
                            icon: s.icon || 'CpuChipIcon',
                            order: String(s.order),
                          });
                          setSkillFormMode('edit');
                        }}
                        className="p-2 bg-[#1A2535] hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                      >
                        <Icon name="PencilSquareIcon" size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="p-2 bg-[#1A2535] hover:bg-red-950 hover:text-red-400 text-slate-400 rounded-xl transition cursor-pointer"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (Desktop Only) */}
              <div className="hidden md:block bento-card overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1E2D3D] text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-[#080C10]/60">
                      <th className="p-4 pl-6">Order</th>
                      <th className="p-4">Skill Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Proficiency</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2D3D]/50 text-xs font-mono">
                    {skills.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-4 pl-6 text-slate-500">#{s.order ?? idx + 1}</td>
                        <td className="p-4 font-bold text-slate-100 font-sans text-sm">{s.name}</td>
                        <td className="p-4 text-slate-400">{s.category}</td>
                        <td className="p-4 font-bold text-[#0ECFCF]">
                          {s.level >= 85 ? 'CORE' : s.level >= 70 ? 'STRONG' : 'WORKING'} ({s.level}%)
                        </td>
                        <td className="p-4 text-right pr-6 space-x-2">
                          <button
                            onClick={() => {
                              setEditingSkill(s);
                              setSkillForm({
                                name: s.name,
                                category: s.category,
                                level: String(s.level),
                                icon: s.icon || 'CpuChipIcon',
                                order: String(s.order),
                              });
                              setSkillFormMode('edit');
                            }}
                            className="p-2 bg-[#1A2535] hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer inline-flex items-center"
                          >
                            <Icon name="PencilSquareIcon" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(s.id)}
                            className="p-2 bg-[#1A2535] hover:bg-red-950 hover:text-red-400 text-slate-400 rounded-xl transition cursor-pointer inline-flex items-center"
                          >
                            <Icon name="TrashIcon" size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Full Page Form for Skill Add/Edit */
            <div className="space-y-6 w-full">
              <div className="flex items-center border-b border-[#1E2D3D] pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSkillFormMode('list');
                      setEditingSkill(null);
                    }}
                    className="p-2 bg-[#0F1923] border border-[#1E2D3D] hover:border-[#0ECFCF] text-slate-300 rounded-xl transition cursor-pointer flex items-center gap-2 text-xs font-mono shrink-0"
                  >
                    <Icon name="ArrowLeftIcon" size={16} />
                    <span>Back</span>
                  </button>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                      {skillFormMode === 'edit' ? `Edit Skill: ${editingSkill?.name}` : 'Add Skill'}
                    </h1>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">Configure skill name, category, and proficiency level.</p>
                  </div>
                </div>
              </div>

              <form id="skill-full-form" onSubmit={handleSaveSkill} className="bento-card p-4 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Skill Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Node.js / ASP.NET Core"
                      className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Category *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Backend Development / Databases"
                      className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Proficiency Level (0 - 100%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={skillForm.level}
                        onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Icon Identifier</label>
                      <input
                        type="text"
                        placeholder="CpuChipIcon"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={skillForm.icon}
                        onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Display Order</label>
                      <input
                        type="number"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={skillForm.order}
                        onChange={(e) => setSkillForm({ ...skillForm, order: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1E2D3D]">
                  <button
                    type="button"
                    onClick={() => {
                      setSkillFormMode('list');
                      setEditingSkill(null);
                    }}
                    className="px-5 py-2.5 bg-[#1A2535] hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] text-xs font-mono font-bold rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] cursor-pointer"
                  >
                    Save Skill
                  </button>
                </div>
              </form>
            </div>
          )
        )}

        {/* Tab 4: Experience */}
        {activeTab === 'experience' && (
          expFormMode === 'list' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">Experience Management</h1>
                  <p className="text-xs font-mono text-slate-400">Manage career history, roles, and project achievements.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingExp(null);
                    setExpForm(blankExpForm);
                    setExpFormMode('add');
                  }}
                  className="bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] font-bold text-xs font-mono px-5 py-2.5 rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Icon name="PlusIcon" size={16} />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="bento-card p-5 sm:p-6 relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-3xl">
                      <h3 className="text-base font-bold text-white">{exp.title}</h3>
                      <div className="text-xs font-mono text-[#0ECFCF]">
                        {exp.company} {exp.location ? `(${exp.location})` : ''} &bull; {exp.period}
                      </div>
                      <p className="text-xs font-mono text-slate-300 leading-relaxed pt-2">{exp.description}</p>
                      {exp.technologies && exp.technologies.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.technologies.map((t, idx) => (
                            <span key={idx} className="skill-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <button
                        onClick={() => {
                          setEditingExp(exp);
                          setExpForm({
                            title: exp.title,
                            company: exp.company,
                            companyUrl: exp.companyUrl || '',
                            location: exp.location || '',
                            period: exp.period,
                            description: exp.description || '',
                            technologies: (exp.technologies || []).join(', '),
                            order: String(exp.order ?? 0),
                          });
                          setExpFormMode('edit');
                        }}
                        className="p-2.5 bg-[#1A2535] hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                      >
                        <Icon name="PencilSquareIcon" size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-2.5 bg-[#1A2535] hover:bg-red-950 hover:text-red-400 text-slate-400 rounded-xl transition cursor-pointer"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Full Page Form for Experience Add/Edit */
            <div className="space-y-6 w-full">
              <div className="flex items-center border-b border-[#1E2D3D] pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setExpFormMode('list');
                      setEditingExp(null);
                    }}
                    className="p-2 bg-[#0F1923] border border-[#1E2D3D] hover:border-[#0ECFCF] text-slate-300 rounded-xl transition cursor-pointer flex items-center gap-2 text-xs font-mono shrink-0"
                  >
                    <Icon name="ArrowLeftIcon" size={16} />
                    <span>Back</span>
                  </button>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                      {expFormMode === 'edit' ? `Edit Experience: ${editingExp?.title}` : 'Add Experience'}
                    </h1>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">Define your role title, company details, duration period, and achievements.</p>
                  </div>
                </div>
              </div>

              <form id="exp-full-form" onSubmit={handleSaveExperience} className="bento-card p-4 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2D3D] pb-2">
                    <Icon name="BriefcaseIcon" size={16} className="text-[#0ECFCF]" />
                    <span>Role &amp; Organization</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Role Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Summer Internship (Back-End Dev)"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={expForm.title}
                        onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Company / Subtitle *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PROART | Microsoft Solutions Partner"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={expForm.company}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Company Website URL</label>
                      <input
                        type="text"
                        placeholder="https://proart.net/"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={expForm.companyUrl}
                        onChange={(e) => setExpForm({ ...expForm, companyUrl: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="Maadi, Egypt / Remote"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={expForm.location}
                        onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Display Order</label>
                      <input
                        type="number"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={expForm.order}
                        onChange={(e) => setExpForm({ ...expForm, order: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Duration Period Picker Component */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2D3D] pb-2">
                    <Icon name="CalendarIcon" size={16} className="text-[#0ECFCF]" />
                    <span>Duration &amp; Timeline</span>
                  </h3>
                  <DatePeriodPicker
                    value={expForm.period}
                    onChange={(val) => setExpForm({ ...expForm, period: val })}
                  />
                </div>

                {/* Description & Technologies */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2D3D] pb-2">
                    <Icon name="DocumentTextIcon" size={16} className="text-[#0ECFCF]" />
                    <span>Description &amp; Tech Stack</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Detailed Role Description *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe key responsibilities, projects, system architectures built, and team accomplishments..."
                      className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl p-4 text-xs font-mono text-slate-200 outline-none min-h-[120px]"
                      value={expForm.description}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      placeholder="ASP.NET Core, C#, SQL Server, RESTful APIs, .NET, Azure SQL"
                      className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                      value={expForm.technologies}
                      onChange={(e) => setExpForm({ ...expForm, technologies: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1E2D3D]">
                  <button
                    type="button"
                    onClick={() => {
                      setExpFormMode('list');
                      setEditingExp(null);
                    }}
                    className="px-5 py-2.5 bg-[#1A2535] hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] text-xs font-mono font-bold rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] cursor-pointer"
                  >
                    Save Experience
                  </button>
                </div>
              </form>
            </div>
          )
        )}

        {/* Tab 5: Certifications */}
        {activeTab === 'certifications' && (
          certFormMode === 'list' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">Certifications Management</h1>
                  <p className="text-xs font-mono text-slate-400">Manage credentials, issuing bodies, and certificate files.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCert(null);
                    setCertForm(blankCertForm);
                    setCertFormMode('add');
                  }}
                  className="bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] font-bold text-xs font-mono px-5 py-2.5 rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Icon name="PlusIcon" size={16} />
                  <span>Add Certification</span>
                </button>
              </div>

              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="bento-card p-5 sm:p-6 relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-3xl">
                      <h3 className="text-base font-bold text-white">{cert.title}</h3>
                      <div className="text-xs font-mono text-[#0ECFCF]">{cert.issuer} ({cert.year})</div>
                      <p className="text-xs font-mono text-slate-300 leading-relaxed pt-2">{cert.description}</p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <button
                        onClick={() => {
                          setEditingCert(cert);
                          setCertForm({
                            title: cert.title,
                            issuer: cert.issuer,
                            year: cert.year,
                            description: cert.description,
                            imageUrl: cert.imageUrl || '',
                            order: String(cert.order ?? 0),
                          });
                          setCertFormMode('edit');
                        }}
                        className="p-2.5 bg-[#1A2535] hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                      >
                        <Icon name="PencilSquareIcon" size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-2.5 bg-[#1A2535] hover:bg-red-950 hover:text-red-400 text-slate-400 rounded-xl transition cursor-pointer"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Full Page Form for Certification Add/Edit */
            <div className="space-y-6 w-full">
              <div className="flex items-center border-b border-[#1E2D3D] pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCertFormMode('list');
                      setEditingCert(null);
                    }}
                    className="p-2 bg-[#0F1923] border border-[#1E2D3D] hover:border-[#0ECFCF] text-slate-300 rounded-xl transition cursor-pointer flex items-center gap-2 text-xs font-mono shrink-0"
                  >
                    <Icon name="ArrowLeftIcon" size={16} />
                    <span>Back</span>
                  </button>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                      {certFormMode === 'edit' ? `Edit Certification: ${editingCert?.title}` : 'Add Certification'}
                    </h1>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">Manage certification title, issuer, year, and badge image.</p>
                  </div>
                </div>
              </div>

              <form id="cert-full-form" onSubmit={handleSaveCert} className="bento-card p-4 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Certification Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                      value={certForm.title}
                      onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Issuer Organization *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amazon Web Services"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Year Issued *</label>
                      <input
                        type="text"
                        required
                        placeholder="2026"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={certForm.year}
                        onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Display Order</label>
                      <input
                        type="number"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={certForm.order}
                        onChange={(e) => setCertForm({ ...certForm, order: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end pt-2">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Certificate Image URL</label>
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                        value={certForm.imageUrl}
                        onChange={(e) => setCertForm({ ...certForm, imageUrl: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="px-5 py-3 rounded-xl bg-[#1A2535] border border-[#1E2D3D] hover:border-[#0ECFCF] text-xs font-mono uppercase tracking-wide cursor-pointer text-slate-200 transition font-bold">
                        {uploadingCertImage ? 'Uploading Image...' : 'Upload Image File'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleCertImageUpload(e.target.files?.[0])}
                          disabled={uploadingCertImage}
                        />
                      </label>
                      {certForm.imageUrl ? (
                        <span className="text-xs font-mono text-[#0ECFCF] font-bold">✓ Ready</span>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Description *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Brief description of skills validated by this certification..."
                      className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl p-4 text-xs font-mono text-slate-200 outline-none min-h-[100px]"
                      value={certForm.description}
                      onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1E2D3D]">
                  <button
                    type="button"
                    onClick={() => {
                      setCertFormMode('list');
                      setEditingCert(null);
                    }}
                    className="px-5 py-2.5 bg-[#1A2535] hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] text-xs font-mono font-bold rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] cursor-pointer"
                  >
                    Save Certification
                  </button>
                </div>
              </form>
            </div>
          )
        )}

        {/* Tab 6: Messages Inbox */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">Contact Submissions Inbox</h1>
              <p className="text-xs font-mono text-slate-400">Review public contact form inquiries, manage status, and reply directly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[420px]">
              <div className="lg:col-span-5 bento-card p-4 overflow-y-auto max-h-[550px] space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-12 text-center text-xs font-mono text-slate-500">
                    No contact messages received yet.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelected = selectedMessage?._id === msg._id;
                    return (
                      <div
                        key={msg._id}
                        onClick={() => {
                          setSelectedMessage(msg);
                          setIsReplying(false);
                          setReplyText('');
                        }}
                        className={`p-4 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A2535] border-[#0ECFCF] shadow-md'
                            : 'bg-[#080C10] border-[#1E2D3D] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm text-slate-100 font-sans truncate">{msg.name}</span>
                          <div className="flex items-center gap-1.5">
                            {msg.replied ? (
                              <span className="text-[10px] font-mono font-bold text-[#0ECFCF] bg-[#0ECFCF]/10 px-2 py-0.5 rounded-full border border-[#0ECFCF]/30" title="Replied">
                                Replied
                              </span>
                            ) : !msg.read ? (
                              <span className="w-2 h-2 rounded-full bg-amber-400" title="Unread" />
                            ) : null}
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-mono text-[#0ECFCF] truncate mb-1">{formatTopicSubject(msg.subject)}</div>
                        <div className="text-xs font-mono text-slate-400 line-clamp-2">{msg.message}</div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="lg:col-span-7 bento-card p-6 flex flex-col justify-between">
                {!selectedMessage ? (
                  <div className="h-full flex items-center justify-center text-center text-xs font-mono text-slate-500 min-h-[300px]">
                    Select an inquiry message from the left list to read details and reply.
                  </div>
                ) : (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#1E2D3D] pb-4">
                        <div>
                          <h2 className="text-lg font-bold text-white mb-1">{formatTopicSubject(selectedMessage.subject)}</h2>
                          <div className="text-xs font-mono text-slate-300">From: <span className="font-bold text-white">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;</div>
                          <div className="text-[11px] font-mono text-slate-500 mt-1">
                            Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedMessage.replied ? (
                            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border bg-[#0ECFCF]/10 border-[#0ECFCF]/40 text-[#0ECFCF] flex items-center gap-1">
                              <Icon name="CheckIcon" size={12} />
                              <span>REPLIED</span>
                            </span>
                          ) : null}
                          <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${
                            selectedMessage.read ? 'bg-[#080C10] border-[#1E2D3D] text-slate-400' : 'bg-amber-950/60 border-amber-800/50 text-amber-400'
                          }`}>
                            {selectedMessage.read ? 'READ' : 'UNREAD'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">Inquiry Message:</div>
                        <div className="p-4 bg-[#080C10] border border-[#1E2D3D] rounded-xl text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </div>
                      </div>

                      {/* In-Dashboard Reply Composer */}
                      {isReplying && (
                        <div className="p-4 bg-[#0D1520] border border-[#0ECFCF]/40 rounded-xl space-y-3 shadow-lg">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-mono font-bold text-white flex items-center gap-2">
                              <Icon name="EnvelopeIcon" size={15} className="text-[#0ECFCF]" />
                              <span>Reply to <strong className="text-[#0ECFCF]">{selectedMessage.name}</strong></span>
                            </label>
                            <span className="text-[10px] font-mono text-[#0ECFCF] bg-[#0ECFCF]/10 px-2 py-0.5 rounded-full">
                              Branded Dark Email
                            </span>
                          </div>

                          <textarea
                            rows={4}
                            placeholder={`Hi ${selectedMessage.name},\n\nThank you for reaching out...`}
                            className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl p-3 text-xs font-mono text-slate-200 outline-none resize-none transition"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            autoFocus
                          />

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                            <p className="text-[10px] font-mono text-slate-400">
                              Will be sent directly to <span className="text-slate-200 font-bold">{selectedMessage.email}</span>
                            </p>
                            <div className="flex items-center justify-end gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsReplying(false);
                                  setReplyText('');
                                }}
                                disabled={sendingReply}
                                className="px-3.5 py-2 bg-[#1A2535] hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition cursor-pointer disabled:opacity-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSendReply}
                                disabled={sendingReply || !replyText.trim()}
                                className="bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] font-bold text-xs font-mono px-5 py-2 rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                <Icon name="PaperAirplaneIcon" size={14} />
                                <span>{sendingReply ? 'Sending Email...' : 'Send Reply'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E2D3D]">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {!isReplying ? (
                          <button
                            type="button"
                            onClick={() => setIsReplying(true)}
                            className="bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] font-bold text-xs font-mono px-5 py-2.5 rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] flex items-center gap-2 cursor-pointer"
                          >
                            <Icon name="PaperAirplaneIcon" size={16} />
                            <span>{selectedMessage.replied ? 'Send Another Reply' : 'Reply via Email'}</span>
                          </button>
                        ) : null}

                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedMessage.email)}&su=${encodeURIComponent(`Re: ${formatTopicSubject(selectedMessage.subject)} — Youseef Sherif`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2.5 bg-[#1A2535] hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                          title="Open external compose in Gmail"
                        >
                          <Icon name="ArrowTopRightOnSquareIcon" size={14} />
                          <span>Gmail Web</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleReadMessage(selectedMessage)}
                          className="px-3.5 py-2 bg-[#1A2535] hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl transition cursor-pointer"
                        >
                          {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(selectedMessage._id)}
                          className="px-3.5 py-2 bg-[#1A2535] hover:bg-red-950 hover:text-red-400 text-slate-400 font-mono text-xs rounded-xl transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">Privacy-Conscious Analytics</h1>
              <p className="text-xs font-mono text-slate-400">Track page views, portfolio project interest, and form submissions over time.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bento-card p-5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span>Total Page Views</span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/30 flex items-center justify-center text-cyan-400">
                    <Icon name="EyeIcon" size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{analyticsTotal || analytics.totalPageViews}</div>
                <div className="text-xs font-mono text-[#0ECFCF]">Tracked HTTP Sessions</div>
              </div>

              <div className="bento-card p-5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span>Contact Submissions</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/30 flex items-center justify-center text-amber-400">
                    <Icon name="PaperAirplaneIcon" size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{messages.length}</div>
                <div className="text-xs font-mono text-slate-400">Inquiry conversion rate</div>
              </div>

              <div className="bento-card p-5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span>Active Projects</span>
                  <div className="w-8 h-8 rounded-lg bg-[#0ECFCF]/10 border border-[#0ECFCF]/30 flex items-center justify-center text-[#0ECFCF]">
                    <Icon name="FolderIcon" size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{projects.length}</div>
                <div className="text-xs font-mono text-slate-400">Live published projects</div>
              </div>
            </div>

            <div className="bento-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Page Views Trend (Last 14 Days)</h2>
                <span className="text-xs font-mono text-[#0ECFCF]">Aggregation: Daily</span>
              </div>

              <div className="w-full pt-4">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={analytics.trendData}>
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ECFCF" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#0ECFCF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F1923', borderColor: '#1E2D3D', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#0ECFCF' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#0ECFCF" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Account Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-8 w-full">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">Account &amp; Database Settings</h1>
              <p className="text-xs font-mono text-slate-400">Update your admin email, change password, or reset database.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bento-card p-4 sm:p-6 space-y-5">
              <h3 className="text-sm font-bold text-white">Admin Account Credentials</h3>
              
              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Admin Email</label>
                <input
                  type="email"
                  className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Current password"
                    className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {settingsMessage ? (
                <p className="text-xs font-mono text-emerald-400">{settingsMessage}</p>
              ) : null}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-[11px] font-mono text-slate-500">
                  Leave password fields empty to keep current password.
                </p>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="w-full sm:w-auto bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] font-bold text-xs font-mono px-6 py-3 rounded-xl transition shadow-[0_0_20px_rgba(14,207,207,0.3)] disabled:opacity-50 cursor-pointer"
                >
                  {settingsLoading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>

            {/* Resume / CV Management Card */}
            <div className="bento-card p-4 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2D3D] pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Icon name="DocumentTextIcon" size={18} className="text-[#0ECFCF]" />
                    <span>Resume / CV Document Management</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-2 leading-relaxed font-medium">
                    Upload or update your CV file link for public portfolio download button.
                  </p>
                </div>
                {settingsCvUrl ? (
                  <a
                    href={settingsCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#1A2535] hover:bg-slate-700 text-[#0ECFCF] text-xs font-mono rounded-xl transition flex items-center gap-2 shrink-0 font-bold"
                  >
                    <Icon name="ArrowDownTrayIcon" size={14} />
                    <span>Preview / Download CV</span>
                  </a>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
                    CV File URL / Path
                  </label>
                  <input
                    type="text"
                    placeholder="/cv.pdf or https://..."
                    className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] rounded-xl px-4 py-3 text-xs font-mono text-slate-200 outline-none"
                    value={settingsCvUrl}
                    onChange={(e) => setSettingsCvUrl(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="px-5 py-3 rounded-xl bg-[#1A2535] border border-[#1E2D3D] hover:border-[#0ECFCF] text-xs font-mono uppercase tracking-wide cursor-pointer text-slate-200 transition font-bold">
                    {uploadingCv ? 'Uploading CV...' : 'Upload New CV File (PDF)'}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleCvFileUpload(e.target.files?.[0])}
                      disabled={uploadingCv}
                    />
                  </label>
                  {settingsCvUrl ? (
                    <span className="text-xs font-mono text-[#0ECFCF] font-bold">✓ Active</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="bento-card p-4 sm:p-6 border-red-900/40 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-red-400">Danger Zone: Reset Database</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Restore all projects, skills, certifications, and settings back to initial portfolio defaults.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-red-950 border border-red-800/60 hover:bg-red-900 text-red-400 text-xs font-mono rounded-xl transition cursor-pointer shrink-0"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm ? (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bento-card w-full max-w-sm p-6 space-y-4 text-center">
            <h3 className="text-lg font-bold text-white">Sign Out</h3>
            <p className="text-xs font-mono text-slate-400">Are you sure you want to log out of the Admin Dashboard?</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="px-4 py-2 bg-[#1A2535] text-slate-300 text-xs font-mono rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="px-5 py-2 bg-[#0ECFCF] text-[#080C10] text-xs font-mono font-bold rounded-xl"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Reset Database Confirmation Modal */}
      {showResetConfirm ? (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bento-card border-red-800/60 w-full max-w-sm p-6 space-y-4 text-center">
            <h3 className="text-lg font-bold text-red-400">Reset Database</h3>
            <p className="text-xs font-mono text-slate-300">
              This action will reset projects, skills, certifications, and settings to original portfolio defaults. Are you sure?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-[#1A2535] text-slate-300 text-xs font-mono rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold rounded-xl"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen ? (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bento-card border-[#1E2D3D] w-full max-w-sm p-6 space-y-4 text-center shadow-2xl shadow-black/80">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400 mx-auto">
              <Icon name="TrashIcon" size={22} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{confirmModal.title}</h3>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">{confirmModal.message}</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-[#1A2535] hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold rounded-xl transition cursor-pointer shadow-lg shadow-red-900/30"
              >
                {confirmModal.confirmText || 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
