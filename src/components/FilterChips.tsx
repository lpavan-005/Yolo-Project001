import type { Category } from '../data/places';
import { CATEGORY_META, PLACES } from '../data/places';

export type FilterValue = 'all' | Category;

interface FilterChipsProps {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}

const ORDER: FilterValue[] = ['all', 'day1', 'day2', 'food', 'deep'];

export function FilterChips({ value, onChange }: FilterChipsProps) {
  const counts: Record<FilterValue, number> = {
    all: PLACES.length,
    day1: PLACES.filter(p => p.cat === 'day1').length,
    day2: PLACES.filter(p => p.cat === 'day2').length,
    food: PLACES.filter(p => p.cat === 'food').length,
    deep: PLACES.filter(p => p.cat === 'deep').length,
  };

  return (
    <div className="chips" role="tablist" aria-label="Filter">
      {ORDER.map(v => {
        const label = v === 'all' ? 'All' : CATEGORY_META[v].short;
        const isActive = value === v;
        const color = v === 'all' ? 'var(--ink)' : CATEGORY_META[v].color;
        const inkColor = v === 'all' ? 'var(--ink)' : CATEGORY_META[v].ink;
        return (
          <button
            key={v}
            className={`chip ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(v)}
            role="tab"
            aria-selected={isActive}
            style={
              isActive
                ? ({ '--chip-bg': color, '--chip-ink': '#FFFFFF' } as React.CSSProperties)
                : ({ '--chip-bg': 'var(--paper)', '--chip-ink': inkColor } as React.CSSProperties)
            }
          >
            {v !== 'all' && (
              <span className="chip__dot" style={{ background: isActive ? '#FFFFFF' : color }} />
            )}
            <span>{label}</span>
            <span className="chip__count mono">{counts[v]}</span>
          </button>
        );
      })}
    </div>
  );
}
