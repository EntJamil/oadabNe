import {
  BookItem,
  AuthorItem,
  SearchRecord,
  LIBRARY_CATALOG,
  AUTHORS_CATALOG,
} from '../data/catalogData';

export type PillarFilter =
  | 'all'
  | 'history'
  | 'literature'
  | 'poetry'
  | 'wisdom'
  | 'language'
  | 'biography'
  | 'travel';

export type EraFilter =
  | 'all'
  | 'early'
  | 'abbasid'
  | 'andalusian'
  | 'mamluk_ottoman'
  | 'modern';

export type BookSortOption = 'curated' | 'words_desc' | 'chapters_desc' | 'title_asc';

export interface PillarMeta {
  id: PillarFilter;
  label: string;
  shortLabel: string;
  description: string;
}

export const PILLAR_CATEGORIES: PillarMeta[] = [
  {
    id: 'all',
    label: 'جميع المؤلفات',
    shortLabel: 'الكل',
    description: 'المدونة الكاملة لأمهات الكتب التراثية المحققة في الخزانة',
  },
  {
    id: 'wisdom',
    label: 'حكمة وفلسفة وأمثال',
    shortLabel: 'الحكمة والفلسفة',
    description: 'كتب الحكمة العملية، الفلسفة الإسلامية، الأخلاق، وعلم العمران',
  },
  {
    id: 'literature',
    label: 'روائع الأدب والمقامات',
    shortLabel: 'الأدب والمقامات',
    description: 'عيون البيان العربي، المقامات، الرسائل الأدبية، والحكايات السردية',
  },
  {
    id: 'history',
    label: 'عيون التاريخ والسير',
    shortLabel: 'التاريخ والسير',
    description: 'حوليات التاريخ الإسلامي، السيرة النبوية، وتاريخ الحواضر والأمم',
  },
  {
    id: 'language',
    label: 'لغة ومعاجم وفقه اللسان',
    shortLabel: 'اللغة والمعاجم',
    description: 'أصول النحو، فقه اللغة، أسرار البلاغة، ودلائل الإعجاز البياني',
  },
  {
    id: 'travel',
    label: 'أدب الرحلة والجغرافيا',
    shortLabel: 'الرحلات والجغرافيا',
    description: 'يوميات الرحالة العرب، المسالك والممالك، وخطط الأقاليم والبلدان',
  },
  {
    id: 'poetry',
    label: 'شعر ودواوين العرب',
    shortLabel: 'الشعر والدواوين',
    description: 'المعلقات، الدواوين الشعرية الخالدة، وشروح القصائد العربية',
  },
  {
    id: 'biography',
    label: 'تراجم وطبقات وأعيان',
    shortLabel: 'التراجم والطبقات',
    description: 'سير الأعلام، فهارس المصنفين، وطبقات العلماء والأدباء',
  },
];

export interface EraMeta {
  id: EraFilter;
  label: string;
  period: string;
}

export const HISTORICAL_ERAS: EraMeta[] = [
  { id: 'all', label: 'جميع العصور', period: 'القرن ٦ م — القرن ٢٠ م' },
  { id: 'early', label: 'العصر الجاهلي وصدر الإسلام', period: 'قبل الإسلام — ١٣٢ هـ' },
  { id: 'abbasid', label: 'العصر العباسي', period: '١٣٢ هـ — ٦٥٦ هـ' },
  { id: 'andalusian', label: 'العصر الأندلسي', period: '٩٢ هـ — ٨٩٧ هـ' },
  { id: 'mamluk_ottoman', label: 'العصر المملوكي والمغربي', period: '٦٤٨ هـ — ١٢٠٠ هـ' },
  { id: 'modern', label: 'العصر الحديث والنهضة', period: 'القرن ١٩ — ٢٠ م' },
];

/**
 * Strips Arabic Tashkeel (diacritics) while preserving base characters (hamzas, teh marbuta, etc.)
 * Used by the Reader's "حركات" (Diacritics) toggle.
 */
export function stripTashkeel(text: string): string {
  if (!text) return '';
  return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
}

