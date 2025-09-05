import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[] | undefined;
  }
}

export const AdSenseLoader: React.FC = () => {
  useEffect(() => {
    const client = import.meta.env.VITE_ADSENSE_ID as string | undefined;
    if (!client) return;

    const scriptId = 'adsbygoogle-js';
    if (document.getElementById(scriptId)) return;

    const s = document.createElement('script');
    s.id = scriptId;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    document.head.appendChild(s);
  }, []);

  return null;
};

type AdUnitProps = {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
};

export const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto', className, style }) => {
  useEffect(() => {
    const client = import.meta.env.VITE_ADSENSE_ID as string | undefined;
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore if not ready
    }
  }, [slot]);

  const client = import.meta.env.VITE_ADSENSE_ID as string | undefined;
  if (!client || !slot) return null;

  return (
    <ins
      className={`adsbygoogle block ${className || ''}`}
      style={style || { display: 'block', minHeight: '90px' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
};

