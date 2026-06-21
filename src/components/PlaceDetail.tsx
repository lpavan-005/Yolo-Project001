import type { Place } from '../data/places';
import { CATEGORY_META } from '../data/places';
import { SmartImage } from './SmartImage';
import { ExternalIcon, ClockIcon } from '../icons';

interface PlaceDetailProps {
  place: Place;
  expanded: boolean;
}

export function PlaceDetail({ place, expanded }: PlaceDetailProps) {
  const meta = CATEGORY_META[place.cat];

  return (
    <div className="detail">
      <div className="detail__hero">
        <SmartImage
          primary={place.photo}
          fallback={place.fallbackPhoto}
          cat={place.cat}
          alt={place.name}
          variant="raw"
          className="detail__photo"
        />
        {place.time && (
          <div className="detail__stamp">
            <ClockIcon size={12} />
            <span className="mono">{place.time}</span>
          </div>
        )}
      </div>

      <div className="detail__body">
        <div className="detail__eyebrow" style={{ color: meta.ink }}>
          <span className="detail__dot" style={{ background: meta.color }} />
          {place.sub ?? meta.label}
          {place.order && <span className="detail__order mono">#{place.order}</span>}
        </div>

        <h2 className="detail__title display">{place.name}</h2>

        <p className={`detail__note ${expanded ? 'is-expanded' : ''}`}>
          {place.note}
        </p>

        <div className="detail__actions">
          <a
            className="btn btn-primary"
            href={place.maps}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalIcon size={15} />
            Open in Google Maps
          </a>
        </div>

        {expanded && (
          <div className="detail__meta mono">
            <div>
              <span>Lat</span>
              <span>{place.lat.toFixed(5)}</span>
            </div>
            <div>
              <span>Lng</span>
              <span>{place.lng.toFixed(5)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