/**
 * Normalizes Arabic text for search and comparison.
 */
export function normalizeArabicText(value: string): string {
  if (!value) return '';
  return String(value)
    .normalize('NFKC')
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Filters and sorts books from the catalog.
 */
export function filterBooks(
  books: BookItem[],
  options: {
    pillar?: PillarFilter;
    query?: string;
    sortBy?: BookSortOption;
  } = {}
): BookItem[] {
  const { pillar = 'all', query = '', sortBy = 'curated' } = options;
  const normQuery = normalizeArabicText(query);
  const queryTokens = normQuery ? normQuery.split(' ').filter(Boolean) : [];

  const filtered = books.filter((book) => {
    const matchesPillar = pillar === 'all' || book.pillar === pillar;
    if (!matchesPillar) return false;

    if (queryTokens.length === 0) return true;

    const haystack = normalizeArabicText(
      `${book.title} ${book.author} ${book.category} ${book.description} ${book.year} ${book.badge}`
    );
    return queryTokens.every((token) => haystack.includes(token));
  });

  if (sortBy === 'words_desc') {
    return [...filtered].sort((a, b) => (b.words_count || 0) - (a.words_count || 0));
  }
  if (sortBy === 'chapters_desc') {
    return [...filtered].sort((a, b) => (b.chapters_count || 0) - (a.chapters_count || 0));
  }
  if (sortBy === 'title_asc') {
    return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'ar'));
  }
  return filtered;
}

/**
 * Returns all books belonging to a given author.
 */
export function getAuthorWorks(author: AuthorItem, books: BookItem[] = LIBRARY_CATALOG): BookItem[] {
  const authorNames = [author.name, author.full_name, ...(author.aliases || [])]
    .map(normalizeArabicText)
    .filter(Boolean);

  return books.filter((book) => {
    if (book.author_id === author.id) return true;
    const normBookAuthor = normalizeArabicText(book.author);
    return authorNames.some(
      (n) => n === normBookAuthor || normBookAuthor.includes(n) || n.includes(normBookAuthor)
    );
  });
}

/**
 * Filters authors by era and search query.
 */
export function filterAuthors(
  authors: AuthorItem[],
  options: {
    era?: EraFilter;
    query?: string;
    onlyWithBooks?: boolean;
  } = {},
  books: BookItem[] = LIBRARY_CATALOG
): AuthorItem[] {
  const { era = 'all', query = '', onlyWithBooks = false } = options;
  const normQuery = normalizeArabicText(query);
  const queryTokens = normQuery ? normQuery.split(' ').filter(Boolean) : [];

  const filtered = authors.filter((author) => {
    const matchesEra = era === 'all' || author.era_id === era;
    if (!matchesEra) return false;

    if (onlyWithBooks && getAuthorWorks(author, books).length === 0) {
      return false;
    }

    if (queryTokens.length === 0) return true;

    const haystack = normalizeArabicText(
      `${author.name} ${author.full_name} ${author.title} ${author.origin} ${author.era_name} ${(author.specialties || []).join(' ')} ${author.bio}`
    );
    return queryTokens.every((token) => haystack.includes(token));
  });

  return [...filtered].sort(
    (a, b) => getAuthorWorks(b, books).length - getAuthorWorks(a, books).length
  );
}

export interface CorpusSearchResult {
  record: SearchRecord;
  book?: BookItem;
  snippet: string;
  score: number;
}

/**
 * Searches across the chapter corpus (1,692 chapters) and produces ranked results with snippets.
 */
