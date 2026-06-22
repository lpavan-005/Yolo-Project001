import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapCanvas } from './components/MapCanvas';
import { FilterChips } from './components/FilterChips';
import type { FilterValue } from './components/FilterChips';
import { PlaceList } from './components/PlaceList';
import { Timeline } from './components/Timeline';
import { PlaceCard } from './components/PlaceCard';
import { PlaceDetail } from './components/PlaceDetail';
import { PLACES } from './data/places';
import type { Place } from './data/places';
import { MenuIcon, XIcon, MapIcon, ListIcon } from './icons';

type View = 'map' | 'timeline-day1' | 'timeline-day2';

export default function App() {
  const [filter, setFilter]       = useState<FilterValue>('all');
  const [selected, setSelected]   = useState<Place | null>(null);
  const [activeCardIdx, setActiveCardIdx] = useState<number>(-1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView]           = useState<View>('map');
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 880);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 880);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Ordered list of places for the current filter — matches what PlaceList shows
  const filteredPlaces = useMemo<Place[]>(() => {
    const day1 = PLACES.filter(p => p.cat === 'day1').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const day2 = PLACES.filter(p => p.cat === 'day2').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const food = PLACES.filter(p => p.cat === 'food');
    const deep = PLACES.filter(p => p.cat === 'deep');
    const linked1 = PLACES.filter(p => p.linkedDay === 'day1');
    const linked2 = PLACES.filter(p => p.linkedDay === 'day2');
    switch (filter) {
      case 'day1': return [...day1, ...linked1];
      case 'day2': return [...day2, ...linked2];
      case 'food': return food;
      case 'deep': return deep;
      default:     return [...day1, ...day2, ...food, ...deep];
    }
  }, [filter]);

  // When filter changes keep card open if selected place is still in list
  useEffect(() => {
    if (selected) {
      const idx = filteredPlaces.findIndex(p => p.id === selected.id);
      if (idx >= 0) setActiveCardIdx(idx);
      else { setSelected(null); setActiveCardIdx(-1); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPlaces]);

  const onSelectPlace = useCallback((p: Place) => {
    const idx = filteredPlaces.findIndex(fp => fp.id === p.id);
    setSelected(p);
    setActiveCardIdx(idx >= 0 ? idx : 0);
    if (!isDesktop) setDrawerOpen(false);
    setView('map');
  }, [filteredPlaces, isDesktop]);

  const onCloseDetail = useCallback(() => {
    setSelected(null);
    setActiveCardIdx(-1);
  }, []);

  const onCardIndexChange = useCallback((idx: number) => {
    const place = filteredPlaces[idx];
    if (place) {
      setSelected(place);
      setActiveCardIdx(idx);
    }
  }, [filteredPlaces]);

  // Fixed inset: card is always ~250px + 12px margin from bottom on mobile
  const bottomInset = (!isDesktop && activeCardIdx >= 0) ? 268 : 0;

  if (isDesktop) {
    return <DesktopLayout
      filter={filter}
      setFilter={setFilter}
      selected={selected}
      setSelected={onSelectPlace}
      onCloseDetail={onCloseDetail}
      view={view}
      setView={setView}
    />;
  }

  return (
    <div className="app">
      <MapCanvas
        filter={filter}
        selectedId={selected?.id ?? null}
        onMarkerClick={onSelectPlace}
        bottomInset={bottomInset}
      />

      <header className="topbar">
        <button className="iconbtn" onClick={() => setDrawerOpen(true)} aria-label="Open list">
          <MenuIcon size={18} />
        </button>
        <div className="topbar__title">
          <h1 className="display">Manali, in Full</h1>
          <p>{PLACES.length} stops · tap a pin</p>
        </div>
        <button
          className={`iconbtn ${view !== 'map' ? 'is-active' : ''}`}
          onClick={() => setView(view === 'map' ? 'timeline-day1' : 'map')}
          aria-label={view === 'map' ? 'Show timeline' : 'Show map'}
        >
          {view === 'map' ? <ListIcon size={18} /> : <MapIcon size={18} />}
        </button>
      </header>

      {view === 'map' && (
        <div className="chipbar">
          <FilterChips value={filter} onChange={setFilter} />
        </div>
      )}

      {view !== 'map' && (
        <div className="timeline-overlay">
          <div className="timeline-overlay__tabs">
            <button
              className={view === 'timeline-day1' ? 'is-active' : ''}
              onClick={() => setView('timeline-day1')}
            >Day 1</button>
            <button
              className={view === 'timeline-day2' ? 'is-active' : ''}
              onClick={() => setView('timeline-day2')}
            >Day 2</button>
          </div>
          <div className="timeline-overlay__scroll">
            <Timeline
              day={view === 'timeline-day1' ? 'day1' : 'day2'}
              onSelect={onSelectPlace}
              selectedId={selected?.id ?? null}
            />
          </div>
        </div>
      )}

      <div
        className={`scrim ${drawerOpen ? 'is-open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />
      <aside className={`drawer ${drawerOpen ? 'is-open' : ''}`}>
        <div className="drawer__head">
          <h2 className="display" style={{ fontSize: 22 }}>Every stop</h2>
          <button className="iconbtn" onClick={() => setDrawerOpen(false)} aria-label="Close">
            <XIcon size={18} />
          </button>
        </div>
        <div style={{ padding: '0 16px 8px' }}>
          <FilterChips value={filter} onChange={setFilter} />
        </div>
        <PlaceList
          filter={filter}
          selectedId={selected?.id ?? null}
          onSelect={onSelectPlace}
        />
      </aside>

      {activeCardIdx >= 0 && filteredPlaces.length > 0 && (
        <PlaceCard
          places={filteredPlaces}
          activeIndex={activeCardIdx}
          onIndexChange={onCardIndexChange}
          onClose={onCloseDetail}
        />
      )}
    </div>
  );
}

interface DesktopProps {
  filter: FilterValue;
  setFilter: (v: FilterValue) => void;
  selected: Place | null;
  setSelected: (p: Place) => void;
  onCloseDetail: () => void;
  view: View;
  setView: (v: View) => void;
}

function DesktopLayout({
  filter, setFilter, selected, setSelected, onCloseDetail, view, setView
}: DesktopProps) {
  return (
    <div className="app app--desktop">
      <aside className="sidebar">
        <header className="sidebar__head">
          <h1 className="display">Manali, in Full</h1>
          <p className="sidebar__sub">
            A 2-day local itinerary, refined.<br />
            <span className="mono" style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
              {PLACES.length} STOPS · LATE JULY
            </span>
          </p>
        </header>

        <div className="sidebar__chips">
          <FilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="sidebar__view-toggle">
          <button className={view === 'map' ? 'is-active' : ''} onClick={() => setView('map')}>
            <MapIcon size={14} /> List
          </button>
          <button className={view === 'timeline-day1' ? 'is-active' : ''} onClick={() => setView('timeline-day1')}>
            Day 1
          </button>
          <button className={view === 'timeline-day2' ? 'is-active' : ''} onClick={() => setView('timeline-day2')}>
            Day 2
          </button>
        </div>

        <div className="sidebar__scroll">
          {view === 'map' ? (
            <PlaceList filter={filter} selectedId={selected?.id ?? null} onSelect={setSelected} />
          ) : (
            <Timeline
              day={view === 'timeline-day1' ? 'day1' : 'day2'}
              onSelect={setSelected}
              selectedId={selected?.id ?? null}
            />
          )}
        </div>
      </aside>

      <main className="main">
        <MapCanvas
          filter={filter}
          selectedId={selected?.id ?? null}
          onMarkerClick={setSelected}
          bottomInset={0}
        />
        {selected && (
          <div className="floating-detail">
            <button className="floating-detail__close" onClick={onCloseDetail} aria-label="Close">
              <XIcon size={16} />
            </button>
            <PlaceDetail place={selected} expanded={true} />
          </div>
        )}
      </main>
    </div>
  );
}
