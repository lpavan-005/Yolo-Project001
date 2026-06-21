import { useMemo } from 'react';
import { PLACES } from '../data/places';
import type { Place, Category } from '../data/places';
import { CATEGORY_META } from '../data/places';
import { SmartImage } from './SmartImage';
import { ClockIcon } from '../icons';

interface TimelineProps {
  day: 'day1' | 'day2';
  onSelect: (p: Place) => void;
  selectedId: string | null;
}

export function Timeline({ day, onSelect, selectedId }: TimelineProps) {
  const meta = CATEGORY_META[day];
  const stops = useMemo(
    () => PLACES.filter(p => p.cat === day).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [day]
  );
  const eveningPicks = useMemo(
    () => PLACES.filter(p => p.linkedDay === day),
    [day]
  );

  return (
    <div className="timeline">
      <div className="timeline__head">
        <div className="timeline__eyebrow" style={{ color: meta.ink }}>
          <span className="mono">{day === 'day1' ? 'DAY ONE' : 'DAY TWO'}</span>
          <span className="timeline__rule" style={{ background: meta.color }} />
        </div>
        <h2 className="display timeline__title">
          {day === 'day1' ? 'Temples, culture & Old Manali' : 'Atal Tunnel, Sissu & Jagatsukh'}
        </h2>
        <p className="timeline__intro">
          {day === 'day1'
            ? 'The slow day. Temples and the culture museum in the morning, then a deliberately unhurried block through Old Manali, hot springs by mid-afternoon.'
            : 'The snow day. Up through Atal Tunnel into Lahaul valley by morning, an offbeat ancient temple on the way back, then shopping and a Tibetan dinner to close.'}
        </p>
      </div>

      <ol className="timeline__list">
        {stops.map((p, idx) => {
          const isSelected = selectedId === p.id;
          return (
            <li key={p.id} className={`stop ${isSelected ? 'is-selected' : ''}`}>
              <div className="stop__rail">
                <div className="stop__dot" style={{ background: meta.color }}>
                  <span className="mono">{p.order}</span>
                </div>
                {(idx < stops.length - 1 || eveningPicks.length > 0) && (
                  <div className="stop__line" style={{ background: meta.color }} />
                )}
              </div>
              <button className="stop__card" onClick={() => onSelect(p)}>
                <SmartImage
                  primary={p.photo}
                  fallback={p.fallbackPhoto}
                  cat={p.cat as Category}
                  className="stop__photo"
                  variant="raw"
                  alt={p.name}
                />
                <div className="stop__text">
                  {p.time && (
                    <div className="stop__time mono">
                      <ClockIcon size={11} />
                      {p.time}
                    </div>
                  )}
                  <div className="stop__name display">{p.name}</div>
                  <p className="stop__note">{truncate(p.note, 140)}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      {eveningPicks.length > 0 && (
        <div className="evening-picks">
          <div className="evening-picks__head">
            <div className="stop__rail">
              <div className="stop__dot stop__dot--choice" style={{ background: 'var(--copper)' }}>
                <span className="mono">?</span>
              </div>
            </div>
            <div>
              <div className="evening-picks__eyebrow mono">EVENING &middot; PICK ONE</div>
              <p className="evening-picks__note">
                Not a fixed stop — whichever fits the mood once you're back in town.
              </p>
            </div>
          </div>
          <div className="evening-picks__grid">
            {eveningPicks.map(p => {
              const isSelected = selectedId === p.id;
              return (
                <button
                  key={p.id}
                  className={`evening-pick ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelect(p)}
                >
                  <SmartImage
                    primary={p.photo}
                    fallback={p.fallbackPhoto}
                    cat={p.cat as Category}
                    className="evening-pick__photo"
                    variant="raw"
                    alt={p.name}
                  />
                  <div className="evening-pick__name display">{p.name}</div>
                  <p className="evening-pick__note">{truncate(p.note, 80)}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, '') + '…';
}
