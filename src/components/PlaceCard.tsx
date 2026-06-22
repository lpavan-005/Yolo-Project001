import { useState, useEffect, useRef, useCallback } from 'react';
import type { Place } from '../data/places';
import { CATEGORY_META } from '../data/places';
import { SmartImage } from './SmartImage';
import { ExternalIcon, ClockIcon } from '../icons';

export interface PlaceCardProps {
  places: Place[];
  activeIndex: number;
  onIndexChange: (idx: number) => void;
  onClose: () => void;
}

// ── Animation phase state machine ──────────────────────────────────
type Phase =
  | { t: 'idle' }
  | { t: 'dragging'; x: number; y: number }
  | { t: 'fly-out'; toX: number }
  | { t: 'reposition'; fromX: number }
  | { t: 'fly-in' }
  | { t: 'rubber-push'; toX: number }
  | { t: 'rubber-release' }
  | { t: 'dismiss' };

// All transforms use translate(x,y) so CSS can interpolate between any pair
function phaseStyle(p: Phase, mounted: boolean): React.CSSProperties {
  switch (p.t) {
    case 'idle':
      return {
        transform: mounted ? 'translate(0,0)' : 'translate(0,120%)',
        transition: 'transform 210ms cubic-bezier(0.16,1,0.3,1)',
      };
    case 'dragging':
      return { transform: `translate(${p.x}px,${Math.max(0, p.y)}px)`, transition: 'none' };
    case 'fly-out':
      return { transform: `translate(${p.toX}px,0)`, transition: 'transform 145ms ease-in' };
    case 'reposition':
      return { transform: `translate(${p.fromX}px,0)`, transition: 'none' };
    case 'fly-in':
      return { transform: 'translate(0,0)', transition: 'transform 185ms cubic-bezier(0.16,1,0.3,1)' };
    case 'rubber-push':
      return { transform: `translate(${p.toX}px,0)`, transition: 'transform 120ms ease-out' };
    case 'rubber-release':
      return { transform: 'translate(0,0)', transition: 'transform 210ms cubic-bezier(0.34,1.56,0.64,1)' };
    case 'dismiss':
      return { transform: 'translate(0,115%)', transition: 'transform 155ms ease-in', opacity: 0 };
    default:
      return { transform: 'translate(0,0)' };
  }
}

