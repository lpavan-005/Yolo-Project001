import { useEffect, useRef } from 'react';
import L, { Map as LMap, Marker, Polyline } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PLACES, CATEGORY_META } from '../data/places';
import type { Place, Category } from '../data/places';
import type { FilterValue } from './FilterChips';

const GLYPH: Record<Category, string> = {
  day1: '\u{1F6D5}',    // temple
  day2: '\u{2744}\u{FE0F}', // snowflake
  food: '\u{1F37D}\u{FE0F}', // plate
  deep: '\u{2728}',     // sparkles
};

interface MapCanvasProps {
  filter: FilterValue;
  selectedId: string | null;
  onMarkerClick: (place: Place) => void;
  /** When the user explicitly recenters, give us a callback */
  bottomInset?: number;
}

export function MapCanvas({ filter, selectedId, onMarkerClick, bottomInset = 0 }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const routesRef = useRef<Record<string, Polyline>>({});

  // ---- Initial setup ----
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    }).setView([32.27, 77.18], 12);

    // Carto Voyager — softer, more refined than default OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> · © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapRef.current = map;

    // Build markers
    PLACES.forEach(p => {
      const meta = CATEGORY_META[p.cat];
      const icon = L.divIcon({
        className: '',
        html: `
          <div class="map-pin" data-cat="${p.cat}" data-id="${p.id}" style="--pin-color: ${meta.color}; --pin-ink: ${meta.ink};">
            <div class="map-pin__inner">
              <span class="map-pin__glyph">${GLYPH[p.cat]}</span>
              ${p.order ? `<span class="map-pin__num mono">${p.order}</span>` : ''}
            </div>
            <div class="map-pin__shadow"></div>
          </div>`,
        iconSize: [40, 48],
        iconAnchor: [20, 44],
      });

      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      marker.on('click', () => onMarkerClick(p));
      markersRef.current[p.id] = marker;
    });

    // Build route lines for days
    (['day1', 'day2'] as const).forEach(cat => {
      const stops = PLACES.filter(p => p.cat === cat).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const pts: [number, number][] = stops.map(p => [p.lat, p.lng]);
      const line = L.polyline(pts, {
        color: CATEGORY_META[cat].color,
        weight: 2.5,
        opacity: 0.55,
        dashArray: '2,8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routesRef.current[cat] = line;
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
      routesRef.current = {};
    };
  }, []);

  // ---- Re-bind click handler when callback changes (no remount) ----
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.off('click');
      const place = PLACES.find(p => p.id === id);
      if (place) marker.on('click', () => onMarkerClick(place));
    });
  }, [onMarkerClick]);

  // ---- Apply filter ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const place = PLACES.find(p => p.id === id)!;
      const show = filter === 'all' || place.cat === filter;
      const has = map.hasLayer(marker);
      if (show && !has) marker.addTo(map);
      else if (!show && has) map.removeLayer(marker);
    });

    Object.entries(routesRef.current).forEach(([cat, line]) => {
      const show = filter === 'all' || filter === cat;
      const has = map.hasLayer(line);
      if (show && !has) line.addTo(map);
      else if (!show && has) map.removeLayer(line);
    });

    // Fit bounds when filter changes (and there's something to fit)
    const visible = PLACES.filter(p => filter === 'all' || p.cat === filter);
    if (visible.length > 1 && filter !== 'all') {
      const bounds = L.latLngBounds(visible.map(p => [p.lat, p.lng]));
      map.flyToBounds(bounds, {
        padding: [60, 60],
        paddingBottomRight: [60, 60 + bottomInset],
        duration: 0.8,
      });
    }
  }, [filter, bottomInset]);

  // ---- Apply selection highlight + fly-to ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const pin = el.querySelector('.map-pin');
      if (pin) pin.classList.toggle('is-selected', id === selectedId);
    });

    if (selectedId) {
      const marker = markersRef.current[selectedId];
      if (marker) {
        const ll = marker.getLatLng();
        // Offset target down by half the bottom inset so the selected pin sits
        // in the visible area above the sheet
        const pt = map.project(ll, map.getZoom());
        pt.y -= bottomInset / 2;
        const target = map.unproject(pt, map.getZoom());
        map.flyTo(target, Math.max(map.getZoom(), 14), { duration: 0.6 });
      }
    }
  }, [selectedId, bottomInset]);

  // ---- Resize observer ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const ro = new ResizeObserver(() => map.invalidateSize());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return <div ref={containerRef} className="map-canvas" aria-label="Map" />;
}
