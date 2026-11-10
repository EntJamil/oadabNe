import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeArabicText,
  stripTashkeel,
  filterBooks,
  filterAuthors,
  getAuthorWorks,
  searchCorpus,
  validateContactForm,
  computeLibraryStats,
} from './heritageLogic';
import { LIBRARY_CATALOG, AUTHORS_CATALOG } from '../data/catalogData';

test('normalizeArabicText unifies hamzas, teh marbuta, and strips diacritics', () => {
  const input = 'أَدَبُ أُمَّتِنَا — المَوْسُوعَةُ الرَّقْمِيَّةُ';
  const normalized = normalizeArabicText(input);
  assert.equal(normalized, 'ادب امتنا — الموسوعه الرقميه');
});

test('stripTashkeel removes vowel marks while preserving base Arabic letters', () => {
  const input = 'طوق الحمامة في الأُلفة والأُلاّف';
  const stripped = stripTashkeel(input);
  assert.equal(stripped, 'طوق الحمامة في الألفة والألاف');
});

test('filterBooks filters by pillar and normalized Arabic query accurately', () => {
  const allBooks = filterBooks(LIBRARY_CATALOG, { pillar: 'all' });
  assert.equal(allBooks.length, 66);

  const ibnKhaldunResults = filterBooks(LIBRARY_CATALOG, { query: 'ابن خلدون' });
  assert.ok(ibnKhaldunResults.length >= 1);
  assert.ok(ibnKhaldunResults.some((b) => b.id === 'muqaddimah_ibn_khaldun'));

  const travelBooks = filterBooks(LIBRARY_CATALOG, { pillar: 'travel' });
  assert.ok(travelBooks.length >= 3);
  assert.ok(travelBooks.every((b) => b.pillar === 'travel'));
});

test('filterAuthors and getAuthorWorks link authors to their catalog books', () => {
  const allAuthors = filterAuthors(AUTHORS_CATALOG, { era: 'all' });
  assert.ok(allAuthors.length >= 50);

  const andalusianAuthors = filterAuthors(AUTHORS_CATALOG, { era: 'andalusian' });
  assert.ok(andalusianAuthors.length >= 3);

  const jahiz = AUTHORS_CATALOG.find((a) => normalizeArabicText(a.name).includes('الجاحظ'));
  assert.ok(jahiz, 'Al-Jahiz should exist in AUTHORS_CATALOG');
  const jahizBooks = getAuthorWorks(jahiz!, LIBRARY_CATALOG);
  assert.ok(jahizBooks.length >= 1, 'Al-Jahiz should have linked books in the catalog');
});

test('searchCorpus ranks exact title and text matches with context snippets', () => {
  const sampleRecords = [
    {
      book_id: 'kalila_wa_dimna',
      book: 'كليلة ودِمنة',
      author: 'عبد الله بن المقفع',
      chapter: 6,
      title: 'باب الأسد والثور',
      subtitle: 'عبد الله بن المقفع',
      text: 'قال دبشليم الملك لبيدبا الفيلسوف: اضرب لي مثلاً لمتحابين يقطع بينهما الكذوب المحتال حتى يحملهما على العداوة والبغضاء.',
      url: '/book/kalila_wa_dimna/chapter-6/',
      verified: true,
    },
    {
      book_id: 'alf_layla',
      book: 'ألف ليلة وليلة',
      author: 'تراث شعبي مشرقي',
      chapter: 1,
      title: 'حكايات الملك شهريار',
      subtitle: 'المجلد الأول',
      text: 'كان في قديم الزمان وسالف العصر والأوان ملك من ملوك ساسان بجزائر الهند والصين.',
      url: '/book/alf_layla/chapter-1/',
      verified: true,
    },
  ];

  const hits = searchCorpus(sampleRecords, 'دبشليم الملك');
  assert.equal(hits.length, 1);
  assert.equal(hits[0].record.book_id, 'kalila_wa_dimna');
  assert.ok(hits[0].snippet.includes('دبشليم'));
});

test('validateContactForm rejects empty or invalid inputs and accepts valid submissions', () => {
  const invalid = validateContactForm({
    name: 'أ',
    email: 'invalid-email',
    inquiryType: 'تحقيق نصي',
    message: 'قصير',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'د. عبد الله بن محمد',
    email: 'researcher@example.com',
    inquiryType: 'تصحيح أو تحقيق نصي',
    bookReference: 'كليلة ودمنة - الفصل ٤',
    message: 'ملاحظة علمية حول ضبط عبارة في باب برزويه الطبيب مع الإحالة للمصدر.',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('computeLibraryStats aggregates books, chapters, and words accurately', () => {
  const stats = computeLibraryStats();
  assert.equal(stats.totalBooks, 66);
  assert.ok(stats.totalWords > 3000000);
  assert.ok(stats.totalAuthors >= 50);
});
