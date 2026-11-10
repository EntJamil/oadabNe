import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  List,
  ArrowRight,
  ArrowUpLeft,
} from 'lucide-react';
import {
  AuthorItem,
  BookItem,
  AUTHORS_CATALOG,
  LIBRARY_CATALOG,
} from '../data/catalogData';
import {
  EraFilter,
  HISTORICAL_ERAS,
  filterAuthors,
  getAuthorWorks,
  computeLibraryStats,
} from '../utils/heritageLogic';
import { BookCoverArtwork } from './BookCoverArtwork';
import { AppRoutePage } from './HeaderNav';

interface AuthorsDirectoryViewProps {
  onSelectAuthor: (authorId: string) => void;
  onNavigate: (page: AppRoutePage) => void;
}

export const AuthorsDirectoryView: React.FC<AuthorsDirectoryViewProps> = ({
  onSelectAuthor,
  onNavigate,
}) => {
  const [selectedEra, setSelectedEra] = useState<EraFilter>('all');
  const [authorQuery, setAuthorQuery] = useState('');
  const [onlyWithBooks, setOnlyWithBooks] = useState(false);

  const stats = useMemo(
    () => computeLibraryStats(LIBRARY_CATALOG, AUTHORS_CATALOG, 1692),
    []
  );

  const filteredAuthors = useMemo(
    () =>
      filterAuthors(
        AUTHORS_CATALOG,
        {
          era: selectedEra,
          query: authorQuery,
          onlyWithBooks,
        },
        LIBRARY_CATALOG
      ),
    [selectedEra, authorQuery, onlyWithBooks]
  );

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-8">
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
            className="px-4 py-2 text-xs font-bold rounded-lg shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#FFFFFF',
            }}
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

        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>خزانة تراجم الأعلام</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span className="tabular-nums">{stats.totalAuthors} علماً ومؤلفاً</span>
        </div>
      </div>

      {/* Directory Editorial Header */}
      <header
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
          دليل أعلام الفكر والأدب والتراث العربي
        </div>
        <h1
          className="font-display text-3xl lg:text-4xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          تراجم المؤلفين والأدباء والحكماء عبر العصور
        </h1>
        <p
          className="text-base leading-relaxed max-w-[68ch] mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          استعرض سير وتراجم أئمة البيان والتاريخ والفلسفة والشعر العربي من العصر
          الجاهلي وصدر الإسلام مروراً بالعصر العباسي والأندلسي حتى رواد النهضة
          الأدبية الحديثة، مع وصول مباشر إلى مصنفاتهم المحققة في الخزانة.
        </p>

        {/* Search & Era Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="search"
              value={authorQuery}
              onChange={(e) => setAuthorQuery(e.target.value)}
              placeholder="ابحث باسم الأديب أو المؤرخ (مثل: الجاحظ، ابن خلدون، ابن حزم، العقاد، الغزالي)..."
              aria-label="ابحث في أسماء وسير الأدباء"
              className="w-full pr-11 pl-4 py-2.5 text-sm rounded-lg border focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium cursor-pointer select-none whitespace-nowrap shrink-0"
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <input
              type="checkbox"
              checked={onlyWithBooks}
              onChange={(e) => setOnlyWithBooks(e.target.checked)}
              className="rounded accent-amber-700"
            />
            <span>الأعلام المتاح لهم كتب فقط</span>
          </label>
        </div>

        {/* Historical Era Timeline Tabs */}
        <div
          className="flex flex-wrap items-center gap-2 pt-4 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
          role="tablist"
          aria-label="تصفية حسب العصر التاريخي"
        >
          {HISTORICAL_ERAS.map((era) => {
            const isSelected = selectedEra === era.id;
            const count = stats.eraCounts[era.id] || 0;
            return (
              <button
                key={era.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedEra(era.id)}
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
                <span>{era.label}</span>
                <span className="mr-1.5 opacity-80 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Results Summary */}
      <div
        className="flex items-center justify-between gap-4 pb-3 mb-6 border-b text-xs"
        style={{
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <span>
          عرض <strong className="tabular-nums">{filteredAuthors.length}</strong> من أصل{' '}
          <strong className="tabular-nums">{stats.totalAuthors}</strong> أديباً ومفكراً
        </span>
        <span>انقر على بطاقة العلم لاستعراض سيرته الكاملة ومصنفاته</span>
      </div>

      {/* Authors Grid */}
      {filteredAuthors.length === 0 ? (
        <div
          className="rounded-xl border py-16 px-6 text-center"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <h3 className="font-display text-2xl font-bold mb-2">
            لم نجد علماً يطابق بحثك الحالي
          </h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            جرّب البحث بجزء من الاسم أو اختيار «جميع العصور» أعلاه.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedEra('all');
              setAuthorQuery('');
              setOnlyWithBooks(false);
            }}
            className="px-5 py-2.5 text-xs font-semibold rounded-lg text-white cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            عرض جميع الأعلام ({stats.totalAuthors})
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="authors-directory-grid"
        >
          {filteredAuthors.map((author) => {
            const works = getAuthorWorks(author, LIBRARY_CATALOG);
            const monogram = author.name.trim().charAt(0) || 'أ';

            return (
              <article
                key={author.id}
                className="rounded-xl border p-6 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div>
                  {/* Author Header Lockup */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl font-bold shrink-0 border"
                      style={{
                        backgroundColor: '#1E1610',
                        color: '#E5C168',
                        borderColor: 'rgba(212, 175, 55, 0.4)',
                      }}
                      aria-hidden="true"
                    >
                      {monogram}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2
                        className="font-display text-xl font-bold leading-snug"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectAuthor(author.id)}
                          className="text-right hover:underline cursor-pointer"
                        >
                          {author.name}
                        </button>
                      </h2>
                      {/* Clean Unboxed Metadata */}
                      <div
                        className="flex flex-wrap items-center gap-1.5 text-xs mt-1"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <span>{author.era_name}</span>
                        <span aria-hidden="true">·</span>
                        <span>{author.death_hijri ? `ت ${author.death_hijri}` : author.birth_death}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scholarly Epithet */}
                  <div
                    className="text-xs font-semibold mb-2.5"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {author.title}
                  </div>

                  {/* Bio Excerpt */}
                  <p
                    className="text-sm leading-relaxed line-clamp-3 mb-4"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {author.bio}
                  </p>

                  {/* Unboxed Specialties Line */}
                  {author.specialties && author.specialties.length > 0 && (
                    <div
                      className="text-xs pb-4"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span>الميادين: </span>
                      <span>{author.specialties.slice(0, 3).join(' · ')}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div
                  className="pt-3.5 border-t flex items-center justify-between gap-2 text-xs"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <span
                    className="font-medium tabular-nums"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {works.length > 0
                      ? `${works.length} مصنفات بالخزانة`
                      : 'من أعلام النهضة والتراث'}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectAuthor(author.id)}
                    className="inline-flex items-center gap-1 font-semibold hover:underline cursor-pointer"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    <span>السيرة والمؤلفات</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface AuthorProfileViewProps {
  author: AuthorItem;
  onSelectAuthor: (authorId: string) => void;
  onOpenReader: (bookId: string, chapterId?: number) => void;
  onOpenChaptersModal: (book: BookItem) => void;
  onNavigate: (page: AppRoutePage) => void;
}

export const AuthorProfileView: React.FC<AuthorProfileViewProps> = ({
  author,
  onSelectAuthor,
  onOpenReader,
  onOpenChaptersModal,
  onNavigate,
}) => {
  const authorWorks = useMemo(
    () => getAuthorWorks(author, LIBRARY_CATALOG),
    [author]
  );

  const eraPeers = useMemo(
    () =>
      AUTHORS_CATALOG.filter(
        (a) => a.era_id === author.era_id && a.id !== author.id
      ).slice(0, 6),
    [author]
  );

  const monogram = author.name.trim().charAt(0) || 'أ';

  return (
    <div className="max-w-[1140px] mx-auto px-6 py-8">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="مسار التنقل"
        className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b text-xs"
        style={{
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:underline font-medium cursor-pointer"
            style={{ color: 'var(--accent-primary)' }}
          >
            الرئيسية
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() => onNavigate('authors')}
            className="hover:underline font-medium cursor-pointer"
            style={{ color: 'var(--accent-primary)' }}
          >
            دليل الأدباء والمؤلفين
          </button>
          <span aria-hidden="true">/</span>
          <span style={{ color: 'var(--text-primary)' }}>{author.name}</span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('authors')}
          className="inline-flex items-center gap-1.5 font-semibold hover:underline cursor-pointer"
          style={{ color: 'var(--accent-primary)' }}
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة إلى دليل المؤلفين</span>
        </button>
      </nav>

      {/* Museum Monograph Header & Accession Metadata Grid */}
      <section
        className="rounded-xl border p-8 mb-8"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex flex-col md:flex-row items-start gap-6 pb-8 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-display text-3xl font-bold shrink-0 border"
            style={{
              backgroundColor: '#1E1610',
              color: '#E5C168',
              borderColor: 'rgba(212, 175, 55, 0.45)',
            }}
            aria-hidden="true"
          >
            {monogram}
          </div>

          <div className="flex-1">
            <div
              className="text-xs font-semibold mb-1.5"
              style={{ color: 'var(--accent-primary)' }}
            >
              ترجمة علمية موثقة · {author.era_name}
            </div>
            <h1
              className="font-display text-3xl lg:text-4xl font-bold mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              {author.name}
            </h1>
            <div
              className="text-sm mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {author.full_name}
            </div>
            <div
              className="text-base font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {author.title}
            </div>
          </div>
        </div>

        {/* Accession Metadata Definition List (Pattern B) */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-sm">
          <div>
            <dt className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              الحقبة التاريخية
            </dt>
            <dd className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {author.era_name}
            </dd>
          </div>
          <div>
            <dt className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              التواريخ (الميلاد والوفاة)
            </dt>
            <dd className="font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {author.birth_death}
            </dd>
          </div>
          <div>
            <dt className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              الموطن والحواضر العلمية
            </dt>
            <dd className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {author.origin}
            </dd>
          </div>
          <div>
            <dt className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              المصنفات المتاحة بالخزانة
            </dt>
            <dd className="font-semibold tabular-nums" style={{ color: 'var(--accent-primary)' }}>
              {authorWorks.length} مؤلفات محققة
            </dd>
          </div>
        </dl>
      </section>

      {/* Biography & Editorial Pull Quote */}
      <section
        className="rounded-xl border p-8 mb-8"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <h2
          className="font-display text-2xl font-bold mb-4 pb-3 border-b"
          style={{
            color: 'var(--text-primary)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          السيرة والمكانة الفكرية والأدبية
        </h2>

        <p
          className="text-base leading-loose max-w-[72ch] mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          {author.bio}
        </p>

        {/* Editorial Pull Quote (Framed by top/bottom hairline dividers, NO thick left accent bar) */}
        {author.famous_quote && (
          <blockquote
            className="my-6 py-6 px-6 border-t border-b text-center max-w-3xl mx-auto"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div
              className="text-xs font-semibold mb-2"
              style={{ color: 'var(--accent-primary)' }}
            >
              من درر وأقوال {author.name}
            </div>
            <p
              className="font-display text-xl lg:text-2xl italic leading-relaxed"
              style={{ color: 'var(--text-primary)' }}
            >
              {author.famous_quote}
            </p>
          </blockquote>
        )}

        {author.specialties && author.specialties.length > 0 && (
          <div
            className="pt-4 border-t text-xs flex flex-wrap items-center gap-2"
            style={{
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              الاختصاصات والميادين العلمية:
            </span>
            <span>{author.specialties.join(' · ')}</span>
          </div>
        )}
      </section>

      {/* Author's Works in the Library */}
      <section className="mb-10">
        <div
          className="flex items-baseline justify-between gap-4 pb-3 mb-6 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <h2
            className="font-display text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            مؤلفات {author.name} في خزانة أدب أمتنا ({authorWorks.length})
          </h2>
        </div>

        {authorWorks.length === 0 ? (
          <div
            className="rounded-xl border p-8 text-center"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              يجري حالياً استكمال التدقيق النصي وفحص حالة الملك العام لمصنفات «{author.name}» لإدراجها ضمن القارئ التفاعلي.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-white cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              استعراض الكتب الـ ٦٦ المكتملة في الخزانة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorWorks.map((book) => (
              <article
                key={book.id}
                className="rounded-xl border overflow-hidden flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div>
                  <div
                    onClick={() => onOpenReader(book.id, 1)}
                    className="cursor-pointer"
                  >
                    <BookCoverArtwork book={book} size="sm" />
                  </div>
                  <div className="p-5">
                    <div
                      className="text-xs mb-1.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {book.category} · {book.chapters_count} فصلاً ·{' '}
                      {(book.words_count || 0).toLocaleString('en-US')} كلمة
                    </div>
                    <h3
                      className="font-display text-xl font-bold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {book.title}
                    </h3>
                    <p
                      className="text-xs leading-relaxed line-clamp-3"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {book.description}
                    </p>
                  </div>
                </div>
                <div
                  className="px-5 py-3 border-t flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onOpenReader(book.id, 1)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-lg cursor-pointer"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>اقرأ الكتاب</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenChaptersModal(book)}
                    className="px-3 py-2 text-xs font-medium rounded-lg border cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-strong)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <List className="w-3.5 h-3.5 inline ml-1" />
                    <span>الفهرس</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Contemporaneous Scholars from the Same Era */}
      {eraPeers.length > 0 && (
        <section>
          <h2
            className="font-display text-xl font-bold pb-3 mb-4 border-b"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            أعلام ومؤلفون آخرون من {author.era_name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eraPeers.map((peer) => (
              <button
                key={peer.id}
                type="button"
                onClick={() => onSelectAuthor(peer.id)}
                className="text-right rounded-xl border p-4 flex items-center justify-between gap-3 transition-colors hover:opacity-90 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="min-w-0">
                  <div
                    className="font-display text-lg font-bold truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {peer.name}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {peer.title}
                  </div>
                </div>
                <ArrowUpLeft
                  className="w-4 h-4 shrink-0"
                  style={{ color: 'var(--accent-primary)' }}
                />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
