import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapCanvas } from './components/MapCanvas';
import { FilterChips } from './components/FilterChips';
import type { FilterValue } from './components/FilterChips';
import { PlaceList } from './components/PlaceList';
import { Timeline } from './components/Timeline';
import { BottomSheet } from './components/BottomSheet';
import type { SnapPoint } from './components/BottomSheet';
import { PlaceDetail } from './components/PlaceDetail';
import { PLACES } from './data/places';
import type { Place } from './data/places';
import { MenuIcon, XIcon, MapIcon, ListIcon } from './icons';

type View = 'map' | 'timeline-day1' | 'timeline-day2';

export default function App() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [selected, setSelected] = useState<Place | null>(null);
  const [snap, setSnap] = useState<SnapPoint>('half');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<View>('map');
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 880);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 880);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onSelectPlace = useCallback((p: Place) => {
    setSelected(p);
    setSnap(prev => (prev === 'closed' ? 'half' : prev));
    if (!isDesktop) setDrawerOpen(false);
    setView('map');
  }, [isDesktop]);

  const onCloseDetail = useCallback(() => {
    setSelected(null);
  }, []);

  const bottomInset = useMemo(() => {
    if (!selected || isDesktop) return 0;
    if (snap === 'peek') return window.innerHeight * 0.22;
    if (snap === 'half') return window.innerHeight * 0.55;
    if (snap === 'full') return window.innerHeight * 0.92;
    return 0;
  }, [snap, selected, isDesktop]);

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

      <div className="chipbar">
        <FilterChips value={filter} onChange={setFilter} />
      </div>

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

      <BottomSheet
        open={!!selected}
        snap={snap}
        onSnapChange={setSnap}
        onClose={onCloseDetail}
      >
        {selected && <PlaceDetail place={selected} expanded={snap === 'full'} />}
      </BottomSheet>
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
