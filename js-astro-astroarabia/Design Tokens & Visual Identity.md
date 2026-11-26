### نظام التصميم والألوان المتطور (Design Tokens & Visual Identity)

يتفوق نظام تصميم **AstroArabia** على نمط AstroWind التقليدي بالاعتماد على:

1. **شبكة ألوان متكيفة (Adaptive Preset Palettes):** تخصيص ألوان وظيفية لكل نموذج عمل بدلاً من لون أساسي موحد.
2. **عناصر الزجاج المصقول (Modern Glassmorphism):** تدرجات خفيفة وظلال ناعمة (Mesh Gradients & Glow Effects).
3. **تنسيق الخطوط الذهبي:** دمج خط `Alexandria` للعناوين المودرن مع `IBM Plex Sans Arabic` لسهولة القراءة النصية الطويلة.

#### ملف `src/styles/global.css` (Tailwind CSS v4 Engine)

```css
@import "tailwindcss";
@import "@fontsource-variable/alexandria";
@import "@fontsource-variable/ibm-plex-sans-arabic";

@theme {
  /* الخطوط */
  --font-sans: "IBM Plex Sans Arabic Variable", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-heading: "Alexandria Variable", sans-serif;

  /* لوحة ألوان الشركات والخدمات (Corporate Emerald) */
  --color-corporate-50: #ecfdf5;
  --color-corporate-600: #059669;
  --color-corporate-900: #064e3b;

  /* لوحة ألوان الـ SaaS والمنتجات (SaaS Violet) */
  --color-saas-50: #f5f3ff;
  --color-saas-600: #7c3aed;
  --color-saas-900: #4c1d95;

  /* لوحة ألوان التوثيق والبرمجة (Docs Cyan & Slate) */
  --color-docs-600: #0891b2;
  --color-surface-code: #0b1120;

  /* لوحة ألوان العلامة الشخصية (Personal Amber) */
  --color-personal-500: #f59e0b;
  --color-personal-900: #78350f;

  /* لوحة ألوان الهبوط والإعلانات (High-Conversion Rose) */
  --color-conversion-500: #f43f5e;
  --color-conversion-600: #e11d48;
}

@layer base {
  html {
    direction: rtl;
    text-align: start;
    font-family: var(--font-sans);
    letter-spacing: normal;
    line-height: 1.8;
    background-color: #030712;
    color: #f3f4f6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    letter-spacing: -0.02em;
  }
}

/* بطاقات المظاهر الحديثة وتأثيرات الإضاءة */
.glow-card {
  background: radial-gradient(1000px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.06), transparent 40%);
}

```

---

### معمارية النماذج الخمسة الجاهزة (Multi-Demo Presets Directory)

```text
src/
├── components/
│   ├── widgets/
│   │   ├── corporate/       # ContactMap, MultiStepQuote, ServiceGrid
│   │   ├── saas/            # PricingSwitcher, FeatureMatrix, BentoGrid
│   │   ├── docs/            # CodeSnippetLTR, DocSearch, TableOfContents
│   │   ├── personal/        # CaseStudyCard, ResumeTimeline, BookingWidget
│   │   └── landing/         # UrgencyTimer, SocialProofToast, StickyCTA
├── content/
│   ├── docs/                # شروحات ومقالات التوثيق البرمجي
│   ├── portfolio/           # دراسات الحالة وأعمال المستقلين
│   └── changelog/           # سجل تحديثات المنتجات التقنية
└── pages/
    ├── index.astro          # البوابة الرئيسية لاستعراض القالب والنماذج
    ├── agency/              # 1. نموذج الشركات والخدمات
    ├── saas/                # 2. نموذج المنتجات الرقمية والـ SaaS
    ├── docs/                # 3. نموذج التوثيق وقواعد المعرفة
    ├── portfolio/           # 4. نموذج العلامة الشخصية والمستقلين
    └── landing/             # 5. صفحة الهبوط الإعلانية عالية التحويل

```

---

### بناء المكونات الأيقونية للنماذج الخمسة

#### 1. نموذج الشركات والخدمات (Corporate): نموذج طلب عرض سعر تفاعلي

`src/components/widgets/corporate/MultiStepQuote.astro`

```astro
---
import { Icon } from 'astro-icon/components';
---

<div class="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/20 shadow-2xl backdrop-blur-xl">
  <div class="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
    <div>
      <h3 class="text-2xl font-bold font-heading text-white">طلب عرض سعر مباشر</h3>
      <p class="text-slate-400 text-sm mt-1">احصل على تسعير فوري ودقيق خلال دقائق</p>
    </div>
    <span class="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
      استجابة فورية
    </span>
  </div>

  <form class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">نوع الخدمة المطلوبة</label>
        <select class="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none">
          <option>استشارات وتطوير برمجيات</option>
          <option>خدمات الصيانة والتشغيل</option>
          <option>إدارة الحملات الرقمية</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">رقم الجوال / واتساب</label>
        <input type="tel" placeholder="05xxxxxxxx" dir="ltr" class="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-right focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>
    </div>

    <button type="submit" class="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2">
      <Icon name="lucide:send" class="w-5 h-5" />
      <span>إرسال الطلب عبر واتساب المباشر</span>
    </button>
  </form>
</div>

```

---

#### 2. نموذج المنتجات الرقمية (SaaS): جدول تسعير تفاعلي بتصميم Bento Grid

`src/components/widgets/saas/PricingSwitcher.astro`

