import React, { useState } from 'react';
import {
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { LIBRARY_CATALOG } from '../data/catalogData';
import {
  ContactFormInput,
  validateContactForm,
} from '../utils/heritageLogic';
import { AppRoutePage } from './HeaderNav';

const CODEX_IMAGE_URL = '/src/assets/images/featured_illuminated_codex_1794328075320.jpg';
const ASTROLABE_IMAGE_URL = '/src/assets/images/scholars_astrolabe_inkwell_1794328076219.jpg';

interface AboutViewProps {
  onNavigate: (page: AppRoutePage) => void;
  onOpenReader: (bookId: string, chapterId?: number) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  onOpenReader,
}) => {
  const [codexImgFailed, setCodexImgFailed] = useState(false);
  const [astrolabeImgFailed, setAstrolabeImgFailed] = useState(false);

  return (
    <div className="max-w-[1140px] mx-auto px-6 py-10">
      {/* Editorial Header */}
      <header
        className="rounded-xl border p-8 lg:p-10 mb-10"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div
          className="text-xs font-semibold mb-2"
          style={{ color: 'var(--accent-primary)' }}
        >
          المنهج العلمي والرسالة الحضارية
        </div>
        <h1
          className="font-display text-3xl lg:text-4xl font-bold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          عن موسوعة «أَدَبُ أُمَّتِنَا» للتراث والتاريخ العربي
        </h1>
        <p
          className="text-base leading-loose max-w-[72ch]"
          style={{ color: 'var(--text-secondary)' }}
        >
          منصة «أَدَبُ أُمَّتِنَا» (OADAB) هي مبادرة ثقافية ومعرفية رقمية تهدف إلى
          إحياء عيون التراث العربي والإسلامي وتقديم أمهات الكتب الأدبية والتاريخية
          والفلسفية في حلة رقمية محققة، تجمع بين أصالة المتن الكلاسيكي وأحدث
          معايير الطباعة الرقمية والبحث الفوري.
        </p>
      </header>

      {/* 2-Column Editorial Visual + Methodology Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
        <div
          className="lg:col-span-7 rounded-xl border p-8 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div>
            <h2
              className="font-display text-2xl font-bold mb-6 pb-3 border-b"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              الأركان الأربعة لمنهجية المنصة
            </h2>

            <div className="space-y-6">
              <div>
                <h3
                  className="font-display text-xl font-bold mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  01. أمهات الكتب المحققة والمكتملة
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  نعرض في الخزانة العامة الكتب الـ ٦٦ التي اجتازت فحوص الاكتمال
                  ومطابقة الفصول والمصادر وحقوق إعادة النشر، ونحتفظ بالمسودات
                  والمقتطفات قيد التدقيق خارج العرض العام لضمان الموثوقية العلمية.
                </p>
              </div>

              <div>
                <h3
                  className="font-display text-xl font-bold mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  02. قارئ تفاعلي فائق السرعة
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  واجهة مطالعة مرنة تدعم البحث السريع داخل الفصول، والتحكم بإظهار
                  أو إخفاء حركات التشكيل، وتخصيص الخطوط العربية الأصيلة، وأربعة
                  أنماط لونية مريحة للعين (الورق التراثي، النهاري، الأندلسي، والليلي).
                </p>
              </div>

              <div>
                <h3
                  className="font-display text-xl font-bold mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  03. توثيق الحقوق والمصادر المرجعية
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  تختلف حالة حقوق النشر بحسب المؤلف والبلد والطبعة؛ لذا نلتزم
                  بنشر المتون الواقعة في الملك العام (Public Domain) أو المرخصة
                  بالمشاع الإبداعي مع إرفاق رابط المصدر المرجعي وتاريخ التدقيق لكل كتاب.
                </p>
              </div>

              <div>
                <h3
                  className="font-display text-xl font-bold mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  04. فهرسة شاملة ومحرك بحث نصي
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  تضم الموسوعة أكثر من ١,٦٩٢ فصلاً وباباً مفهرساً بالكامل بأكثر من
                  ٣.٧ مليون كلمة، مما يتيح للباحثين الوصول إلى الشواهد والأبيات
                  والمفاهيم في أجزاء من الثانية.
                </p>
              </div>
            </div>
          </div>

          <div
            className="mt-8 pt-6 border-t flex flex-wrap items-center gap-3"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 text-xs font-semibold rounded-lg text-white cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              تصفح خزانة الكتب (66)
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-4 py-2.5 text-xs font-medium rounded-lg border cursor-pointer"
              style={{
                borderColor: 'var(--border-strong)',
                color: 'var(--text-primary)',
              }}
            >
              تواصل مع هيئة التحرير
            </button>
          </div>
        </div>

        {/* Visual Showcase Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <figure
            className="rounded-xl border overflow-hidden flex-1 flex flex-col"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="relative h-56 w-full overflow-hidden bg-stone-900">
              {!codexImgFailed ? (
                <img
                  src={CODEX_IMAGE_URL}
                  alt="مخطوطة عربية مذهبة توضح العناية بالخط العربي والزخرفة الهندسية"
                  referrerPolicy="no-referrer"
                  onError={() => setCodexImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-xl text-amber-200">
                  المخطوطات العربية المذهبة
                </div>
              )}
            </div>
            <figcaption
              className="p-4 text-xs leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              لوحة ١ — العناية بجماليات الخط العربي وضبط المتون على غرار المصاحف
              والمخطوطات التراثية المحققة.
            </figcaption>
          </figure>

          <figure
            className="rounded-xl border overflow-hidden flex-1 flex flex-col"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="relative h-56 w-full overflow-hidden bg-stone-900">
              {!astrolabeImgFailed ? (
                <img
                  src={ASTROLABE_IMAGE_URL}
                  alt="إسطرلاب عربي تاريخي وأقلام قصب ومجلدات تراثية"
                  referrerPolicy="no-referrer"
                  onError={() => setAstrolabeImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-xl text-amber-200">
                  تراث العلوم والآداب العربية
                </div>
              )}
            </div>
            <figcaption
              className="p-4 text-xs leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              لوحة ٢ — التكامل بين علوم اللسان والأدب والتاريخ والجغرافيا والفلسفة
              في الحضارة العربية.
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
};

export interface SubmittedFeedbackTicket {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  bookReference: string;
  message: string;
  createdAt: string;
}

interface ContactViewProps {
  onNavigate: (page: AppRoutePage) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [formState, setFormState] = useState<ContactFormInput>({
    name: '',
    email: '',
    inquiryType: 'تصحيح مطبعي أو تحقيق نصي',
    bookReference: 'kalila_wa_dimna',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormInput, string>>>({});
  const [submittedTickets, setSubmittedTickets] = useState<SubmittedFeedbackTicket[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(formState);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const matchedBook = LIBRARY_CATALOG.find(
      (b) => b.id === formState.bookReference
    );
    const newTicket: SubmittedFeedbackTicket = {
      id: `OADAB-${1040 + submittedTickets.length + 1}`,
      name: formState.name.trim(),
      email: formState.email.trim(),
      inquiryType: formState.inquiryType,
      bookReference: matchedBook ? matchedBook.title : 'ملاحظة عامة',
      message: formState.message.trim(),
      createdAt: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setSubmittedTickets((prev) => [newTicket, ...prev]);
    setFormState((prev) => ({
      ...prev,
      message: '',
    }));
  };

  return (
    <div className="max-w-[1140px] mx-auto px-6 py-10">
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
          التواصل العلمي وملاحظات التحقيق
        </div>
        <h1
          className="font-display text-3xl lg:text-4xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          اتصل بنا وأرسل ملاحظات التدقيق النصي
        </h1>
        <p
          className="text-base leading-relaxed max-w-[68ch]"
          style={{ color: 'var(--text-secondary)' }}
        >
          يسعد فريق التحرير في «أَدَبُ أُمَّتِنَا» باستقبال ملاحظات الباحثين والقراء
          حول ضبط النصوص، اقتراحات الكتب التراثية، أو الاستفسارات المؤسسية.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Right Column (7 cols): Interactive Contact & Manuscript Feedback Form */}
        <section
          className="lg:col-span-7 rounded-xl border p-8"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <h2
            className="font-display text-2xl font-bold mb-6 pb-3 border-b"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            نموذج المراسلة وتوثيق الملاحظات
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                الاسم الكامل أو الصفة العلمية *
              </label>
              <input
                id="contact-name"
                type="text"
                value={formState.name}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="مثال: د. عبد الله بن محمد"
                className="w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: errors.name
                    ? '#DC2626'
                    : 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                البريد الإلكتروني *
              </label>
              <input
                id="contact-email"
                type="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: errors.email
                    ? '#DC2626'
                    : 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-type"
                  className="block text-xs font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  نوع المراسلة
                </label>
                <select
                  id="contact-type"
                  value={formState.inquiryType}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      inquiryType: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="تصحيح مطبعي أو تحقيق نصي">
                    تصحيح مطبعي أو تحقيق نصي
                  </option>
                  <option value="اقتراح إضافة كتاب تراثي">
                    اقتراح إضافة كتاب تراثي
                  </option>
                  <option value="استفسار حول حقوق النشر والمصادر">
                    استفسار حول حقوق النشر والمصادر
                  </option>
                  <option value="تعاون بحثي أو مؤسسي">
                    تعاون بحثي أو مؤسسي
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-book"
                  className="block text-xs font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  الكتاب المرتبط (اختياري)
                </label>
                <select
                  id="contact-book"
                  value={formState.bookReference}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      bookReference: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="general">ملاحظة عامة على المنصة</option>
                  {LIBRARY_CATALOG.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                تفاصيل الرسالة أو الملاحظة العلمية *
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={formState.message}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="اكتب رسالتك أو رقم الفصل واسم الكتاب والملاحظة بدقة..."
                className="w-full px-4 py-3 text-sm rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: errors.message
                    ? '#DC2626'
                    : 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
              {errors.message && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold rounded-lg text-white transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الملاحظة لهيئة التحرير</span>
              </button>

              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                يتم الرد خلال ٢٤ — ٤٨ ساعة عمل
              </span>
            </div>
          </form>

          {/* Submitted Verification Tickets List */}
          {submittedTickets.length > 0 && (
            <div
              className="mt-8 pt-6 border-t space-y-3"
              style={{ borderColor: 'var(--border-subtle)' }}
              data-testid="submitted-tickets-list"
            >
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                <CheckCircle2 className="w-4 h-4" />
                <span>سجل المراسلات المرسلة ({submittedTickets.length})</span>
              </h3>
              {submittedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-lg border p-4 text-xs"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-strong)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 font-semibold mb-1">
                    <span>
                      {ticket.inquiryType} · {ticket.bookReference}
                    </span>
                    <span className="font-mono-nums">{ticket.id}</span>
                  </div>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {ticket.message}
                  </p>
                  <div style={{ color: 'var(--text-muted)' }}>
                    مرسلة باسم: {ticket.name} ({ticket.email}) · تم الاستلام بنجاح
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Left Column (5 cols): Official Channels & Editorial Hours */}
        <aside
          className="lg:col-span-5 rounded-xl border p-8 space-y-6"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <h2
            className="font-display text-2xl font-bold pb-3 border-b"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            قنوات التواصل والشبكات الرسمية
          </h2>

          <div className="space-y-5 text-sm">
            <div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                البريد الإلكتروني المباشر
              </h3>
              <p className="text-xs leading-relaxed mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                للمراسلات الأكاديمية وملاحظات حقوق النشر والتدقيق:
              </p>
              <a
                href="mailto:contact@oadab.com"
                className="text-xs font-mono-nums font-semibold underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                contact@oadab.com
              </a>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                قناة يوتيوب الرسمية (@OADAB)
              </h3>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                تسجيلات صوتية وقراءات مختارة من عيون الشعر والنثر والحكمة العربية:
              </p>
              <a
                href="https://www.youtube.com/@OADAB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                <span>زيارة قناة يوتيوب الرسمية</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                حساب تيك توك الرسمي (@OADAB)
              </h3>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                مقتطفات يومية وشواهد بلاغية موجزة من أمهات الكتب:
              </p>
              <a
                href="https://www.tiktok.com/@OADAB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                <span>متابعة حساب @OADAB</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                أوقات المتابعة والرد
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                يقوم فريق التحرير بمراجعة الملاحظات النصية ومطابقتها على الطبعات
                المرجعية والرد عليها خلال ٢٤ — ٤٨ ساعة كحد أقصى.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

interface LegalViewProps {
  type: 'privacy' | 'terms';
  onNavigate: (page: AppRoutePage) => void;
}

export const LegalDocumentView: React.FC<LegalViewProps> = ({
  type,
  onNavigate,
}) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="max-w-[920px] mx-auto px-6 py-10">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer"
          style={{ color: 'var(--accent-primary)' }}
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة إلى خزانة الكتب</span>
        </button>
      </div>

      <article
        className="rounded-xl border p-8 lg:p-12"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <header
          className="pb-6 mb-8 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div
            className="text-xs font-semibold mb-2"
            style={{ color: 'var(--accent-primary)' }}
          >
            الوثائق القانونية والتنظيمية · منصة أدب أمتنا (OADAB)
          </div>
          <h1
            className="font-display text-3xl lg:text-4xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {isPrivacy
              ? 'وثيقة سياسة الخصوصية وسرية البيانات'
              : 'شروط الاستخدام وبيان الملكية الفكرية'}
          </h1>
        </header>

        {isPrivacy ? (
          <div
            className="space-y-6 text-sm leading-loose"
            style={{ color: 'var(--text-secondary)' }}
          >
            <section>
              <h2
                className="font-display text-xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                ١. البيانات التي نجمعها
              </h2>
              <p>
                تتيح منصة «أَدَبُ أُمَّتِنَا» تصفح ومطالعة جميع الكتب والمتون التراثية
                مجاناً دون اشتراط إنشاء حساب شخصي أو تقديم بيانات تعريفية. عند
                مراسلتنا عبر نموذج التواصل، نستخدم الاسم والبريد الإلكتروني حصراً
                للرد على استفسارك أو ملاحظتك العلمية.
              </p>
            </section>

            <section>
              <h2
                className="font-display text-xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                ٢. التخزين المحلي وتفضيلات القراءة (LocalStorage)
              </h2>
              <p>
                يستخدم القارئ التفاعلي تقنية التخزين المحلي في متصفحك لحفظ
                تفضيلاتك الشخصية مثل: المظهر اللوني المختار (الورق التراثي أو
                الليلي)، حجم الخط العربي، والإشارات المرجعية للفصول التي توقفت
                عندها. تبقى هذه البيانات على جهازك فقط ولا يتم نقلها إلى خوادم
                خارجية.
              </p>
            </section>

            <section>
              <h2
                className="font-display text-xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                ٣. الأمان وحماية الاتصال
              </h2>
              <p>
                تعمل جميع صفحات وفهارس المنصة عبر بروتوكول التشفير الآمن (HTTPS /
                SSL) لضمان سلامة المحتوى وسرية التصفح للباحثين والطلاب في جميع
                أنحاء العالم.
              </p>
            </section>
          </div>
        ) : (
          <div
            className="space-y-6 text-sm leading-loose"
            style={{ color: 'var(--text-secondary)' }}
          >
            <section>
              <h2
                className="font-display text-xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                ١. الوضع القانوني لنصوص التراث (الملك العام)
              </h2>
              <p>
                الأصل في المتون التراثية الكلاسيكية المنشورة في «أَدَبُ أُمَّتِنَا» أنها
                من التراث الإنساني والعربي العام (Public Domain) لتقادم عهد
                مؤلفيها عبر القرون، أو مأخوذة من طبعات ومصادر رقمية تتيح إعادة
                النشر غير التجاري والعلمي مع توثيق المصدر المرجعي لكل مصنف.
              </p>
            </section>

            <section>
              <h2
                className="font-display text-xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                ٢. حقوق التصميم والبرمجة وهوية المنصة
              </h2>
              <p>
                إن البرمجيات الخاصة بالقارئ التفاعلي، هيكلة قواعد البيانات،
                والهوية البصرية لمنصة «أَدَبُ أُمَّتِنَا» (OADAB) محمية بموجب قوانين
                الملكية الفكرية، ولا يجوز نسخ الواجهات البرمجية أو انتحال الهوية
                المؤسسية للمنصة.
              </p>
            </section>

            <section>
              <h2
                className="font-display text-xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                ٣. الاستخدام العادل والعلمي
              </h2>
              <p>
                يُسمح للباحثين والطلاب والمؤسسات التعليمية بالاقتباس من متون
                الموسوعة والاستشهاد بها في الأبحاث والدراسات مع الإحالة العلمية
                إلى الكتاب والمؤلف والفصل.
              </p>
            </section>
          </div>
        )}
      </article>
    </div>
  );
};
