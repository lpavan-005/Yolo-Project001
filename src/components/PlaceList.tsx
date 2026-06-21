import { useMemo, useState } from 'react';
import type { Place, Category } from '../data/places';
import { PLACES, CATEGORY_META } from '../data/places';
import { SmartImage } from './SmartImage';
import { SearchIcon, XIcon } from '../icons';
import type { FilterValue } from './FilterChips';

interface PlaceListProps {
  filter: FilterValue;
  selectedId: string | null;
  onSelect: (place: Place) => void;
}

export function PlaceList({ filter, selectedId, onSelect }: PlaceListProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let result = filter === 'all' ? PLACES : PLACES.filter(p => p.cat === filter);
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        (p.sub?.toLowerCase().includes(q) ?? false)
      );
    }
    return result;
  }, [filter, query]);

  const grouped = useMemo(() => {
    if (filter !== 'all') {
      return [[CATEGORY_META[filter].label, filtered]] as Array<[string, Place[]]>;
    }
    const order: Category[] = ['day1', 'day2', 'food', 'deep'];
    return order
      .map(cat => [CATEGORY_META[cat].label, filtered.filter(p => p.cat === cat)] as [string, Place[]])
      .filter(([, items]) => items.length > 0);
  }, [filter, filtered]);

  return (
    <div className="list">
      <div className="list__search">
        <SearchIcon size={16} className="list__search-icon" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search places, food, notes…"
          aria-label="Search"
        />
        {query && (
          <button className="list__search-clear" onClick={() => setQuery('')} aria-label="Clear search">
            <XIcon size={14} />
          </button>
        )}
      </div>

      <div className="list__scroll">
        {filtered.length === 0 ? (
          <div className="list__empty">
            <p className="display" style={{ fontSize: 22 }}>Nothing matches that.</p>
            <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Try a different word, or clear the search.</p>
          </div>
        ) : (
          grouped.map(([label, items]) => (
            <section key={label} className="list__section">
              <div className="list__section-head">
                <span className="list__section-title">{label}</span>
                <span className="list__section-count mono">{items.length}</span>
              </div>
              {items.map(p => {
                const meta = CATEGORY_META[p.cat];
                const isSelected = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    className={`row ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => onSelect(p)}
                  >
                    <SmartImage
                      primary={p.photo}
                      fallback={p.fallbackPhoto}
                      cat={p.cat}
                      className="row__thumb"
                      variant="raw"
                      alt={p.name}
                    />
                    <div className="row__text">
                      <div className="row__name">{p.name}</div>
                      <div className="row__meta">
                        {p.order && <span className="row__order mono" style={{ color: meta.color }}>#{p.order}</span>}
                        {p.time && <span>{p.time}</span>}
                        {p.sub && !p.time && <span>{p.sub}</span>}
                      </div>
                    </div>
                    <span className="row__dot" style={{ background: meta.color }} />
                  </button>
                );
              })}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
