import React, { useState, useEffect, useMemo } from 'react';
import {
  BookItem,
  TocEntry,
  SearchRecord,
  LIBRARY_CATALOG,
  AUTHORS_CATALOG,
  INITIAL_BOOK_TOCS,
  INITIAL_BOOK_CHAPTERS,
} from './data/catalogData';
import { PillarFilter } from './utils/heritageLogic';
import { HeaderNav, AppRoutePage } from './components/HeaderNav';
import {
  CatalogView,
  ThemeMode,
  SavedBookmark,
} from './components/CatalogView';
import {
  AuthorsDirectoryView,
  AuthorProfileView,
} from './components/AuthorsView';
import { CorpusSearchView } from './components/CorpusSearchView';
import { InteractiveReaderView } from './components/InteractiveReaderView';
import {
  AboutView,
  ContactView,
  LegalDocumentView,
} from './components/InstitutionalViews';
import { ChapterModal, FooterSection } from './components/ChapterModal';

// Build instant initial corpus records from INITIAL_BOOK_CHAPTERS before /search-index.json finishes loading
function buildInitialCorpusRecords(): SearchRecord[] {
  const list: SearchRecord[] = [];
  for (const book of LIBRARY_CATALOG) {
    const chMap = INITIAL_BOOK_CHAPTERS[book.id] || {};
    for (const chKey of Object.keys(chMap)) {
      const ch = chMap[Number(chKey)];
      if (ch) {
        list.push({
          book_id: book.id,
          book: book.title,
          author: book.author,
          chapter: ch.id,
          title: ch.title,
          subtitle: ch.subtitle || book.author,
          text: ch.text,
          url: `/reader?book=${book.id}&chapter=${ch.id}`,
          verified: true,
        });
      }
    }
  }
  return list;
}

