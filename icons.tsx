import React from 'react';

// Common props for Lucide icons
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  className?: string;
  children?: React.ReactNode;
}

const IconBase = ({ size = 24, strokeWidth = 2, children, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const Check = (props: IconProps) => (
  <IconBase {...props}>
    <polyline points="20 6 9 17 4 12" />
  </IconBase>
);

export const Plus = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </IconBase>
);

export const Minus = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 12h14" />
  </IconBase>
);

export const Flower = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 1 4.5 4.5M7.5 12H9m3 4.5a4.5 4.5 0 1 0 4.5-4.5M12 16.5V15m4.5-3a4.5 4.5 0 1 1 4.5 4.5M16.5 12H15" />
    <circle cx="12" cy="12" r="3" />
    <path d="m8 16 1.5-1.5" />
    <path d="M14.5 9.5 16 8" />
    <path d="m8 8 1.5 1.5" />
    <path d="M14.5 14.5 16 16" />
  </IconBase>
);

export const Edit2 = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </IconBase>
);

export const X = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </IconBase>
);


export const Calendar = (props: IconProps) => (
  <IconBase {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </IconBase>
);

export const ChevronDown = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m6 9 6 6 6-6" />
  </IconBase>
);

export const Settings = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);

export const Upload = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </IconBase>
);

export const Info = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </IconBase>
);

export const Menu = (props: IconProps) => (
  <IconBase {...props}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </IconBase>
);

export const Sprout = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </IconBase>
);

export const Leaf = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </IconBase>
);

export const TreeDeciduous = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M8 19h8a4 4 0 0 0 3.8-2.8 4 4 0 0 0-1.6-4.5c.5-.8.5-1.8.1-2.7A4 4 0 0 0 15 6c-1.4 0-2.7.6-3.5 1.5A4 4 0 0 0 4.8 9a4 4 0 0 0 3.2 10Z" />
    <path d="M12 19v3" />
  </IconBase>
);

export const TreePine = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m10 11 2 2 2-2" />
    <path d="M12 22v-8" />
    <path d="M13.8 5.2 6 15h12L10.2 5.2a1.5 1.5 0 0 1 2.6 0Z" />
  </IconBase>
);

export const Trees = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" />
    <path d="M7 16v6" />
    <path d="M13 19v3" />
    <path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .6-1.7L13.2 3.2a1 1 0 0 0-1.5 0L8.4 7.3a1 1 0 0 0 .6 1.7H9.2a1 1 0 0 0 .7 1.7L8 14" />
  </IconBase>
);

export const Download = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </IconBase>
);

export const Share2 = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </IconBase>
);

export const KaabaIllustration = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#fcd34d" />
      </linearGradient>
    </defs>
    
    {/* Base Shadow */}
    <ellipse cx="100" cy="170" rx="70" ry="15" fill="#000" opacity="0.1" />

    {/* Cube Left Face (Black) */}
    <path d="M20 70 L100 110 V190 L20 150 Z" fill="#1f2937" />
    
    {/* Cube Right Face (Darker Black) */}
    <path d="M100 110 L180 70 V150 L100 190 Z" fill="#0f172a" />
    
    {/* Cube Top Face (Lightest Black) */}
    <path d="M100 30 L180 70 L100 110 L20 70 Z" fill="#374151" />

    {/* Gold Band - Left Face */}
    <path d="M20 90 L100 130 V145 L20 105 Z" fill="url(#goldGradient)" opacity="0.9" />
    
    {/* Gold Band - Right Face */}
    <path d="M100 130 L180 90 V105 L100 145 Z" fill="url(#goldGradient)" opacity="0.8" />
    
    {/* Door Area (Right Face) */}
    <path d="M145 110 L165 100 V135 L145 145 Z" fill="#fcd34d" opacity="0.5" />

  </svg>
);