export function searchCorpus(
  records: SearchRecord[],
  rawQuery: string,
  options: {
    pillar?: PillarFilter;
    bookId?: string;
    limit?: number;
  } = {},
  books: BookItem[] = LIBRARY_CATALOG
): CorpusSearchResult[] {
  const { pillar = 'all', bookId = 'all', limit = 60 } = options;
  const normQuery = normalizeArabicText(rawQuery);
  if (!normQuery || normQuery.length < 2) {
    return [];
  }

  const queryTokens = normQuery.split(' ').filter(Boolean);
  const bookMap = new Map<string, BookItem>();
  books.forEach((b) => bookMap.set(b.id, b));

  const results: CorpusSearchResult[] = [];

  for (const r of records) {
    const book = bookMap.get(r.book_id);
    if (bookId !== 'all' && r.book_id !== bookId) continue;
    if (pillar !== 'all' && book && book.pillar !== pillar) continue;

    const normTitle = normalizeArabicText(r.title);
    const normText = normalizeArabicText(r.text);
    const normAuthor = normalizeArabicText(r.author);
    const normBook = normalizeArabicText(r.book);

    const combined = `${normTitle} ${normText} ${normAuthor} ${normBook}`;
    if (!queryTokens.every((t) => combined.includes(t))) {
      continue;
    }

    let score = 10;
    if (normTitle.includes(normQuery)) score += 50;
    if (normText.includes(normQuery)) score += 30;
    if (normBook.includes(normQuery)) score += 15;

    // Extract contextual snippet from original text (cleaned of any raw markdown hashes)
    const rawText = (r.text || '').replace(/#{1,6}\s*/g, '').replace(/\s+/g, ' ').trim();
    const firstTokenRaw = rawQuery.trim().split(/\s+/)[0];
    let matchPos = rawText.indexOf(firstTokenRaw);
    if (matchPos === -1) {
      // Fallback approximate position using normalized index
      const normIdx = normText.indexOf(queryTokens[0]);
      matchPos = normIdx > 0 ? Math.min(rawText.length - 1, normIdx) : 0;
    }

    const start = Math.max(0, matchPos - 75);
    const end = Math.min(rawText.length, matchPos + 165);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < rawText.length ? '...' : '';
    const snippet = `${prefix}${rawText.slice(start, end).trim()}${suffix}`;

    results.push({
      record: r,
      book,
      snippet,
      score,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export interface ContactFormInput {
  name: string;
  email: string;
  inquiryType: string;
  bookReference?: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

/**
 * Validates the institutional contact and manuscript verification form.
 */
export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};

  if (!input.name || input.name.trim().length < 3) {
    errors.name = 'يرجى إدخال الاسم الكامل (٣ أحرف على الأقل).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'يرجى إدخال بريد إلكتروني صحيح للتواصل.';
  }

  if (!input.message || input.message.trim().length < 15) {
    errors.message = 'يرجى كتابة تفاصيل الملاحظة أو الرسالة بوضوح (١٥ حرفاً على الأقل).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Computes aggregate encyclopedia statistics.
 */
export function computeLibraryStats(
  books: BookItem[] = LIBRARY_CATALOG,
  authors: AuthorItem[] = AUTHORS_CATALOG,
  totalIndexedChapters = 1692
) {
  const totalWords = books.reduce((sum, b) => sum + (b.words_count || 0), 0);
  const totalChapters = books.reduce((sum, b) => sum + (b.chapters_count || 0), 0) || totalIndexedChapters;
  const totalVerses = books.reduce((sum, b) => sum + (b.verses_count || 0), 0);

  const pillarCounts: Record<PillarFilter, number> = {
    all: books.length,
    wisdom: 0,
    literature: 0,
    history: 0,
    language: 0,
    travel: 0,
    poetry: 0,
    biography: 0,
  };

  books.forEach((b) => {
    if (pillarCounts[b.pillar] !== undefined) {
      pillarCounts[b.pillar]++;
    }
  });

  const eraCounts: Record<EraFilter, number> = {
    all: authors.length,
    early: 0,
    abbasid: 0,
    andalusian: 0,
    mamluk_ottoman: 0,
    modern: 0,
  };

  authors.forEach((a) => {
    const key = a.era_id as EraFilter;
    if (eraCounts[key] !== undefined) {
      eraCounts[key]++;
    }
  });

  return {
    totalBooks: books.length,
    totalAuthors: authors.length,
    totalChapters,
    totalWords,
    totalVerses,
    pillarCounts,
    eraCounts,
  };
}
