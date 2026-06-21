import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const base = (props: IconProps) => ({
  width: props.size ?? 20,
  height: props.size ?? 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
export const XIcon = (p: IconProps) => (
  <svg {...base(p)}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
export const ChevronUpIcon = (p: IconProps) => (
  <svg {...base(p)}><polyline points="18 15 12 9 6 15"/></svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}><polyline points="6 9 12 15 18 9"/></svg>
);
export const ExternalIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);
export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
export const MapIcon = (p: IconProps) => (
  <svg {...base(p)}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
);
export const ListIcon = (p: IconProps) => (
  <svg {...base(p)}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);
export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
export const TempleIcon = (p: IconProps) => (
  <svg {...base(p)} viewBox="0 0 24 24">
    <path d="M3 21h18M5 21V11M19 21V11M7 11h10M5 11l7-5 7 5M9 21v-5h6v5"/>
  </svg>
);
export const MountainIcon = (p: IconProps) => (
  <svg {...base(p)}><polygon points="3 20 8 11 12 17 15 13 21 20 3 20"/><circle cx="16" cy="6" r="2"/></svg>
);
export const ForkIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 3v18M9 3v6a3 3 0 0 1-6 0V3M14 3v18M17 3a5 5 0 0 0 0 10v8"/></svg>
);
export const StarIcon = (p: IconProps) => (
  <svg {...base(p)}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
