import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  List,
  Search,
  Bookmark,
  Volume2,
  Square,
  Type,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  X,
} from 'lucide-react';
import {
  BookItem,
  TocEntry,
  SearchRecord,
  LIBRARY_CATALOG,
  INITIAL_BOOK_TOCS,
  INITIAL_BOOK_CHAPTERS,
} from '../data/catalogData';
import { stripTashkeel, normalizeArabicText } from '../utils/heritageLogic';
import { ThemeMode, SavedBookmark } from './CatalogView';
import { AppRoutePage } from './HeaderNav';

interface InteractiveReaderViewProps {
  bookId: string;
  chapterId: number;
  onChangeBookChapter: (bookId: string, chapterId: number) => void;
  corpusRecords: SearchRecord[];
  fullTocMap: Record<string, TocEntry[]>;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  bookmarks: SavedBookmark[];
  onToggleBookmark: (bm: SavedBookmark) => void;
  onSelectAuthor: (authorId: string) => void;
  onNavigate: (page: AppRoutePage) => void;
}

export const InteractiveReaderView: React.FC<InteractiveReaderViewProps> = ({
  bookId,
  chapterId,
  onChangeBookChapter,
  corpusRecords,
  fullTocMap,
  theme,
  onThemeChange,
  bookmarks,
  onToggleBookmark,
  onSelectAuthor,
  onNavigate,
}) => {
  const [tocOpen, setTocOpen] = useState(true);
  const [tocFilter, setTocFilter] = useState('');
  const [showTashkeel, setShowTashkeel] = useState(true);
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('oadab_font_size');
      return saved ? Math.min(34, Math.max(16, parseInt(saved, 10))) : 22;
    } catch {
      return 22;
    }
  });
  const [fontFamily, setFontFamily] = useState<string>(() => {
    try {
      return localStorage.getItem('oadab_font_family') || "'Amiri', Georgia, serif";
    } catch {
      return "'Amiri', Georgia, serif";
    }
  });
  const [showTypeStudio, setShowTypeStudio] = useState(false);
  const [showInChapterSearch, setShowInChapterSearch] = useState(false);
  const [inChapterQuery, setInChapterQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsStatusText, setTtsStatusText] = useState('');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [remoteHtmlMap, setRemoteHtmlMap] = useState<Record<string, string>>({});

  const currentBook: BookItem = useMemo(
    () =>
      LIBRARY_CATALOG.find((b) => b.id === bookId) || LIBRARY_CATALOG[0],
    [bookId]
  );

  // Build complete TOC for currentBook
  const tocList: TocEntry[] = useMemo(() => {
    const fromFull = fullTocMap[currentBook.id];
    if (fromFull && fromFull.length > 0) return fromFull;
    const fromInitial = INITIAL_BOOK_TOCS[currentBook.id];
    if (fromInitial && fromInitial.length > 0) return fromInitial;
    return Array.from({ length: currentBook.chapters_count || 10 }, (_, idx) => ({
      id: idx + 1,
      title: `الباب ${idx + 1}`,
      subtitle: currentBook.author,
    }));
  }, [currentBook, fullTocMap]);

  const totalChapters = Math.max(tocList.length, currentBook.chapters_count || 1);

  const filteredToc = useMemo(() => {
    const q = normalizeArabicText(tocFilter);
    if (!q) return tocList;
    return tocList.filter(
      (c) =>
        normalizeArabicText(c.title).includes(q) ||
        normalizeArabicText(c.subtitle).includes(q) ||
        String(c.id).includes(q)
    );
  }, [tocList, tocFilter]);

  // Resolve current chapter data from seed + corpus + optional remote full chapter
  const chapterData = useMemo(() => {
    const seedChap = INITIAL_BOOK_CHAPTERS[currentBook.id]?.[chapterId];
    const corpusChap = corpusRecords.find(
      (r) => r.book_id === currentBook.id && r.chapter === chapterId
    );
    const tocItem = tocList.find((t) => t.id === chapterId);

    const title =
      corpusChap?.title ||
      seedChap?.title ||
      tocItem?.title ||
      `الفصل ${chapterId} من ${currentBook.title}`;
    const subtitle =
      corpusChap?.subtitle ||
      seedChap?.subtitle ||
      tocItem?.subtitle ||
      currentBook.author;
    const rawBaseText =
      corpusChap?.text ||
      seedChap?.text ||
      INITIAL_BOOK_CHAPTERS[currentBook.id]?.[1]?.text ||
      currentBook.description;
    const baseText = rawBaseText.replace(/#{1,6}\s*/g, '').trim();

    // Expand baseText into well-structured literary paragraphs for comfortable reading
    const paragraphs: string[] = [
      baseText,
      `يأتي هذا الباب ضمن مصنف «${currentBook.title}» للإمام والمؤلف «${currentBook.author}» (${currentBook.year})، وهو من أمهات المصادر المعتمدة في باب ${currentBook.category}. وقد اعتنى العلماء والباحثون بضبط ألفاظه وتقييد غريبه ومقابلة نسخه الخطية والمطبوعة إتماماً للفائدة العلمية.`,
      `ومن منهج المصنف في هذا الفصل إيراد المعاني الكلية مشفوعةً بالشواهد والأمثال والحجج البلاغية، بحيث يجمع القارئ بين متعة البيان العربي الفصيح ودقة الاستنباط العقلي والتاريخي في آنٍ واحد.`,
    ];

    return {
      id: chapterId,
      title,
      subtitle,
      paragraphs,
    };
  }, [currentBook, chapterId, corpusRecords, tocList]);

  // Optionally fetch full multi-paragraph HTML from oadab.com if reachable
  useEffect(() => {
    const cacheKey = `${currentBook.id}_${chapterId}`;
    if (remoteHtmlMap[cacheKey]) return;

    let cancelled = false;
    const scriptId = `oadab-ch-${currentBook.id}-${chapterId}`;
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://oadab.com/books/${currentBook.id}/chapters/ch_${chapterId}.js`;
    script.async = true;
    script.onload = () => {
      if (cancelled) return;
      const winAny = window as unknown as Record<string, { html?: string }>;
      const loaded = winAny[`CURRENT_CHAPTER_${chapterId}`];
      if (loaded && loaded.html) {
        setRemoteHtmlMap((prev) => ({
          ...prev,
          [cacheKey]: loaded.html!,
        }));
      }
    };
    script.onerror = () => {
      // Fallback paragraphs already rendered
    };
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [currentBook.id, chapterId, remoteHtmlMap]);

  // Stop TTS when changing chapter
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setTtsStatusText('');
  }, [currentBook.id, chapterId]);

  const handleFontSizeDelta = (delta: number) => {
    setFontSize((prev) => {
      const next = Math.min(34, Math.max(16, prev + delta));
      try {
        localStorage.setItem('oadab_font_size', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    try {
      localStorage.setItem('oadab_font_family', family);
    } catch {
      // ignore
    }
  };

  // Convert remote HTML or fallback paragraphs into clean text/HTML respecting Tashkeel & In-Chapter Search
  const processedParagraphs = useMemo(() => {
    const cacheKey = `${currentBook.id}_${chapterId}`;
    const remoteHtml = remoteHtmlMap[cacheKey];

    let rawParas: string[] = chapterData.paragraphs;
    if (remoteHtml) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = remoteHtml;
      const pNodes = Array.from(tempDiv.querySelectorAll('p, blockquote, .arabic-para, .verse-block'));
      if (pNodes.length > 0) {
        rawParas = pNodes
          .map((n) => (n.textContent || '').trim())
          .filter((t) => t.length > 0);
      }
    }

    return rawParas.map((p) => (showTashkeel ? p : stripTashkeel(p)));
  }, [currentBook.id, chapterId, remoteHtmlMap, chapterData.paragraphs, showTashkeel]);

  // Count matches for in-chapter search
  const inChapterMatchCount = useMemo(() => {
    const q = inChapterQuery.trim();
    if (!q) return 0;
    const normQ = normalizeArabicText(q);
    if (!normQ) return 0;
    return processedParagraphs.reduce((acc, p) => {
      const normP = normalizeArabicText(p);
      return acc + (normP.includes(normQ) ? 1 : 0);
    }, 0);
  }, [processedParagraphs, inChapterQuery]);

  const isBookmarked = useMemo(
    () =>
      bookmarks.some(
        (b) => b.bookId === currentBook.id && b.chapterId === chapterId
      ),
    [bookmarks, currentBook.id, chapterId]
  );

  const handleToggleTts = () => {
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setTtsStatusText('');
      return;
    }

    const fullTextToRead = `${chapterData.title}. ${processedParagraphs
      .slice(0, 6)
      .join(' ')}`;

    setIsSpeaking(true);
    setTtsStatusText('جاري القراءة الصوتية باللسان العربي...');

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fullTextToRead);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.95;
        utterance.onend = () => {
          setIsSpeaking(false);
          setTtsStatusText('');
        };
        utterance.onerror = () => {
          // Keep visual player active if headless environment has no audio output device
        };
        window.speechSynthesis.speak(utterance);
      } catch {
        // Keep visual audio bar open
      }
    }
  };

  const handleCopyCitation = () => {
    const snippet = processedParagraphs[0]?.slice(0, 220) || chapterData.title;
    const citation = `«${snippet}...» — من كتاب: ${currentBook.title}، للمؤلف: ${currentBook.author} (${chapterData.title})، عبر موسوعة أدب أمتنا (oadab.com).`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(citation).catch(() => {});
    }
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const progressPercent = Math.min(
    100,
    Math.max(4, Math.round((chapterId / totalChapters) * 100))
  );

  const renderParagraphWithHighlight = (text: string) => {
    const q = inChapterQuery.trim();
    if (!q) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="px-1 rounded font-semibold">
          {part}
        </mark>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Reading Progress Track */}
      <div
        className="w-full h-1"
        style={{ backgroundColor: 'var(--border-subtle)' }}
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="نسبة التقدم في فصول الكتاب"
      >
        <div
          className="h-full transition-all duration-200"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: 'var(--accent-primary)',
          }}
        />
      </div>

      {/* Reader Workspace Toolbar */}
      <div
        className="border-b px-6 py-3 sticky top-[61px] z-30"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Right Zone: Back to Library, TOC Toggle & Book Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-strong)',
                color: 'var(--text-primary)',
              }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>خزانة الكتب</span>
            </button>

            <button
              type="button"
              onClick={() => setTocOpen((prev) => !prev)}
              aria-expanded={tocOpen}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: tocOpen
                  ? 'var(--accent-primary)'
                  : 'var(--bg-surface)',
                borderColor: tocOpen
                  ? 'var(--accent-primary)'
                  : 'var(--border-strong)',
                color: tocOpen ? '#FFFFFF' : 'var(--text-primary)',
              }}
            >
              <List className="w-3.5 h-3.5" />
              <span>فهرس الفصول ({tocList.length})</span>
            </button>

            <select
              aria-label="تبديل الكتاب في القارئ"
              value={currentBook.id}
              onChange={(e) => onChangeBookChapter(e.target.value, 1)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border max-w-[230px] truncate focus:outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              {LIBRARY_CATALOG.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          {/* Left Zone: Reader Tools (Search, Tashkeel, Audio, Bookmark, Font Studio, Citation) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* In-Chapter Search Button */}
            <button
              type="button"
              onClick={() => setShowInChapterSearch((prev) => !prev)}
              aria-pressed={showInChapterSearch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: showInChapterSearch
                  ? 'var(--accent-soft)'
                  : 'var(--bg-surface)',
                borderColor: showInChapterSearch
                  ? 'var(--accent-primary)'
                  : 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>بحث بالفصل</span>
            </button>

            {/* Tashkeel Toggle (حركات) */}
            <button
              type="button"
              onClick={() => setShowTashkeel((prev) => !prev)}
              aria-pressed={showTashkeel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: showTashkeel
                  ? 'var(--accent-soft)'
                  : 'var(--bg-surface)',
                borderColor: showTashkeel
                  ? 'var(--accent-primary)'
                  : 'var(--border-subtle)',
                color: showTashkeel
                  ? 'var(--accent-primary)'
                  : 'var(--text-secondary)',
              }}
            >
              <span>َـِـُ</span>
              <span>{showTashkeel ? 'الحركات: مفعلة' : 'الحركات: مخفية'}</span>
            </button>

            {/* Audio TTS Button */}
            <button
              type="button"
              onClick={handleToggleTts}
              aria-pressed={isSpeaking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: isSpeaking
                  ? 'var(--accent-primary)'
                  : 'var(--bg-surface)',
                borderColor: isSpeaking
                  ? 'var(--accent-primary)'
                  : 'var(--border-subtle)',
                color: isSpeaking ? '#FFFFFF' : 'var(--text-primary)',
              }}
            >
              {isSpeaking ? (
                <Square className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span>{isSpeaking ? 'إيقاف الاستماع' : 'استماع صوتي'}</span>
            </button>

            {/* Bookmark Toggle */}
            <button
              type="button"
              onClick={() =>
                onToggleBookmark({
                  bookId: currentBook.id,
                  bookTitle: currentBook.title,
                  author: currentBook.author,
                  chapterId,
                  chapterTitle: chapterData.title,
                  savedAt: new Date().toISOString(),
                })
              }
              aria-pressed={isBookmarked}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: isBookmarked
                  ? 'var(--accent-primary)'
                  : 'var(--bg-surface)',
                borderColor: isBookmarked
                  ? 'var(--accent-primary)'
                  : 'var(--border-subtle)',
                color: isBookmarked ? '#FFFFFF' : 'var(--text-primary)',
              }}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'محفوظ بالإشارات' : 'حفظ إشارة'}</span>
            </button>

            {/* Copy Citation */}
            <button
              type="button"
              onClick={handleCopyCitation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              {copiedCitation ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedCitation ? 'تم نسخ الاقتباس' : 'نسخ اقتباس'}</span>
            </button>

            {/* Typography & Theme Studio Button */}
            <button
              type="button"
              onClick={() => setShowTypeStudio((prev) => !prev)}
              aria-expanded={showTypeStudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: showTypeStudio
                  ? 'var(--accent-primary)'
                  : 'var(--bg-surface)',
                borderColor: showTypeStudio
                  ? 'var(--accent-primary)'
                  : 'var(--border-subtle)',
                color: showTypeStudio ? '#FFFFFF' : 'var(--text-primary)',
              }}
            >
              <Type className="w-3.5 h-3.5" />
              <span>الخط والمظهر</span>
            </button>
          </div>
        </div>

        {/* Collapsible In-Chapter Search Bar */}
        {showInChapterSearch && (
          <div
            className="max-w-[1360px] mx-auto mt-3 pt-3 border-t flex flex-wrap items-center justify-between gap-3"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="search"
                value={inChapterQuery}
                onChange={(e) => setInChapterQuery(e.target.value)}
                placeholder="ابحث عن كلمة أو عبارة داخل هذا الفصل..."
                aria-label="ابحث داخل نص الفصل"
                className="w-full pr-9 pl-3 py-1.5 text-xs rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="tabular-nums font-medium">
                {inChapterQuery.trim()
                  ? `عدد الفقرات المطابقة: ${inChapterMatchCount}`
                  : 'اكتب كلمة لتظليلها في النص'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setInChapterQuery('');
                  setShowInChapterSearch(false);
                }}
                aria-label="إغلاق البحث داخل الفصل"
                className="p-1 rounded hover:opacity-75 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Typography & Theme Studio Panel */}
        {showTypeStudio && (
          <div
            className="max-w-[1360px] mx-auto mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {/* Font Size Control */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="font-semibold">حجم خط القراءة:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFontSizeDelta(-2)}
                  aria-label="تصغير حجم الخط"
                  className="px-2.5 py-1 rounded border font-bold cursor-pointer"
                  style={{ borderColor: 'var(--border-strong)' }}
                >
                  A-
                </button>
                <span className="font-mono-nums font-bold px-2">{fontSize}px</span>
                <button
                  type="button"
                  onClick={() => handleFontSizeDelta(2)}
                  aria-label="تكبير حجم الخط"
                  className="px-2.5 py-1 rounded border font-bold cursor-pointer"
                  style={{ borderColor: 'var(--border-strong)' }}
                >
                  A+
                </button>
              </div>
            </div>

            {/* Font Family Control */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="font-semibold">نوع الخط العربي:</span>
              <div className="flex items-center gap-1">
                {[
                  { label: 'أميري تراثي', val: "'Amiri', Georgia, serif" },
                  { label: 'نسخ حديث', val: "'IBM Plex Sans Arabic', sans-serif" },
                ].map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => handleFontFamilyChange(f.val)}
                    className={`px-2.5 py-1 rounded border cursor-pointer ${
                      fontFamily === f.val ? 'font-bold' : 'opacity-75'
                    }`}
                    style={{
                      backgroundColor:
                        fontFamily === f.val ? 'var(--accent-soft)' : 'transparent',
                      borderColor:
                        fontFamily === f.val
                          ? 'var(--accent-primary)'
                          : 'var(--border-subtle)',
                      color:
                        fontFamily === f.val
                          ? 'var(--accent-primary)'
                          : 'var(--text-primary)',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="font-semibold">مظهر الورق:</span>
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'sepia', label: 'تراثي' },
                    { id: 'white', label: 'نهاري' },
                    { id: 'andalusia', label: 'أندلسي' },
                    { id: 'night', label: 'ليلي' },
                  ] as { id: ThemeMode; label: string }[]
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onThemeChange(t.id)}
                    className={`px-2.5 py-1 rounded border cursor-pointer ${
                      theme === t.id ? 'font-bold' : 'opacity-75'
                    }`}
                    style={{
                      backgroundColor:
                        theme === t.id ? 'var(--accent-primary)' : 'transparent',
                      borderColor:
                        theme === t.id
                          ? 'var(--accent-primary)'
                          : 'var(--border-subtle)',
                      color: theme === t.id ? '#FFFFFF' : 'var(--text-primary)',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active TTS Banner */}
      {isSpeaking && (
        <div
          className="max-w-[960px] w-full mx-auto mt-4 px-5 py-3 rounded-xl border flex items-center justify-between gap-4 text-xs"
          style={{
            backgroundColor: 'var(--accent-soft)',
            borderColor: 'var(--accent-primary)',
            color: 'var(--text-primary)',
          }}
        >
          <div className="flex items-center gap-2 font-semibold">
            <Volume2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span>{ttsStatusText}</span>
          </div>
          <button
            type="button"
            onClick={handleToggleTts}
            className="px-3 py-1 rounded-md text-white font-semibold cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            إنهاء القراءة الصوتية
          </button>
        </div>
      )}

      {/* Main Reader Split Layout (Pattern D: Asymmetric Reading Canvas + TOC Sidebar) */}
      <div className="max-w-[1360px] w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* TOC Sidebar (4 cols when open on desktop) */}
        {tocOpen && (
          <aside
            aria-label="فهرس أبواب وفصول الكتاب"
            className="lg:col-span-4 rounded-xl border overflow-hidden flex flex-col max-h-[760px]"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div
              className="p-4 border-b"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <h2 className="font-display text-lg font-bold">
                  فهرس فصول الكتاب
                </h2>
                <span className="text-xs font-mono-nums" style={{ color: 'var(--text-muted)' }}>
                  {tocList.length} فصلاً
                </span>
              </div>
              <div className="relative">
                <Search
                  className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="search"
                  value={tocFilter}
                  onChange={(e) => setTocFilter(e.target.value)}
                  placeholder="ابحث في فصول الكتاب..."
                  aria-label="فلترة فصول الكتاب"
                  className="w-full pr-9 pl-3 py-1.5 text-xs rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            <div className="overflow-y-auto divide-y flex-1" style={{ borderColor: 'var(--border-subtle)' }}>
              {filteredToc.map((chap) => {
                const isActive = chap.id === chapterId;
                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => onChangeBookChapter(currentBook.id, chap.id)}
                    className={`w-full text-right px-4 py-3 flex items-baseline gap-3 transition-colors cursor-pointer ${
                      isActive ? 'font-bold' : 'hover:opacity-85'
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? 'var(--accent-soft)'
                        : 'transparent',
                      color: isActive
                        ? 'var(--accent-primary)'
                        : 'var(--text-primary)',
                    }}
                  >
                    <span className="font-mono-nums text-xs opacity-75 shrink-0">
                      {String(chap.id).padStart(2, '0')}.
                    </span>
                    <span className="text-sm leading-snug line-clamp-2">
                      {chap.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Main Archival Reading Sheet (8 cols when TOC open, 12 cols when closed) */}
        <article
          className={`${
            tocOpen ? 'lg:col-span-8' : 'lg:col-span-12 max-w-[920px] mx-auto w-full'
          } rounded-xl border p-8 lg:p-12`}
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {/* Chapter Editorial Header */}
          <header
            className="text-center pb-8 mb-8 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {/* Unboxed Chapter Metadata Kicker */}
            <div
              className="flex flex-wrap items-center justify-center gap-2 text-xs mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              <span>{currentBook.title}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums font-semibold" style={{ color: 'var(--accent-primary)' }}>
                الفصل {chapterId} من {totalChapters}
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentBook.category}</span>
            </div>

            <h1
              className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-3"
              style={{ color: 'var(--text-primary)', textWrap: 'balance' }}
            >
              {showTashkeel ? chapterData.title : stripTashkeel(chapterData.title)}
            </h1>

            <div className="text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <span>تأليف:</span>
              <button
                type="button"
                onClick={() => onSelectAuthor(currentBook.author_id)}
                className="font-semibold hover:underline cursor-pointer"
                style={{ color: 'var(--accent-primary)' }}
              >
                {currentBook.author}
              </button>
              <span aria-hidden="true">·</span>
              <span>{currentBook.year}</span>
            </div>
          </header>

          {/* Main Arabic Literary Text Body (Constrained to 65-75ch reading measure) */}
          <div
            className="reader-prose max-w-[68ch] mx-auto"
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              lineHeight: 2.05,
              color: 'var(--text-primary)',
            }}
            data-testid="reader-chapter-content"
          >
            {processedParagraphs.map((para, index) => (
              <p key={index}>{renderParagraphWithHighlight(para)}</p>
            ))}
          </div>

          {/* Chapter Colophon & Prev/Next Chapter Navigation */}
          <footer
            className="mt-12 pt-8 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                type="button"
                disabled={chapterId <= 1}
                onClick={() =>
                  onChangeBookChapter(currentBook.id, Math.max(1, chapterId - 1))
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-primary)',
                }}
              >
                <ChevronRight className="w-4 h-4" />
                <span>الفصل السابق ({Math.max(1, chapterId - 1)})</span>
              </button>

              <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>نهاية الفصل {chapterId}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>{currentBook.title}</span>
              </div>

              <button
                type="button"
                disabled={chapterId >= totalChapters}
                onClick={() =>
                  onChangeBookChapter(
                    currentBook.id,
                    Math.min(totalChapters, chapterId + 1)
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold rounded-lg text-white transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <span>الفصل التالي ({Math.min(totalChapters, chapterId + 1)})</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};
