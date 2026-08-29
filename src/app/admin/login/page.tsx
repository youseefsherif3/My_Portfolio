'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen flex flex-col items-center justify-center bg-[#080C10] text-[#E2E8F0] px-4 py-6 font-sans overflow-hidden select-none">
      {/* Brand Cyan Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#0ECFCF]/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none" />

      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center z-10 my-auto">
        {/* Terminal Logo Icon */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0F1923] border border-[#0ECFCF]/30 flex items-center justify-center text-[#0ECFCF] font-mono font-bold text-base sm:text-lg mb-3 shadow-[0_0_15px_rgba(14,207,207,0.2)] shrink-0">
          &gt;_
        </div>

        {/* Header Titles */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-0.5 text-center">Admin Portal</h1>
        <p className="text-[11px] sm:text-xs font-mono text-[#0ECFCF]/80 mb-5 sm:mb-6 tracking-wide text-center">
          Youseef Sherif Portfolio Control Panel
        </p>

        {/* Login Card */}
        <div className="w-full bg-[#0F1923]/95 backdrop-blur-xl border border-[#1E2D3D] rounded-2xl p-5 sm:p-8 shadow-2xl shadow-black/80">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] focus:ring-1 focus:ring-[#0ECFCF]/50 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-[#080C10] border border-[#1E2D3D] focus:border-[#0ECFCF] focus:ring-1 focus:ring-[#0ECFCF]/50 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error ? (
              <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-400 font-mono text-center">
                {error}
              </div>
            ) : null}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0ECFCF] hover:bg-[#0ECFCF]/90 text-[#080C10] font-bold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-[0_0_25px_rgba(14,207,207,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
