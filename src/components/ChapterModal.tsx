import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, ExternalLink } from 'lucide-react';
import { BookItem, TocEntry, INITIAL_BOOK_TOCS } from '../data/catalogData';
import { normalizeArabicText, PillarFilter } from '../utils/heritageLogic';

interface ChapterModalProps {
  book: BookItem | null;
  fullTocMap: Record<string, TocEntry[]>;
  onClose: () => void;
  onSelectChapter: (bookId: string, chapterId: number) => void;
  onSelectAuthor: (authorId: string) => void;
}

export const ChapterModal: React.FC<ChapterModalProps> = ({
  book,
  fullTocMap,
  onClose,
  onSelectChapter,
  onSelectAuthor,
}) => {
  const [chapterQuery, setChapterQuery] = useState('');

  const tocList = useMemo(() => {
    if (!book) return [];
    const fromFull = fullTocMap[book.id];
    if (fromFull && fromFull.length > 0) return fromFull;
    const fromInitial = INITIAL_BOOK_TOCS[book.id];
    if (fromInitial && fromInitial.length > 0) return fromInitial;
    return Array.from({ length: Math.min(30, book.chapters_count || 10) }, (_, i) => ({
      id: i + 1,
      title: `الفصل ${i + 1} من ${book.title}`,
      subtitle: book.author,
    }));
  }, [book, fullTocMap]);

  const filteredToc = useMemo(() => {
    const q = normalizeArabicText(chapterQuery);
    if (!q) return tocList;
    return tocList.filter(
      (item) =>
        normalizeArabicText(item.title).includes(q) ||
        normalizeArabicText(item.subtitle).includes(q) ||
        String(item.id).includes(q)
    );
  }, [tocList, chapterQuery]);

  if (!book) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[86vh] rounded-xl border flex flex-col overflow-hidden shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="px-6 py-4 border-b flex items-start justify-between gap-4"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div>
            <div
              className="text-xs font-medium mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <span>فهرس الأبواب والفصول المحققة</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{book.category}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{book.year}</span>
            </div>
            <h2
              id="chapter-modal-title"
              className="font-display text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {book.title}
            </h2>
            <div className="mt-1 text-xs flex flex-wrap items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <span>المؤلف:</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectAuthor(book.author_id);
                }}
                className="font-semibold underline hover:opacity-80 cursor-pointer"
                style={{ color: 'var(--accent-primary)' }}
              >
                {book.author}
              </button>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{book.chapters_count} فصلاً</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{(book.words_count || 0).toLocaleString('ar-EG')} كلمة</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة الفهرس"
            className="p-2 rounded-lg border transition-colors hover:opacity-80 cursor-pointer shrink-0"
            style={{
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input inside Modal */}
        <div
          className="px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="search"
              value={chapterQuery}
              onChange={(e) => setChapterQuery(e.target.value)}
              placeholder="ابحث في عناوين أبواب وفصول هذا الكتاب..."
              aria-label="ابحث في فصول الكتاب"
              className="w-full pr-10 pl-4 py-2 text-sm rounded-lg border focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => onSelectChapter(book.id, 1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>بدء القراءة من الفاتحة</span>
          </button>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {filteredToc.length === 0 ? (
            <div className="py-12 text-center px-6" style={{ color: 'var(--text-muted)' }}>
              لا توجد فصول تطابق عبارة البحث «{chapterQuery}».
            </div>
          ) : (
            filteredToc.map((chap) => (
              <button
                key={chap.id}
                type="button"
                onClick={() => onSelectChapter(book.id, chap.id)}
                className="w-full px-6 py-3.5 text-right flex items-center justify-between gap-4 transition-colors hover:opacity-90 cursor-pointer"
                style={{
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-baseline gap-3.5 min-w-0">
                  <span
                    className="font-mono-nums text-xs font-semibold shrink-0"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {String(chap.id).padStart(2, '0')}.
                  </span>
                  <div className="min-w-0">
                    <div
                      className="font-display text-lg font-bold truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {chap.title}
                    </div>
                    {chap.subtitle && (
                      <div
                        className="text-xs truncate mt-0.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {chap.subtitle}
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className="text-xs font-medium whitespace-nowrap shrink-0"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  مطالعة الفصل ←
                </span>
              </button>
            ))
          )}
        </div>

        {/* Modal Footer with Bibliographic Source Verification */}
        <div
          className="px-6 py-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            <span>حالة النص: محقق ومكتمل</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>تاريخ التدقيق: {book.verification_date}</span>
          </div>
          {book.source_url && (
            <a
              href={book.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline font-medium"
              style={{ color: 'var(--accent-primary)' }}
            >
              <span>المصدر المرجعي الموثق</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

interface FooterSectionProps {
  onNavigate: (page: 'home' | 'authors' | 'search' | 'about' | 'contact' | 'privacy' | 'terms') => void;
  onSelectPillar: (pillar: PillarFilter) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onNavigate,
  onSelectPillar,
}) => {
  return (
    <footer
      className="border-t mt-20"
      style={{
        backgroundColor: 'var(--header-bg)',
        color: 'var(--header-text)',
        borderColor: 'rgba(212, 175, 55, 0.2)',
      }}
    >
      <div className="max-w-[1360px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Mission */}
          <div>
            <h3
              className="font-display text-2xl font-bold mb-3"
              style={{ color: '#E8C872' }}
            >
              أَدَبُ أُمَّتِنَا
            </h3>
            <p className="text-sm leading-relaxed text-stone-300">
              الموسوعة الرقمية الشاملة لعيون التراث والتاريخ العربي. نصوص أمهات الكتب
              محققة وموثقة ومتاحة مجاناً للباحثين والقراء حول العالم بدون أي قيود، مع
              دعم القراءة التفاعلية وضبط الخطوط وتعدد أنماط العرض.
            </p>
          </div>

          {/* Column 2: Curatorial Pillars */}
          <div>
            <h4
              className="text-sm font-bold mb-4 tracking-wide"
              style={{ color: '#E8C872' }}
            >
              أركان الموسوعة التراثية
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPillar('history');
                    onNavigate('home');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  عيون التاريخ والسير
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPillar('literature');
                    onNavigate('home');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  روائع الأدب والمقامات
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPillar('wisdom');
                    onNavigate('home');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  حكمة وفلسفة وأمثال
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPillar('poetry');
                    onNavigate('home');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  شعر ودواوين العرب
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPillar('language');
                    onNavigate('home');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  لغة ومعاجم وفقه اللسان
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPillar('travel');
                    onNavigate('home');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  أدب الرحلة والجغرافيا
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional & Legal Links */}
          <div>
            <h4
              className="text-sm font-bold mb-4 tracking-wide"
              style={{ color: '#E8C872' }}
            >
              روابط قانونية ومؤسسية
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  عن المنصة ومنهج التحقيق
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('authors')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  دليل أعلام الفكر والمؤلفين
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  محرك البحث في المتون
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  وثيقة سياسة الخصوصية
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  شروط الاستخدام والملكية الفكرية
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  اتصل بنا وملاحظات الباحثين
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Channels (@OADAB) */}
          <div>
            <h4
              className="text-sm font-bold mb-4 tracking-wide"
              style={{ color: '#E8C872' }}
            >
              قنوات التواصل الرسمية (@OADAB)
            </h4>
            <p className="text-xs leading-relaxed text-stone-300 mb-4">
              تابع منصة أدب أمتنا على المنصات الرسمية لمتابعة القراءات الصوتية
              والاقتباسات المحققة من أمهات الكتب:
            </p>
            <div className="space-y-2 text-xs text-stone-300">
              <div>
                <a
                  href="https://www.youtube.com/@OADAB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors underline"
                >
                  قناة يوتيوب الرسمية: @OADAB
                </a>
              </div>
              <div>
                <a
                  href="https://www.tiktok.com/@OADAB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors underline"
                >
                  حساب تيك توك الرسمي: @OADAB
                </a>
              </div>
              <div className="pt-1 text-stone-400">
                البريد التحريري: contact@oadab.com
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div>
            © ٢٠٢٦ منصة أدب أمتنا (OADAB) — جميع المتون التراثية مصنفة في الملك العام ومحققة من مصادرها المعتمدة.
          </div>
          <div>
            الموسوعة الرقمية الشاملة لعيون التراث والتاريخ العربي
          </div>
        </div>
      </div>
    </footer>
  );
};
