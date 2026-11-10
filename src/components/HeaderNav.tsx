import React, { useState } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';

export type AppRoutePage =
  | 'home'
  | 'authors'
  | 'author-detail'
  | 'search'
  | 'reader'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';

interface HeaderNavProps {
  activePage: AppRoutePage;
  onNavigate: (page: AppRoutePage) => void;
  onOpenLastRead: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activePage,
  onNavigate,
  onOpenLastRead,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppRoutePage; label: string }[] = [
    { id: 'home', label: 'خزانة الكتب' },
    { id: 'authors', label: 'الأدباء والأعلام' },
    { id: 'search', label: 'البحث في المتون' },
    { id: 'about', label: 'عن الموسوعة' },
    { id: 'contact', label: 'اتصل بنا' },
  ];

  const handleNavClick = (page: AppRoutePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-40 border-b transition-colors"
      style={{
        backgroundColor: 'var(--header-bg)',
        color: 'var(--header-text)',
        borderColor: 'rgba(212, 175, 55, 0.22)',
      }}
    >
      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="font-display text-2xl font-bold tracking-tight whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          style={{ color: '#E8C872' }}
        >
          أَدَبُ أُمَّتِنَا
        </a>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive =
              activePage === item.id ||
              (item.id === 'authors' && activePage === 'author-detail');
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  isActive
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-300 hover:text-white hover:border-stone-500'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenLastRead}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              backgroundColor: '#B38728',
              color: '#FFFFFF',
            }}
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>قاعة المطالعة</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg text-stone-200 hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="قائمة الجوال"
          className="md:hidden border-t px-6 py-3 flex flex-col gap-1"
          style={{
            backgroundColor: 'var(--header-bg)',
            borderColor: 'rgba(212, 175, 55, 0.18)',
          }}
        >
          {navItems.map((item) => {
            const isActive =
              activePage === item.id ||
              (item.id === 'authors' && activePage === 'author-detail');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-right py-2.5 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-stone-200 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
