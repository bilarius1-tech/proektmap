'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourOverlayProps {
  steps: TourStep[];
  onComplete: () => void;
}

export default function TourOverlay({ steps, onComplete }: TourOverlayProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  // Don't show if already seen this session
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('tour-seen') === '1') {
      setClosed(true);
      onComplete();
    }
  }, []);

  const currentStep = steps[step];
  const progress = steps.length > 0 ? Math.round(((step + 1) / steps.length) * 100) : 0;

  // Find target element
  useEffect(() => {
    if (!currentStep || closed) return;
    setVisible(false);
    const timer = setTimeout(() => {
      // Try first selector, fallback to generic
      let el = document.querySelector(currentStep.target);
      if (!el && currentStep.target === 'aside') {
        // Find the sidebar by its style
        el = document.querySelector('[style*="width: 280px"]') 
          || document.querySelector('aside');
      }
      if (!el && currentStep.target === 'h2') {
        el = document.querySelector('h2, h1, h3');
      }
      if (!el && currentStep.target === 'button') {
        // Find the tab buttons (ПОНЯТЬ, ВЫБРАТЬ, ПРОВЕРИТЬ)
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('ПОНЯТЬ') || btn.textContent?.includes('ВЫБРАТЬ')) {
            el = btn;
            break;
          }
        }
        if (!el) el = document.querySelector('button');
      }
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentStep, closed]);

  // NO auto-advance — manual only

  const handleClose = () => {
    setClosed(true);
    sessionStorage.setItem('tour-seen', '1');
    onComplete();
  };

  const next = () => {
    if (step < steps.length - 1) {
      setVisible(false);
      setTimeout(() => setStep(prev => prev + 1), 200);
    } else {
      handleClose();
    }
  };

  const prev = () => {
    if (step > 0) {
      setVisible(false);
      setTimeout(() => setStep(prev => prev - 1), 200);
    }
  };

  if (closed || !currentStep) return null;

  // Tooltip position — clamp to viewport
  const tooltipStyle: any = {
    position: 'fixed',
    zIndex: 1001,
    maxWidth: 360,
    padding: 'var(--space-l)',
    background: 'var(--color-bg-primary)',
    borderRadius: 0,
    border: '2px solid var(--color-accent)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
    animation: 'tourIn 0.3s ease',
    fontSize: 'var(--text-s)',
  };

  const gap = 16;
  const tooltipW = 360;
  const tooltipH = 200; // approximate

  if (targetRect) {
    const pos = currentStep.position || 'bottom';
    // Default: below the target
    let top = targetRect.bottom + gap;
    let left = Math.max(16, targetRect.left);
    
    if (pos === 'top') {
      top = targetRect.top - tooltipH - gap;
      left = Math.max(16, targetRect.left);
    } else if (pos === 'right') {
      top = Math.max(16, targetRect.top);
      left = targetRect.right + gap;
    } else if (pos === 'left') {
      top = Math.max(16, targetRect.top);
      left = targetRect.left - tooltipW - gap;
    }

    // Clamp to viewport
    const maxLeft = window.innerWidth - tooltipW - 16;
    const maxTop = window.innerHeight - tooltipH - 16;
    tooltipStyle.top = Math.max(16, Math.min(top, maxTop));
    tooltipStyle.left = Math.max(16, Math.min(left, maxLeft));
  } else {
    // Center if no target
    tooltipStyle.top = '50%';
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translate(-50%, -50%)';
  }

  return (
    <>
      {/* Progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 4, zIndex: 1002,
        background: 'var(--color-border-light)',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--color-accent), #22c55e)',
          width: `${progress}%`,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Overlay */}
      {visible && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.45)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Tooltip card */}
      {visible && (
        <div style={tooltipStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-s)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Шаг {step + 1} из {steps.length}
              </span>
            </div>
            <button
              onClick={handleClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 2 }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ fontWeight: 800, fontSize: 'var(--text-m)', marginBottom: 4, color: 'var(--color-text-primary)' }}>
            {currentStep.title}
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-m)' }}>
            {currentStep.description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={prev} disabled={step === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px',
                borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)',
                color: step === 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
                cursor: step === 0 ? 'default' : 'pointer', fontWeight: 600, fontSize: 'var(--text-xs)',
                opacity: step === 0 ? 0.4 : 1,
              }}>
              <ChevronLeft size={14} /> Назад
            </button>

            <div style={{ display: 'flex', gap: 4 }}>
              {steps.map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: i === step ? 'var(--color-accent)' : i < step ? '#22c55e' : 'var(--color-border-light)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            <button onClick={next}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px',
                borderRadius: 0, border: 'none', background: 'var(--color-accent)', color: 'white',
                cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-xs)',
              }}>
              {step === steps.length - 1 ? 'Готово' : 'Далее'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tourIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
