import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  List,
  Bookmark,
  SlidersHorizontal,
  ArrowUpLeft,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import {
  BookItem,
  LIBRARY_CATALOG,
  AUTHORS_CATALOG,
} from '../data/catalogData';
import {
  PillarFilter,
  BookSortOption,
  PILLAR_CATEGORIES,
  filterBooks,
  computeLibraryStats,
} from '../utils/heritageLogic';
import { BookCoverArtwork } from './BookCoverArtwork';
import { AppRoutePage } from './HeaderNav';

export type ThemeMode = 'sepia' | 'white' | 'andalusia' | 'night';

export interface SavedBookmark {
  bookId: string;
  bookTitle: string;
  author: string;
  chapterId: number;
  chapterTitle: string;
  savedAt: string;
}

interface CatalogViewProps {
  selectedPillar: PillarFilter;
  onSelectPillar: (pillar: PillarFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onOpenReader: (bookId: string, chapterId?: number) => void;
  onOpenChaptersModal: (book: BookItem) => void;
  onSelectAuthor: (authorId: string) => void;
  onNavigate: (page: AppRoutePage) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  bookmarks: SavedBookmark[];
  onRemoveBookmark: (bookId: string, chapterId: number) => void;
}

const HERO_IMAGE_URL = '/src/assets/images/hero_arabic_manuscript_library_1794328074400.jpg';

export const CatalogView: React.FC<CatalogViewProps> = ({
  selectedPillar,
  onSelectPillar,
  searchQuery,
  onSearchQueryChange,
  onOpenReader,
  onOpenChaptersModal,
  onSelectAuthor,
  onNavigate,
  theme,
  onThemeChange,
  bookmarks,
  onRemoveBookmark,
}) => {
  const [sortBy, setSortBy] = useState<BookSortOption>('curated');
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const stats = useMemo(
    () => computeLibraryStats(LIBRARY_CATALOG, AUTHORS_CATALOG, 1692),
    []
  );

  const filteredBooks = useMemo(
    () =>
      filterBooks(LIBRARY_CATALOG, {
        pillar: selectedPillar,
        query: searchQuery,
        sortBy,
      }),
    [selectedPillar, searchQuery, sortBy]
  );

  const displayedBooks = useMemo(
    () => filteredBooks.slice(0, visibleCount),
    [filteredBooks, visibleCount]
  );

  const featuredBook = useMemo(
    () =>
      LIBRARY_CATALOG.find((b) => b.id === 'muqaddimah_ibn_khaldun') ||
      LIBRARY_CATALOG[0],
    []
  );

  const themeOptions: { id: ThemeMode; label: string }[] = [
    { id: 'sepia', label: 'الورق التراثي' },
    { id: 'white', label: 'النهاري الصافي' },
    { id: 'andalusia', label: 'الأندلسي الهادئ' },
    { id: 'night', label: 'الليلي الملكي' },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-8">
      {/* Operational Utility & Theme Strip */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b text-xs"
        style={{
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            الأرشيف الرقمي المفتوح
          </span>
          <span aria-hidden="true">·</span>
          <span>متون عربية محققة ومفهرسة</span>
          <span aria-hidden="true">·</span>
          <span>تحديث الفهرس: نوفمبر ٢٠٢٦</span>
        </div>

        {/* Interactive Reading Theme Switcher */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-medium">مظهر القراءة:</span>
          <div
            className="inline-flex items-center gap-1 p-1 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
            role="group"
            aria-label="اختيار مظهر القراءة"
          >
            {themeOptions.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onThemeChange(t.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active ? 'shadow-xs font-semibold' : 'opacity-75 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: active ? 'var(--bg-surface)' : 'transparent',
                    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 1: Institutional Hero Split (2-Column Balanced Stretch) */}
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Right Column in RTL (7 cols): Editorial Headline & Mission */}
          <div
            className="lg:col-span-7 rounded-xl border p-8 lg:p-10 flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div>
              <div
                className="text-xs font-semibold mb-3"
                style={{ color: 'var(--accent-primary)' }}
              >
                الموسوعة الرقمية الشاملة لعيون التراث والتاريخ العربي
              </div>

              <h1
                className="font-display font-bold leading-[1.42] mb-4"
                style={{
                  fontSize: 'clamp(2.1rem, 3.5vw, 3.15rem)',
                  color: 'var(--text-primary)',
                  textWrap: 'balance',
                }}
              >
                خزانة أمهات الكتب والمتون العربية المحقَّقة
              </h1>

              <p
                className="text-base leading-relaxed max-w-[65ch] mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                نقدم نصوصاً تراثية مكتملة اجتازت فحوص الفصول والمصادر وحقوق إعادة
                النشر، مع قارئ عربي تفاعلي يدعم ضبط التشكيل والخطوط الأصيلة،
                وفهارس منظمة، ومحرك بحث شامل في آلاف الفصول والأبواب.
              </p>
            </div>

            <div>
              {/* Primary Action & Secondary Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenReader('kalila_wa_dimna', 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>بدء المطالعة التفاعلية</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Search className="w-4 h-4" />
                  <span>البحث في المتون والفصول</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('authors')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <span>تصفح دليل الأعلام ({stats.totalAuthors})</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Left Column in RTL (5 cols): Archival Visual Showcase */}
          <div
            className="lg:col-span-5 rounded-xl border overflow-hidden relative min-h-[300px] flex flex-col justify-end"
            style={{
              backgroundColor: '#1C1610',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {!heroImgFailed ? (
              <img
                src={HERO_IMAGE_URL}
                alt="قاعة المخطوطات والمطالعة التراثية في موسوعة أدب أمتنا"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center p-8 text-center"
                style={{
                  background:
                    'radial-gradient(circle at 50% 35%, #2D2115 0%, #140F0A 100%)',
                }}
              >
                <div className="font-display text-3xl text-amber-200/80">
                  أَدَبُ أُمَّتِنَا — دار الكتب التراثية
                </div>
              </div>
            )}

            {/* Measured Contrast Scrim */}
            <div className="relative z-10 p-6 bg-gradient-to-t from-black/90 via-black/55 to-transparent text-stone-100">
              <div className="text-xs text-amber-300 font-medium mb-1">
                درة المصنفات المختارة · تحقيق وتوثيق
              </div>
              <h2 className="font-display text-xl font-bold text-white mb-1">
                {featuredBook.title}
              </h2>
              <p className="text-xs text-stone-300 mb-3 line-clamp-2">
                {featuredBook.author} · {featuredBook.category} ·{' '}
                {featuredBook.chapters_count} فصلاً
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenReader(featuredBook.id, 1)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-amber-600 hover:bg-amber-500 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  مطالعة المقدمة
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChaptersModal(featuredBook)}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-white/15 hover:bg-white/25 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  استعراض الفهرس
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Archival Metric Strip Below Hero */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
          aria-label="إحصائيات الموسوعة"
        >
          <div
            className="rounded-xl border px-5 py-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div
              className="font-mono-nums text-2xl font-bold"
              style={{ color: 'var(--accent-primary)' }}
            >
              {stats.totalBooks} كتاباً
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              الكتب والمصنفات المكتملة المتاحة للمطالعة
            </div>
          </div>

          <div
            className="rounded-xl border px-5 py-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div
              className="font-mono-nums text-2xl font-bold"
              style={{ color: 'var(--accent-primary)' }}
            >
              {stats.totalAuthors} علماً
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              المؤلفون والأدباء والأعلام عبر ٦ عصور تاريخية
            </div>
          </div>

          <div
            className="rounded-xl border px-5 py-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div
              className="font-mono-nums text-2xl font-bold"
              style={{ color: 'var(--accent-primary)' }}
            >
              1,692 فصلاً
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              الفصول والأبواب المفهرسة في محرك البحث النصي
            </div>
          </div>

          <div
            className="rounded-xl border px-5 py-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div
              className="font-mono-nums text-2xl font-bold"
              style={{ color: 'var(--accent-primary)' }}
            >
              {stats.totalWords.toLocaleString('en-US')}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              إجمالي كلمات المتون العربية المحققة في الخزانة
            </div>
          </div>
        </div>
      </section>

      {/* Saved Bookmarks Bar (if user has saved reading bookmarks) */}
      {bookmarks.length > 0 && (
        <section
          aria-label="الإشارات المرجعية المحفوظة"
          className="mb-8 rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-strong)',
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              <Bookmark className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span>إشاراتك المرجعية المحفوظة ({bookmarks.length})</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              استأنف القراءة من حيث توقفت
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookmarks.map((bm) => (
              <div
                key={`${bm.bookId}-${bm.chapterId}`}
                className="rounded-lg border px-4 py-3 flex items-center justify-between gap-3"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="min-w-0">
                  <div className="font-display font-bold text-base truncate" style={{ color: 'var(--text-primary)' }}>
                    {bm.bookTitle}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    الفصل {bm.chapterId}: {bm.chapterTitle}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenReader(bm.bookId, bm.chapterId)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md text-white cursor-pointer"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    متابعة
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveBookmark(bm.bookId, bm.chapterId)}
                    aria-label={`حذف إشارة ${bm.bookTitle}`}
                    className="px-2 py-1 text-xs rounded hover:opacity-75 cursor-pointer"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Primary Workspace Switcher & Search/Filter Toolbar */}
      <section className="mb-10" aria-label="أدوات التصفح والفلترة">
        {/* 3 Main Encyclopedia Mode Tabs (Matching oadab.com's 3 primary modes cleanly) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div
            className="inline-flex items-center gap-1 p-1.5 rounded-xl border overflow-x-auto max-w-full"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2 text-xs font-bold rounded-lg shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF',
              }}
            >
              تصفح الكتب والمصنفات ({stats.totalBooks})
            </button>
            <button
              type="button"
              onClick={() => onNavigate('authors')}
              className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              تصفح الأدباء والمؤلفين ({stats.totalAuthors})
            </button>
            <button
              type="button"
              onClick={() => onNavigate('search')}
              className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              البحث في المتون والفصول (1,692)
            </button>
          </div>

          {/* Sort Order Control */}
          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            <label htmlFor="catalog-sort" className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              ترتيب العرض:
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as BookSortOption)}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium focus:outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="curated">الترتيب المنهجي المختار</option>
              <option value="words_desc">الأغزر مادةً (عدد الكلمات)</option>
              <option value="chapters_desc">الأكثر أبواباً وفصولاً</option>
              <option value="title_asc">الترتيب الهجائي للعناوين</option>
            </select>
          </div>
        </div>

        {/* Search Input Box & Curatorial Pillar Filter Bar */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  onSearchQueryChange(e.target.value);
                  setVisibleCount(24);
                }}
                placeholder="ابحث في عناوين الكتب، أسماء المؤرخين والأدباء، العصور التاريخية، أو الموضوعات..."
                aria-label="ابحث في عناوين الكتب والمؤلفين"
                className="w-full pr-11 pl-4 py-2.5 text-sm rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => onSearchQueryChange('')}
                className="px-4 py-2.5 text-xs font-medium rounded-lg border whitespace-nowrap shrink-0 cursor-pointer"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                مسح البحث
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('search')}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg text-white whitespace-nowrap shrink-0 cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              البحث العميق داخل النصوص
            </button>
          </div>

          {/* Interactive Pillar Filter Controls (Segmented Functional Buttons) */}
          <div
            className="flex flex-wrap items-center gap-2 pt-2 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
            role="tablist"
            aria-label="تصنيفات الكتب التراثية"
          >
            {PILLAR_CATEGORIES.map((cat) => {
              const isSelected = selectedPillar === cat.id;
              const count = stats.pillarCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectPillar(cat.id);
                    setVisibleCount(24);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected ? 'font-bold shadow-xs' : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--accent-primary)'
                      : 'var(--bg-canvas)',
                    borderColor: isSelected
                      ? 'var(--accent-primary)'
                      : 'var(--border-subtle)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <span>{cat.label}</span>
                  <span className="mr-1.5 opacity-80 tabular-nums">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Section Heading & Results Count */}
      <section aria-label="قائمة أمهات المؤلفات التراثية">
        <div
          className="flex flex-wrap items-baseline justify-between gap-4 pb-4 mb-6 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <h2
              className="font-display text-2xl lg:text-3xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              أمهات المؤلفات التراثية والتاريخية المتاحة
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {
                PILLAR_CATEGORIES.find((c) => c.id === selectedPillar)
                  ?.description
              }
            </p>
          </div>
          <div
            className="text-xs font-medium tabular-nums"
            style={{ color: 'var(--text-secondary)' }}
          >
            عرض {displayedBooks.length} من أصل {filteredBooks.length} كتاباً مطابقاً
          </div>
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 ? (
          <div
            className="rounded-xl border py-16 px-6 text-center"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <h3
              className="font-display text-2xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              لم نعثر على مؤلفات تطابق معايير البحث الحالية
            </h3>
            <p
              className="text-sm max-w-md mx-auto mb-6"
              style={{ color: 'var(--text-muted)' }}
            >
              جرّب البحث بكلمة مفردة (مثل: الجاحظ، ابن خلدون، الأغاني، المعلقات) أو
              إعادة ضبط التصنيف لعرض جميع الكتب الـ ٦٦.
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectPillar('all');
                onSearchQueryChange('');
              }}
              className="px-5 py-2.5 text-xs font-semibold rounded-lg text-white cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              إعادة عرض جميع المؤلفات (66)
            </button>
          </div>
        ) : (
          <>
            {/* Books Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-testid="books-catalog-grid"
            >
              {displayedBooks.map((book) => (
                <article
                  key={book.id}
                  className="rounded-xl border overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div>
                    {/* Clickable Book Cover */}
                    <div
                      onClick={() => onOpenReader(book.id, 1)}
                      className="cursor-pointer"
                    >
                      <BookCoverArtwork book={book} size="md" />
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
                      <div
                        className="flex flex-wrap items-center gap-1.5 text-xs mb-2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <span>{book.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.year}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{book.chapters_count} فصلاً</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          {(book.words_count || 0).toLocaleString('en-US')} كلمة
                        </span>
                      </div>

                      {/* Book Title */}
                      <h3
                        className="font-display text-xl font-bold leading-snug mb-1.5"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenReader(book.id, 1)}
                          className="text-right hover:underline cursor-pointer"
                        >
                          {book.title}
                        </button>
                      </h3>

                      {/* Author Link */}
                      <div className="mb-3">
                        <button
                          type="button"
                          onClick={() => onSelectAuthor(book.author_id)}
                          className="text-xs font-semibold hover:underline cursor-pointer"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          المؤلف: {book.author}
                        </button>
                      </div>

                      {/* Editorial Description */}
                      <p
                        className="text-sm leading-relaxed line-clamp-3"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {book.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div
                    className="px-5 py-3.5 border-t flex items-center justify-between gap-3"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenReader(book.id, 1)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>اقرأ الكتاب</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenChaptersModal(book)}
                      aria-label={`فهرس فصول ${book.title}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-strong)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>الفهرس ({book.chapters_count})</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination / Show More Controls */}
            {visibleCount < filteredBooks.length && (
              <div className="mt-10 text-center flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-6 py-3 text-sm font-semibold rounded-lg text-white transition-colors cursor-pointer"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  عرض المزيد من المؤلفات ({filteredBooks.length - visibleCount} متبقية)
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleCount(filteredBooks.length)}
                  className="px-5 py-3 text-sm font-medium rounded-lg border transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-primary)',
                  }}
                >
                  عرض جميع الكتب ({filteredBooks.length})
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
