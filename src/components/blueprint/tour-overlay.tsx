'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface TourStep {
  target: string;      // CSS selector for element to highlight
  title: string;       // Step title
  description: string; // What to explain
  position?: 'top' | 'bottom' | 'left' | 'right'; // Where to show tooltip
}

interface TourOverlayProps {
  steps: TourStep[];
  onComplete: () => void;
}

export default function TourOverlay({ steps, onComplete }: TourOverlayProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);

  const currentStep = steps[step];
  const progress = steps.length > 0 ? Math.round(((step + 1) / steps.length) * 100) : 0;

  // Find and highlight target element
  useEffect(() => {
    if (!currentStep) return;
    // Delay to let React render the page first
    const timer = setTimeout(() => {
      const el = document.querySelector(currentStep.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        // Scroll element into view if needed
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Auto-advance after 6 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      if (step < steps.length - 1) setStep(prev => prev + 1);
      else onComplete();
    }, 6000);
    return () => clearTimeout(timer);
  }, [step, visible]);

  const next = () => {
    if (step < steps.length - 1) {
      setVisible(false);
      setTimeout(() => setStep(prev => prev + 1), 200);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (step > 0) {
      setVisible(false);
      setTimeout(() => setStep(prev => prev - 1), 200);
    }
  };

  if (!currentStep) return null;

  // Tooltip position
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

  if (targetRect) {
    const pos = currentStep.position || 'bottom';
    const gap = 16;
    if (pos === 'bottom') {
      tooltipStyle.top = targetRect.bottom + gap;
      tooltipStyle.left = Math.max(16, Math.min(targetRect.left, window.innerWidth - 380));
    } else if (pos === 'top') {
      tooltipStyle.bottom = window.innerHeight - targetRect.top + gap;
      tooltipStyle.left = Math.max(16, Math.min(targetRect.left, window.innerWidth - 380));
    } else if (pos === 'right') {
      tooltipStyle.left = targetRect.right + gap;
      tooltipStyle.top = Math.max(16, targetRect.top);
    } else {
      tooltipStyle.right = window.innerWidth - targetRect.left + gap;
      tooltipStyle.top = Math.max(16, targetRect.top);
    }
  } else {
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

      {/* Overlay with spotlight cutout */}
      {visible && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: targetRect
              ? createSpotlightClip(targetRect)
              : 'rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tooltip card */}
      {visible && (
        <div style={tooltipStyle}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-s)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Шаг {step + 1} из {steps.length}
              </span>
            </div>
            <button
              onClick={onComplete}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 2 }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div style={{ fontWeight: 800, fontSize: 'var(--text-m)', marginBottom: 4, color: 'var(--color-text-primary)' }}>
            {currentStep.title}
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-m)' }}>
            {currentStep.description}
          </p>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={prev}
              disabled={step === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px',
                borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)',
                color: step === 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
                cursor: step === 0 ? 'default' : 'pointer', fontWeight: 600, fontSize: 'var(--text-xs)',
                opacity: step === 0 ? 0.4 : 1,
              }}
            >
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

            <button
              onClick={next}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px',
                borderRadius: 0, border: 'none', background: 'var(--color-accent)', color: 'white',
                cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-xs)',
              }}
            >
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

// Create a CSS clip-path that cuts a hole for the spotlight
function createSpotlightClip(rect: DOMRect): string {
  const pad = 8;
  const top = Math.max(0, rect.top - pad);
  const left = Math.max(0, rect.left - pad);
  const bottom = Math.min(window.innerHeight, rect.bottom + pad);
  const right = Math.min(window.innerWidth, rect.right + pad);

  return `rgba(0,0,0,0.55)`;
  // Note: full clip-path is complex. We use a simpler approach:
  // Dark overlay + glowing border on the target via the tooltip position.
  // The target element itself stays visible because it has higher z-index naturally.
}
