import { type SVGProps } from 'react';

// Generate deterministic colors based on seed
function getColors(seed: string): [string, string, string] {
  const hash = seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const hue = Math.abs(hash % 360);
  const saturation = 70 + Math.abs((hash >> 8) % 20);
  const lightness = 80 + Math.abs((hash >> 16) % 10);

  return [
    `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`,
    `hsl(${(hue + 120) % 360}, ${saturation}%, ${lightness}%)`,
  ];
}

// Get pattern type based on seed
function getPatternType(seed: string): number {
  const hash = seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return Math.abs(hash % 6); // 6 different pattern types
}

// Generate SVG shapes based on seed
function generateShapes(seed: string): string {
  const [color1, color2, color3] = getColors(seed);
  const patternType = getPatternType(seed);
  
  let pattern = '';
  switch (patternType) {
    case 0: // Circles
      pattern = `
        <circle cx="25" cy="25" r="15" fill="white" opacity="0.2" />
        <circle cx="75" cy="75" r="15" fill="white" opacity="0.2" />
        <circle cx="75" cy="25" r="10" fill="white" opacity="0.2" />
        <circle cx="25" cy="75" r="10" fill="white" opacity="0.2" />
      `;
      break;
    case 1: // Squares
      pattern = `
        <rect x="20" y="20" width="20" height="20" fill="white" opacity="0.2" transform="rotate(45 30 30)" />
        <rect x="60" y="60" width="20" height="20" fill="white" opacity="0.2" transform="rotate(45 70 70)" />
      `;
      break;
    case 2: // Triangles
      pattern = `
        <path d="M50,20 L70,50 L30,50 Z" fill="white" opacity="0.2" />
        <path d="M50,80 L70,50 L30,50 Z" fill="white" opacity="0.2" />
      `;
      break;
    case 3: // Waves
      pattern = `
        <path d="M0,40 Q25,20 50,40 T100,40" stroke="white" fill="none" opacity="0.2" />
        <path d="M0,60 Q25,80 50,60 T100,60" stroke="white" fill="none" opacity="0.2" />
      `;
      break;
    case 4: // Dots
      pattern = `
        <circle cx="25" cy="25" r="3" fill="white" opacity="0.2" />
        <circle cx="50" cy="50" r="3" fill="white" opacity="0.2" />
        <circle cx="75" cy="75" r="3" fill="white" opacity="0.2" />
        <circle cx="25" cy="75" r="3" fill="white" opacity="0.2" />
        <circle cx="75" cy="25" r="3" fill="white" opacity="0.2" />
      `;
      break;
    case 5: // Hexagons
      pattern = `
        <path d="M50,20 L70,35 L70,65 L50,80 L30,65 L30,35 Z" fill="white" opacity="0.2" />
      `;
      break;
  }

  return `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${color2};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color3};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#grad1)" />
      <circle cx="50" cy="50" r="30" fill="url(#grad2)" />
      ${pattern}
    </svg>
  `;
}

export function generateAvatar(seed: string = Math.random().toString(36).substring(7)): string {
  const svg = generateShapes(seed);
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function AvatarSVG({ seed, ...props }: SVGProps<SVGSVGElement> & { seed?: string }) {
  const [color1, color2, color3] = getColors(seed || Math.random().toString(36).substring(7));
  const patternType = getPatternType(seed || '');
  const gradientId1 = `grad1-${seed}`;
  const gradientId2 = `grad2-${seed}`;
  
  let pattern;
  switch (patternType) {
    case 0: // Circles
      pattern = (
        <>
          <circle cx="25" cy="25" r="15" fill="white" opacity="0.2" />
          <circle cx="75" cy="75" r="15" fill="white" opacity="0.2" />
          <circle cx="75" cy="25" r="10" fill="white" opacity="0.2" />
          <circle cx="25" cy="75" r="10" fill="white" opacity="0.2" />
        </>
      );
      break;
    case 1: // Squares
      pattern = (
        <>
          <rect x="20" y="20" width="20" height="20" fill="white" opacity="0.2" transform="rotate(45 30 30)" />
          <rect x="60" y="60" width="20" height="20" fill="white" opacity="0.2" transform="rotate(45 70 70)" />
        </>
      );
      break;
    case 2: // Triangles
      pattern = (
        <>
          <path d="M50,20 L70,50 L30,50 Z" fill="white" opacity="0.2" />
          <path d="M50,80 L70,50 L30,50 Z" fill="white" opacity="0.2" />
        </>
      );
      break;
    case 3: // Waves
      pattern = (
        <>
          <path d="M0,40 Q25,20 50,40 T100,40" stroke="white" fill="none" opacity="0.2" />
          <path d="M0,60 Q25,80 50,60 T100,60" stroke="white" fill="none" opacity="0.2" />
        </>
      );
      break;
    case 4: // Dots
      pattern = (
        <>
          <circle cx="25" cy="25" r="3" fill="white" opacity="0.2" />
          <circle cx="50" cy="50" r="3" fill="white" opacity="0.2" />
          <circle cx="75" cy="75" r="3" fill="white" opacity="0.2" />
          <circle cx="25" cy="75" r="3" fill="white" opacity="0.2" />
          <circle cx="75" cy="25" r="3" fill="white" opacity="0.2" />
        </>
      );
      break;
    case 5: // Hexagons
      pattern = (
        <path d="M50,20 L70,35 L70,65 L50,80 L30,65 L30,35 Z" fill="white" opacity="0.2" />
      );
      break;
  }
  
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={gradientId1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
        <linearGradient id={gradientId2} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color2} />
          <stop offset="100%" stopColor={color3} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${gradientId1})`} />
      <circle cx="50" cy="50" r="30" fill={`url(#${gradientId2})`} />
      {pattern}
    </svg>
  );
}