export function PlaceCard({ places, activeIndex, onIndexChange, onClose }: PlaceCardProps) {
  const [displayIdx, setDisplayIdx]   = useState(activeIndex);
  const [phase, setPhase]             = useState<Phase>({ t: 'idle' });
  const [isExpanded, setIsExpanded]   = useState(false);
  const [mounted, setMounted]         = useState(false);

  const cardRef       = useRef<HTMLDivElement>(null);
  const isAnimRef     = useRef(false);
  const displayIdxRef = useRef(activeIndex);   // shadow that never lags behind async state
  const dragRef       = useRef<{
    sx: number; sy: number; st: number;
    axis: 'x' | 'y' | null;
  } | null>(null);

  // Entry animation: render at bottom, animate up
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Sync when App changes activeIndex externally (pin tap while card open)
  useEffect(() => {
    if (activeIndex !== displayIdxRef.current && !isAnimRef.current) {
      const dir = activeIndex > displayIdxRef.current ? 'left' : 'right';
      runTransition(activeIndex, dir);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const runTransition = useCallback((newIdx: number, dir: 'left' | 'right') => {
    if (isAnimRef.current) return;
    isAnimRef.current = true;
    const W = (cardRef.current?.offsetWidth ?? 370) + 24;
    const flyX = dir === 'left' ? -W : W;

    setPhase({ t: 'fly-out', toX: flyX });

    setTimeout(() => {
      displayIdxRef.current = newIdx;
      setDisplayIdx(newIdx);
      setIsExpanded(false);
      onIndexChange(newIdx);
      setPhase({ t: 'reposition', fromX: -flyX });

      // Two RAFs: ensure DOM painted the reposition before starting fly-in
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setPhase({ t: 'fly-in' });
        setTimeout(() => {
          setPhase({ t: 'idle' });
          isAnimRef.current = false;
        }, 190);
      }));
    }, 148);
  }, [onIndexChange]);

  const runRubberBand = useCallback((dir: 'left' | 'right', wrapTo: number) => {
    if (isAnimRef.current) return;
    isAnimRef.current = true;
    const nudge = dir === 'left' ? -68 : 68;

    setPhase({ t: 'rubber-push', toX: nudge });
    setTimeout(() => {
      setPhase({ t: 'rubber-release' });
      setTimeout(() => {
        isAnimRef.current = false;
        runTransition(wrapTo, dir);
      }, 215);
    }, 125);
  }, [runTransition]);

  function goNext() {
    const last = places.length - 1;
    if (displayIdxRef.current >= last) runRubberBand('left', 0);
    else runTransition(displayIdxRef.current + 1, 'left');
  }
  function goPrev() {
    if (displayIdxRef.current <= 0) runRubberBand('right', places.length - 1);
    else runTransition(displayIdxRef.current - 1, 'right');
  }

  // ── Pointer drag ──────────────────────────────────────────────────
  function onPtrDown(e: React.PointerEvent) {
    if (isAnimRef.current) return;
    // Let scrollable note area handle its own touch events
    if ((e.target as Element).closest('.place-card__note-scroll')) return;
    // Let buttons and links handle their own click events — don't capture pointer for these
    if ((e.target as Element).closest('button, a')) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, st: Date.now(), axis: null };
    setPhase({ t: 'dragging', x: 0, y: 0 });
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }

  function onPtrMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.sx;
    const dy = e.clientY - dragRef.current.sy;

    if (!dragRef.current.axis) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.4) dragRef.current.axis = 'x';
      else if (dy > 10 && dy > Math.abs(dx) * 1.4) dragRef.current.axis = 'y';
      else return;
    }

    if (dragRef.current.axis === 'x') {
      const atEnd = (dx < 0 && displayIdxRef.current >= places.length - 1)
                 || (dx > 0 && displayIdxRef.current <= 0);
      setPhase({ t: 'dragging', x: atEnd ? dx * 0.22 : dx, y: 0 });
    } else {
      setPhase({ t: 'dragging', x: 0, y: Math.max(0, dy) });
    }
  }

  function onPtrUp(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx   = e.clientX - dragRef.current.sx;
    const dy   = e.clientY - dragRef.current.sy;
    const ms   = Math.max(1, Date.now() - dragRef.current.st);
    const axis = dragRef.current.axis;
    dragRef.current = null;
    (e.currentTarget as Element).releasePointerCapture(e.pointerId);

    // Dismiss: swipe down
    if (axis === 'y' && dy > 80) {
      setPhase({ t: 'dismiss' });
      setTimeout(onClose, 160);
      return;
    }

    // Horizontal swipe
    const W = cardRef.current?.offsetWidth ?? 370;
    const vel = Math.abs(dx) / ms; // px/ms

    if (axis === 'x' && (Math.abs(dx) > W * 0.28 || vel > 0.42)) {
      if (dx < 0) goNext();
      else goPrev();
    } else {
      setPhase({ t: 'idle' }); // snap back
    }
  }

  // ── Render ────────────────────────────────────────────────────────
  const place = places[Math.min(displayIdx, places.length - 1)] ?? places[0];
  if (!place) return null;

  const meta     = CATEGORY_META[place.cat];
  const cardStyle = phaseStyle(phase, mounted);
  const n        = places.length;
  const dotCount = Math.min(n, 9);
  const dotIdx   = Math.min(displayIdx, dotCount - 1);

  return (
    <div className="card-outer" aria-live="polite">
      <div
        ref={cardRef}
        className={`place-card${isExpanded ? ' is-expanded' : ''}`}
        style={cardStyle}
        onPointerDown={onPtrDown}
        onPointerMove={onPtrMove}
        onPointerUp={onPtrUp}
        onPointerCancel={onPtrUp}
        role="dialog"
        aria-label={place.name}
      >
        {/* Drag handle / dismiss hint */}
        <div className="place-card__grip" aria-hidden />

        {/* Photo strip */}
        <div className="place-card__photo-wrap">
          <SmartImage
            primary={place.photo}
            fallback={place.fallbackPhoto}
            cat={place.cat}
            className="place-card__photo"
            variant="raw"
            alt={place.name}
          />
          <div
            className="place-card__photo-badge"
            style={{ background: meta.soft, color: meta.ink }}
          >
            <span className="place-card__badge-dot" style={{ background: meta.color }} />
            {place.sub ?? meta.short}
          </div>
          {place.time && (
            <div className="place-card__time-chip">
              <ClockIcon size={11} />
              {place.time}
            </div>
          )}
        </div>

        {/* Text body */}
        <div className="place-card__body">
          <h2 className="place-card__title display">{place.name}</h2>
          <div className="place-card__note-wrap">
            <div className={`place-card__note-scroll${isExpanded ? ' is-open' : ''}`}>
              <p className="place-card__note">{place.note}</p>
            </div>
            {!isExpanded && <div className="place-card__note-fade" />}
          </div>
          <button
            className="place-card__read-more"
            style={{ color: isExpanded ? meta.ink : meta.color }}
            onClick={e => { e.stopPropagation(); setIsExpanded(v => !v); }}
          >
            {isExpanded ? '∧ less' : '∨ full note'}
          </button>
        </div>

        {/* Maps CTA */}
        <div className="place-card__actions">
          <a
            className="place-card__maps-btn"
            href={place.maps}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            <ExternalIcon size={14} />
            Open in Google Maps
          </a>
        </div>

        {/* Nav strip: ‹ dots counter › */}
        <div className="place-card__nav">
          <button
            className="place-card__nav-arrow"
            aria-label="Previous"
            onClick={e => { e.stopPropagation(); goPrev(); }}
          >‹</button>

          <div className="place-card__nav-mid">
            <div className="place-card__dots" aria-hidden>
              {Array.from({ length: dotCount }, (_, i) => (
                <span
                  key={i}
                  className={`place-card__dot${i === dotIdx ? ' is-active' : ''}`}
                  style={i === dotIdx ? { background: meta.color, width: '16px', borderRadius: '3px' } : {}}
                />
              ))}
            </div>
            <span className="place-card__counter mono">
              {displayIdx + 1}&thinsp;/&thinsp;{n}
            </span>
          </div>

          <button
            className="place-card__nav-arrow"
            aria-label="Next"
            onClick={e => { e.stopPropagation(); goNext(); }}
          >›</button>
        </div>
      </div>
    </div>
  );
}