```astro
---
import { Icon } from 'astro-icon/components';

const plans = [
  {
    name: "البداية",
    priceMonthly: "99",
    priceYearly: "79",
    desc: "مثالية للمشاريع الناشئة والفرق الصغيرة.",
    features: ["5 مستخدمين", "دعم فني عبر البريد", "تحديثات مجانية لمدة سنة"],
    isPopular: false
  },
  {
    name: "الاحترافية",
    priceMonthly: "249",
    priceYearly: "199",
    desc: "أفضل قيمة للشركات سريعة النمو.",
    features: ["مستخدمين غير محدودين", "دعم أولوية على مدار الساعة", "تكامل API كامل", "نسخ احتياطي يومي"],
    isPopular: true
  }
];
---

<div class="max-w-6xl mx-auto px-4 py-16">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
    {plans.map((plan) => (
      <div class={`relative flex flex-col justify-between p-8 rounded-3xl border transition-all duration-300 ${
        plan.isPopular 
          ? "bg-slate-900/90 border-violet-500 shadow-2xl shadow-violet-900/20 ring-2 ring-violet-500/50" 
          : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
      }`}>
        {plan.isPopular && (
          <span class="absolute -top-4 start-8 px-4 py-1 text-xs font-bold rounded-full bg-violet-600 text-white uppercase tracking-wider">
            الأكثر طلباً
          </span>
        )}

        <div>
          <h3 class="text-2xl font-bold text-white mb-2">{plan.name}</h3>
          <p class="text-slate-400 text-sm mb-6">{plan.desc}</p>
          
          <div class="flex items-baseline gap-2 mb-8">
            <span class="text-5xl font-black font-heading text-white">{plan.priceMonthly}</span>
            <span class="text-slate-400 text-sm">ريال / شهرياً</span>
          </div>

          <ul class="space-y-4 mb-8">
            {plan.features.map((feature) => (
              <li class="flex items-center gap-3 text-slate-300 text-sm">
                <Icon name="lucide:check-circle-2" class="w-5 h-5 text-violet-400 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <a href="#subscribe" class={`w-full py-3.5 rounded-xl font-bold text-center transition ${
          plan.isPopular 
            ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30" 
            : "bg-slate-800 hover:bg-slate-700 text-slate-200"
        }`}>
          اختر هذه الخطة
        </a>
      </div>
    ))}
  </div>
</div>

```

---

#### 3. نموذج التوثيق (Documentation): كتل برمجية متناسقة Bi-Directional

`src/components/widgets/docs/CodeSnippetLTR.astro`

```astro
---
interface Props {
  title: string;
  code: string;
  lang?: string;
}

const { title, code, lang = "bash" } = Astro.props;
---

<div class="w-full my-6 rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden shadow-xl">
  <div class="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
    <span class="text-xs font-mono font-medium text-slate-400">{title}</span>
    <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{lang}</span>
  </div>
  <div class="p-4 overflow-x-auto" dir="ltr">
    <pre class="text-sm font-mono text-cyan-300 leading-relaxed"><code>{code}</code></pre>
  </div>
</div>

```

---

#### 4. نموذج العلامة الشخصية (Portfolio): بطاقة دراسة حالة سينمائية

`src/components/widgets/personal/CaseStudyCard.astro`

```astro
---
import { Icon } from 'astro-icon/components';

interface Props {
  title: string;
  metric: string;
  category: string;
  image: string;
}

const { title, metric, category, image } = Astro.props;
---

<div class="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-amber-500/50 transition-all duration-500">
  <div class="aspect-video w-full overflow-hidden bg-slate-950">
    <img src={image} alt={title} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
  </div>

  <div class="p-6">
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-semibold text-amber-400 uppercase">{category}</span>
      <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">{metric}</span>
    </div>
    
    <h3 class="text-xl font-bold text-white group-hover:text-amber-300 transition mb-4">{title}</h3>
    
    <a href="#view" class="inline-flex items-center gap-2 text-sm font-bold text-slate-300 group-hover:text-white transition">
      <span>استعراض تفاصيل المشروع</span>
      <Icon name="lucide:arrow-left" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
    </a>
  </div>
</div>

```

---

#### 5. نموذج الهبوط الإعلاني (High-Converting Landing): شريط تحفيز وإثبات اجتماعي

`src/components/widgets/landing/UrgencyTimer.astro`

```astro
---
import { Icon } from 'astro-icon/components';
---

<div class="fixed bottom-0 inset-x-0 z-50 p-4 bg-slate-950/95 border-t border-rose-500/30 backdrop-blur-lg shadow-2xl">
  <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
      </span>
      <p class="text-sm font-bold text-white">
        عرض خاص ينتهي قريباً: <span class="text-rose-400">خصم 40%</span> لأول 50 عميل فقط!
      </p>
    </div>

    <div class="flex items-center gap-3 w-full sm:w-auto">
      <a href="#order" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-lg shadow-rose-600/30 transition text-center">
        احجز مقعدك الآن
      </a>
    </div>
  </div>
</div>

```

---

### إستراتيجية الأصول البصرية والصور الفائقة (Visual Asset Strategy)

للتفوق البصري الكامل على قوالب الـ LTR المترجمة:

* **Vector Mesh Gradients:** استخدام رسومات SVG خفيفة كخلفيات حركية نابضة بدلاً من الصور النقطية الثقيلة.
* **موك آب واجهات مخصصة (RTL UI Mockups):** تصميم لوحات تحكم عربية حصرية داخل إطارات الزجاج (Mac OS Frame مع كتابات عربية نقية).
* **توليد أغلفة السوشيال ميديا تلقائياً (Dynamic OG Images):** تكامل مع محرك Satori لتوليد بطاقات مشاركة عربية تلقائية بدقة عالية لكل تدوينة أو صفحة خدمة.