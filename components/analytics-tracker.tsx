'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('tcg_session_id');
  if (!id) {
    id = 's_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    sessionStorage.setItem('tcg_session_id', id);
  }
  return id;
}

function getDeviceType(): 'Mobile' | 'Tablet' | 'Desktop' {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function sendTrack(payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${apiUrl}/analytics/track`;
  const body = JSON.stringify(payload);

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;
    lastPath.current = pathname;

    const sessionId = getSessionId();
    let referrer = 'direct';
    if (document.referrer) {
      try {
        referrer = new URL(document.referrer).hostname;
      } catch (e) {
        referrer = 'external';
      }
    }
    const device = getDeviceType();

    sendTrack({
      type: 'pageview',
      path: pathname,
      sessionId,
      referrer,
      device,
      userAgent: navigator.userAgent,
    });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const actionBtn = target.closest('[data-analytics-event]') as HTMLElement | null;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      const button = target.closest('button') as HTMLButtonElement | null;

      let eventName = '';
      let targetLabel = '';

      if (actionBtn) {
        eventName = actionBtn.getAttribute('data-analytics-event') || 'click';
        targetLabel = actionBtn.getAttribute('data-analytics-target') || actionBtn.innerText?.trim().substring(0, 50) || '';
      } else if (anchor) {
        const href = anchor.getAttribute('href') || '';
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        eventName = isExternal ? 'outbound_click' : 'link_click';
        targetLabel = anchor.innerText?.trim().substring(0, 50) || href || 'link';
      } else if (button) {
        eventName = 'button_click';
        targetLabel = button.innerText?.trim().substring(0, 50) || 'button';
      } else {
        return;
      }

      const sessionId = getSessionId();

      sendTrack({
        type: 'event',
        path: window.location.pathname,
        sessionId,
        eventName,
        target: targetLabel,
      });
    };

    window.addEventListener('click', handleClick, { passive: true });
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return null;
}
