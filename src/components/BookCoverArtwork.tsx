import React from 'react';
import { BookItem } from '../data/catalogData';
import { stripTashkeel } from '../utils/heritageLogic';

interface BookCoverArtworkProps {
  book: BookItem;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PALETTE_BY_PILLAR: Record<
  string,
  {
    bgPrimary: string;
    bgSecondary: string;
    borderGold: string;
    textMain: string;
    textAccent: string;
    patternStroke: string;
  }
> = {
  wisdom: {
    bgPrimary: '#231A12',
    bgSecondary: '#17110B',
    borderGold: '#C89D46',
    textMain: '#F6F0E4',
    textAccent: '#DFB867',
    patternStroke: 'rgba(200, 157, 70, 0.18)',
  },
  literature: {
    bgPrimary: '#2A141D',
    bgSecondary: '#1B0C12',
    borderGold: '#CDA34F',
    textMain: '#F7EFEA',
    textAccent: '#E4BE70',
    patternStroke: 'rgba(205, 163, 79, 0.18)',
  },
  history: {
    bgPrimary: '#142030',
    bgSecondary: '#0C141F',
    borderGold: '#C49A45',
    textMain: '#F0F4F8',
    textAccent: '#DFB86A',
    patternStroke: 'rgba(196, 154, 69, 0.18)',
  },
  poetry: {
    bgPrimary: '#13261E',
    bgSecondary: '#0B1812',
    borderGold: '#C29B48',
    textMain: '#EFF6F2',
    textAccent: '#DFBA69',
    patternStroke: 'rgba(194, 155, 72, 0.18)',
  },
  language: {
    bgPrimary: '#2B1B14',
    bgSecondary: '#1C110C',
    borderGold: '#CE9E46',
    textMain: '#F7F1EC',
    textAccent: '#E3B968',
    patternStroke: 'rgba(206, 158, 70, 0.18)',
  },
  travel: {
    bgPrimary: '#16242B',
    bgSecondary: '#0D171C',
    borderGold: '#C59D4B',
    textMain: '#F0F5F7',
    textAccent: '#E0BA6C',
    patternStroke: 'rgba(197, 157, 75, 0.18)',
  },
  biography: {
    bgPrimary: '#1F1E24',
    bgSecondary: '#141317',
    borderGold: '#C69E4B',
    textMain: '#F4F3F6',
    textAccent: '#E0BA6B',
    patternStroke: 'rgba(198, 158, 75, 0.18)',
  },
};

export const BookCoverArtwork: React.FC<BookCoverArtworkProps> = ({
  book,
  size = 'md',
  className = '',
}) => {
  const palette = PALETTE_BY_PILLAR[book.pillar] || PALETTE_BY_PILLAR.wisdom;

  // Clean title from parenthetical subtitle for crisp display
  const rawCleanTitle = stripTashkeel(book.title);
  const parenIndex = rawCleanTitle.indexOf('(');
  const mainTitle =
    parenIndex > 0 ? rawCleanTitle.slice(0, parenIndex).trim() : rawCleanTitle;
  const subTitle =
    parenIndex > 0
      ? rawCleanTitle.slice(parenIndex).replace(/[()]/g, '').trim()
      : book.category;

  const heightClass =
    size === 'sm' ? 'h-44' : size === 'lg' ? 'h-80' : 'h-60';

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden select-none flex flex-col justify-between p-5 ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 25%, ${palette.bgPrimary} 0%, ${palette.bgSecondary} 100%)`,
        color: palette.textMain,
      }}
      aria-label={`غلاف كتاب ${book.title}`}
    >
      {/* Classical Andalusian Geometric Filigree Frame (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 300 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Outer Double Archival Frame */}
        <rect
          x="12"
          y="12"
          width="276"
          height="376"
          fill="none"
          stroke={palette.borderGold}
          strokeWidth="1.2"
          strokeOpacity="0.55"
        />
        <rect
          x="17"
          y="17"
          width="266"
          height="366"
          fill="none"
          stroke={palette.borderGold}
          strokeWidth="0.6"
          strokeOpacity="0.35"
        />
        {/* Corner Arabesque Ornaments */}
        <path
          d="M 12 34 L 34 12 M 266 12 L 288 34 M 12 366 L 34 388 M 266 388 L 288 366"
          stroke={palette.borderGold}
          strokeWidth="1"
          strokeOpacity="0.45"
        />
        {/* Top Shamsa Medallion */}
        <circle
          cx="150"
          cy="18"
          r="28"
          fill="none"
          stroke={palette.patternStroke}
          strokeWidth="1.2"
        />
        <circle
          cx="150"
          cy="18"
          r="18"
          fill="none"
          stroke={palette.patternStroke}
          strokeWidth="0.8"
        />
        {/* Central Subtle Geometric Rosette */}
        <g transform="translate(150, 195)" stroke={palette.patternStroke} fill="none">
          <circle r="76" strokeWidth="0.7" />
          <circle r="58" strokeWidth="0.6" strokeDasharray="3 3" />
          <rect
            x="-42"
            y="-42"
            width="84"
            height="84"
            strokeWidth="0.6"
            transform="rotate(45)"
          />
          <rect x="-42" y="-42" width="84" height="84" strokeWidth="0.6" />
        </g>
      </svg>

      {/* Top Header Row: Category & Verification Status */}
      <div className="relative z-10 flex items-center justify-between text-[11px] tracking-wide border-b pb-2"
        style={{ borderColor: 'rgba(200, 157, 70, 0.22)', color: palette.textAccent }}
      >
        <span className="truncate max-w-[65%] font-medium">{book.category}</span>
        <span className="opacity-85 shrink-0">متن محقق</span>
      </div>

      {/* Center Calligraphic Title */}
      <div className="relative z-10 my-auto px-2 text-center">
        <div
          className="font-display font-bold leading-snug line-clamp-2"
          style={{
            fontSize: size === 'sm' ? '1.15rem' : size === 'lg' ? '1.65rem' : '1.35rem',
            color: palette.textMain,
            textWrap: 'balance',
          }}
        >
          {mainTitle}
        </div>
        {subTitle && size !== 'sm' && (
          <div
            className="mt-1.5 text-xs opacity-80 line-clamp-1 font-normal"
            style={{ color: palette.textAccent }}
          >
            {subTitle}
          </div>
        )}
      </div>

      {/* Bottom Author & Date Colophon */}
      <div
        className="relative z-10 pt-2.5 border-t text-center"
        style={{ borderColor: 'rgba(200, 157, 70, 0.22)' }}
      >
        <div
          className="text-xs font-semibold truncate"
          style={{ color: palette.textAccent }}
        >
          {book.author}
        </div>
        <div className="text-[11px] opacity-75 mt-0.5 truncate">
          {book.year} · {book.chapters_count} فصلاً
        </div>
      </div>
    </div>
  );
};