export default function App() {
  const [activePage, setActivePage] = useState<AppRoutePage>('home');
  const [selectedPillar, setSelectedPillar] = useState<PillarFilter>('all');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(
    AUTHORS_CATALOG[0]?.id || 'abbas_al_aqqad'
  );
  const [readerBookId, setReaderBookId] = useState<string>('kalila_wa_dimna');
  const [readerChapterId, setReaderChapterId] = useState<number>(1);
  const [modalBook, setModalBook] = useState<BookItem | null>(null);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('oadab_theme') as ThemeMode | null;
      if (saved && ['sepia', 'white', 'andalusia', 'night'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'sepia';
  });

  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>(() => {
    try {
      const raw = localStorage.getItem('oadab_bookmarks');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  });

  const [corpusRecords, setCorpusRecords] = useState<SearchRecord[]>(() =>
    buildInitialCorpusRecords()
  );
  const [isLoadingCorpus, setIsLoadingCorpus] = useState<boolean>(true);

  // Sync theme attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'night') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('oadab_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Read initial URL parameters if present
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as AppRoutePage | null;
      const bookParam = params.get('book');
      const chapterParam = params.get('chapter');
      const authorParam = params.get('author') || params.get('id');

      if (bookParam && LIBRARY_CATALOG.some((b) => b.id === bookParam)) {
        setReaderBookId(bookParam);
        setReaderChapterId(Math.max(1, parseInt(chapterParam || '1', 10) || 1));
        setActivePage('reader');
      } else if (
        authorParam &&
        AUTHORS_CATALOG.some((a) => a.id === authorParam)
      ) {
        setSelectedAuthorId(authorParam);
        setActivePage('author-detail');
      } else if (
        pageParam &&
        [
          'home',
          'authors',
          'author-detail',
          'search',
          'reader',
          'about',
          'contact',
          'privacy',
          'terms',
        ].includes(pageParam)
      ) {
        setActivePage(pageParam);
      }
    } catch {
      // ignore
    }
  }, []);

  // Load full 1,692-chapter corpus from /search-index.json
  useEffect(() => {
    let cancelled = false;
    fetch('/search-index.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load search-index.json');
        return res.json();
      })
      .then((data: SearchRecord[]) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setCorpusRecords(data);
        }
        setIsLoadingCorpus(false);
      })
      .catch(() => {
        if (!cancelled) setIsLoadingCorpus(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Build complete TOC map per book from corpusRecords
  const fullTocMap = useMemo(() => {
    const map: Record<string, TocEntry[]> = { ...INITIAL_BOOK_TOCS };
    const byBook: Record<string, TocEntry[]> = {};
    for (const r of corpusRecords) {
      if (!byBook[r.book_id]) byBook[r.book_id] = [];
      byBook[r.book_id].push({
        id: r.chapter,
        title: r.title,
        subtitle: r.subtitle || r.author,
      });
    }
    for (const bookId of Object.keys(byBook)) {
      byBook[bookId].sort((a, b) => a.id - b.id);
      if (byBook[bookId].length >= (map[bookId]?.length || 0)) {
        map[bookId] = byBook[bookId];
      }
    }
    return map;
  }, [corpusRecords]);

  const handleNavigate = (page: AppRoutePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReader = (bookId: string, chapterId = 1) => {
    setReaderBookId(bookId);
    setReaderChapterId(chapterId);
    setModalBook(null);
    setActivePage('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAuthor = (authorId: string) => {
    const found =
      AUTHORS_CATALOG.find((a) => a.id === authorId) || AUTHORS_CATALOG[0];
    if (found) {
      setSelectedAuthorId(found.id);
      setActivePage('author-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleBookmark = (bm: SavedBookmark) => {
    setBookmarks((prev) => {
      const exists = prev.some(
        (x) => x.bookId === bm.bookId && x.chapterId === bm.chapterId
      );
      const next = exists
        ? prev.filter(
            (x) => !(x.bookId === bm.bookId && x.chapterId === bm.chapterId)
          )
        : [bm, ...prev];
      try {
        localStorage.setItem('oadab_bookmarks', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleRemoveBookmark = (bookId: string, chapterId: number) => {
    setBookmarks((prev) => {
      const next = prev.filter(
        (x) => !(x.bookId === bookId && x.chapterId === chapterId)
      );
      try {
        localStorage.setItem('oadab_bookmarks', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const activeAuthor = useMemo(
    () =>
      AUTHORS_CATALOG.find((a) => a.id === selectedAuthorId) ||
      AUTHORS_CATALOG[0],
    [selectedAuthorId]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <HeaderNav
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenLastRead={() => handleOpenReader(readerBookId, readerChapterId)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <CatalogView
            selectedPillar={selectedPillar}
            onSelectPillar={setSelectedPillar}
            searchQuery={catalogSearchQuery}
            onSearchQueryChange={setCatalogSearchQuery}
            onOpenReader={handleOpenReader}
            onOpenChaptersModal={(book) => setModalBook(book)}
            onSelectAuthor={handleSelectAuthor}
            onNavigate={handleNavigate}
            theme={theme}
            onThemeChange={setTheme}
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
          />
        )}

        {activePage === 'authors' && (
          <AuthorsDirectoryView
            onSelectAuthor={handleSelectAuthor}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'author-detail' && activeAuthor && (
          <AuthorProfileView
            author={activeAuthor}
            onSelectAuthor={handleSelectAuthor}
            onOpenReader={handleOpenReader}
            onOpenChaptersModal={(book) => setModalBook(book)}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'search' && (
          <CorpusSearchView
            corpusRecords={corpusRecords}
            isLoadingCorpus={isLoadingCorpus}
            onOpenReader={handleOpenReader}
            onSelectAuthor={handleSelectAuthor}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'reader' && (
          <InteractiveReaderView
            bookId={readerBookId}
            chapterId={readerChapterId}
            onChangeBookChapter={(bId, cId) => {
              setReaderBookId(bId);
              setReaderChapterId(cId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            corpusRecords={corpusRecords}
            fullTocMap={fullTocMap}
            theme={theme}
            onThemeChange={setTheme}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSelectAuthor={handleSelectAuthor}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
            onOpenReader={handleOpenReader}
          />
        )}

        {activePage === 'contact' && (
          <ContactView onNavigate={handleNavigate} />
        )}

        {activePage === 'privacy' && (
          <LegalDocumentView type="privacy" onNavigate={handleNavigate} />
        )}

        {activePage === 'terms' && (
          <LegalDocumentView type="terms" onNavigate={handleNavigate} />
        )}
      </main>

      {/* Chapter Index Modal */}
      <ChapterModal
        book={modalBook}
        fullTocMap={fullTocMap}
        onClose={() => setModalBook(null)}
        onSelectChapter={(bId, cId) => handleOpenReader(bId, cId)}
        onSelectAuthor={handleSelectAuthor}
      />

      {/* Institutional Footer */}
      <FooterSection
        onNavigate={handleNavigate}
        onSelectPillar={(pillar) => {
          setSelectedPillar(pillar);
          handleNavigate('home');
        }}
      />
    </div>
  );
}
