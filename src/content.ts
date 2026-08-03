/**
 * ============================================================
 *  EDIT THIS FILE — all portfolio content lives here.
 *  Put your name, roles, projects, talks, and contact info.
 *  Images go in /public (portrait, logos, talk thumbs, etc.)
 * ============================================================
 */

export type CaseStudy = {
  title: string
  meta: string
  body: string
  badge?: string
  facts: string[]
  process?: string[]
  note?: string
  metrics?: {
    title: string
    items: { value: string; label: string; note?: string }[]
  }
  links?: { label: string; href: string }[]
  figma?: string
}

export type Talk = {
  title: string
  tags: string[]
  meta: string
  /** YouTube video id — leave empty to skip embed */
  video?: string
  start?: number
  /** Optional thumbnail under /public */
  img?: string
}

export const content = {
  /** Browser tab title */
  siteTitle: 'Mahdieh Dehghan — Portfolio',

  /** Top-left brand line */
  brand: 'Mahdieh Dehghan',

  /** Top-right status */
  status: 'portfolio — 2026',

  /** Loader word (outlined) */
  loaderWord: 'Hi There!',

  /** Scroll hint under the stage */
  scrollHint: 'Explore Away!',

  /** Section ids — keep in sync with section order below */
  sections: [
    'intro',
    'About Me',
    'Experience',
    'More',
    'Achievements',
    'Projects',
    'talks',
    'manifesto',
    "Contact Me!",
  ] as const,

  intro: {
    first: 'Mahdie',
    last: 'Dehghan',
    alias: '( Marketing Manager )',
    roles: ['Marketing', 'Brand', 'Growth', 'Strategy'],
    /** Place your photo at \public\Portrait.png */
portrait: `${import.meta.env.BASE_URL}Portrait.png`,
  },

  pitch: {
    title: 'About Me',
    body: 'Marketing & Brand Manager with 6+ years driving brand growth, marketing operations, customer acquisition, and digital transformation.',
  },

  decade: {
    title: '6+ years helping FinTech, Web3, and eCommerce brands grow',
    /** Logo files in /public/logos/logo-1.png … or leave empty for text chips */
    logos: [
      'Bazaryaban Iran Zamin',
      'Ernyka Holding',
      'Rabex',
      'Exbito',
      'Kalaoma',
    ],
  },

  story: {
    roles: [
{ role: 'Marketing & Brand Strategist @ Bazaryaban Iran Zamin', period: 'Jun 2023 — present' },
      { role: 'UX Researcher & Senior Marketing Specialist @ Ernyka Holding', period: '2021 — 2023' },
      { role: 'Senior Content Specialist – FinTech @ Rabex (Freelance)', period: '2021 — 2022' },
      { role: 'Digital Content & Brand Manager @ Exbito Cryptocurrency Exchange', period: '2020 — 2022' },
      { role: 'Senior SEO & Content Production Specialist @ Kalaoma', period: '2018 — 2020' },
    ],
    facts: [
      'FinTech & Web3 storyteller',
      'Marketing automation nerd',
      'Data over guesswork',
      'Cross-functional by nature',
      'Always shipping campaigns',
      '',
      'Based in Tehran, Iran',
    ],
    },

  numbers: {
    title: 'Perspective in numbers',
    sub: 'Outcomes and outputs',
    stats: [
    { n: 6, prefix: '', suffix: '+', label: 'years of experience' },
      { n: 70, prefix: '', suffix: '%', label: 'marketing cost reduction' },
      { n: 100, prefix: '+', suffix: '', label: 'crypto & FinTech articles' },
      { n: 20, prefix: '', suffix: '%', label: 'SEO performance improvement' },
      { n: 200, prefix: '+', suffix: '', label: 'products & pages optimized' },
      { n: 30, prefix: '', suffix: '', label: 'course modules architected' },
      { n: 23, prefix: '', suffix: '%', label: 'UX improvement delivered' },
    ],
  },

  cases: [
    {
    title: 'Gainmax Online Shop',
      meta: 'Brand Identity / E-commerce Website',
      body: 'A complete branding and online shop project for Gainmax, covering logo design, visual identity, and the design of the customer-facing online store. The main challenge was working through unclear stakeholder expectations and decision instability — I structured the process around a stakeholder audit, reducing ambiguity and translating scattered inputs into a clear design direction.',
      facts: ['Role — Designer', 'Scope — Logo, visual identity, online shop', 'Tools — Graphic Design, WordPress, WooCommerce'],
      process: ['Stakeholder audit', 'Alignment', 'Logo design', 'Visual identity', 'Shop build'],
      metrics: {
        title: 'Outcome',
        items: [
          { value: '✓', label: 'Logo designed' },
          { value: '✓', label: 'Visual identity defined' },
          { value: '✓', label: 'Website designed' },
        ],
      },
    },
    {
      title: 'Cloudinative Visual Identity',
      meta: 'Exhibition / Brand Collateral Design',
      body: 'A fast-paced visual identity execution project for Cloudinative, preparing exhibition materials — tent banners, light box, brochure, and catalogue — across multiple touchpoints under a very tight deadline. The work demanded prioritization, long-hour execution, and consistency across every deliverable.',
      facts: ['Role — Strategist, Planner & Task Executor', 'Scope — Exhibition materials', 'Challenge — Severe time limit'],
      metrics: {
        title: 'Outcome',
        items: [
          { value: '✓', label: 'Exhibition materials ready' },
          { value: '4', label: 'deliverables shipped', note: 'banners, light box, brochure, catalogue' },
        ],
      },
    },
    {
      title: 'Tokyo Women Film Festival',
      meta: 'Brand Identity / Website Design',
      body: 'A branding and website design project for the Tokyo Women Film Festival, requiring careful visual decision-making with limited reference material and sensitivity to cultural context. I relied on active communication and feedback loops with multiple stakeholders to shape a respectful, fitting direction.',
      facts: ['Role — Designer', 'Scope — Logo, visual identity, website', 'Tools — Graphic Design, WordPress, WooCommerce'],
      metrics: {
        title: 'Outcome',
        items: [
          { value: '✓', label: 'Logo designed' },
          { value: '✓', label: 'Visual identity defined' },
          { value: '✓', label: 'Website designed' },
        ],
      },
    },
{
      title: 'Rose Face Logo',
      meta: 'Logo Design',
      body: 'A logo design project developed under a fixed typographic constraint — the typeface could not be changed. I shifted focus to composition, proportion, and visual harmony to turn that limitation into a stronger, more intentional final mark.',
      facts: ['Role — Visual Designer', 'Challenge — No choice in typeface', 'Solution — Creative composition'],
      metrics: {
        title: 'Outcome',
        items: [
          { value: '✓', label: 'Logo designed' },
        ],
      },
    },
  ] as CaseStudy[],

  talks: [ ] as Talk[],

  /** Alternating Q / A lines for the manifesto section */
  manifesto: [
    'Why marketing?\nBecause a great product still needs to be understood.',
    'Growth isn’t luck,\nit’s a system.',
    'I don’t chase trends.\nI build the strategy, the automation, and the story that make growth repeatable.',
  ],

  contact: {
    title: "Contact Me!",
    email: 'mahdiedehghan1999@gmail.com',
    note: 'Tehran, Iran · +98 992 313 7884',

  },
}

export type SectionId = (typeof content.sections)[number]
