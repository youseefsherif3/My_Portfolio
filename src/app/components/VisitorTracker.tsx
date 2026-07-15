'use client';

import { useEffect } from 'react';

const VISIT_KEY = 'portfolio_visit_session';

export default function VisitorTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (sessionStorage.getItem(VISIT_KEY)) {
      return;
    }

    sessionStorage.setItem(VISIT_KEY, '1');

    fetch('/api/analytics/visit', { method: 'POST' }).catch(() => null);
  }, []);

  return null;
}
