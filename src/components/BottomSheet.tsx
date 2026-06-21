import { useState, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export type SnapPoint = 'peek' | 'half' | 'full' | 'closed';

interface BottomSheetProps {
  open: boolean;
  snap: SnapPoint;
  onSnapChange: (snap: SnapPoint) => void;
  onClose: () => void;
  children: ReactNode;
  /** Peek height in px */
  peekHeight?: number;
  /** Half height as vh */
  halfHeight?: number;
  /** Full height as vh */
  fullHeight?: number;
}

const SNAP_PERCENTS = {
  closed: 100,    // off-screen
  peek: 78,       // ~22% visible from bottom — header + photo
  half: 45,       // ~55% visible
  full: 8,        // ~92% visible (small top gap)
};

export function BottomSheet({
  open,
  snap,
  onSnapChange,
  onClose,
  children,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ y: number; baseTranslate: number; sheetH: number } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const effectiveSnap: SnapPoint = open ? snap : 'closed';
  const targetPercent = SNAP_PERCENTS[effectiveSnap];

  // Drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!sheetRef.current) return;
    const sheetH = sheetRef.current.getBoundingClientRect().height;
    dragStartRef.current = {
      y: e.clientY,
      baseTranslate: (targetPercent / 100) * sheetH,
      sheetH,
    };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [targetPercent]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const delta = e.clientY - dragStartRef.current.y;
    setDragOffset(delta);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const { baseTranslate, sheetH } = dragStartRef.current;
    const newTranslate = baseTranslate + dragOffset;
    const newPercent = (newTranslate / sheetH) * 100;

    // Dragged most of the way down past peek -> close entirely.
    // Otherwise always snap to whichever defined point is visually nearest
    // to where the finger let go. No separate "flick" vs "small drag" cases —
    // that mixed logic was the source of the inconsistent feel.
    if (newPercent > 88) {
      onClose();
    } else {
      const distances = (['peek', 'half', 'full'] as SnapPoint[])
        .map(k => ({ key: k, dist: Math.abs(SNAP_PERCENTS[k] - newPercent) }));
      distances.sort((a, b) => a.dist - b.dist);
      onSnapChange(distances[0].key);
    }

    dragStartRef.current = null;
    setDragOffset(0);
    setDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, [dragOffset, onSnapChange, onClose]);

  // Translate calculation including live drag
  const translateY = dragging && dragStartRef.current
    ? `calc(${targetPercent}% + ${dragOffset}px)`
    : `${targetPercent}%`;

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Light scrim only when full; never blocks the map when peek/half so it still feels integrated */}
      <div
        className={`sheet-scrim ${open && snap === 'full' ? 'is-shown' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={sheetRef}
        className={`sheet ${open ? 'is-open' : ''} ${dragging ? 'is-dragging' : ''}`}
        style={{ transform: `translateY(${translateY})` }}
        role="dialog"
        aria-modal={snap === 'full'}
      >
        <div
          className="sheet__handle"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="button"
          tabIndex={0}
          aria-label="Resize"
        >
          <div className="sheet__grip" />
        </div>
        <div className="sheet__body">
          {children}
        </div>
      </div>
    </>
  );
}
