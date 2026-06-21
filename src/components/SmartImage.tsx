import { useState, useEffect, useMemo } from 'react';
import type { Category } from '../data/places';
import { CATEGORY_META } from '../data/places';

interface SmartImageProps {
  primary: string | null;
  fallback: string;
  cat: Category;
  alt?: string;
  className?: string;
  /** "card" = rounded corners + aspect, "raw" = caller controls */
  variant?: 'card' | 'raw';
  /** Show category-stamped pattern as ultimate fallback */
  showStamp?: boolean;
}

/**
 * Image with two-tier fallback:
 *   1. Try Google Place Photo URL (often fails or rate-limits)
 *   2. Fall back to a curated Unsplash atmospheric photo (always works)
 *   3. Ultimate: a category-colored panel with a soft stamp
 *
 * Also handles loading skeleton so the layout doesn't flicker.
 */
export function SmartImage({
  primary,
  fallback,
  cat,
  alt = '',
  className = '',
  variant = 'card',
  showStamp = true,
}: SmartImageProps) {
  // Stage: 0 = trying primary, 1 = trying fallback, 2 = stamp only
  const [stage, setStage] = useState<0 | 1 | 2>(primary ? 0 : 1);
  const [loaded, setLoaded] = useState(false);
  const meta = CATEGORY_META[cat];

  const currentSrc = useMemo(() => {
    if (stage === 0 && primary) return primary;
    if (stage <= 1) return fallback;
    return null;
  }, [stage, primary, fallback]);

  // Reset state if primary changes (e.g. switching detail card)
  useEffect(() => {
    setStage(primary ? 0 : 1);
    setLoaded(false);
  }, [primary, fallback]);

  function handleError() {
    if (stage === 0) {
      setStage(1);
      setLoaded(false);
    } else if (stage === 1) {
      setStage(2);
    }
  }

  return (
    <div
      className={`smart-img ${variant === 'card' ? 'smart-img--card' : ''} ${className}`}
      style={{ background: meta.soft }}
      aria-label={alt}
    >
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`smart-img__img ${loaded ? 'is-loaded' : ''}`}
        />
      )}
      {!loaded && stage < 2 && (
        <div className="smart-img__skeleton" style={{ background: `linear-gradient(110deg, ${meta.soft} 30%, ${meta.color}11 50%, ${meta.soft} 70%)` }} />
      )}
      {stage === 2 && showStamp && (
        <div className="smart-img__stamp" style={{ color: meta.ink, borderColor: meta.color }}>
          <div className="smart-img__stamp-inner">
            <div className="display" style={{ fontSize: 28, lineHeight: 1 }}>{meta.short}</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: 1, marginTop: 6, opacity: 0.7 }}>MANALI · 2026</div>
          </div>
        </div>
      )}
    </div>
  );
}
