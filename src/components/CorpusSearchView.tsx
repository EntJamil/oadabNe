import React, { useState, useMemo } from 'react';
import { Search, BookOpen, SlidersHorizontal, ArrowUpLeft } from 'lucide-react';
import {
  SearchRecord,
  LIBRARY_CATALOG,
  AUTHORS_CATALOG,
} from '../data/catalogData';
import {
  PillarFilter,
  PILLAR_CATEGORIES,
  searchCorpus,
  computeLibraryStats,
} from '../utils/heritageLogic';
import { AppRoutePage } from './HeaderNav';

interface CorpusSearchViewProps {
  corpusRecords: SearchRecord[];
  isLoadingCorpus: boolean;
  initialQuery?: string;
  onOpenReader: (bookId: string, chapterId: number) => void;
  onSelectAuthor: (authorId: string) => void;
  onNavigate: (page: AppRoutePage) => void;
}

const SUGGESTED_QUERIES = [
  'العمران البشري',
  'دبشليم الملك',
  'شهريار وشهرزاد',
  'الشعر والبلاغة',
  'قرطبة والأندلس',
  'الحكمة والأخلاق',
];

export const CorpusSearchView: React.FC<CorpusSearchViewProps> = ({
  corpusRecords,
  isLoadingCorpus,
  initialQuery = '',
  onOpenReader,
  onSelectAuthor,
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery || 'الحكمة');
  const [selectedPillar, setSelectedPillar] = useState<PillarFilter>('all');
  const [selectedBookId, setSelectedBookId] = useState<string>('all');

  const stats = useMemo(
    () =>
      computeLibraryStats(
        LIBRARY_CATALOG,
        AUTHORS_CATALOG,
        corpusRecords.length || 1692
      ),
    [corpusRecords.length]
  );

  const searchResults = useMemo(
    () =>
      searchCorpus(
        corpusRecords,
        query,
        {
          pillar: selectedPillar,
          bookId: selectedBookId,
          limit: 60,
        },
        LIBRARY_CATALOG
      ),
    [corpusRecords, query, selectedPillar, selectedBookId]
  );

  // Highlight query words cleanly in snippet
  const renderHighlightedSnippet = (snippet: string, rawQ: string) => {
    const cleanQ = rawQ.trim();
    if (!cleanQ) return snippet;
    const tokens = cleanQ
      .split(/\s+/)
      .filter((t) => t.length >= 2)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (tokens.length === 0) return snippet;

    const regex = new RegExp(`(${tokens.join('|')})`, 'gi');
    const parts = snippet.split(regex);
    return parts.map((part, idx) =>
      regex.test(part) ? (
        <mark
          key={idx}
          className="px-1 rounded font-semibold"
          style={{
            backgroundColor: 'rgba(179, 135, 40, 0.28)',
            color: 'var(--text-primary)',
          }}
        >
          {part}
        </mark>
      ) : (
        <React.Fragment key={idx}>{part}</React.Fragment>
      )
    );
  };

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8">
      {/* Top Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
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
            className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
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
            className="px-4 py-2 text-xs font-bold rounded-lg shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#FFFFFF',
            }}
          >
            البحث في المتون والفصول ({corpusRecords.length.toLocaleString('en-US')})
          </button>
        </div>

        <div className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {isLoadingCorpus
            ? 'جاري استكمال فهرس المتون...'
            : `فهرس المتون جاهز: ${corpusRecords.length.toLocaleString('en-US')} فصلاً ومقتطفاً معتمداً`}
        </div>
      </div>

      {/* Search Engine Header & Input Box */}
      <section
        className="rounded-xl border p-8 mb-8"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div
          className="text-xs font-semibold mb-2"
          style={{ color: 'var(--accent-primary)' }}
        >
          محرك البحث الدقيق في متون التراث العربي والإسلامي
        </div>
        <h1
          className="font-display text-3xl lg:text-4xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          البحث الشامل داخل نصوص وفصول الكتب
        </h1>
        <p
          className="text-base leading-relaxed max-w-[68ch] mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          ابحث عن عبارات، شواهد شعرية، مصطلحات فلسفية، أو أحداث تاريخية عبر{' '}
          <span className="tabular-nums font-semibold">
            {corpusRecords.length.toLocaleString('en-US')}
          </span>{' '}
          فصلاً وباباً من أمهات الكتب المحققة، مع مطابقة ذكية تتجاوز فروق الهمزات
          والتشكيل.
        </p>

        {/* Primary Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب كلمة أو جملة للبحث في بطون الكتب (مثال: العمران البشري، دبشليم، الأندلس)..."
              aria-label="ابحث في نصوص وفصول الكتب"
              className="w-full pr-11 pl-4 py-3 text-sm rounded-lg border focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderColor: 'var(--border-strong)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Book Filter Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              className="w-4 h-4 shrink-0"
              style={{ color: 'var(--text-muted)' }}
            />
            <select
              aria-label="تخصيص البحث في كتاب محدد"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="px-3.5 py-3 text-xs font-medium rounded-lg border max-w-[240px] focus:outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="all">جميع الكتب (66 مصنفاً)</option>
              {LIBRARY_CATALOG.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Curated Search Terms */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
          <span style={{ color: 'var(--text-muted)' }}>موضوعات مقترحة للبحث:</span>
          {SUGGESTED_QUERIES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className={`px-3 py-1 rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                query === term ? 'font-bold' : 'hover:opacity-85'
              }`}
              style={{
                backgroundColor:
                  query === term ? 'var(--accent-soft)' : 'var(--bg-canvas)',
                borderColor:
                  query === term ? 'var(--accent-primary)' : 'var(--border-subtle)',
                color:
                  query === term ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Pillar Filter Row */}
        <div
          className="flex flex-wrap items-center gap-2 pt-4 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {PILLAR_CATEGORIES.map((cat) => {
            const active = selectedPillar === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedPillar(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'font-bold' : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: active
                    ? 'var(--accent-primary)'
                    : 'var(--bg-canvas)',
                  borderColor: active
                    ? 'var(--accent-primary)'
                    : 'var(--border-subtle)',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                {cat.shortLabel}
              </button>
            );
          })}
        </div>
      </section>

      {/* Search Results Status Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 pb-3 mb-6 border-b text-xs"
        style={{
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <div>
          {query.trim().length < 2 ? (
            <span>اكتب حرفين على الأقل للبدء في استكشاف الشواهد والفصول.</span>
          ) : (
            <span>
              تم العثور على{' '}
              <strong className="tabular-nums">{searchResults.length}</strong> فصلاً
              مطابقاً لعبارة: «<strong>{query}</strong>»
            </span>
          )}
        </div>
        <div className="tabular-nums" style={{ color: 'var(--text-muted)' }}>
          نطاق الفحص: {corpusRecords.length.toLocaleString('en-US')} فصلاً
        </div>
      </div>

      {/* Results List */}
      {searchResults.length === 0 ? (
        <div
          className="rounded-xl border py-16 px-6 text-center"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <h3 className="font-display text-2xl font-bold mb-2">
            لم نعثر على شواهد مطابقة لعبارة «{query}»
          </h3>
          <p
            className="text-sm max-w-md mx-auto mb-5"
            style={{ color: 'var(--text-muted)' }}
          >
            جرّب كتابة الكلمة المجردة بدون لواحق، أو اختر أحد الموضوعات المقترحة
            أعلاه.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('الحكمة');
              setSelectedPillar('all');
              setSelectedBookId('all');
            }}
            className="px-5 py-2.5 text-xs font-semibold rounded-lg text-white cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            استعراض شواهد «الحكمة»
          </button>
        </div>
      ) : (
        <div className="space-y-4" data-testid="corpus-search-results">
          {searchResults.map(({ record, book, snippet }, index) => (
            <article
              key={`${record.book_id}-${record.chapter}-${index}`}
              className="rounded-xl border p-6 transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              {/* Clean Unboxed Metadata Header */}
              <div
                className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenReader(record.book_id, 1)}
                    className="font-semibold hover:underline cursor-pointer"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {record.book}
                  </button>
                  <span aria-hidden="true">·</span>
                  <span>المؤلف: {record.author}</span>
                  {book && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{book.category}</span>
                    </>
                  )}
                </div>
                <span className="font-mono-nums font-semibold">
                  الفصل {record.chapter}
                </span>
              </div>

              {/* Chapter Title */}
              <h2
                className="font-display text-xl font-bold mb-2.5"
                style={{ color: 'var(--text-primary)' }}
              >
                <button
                  type="button"
                  onClick={() => onOpenReader(record.book_id, record.chapter)}
                  className="text-right hover:underline cursor-pointer"
                >
                  {record.title}
                </button>
              </h2>

              {/* Contextual Excerpt with Highlighting */}
              <p
                className="font-reading text-lg leading-relaxed mb-4 p-4 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                {renderHighlightedSnippet(snippet, query)}
              </p>

              {/* Result Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {book ? (
                  <button
                    type="button"
                    onClick={() => onSelectAuthor(book.author_id)}
                    className="hover:underline font-medium cursor-pointer"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    سيرة المؤلف: {record.author}
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>
                    المؤلف: {record.author}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => onOpenReader(record.book_id, record.chapter)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white transition-colors cursor-pointer"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>مطالعة الفصل في القارئ</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
