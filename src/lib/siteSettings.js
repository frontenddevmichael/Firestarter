// Single source of truth for admin-editable site content.
// Keys map to the `site_settings` table; `def` is the live copy fallback
// used when a key is missing, so pages can never render blank.

export const SETTING_GROUPS = [
  {
    id: 'hero',
    label: 'Hero (home page)',
    page: '/prize',
    keys: [
      { key: 'hero.eyebrow', label: 'Eyebrow', type: 'text', def: 'The Firestarter Young Poets Prize 2026' },
      { key: 'hero.title_a', label: 'Title line 1', type: 'text', def: 'My Voice,' },
      { key: 'hero.title_b', label: 'Title line 2', type: 'text', def: 'My Future.' },
      { key: 'hero.sub', label: 'Subtitle', type: 'textarea', def: 'For secondary school students across Lagos State, ages 10 to 17. Write one original poem. Share the thinking behind it. Build original thinking, confident communication and the responsible use of technology, through poetry, reflection and spoken-word performance.' },
      { key: 'hero.fine', label: 'Fine print (deadline line)', type: 'text', def: 'Free to enter. Entries close October 30, 2026.' },
      { key: 'hero.cta_enter', label: 'Enter button label', type: 'text', def: 'Enter now' },
      { key: 'hero.cta_pack', label: 'Spark Pack button label', type: 'text', def: 'Download the Spark Pack' },
      { key: 'hero.final_title', label: 'Final CTA title', type: 'text', def: 'Every voice begins somewhere.' },
      { key: 'hero.final_sub', label: 'Final CTA subtitle', type: 'text', def: 'This could be where yours begins.' },
    ],
  },
  {
    id: 'theme',
    label: 'Theme',
    page: '/prize/about',
    keys: [
      { key: 'theme.name', label: 'Theme name', type: 'text', def: 'My Voice, My Future' },
      { key: 'theme.title', label: 'Theme title', type: 'text', def: 'My Voice, My Future.' },
      { key: 'theme.desc', label: 'Theme description', type: 'textarea', def: 'Every generation inherits a world shaped by the voices that came before it. The future will be shaped by the voices that speak today. Yours is one of them. Write honestly. Imagine boldly. Use your words to help shape the future you want to see.' },
    ],
  },
  {
    id: 'dates',
    label: 'Key dates',
    page: '/prize/key-dates',
    keys: [
      { key: 'dates.deadline_long', label: 'Deadline (long)', type: 'text', def: 'October 30, 2026' },
      { key: 'dates.deadline_short', label: 'Deadline (short)', type: 'text', def: 'Oct 30' },
      { key: 'dates.deadline_full', label: 'Deadline (full, with time)', type: 'text', def: 'Friday, 30 October 2026, 11:59 PM (WAT)' },
      { key: 'dates.judging', label: 'Judging & shortlist', type: 'text', def: 'November' },
      { key: 'dates.lab', label: 'Creative-Tech Lab', type: 'text', def: 'Early Dec' },
      { key: 'dates.final', label: 'Grand final', type: 'text', def: 'December' },
      { key: 'dates.videos_due', label: 'Performance videos due', type: 'text', def: 'Late November' },
    ],
  },
  {
    id: 'prizes',
    label: 'Prizes',
    page: '/prize/spark-pack',
    keys: [
      { key: 'prize.first', label: '1st place', type: 'text', def: '₦1,000,000' },
      { key: 'prize.second', label: '2nd place', type: 'text', def: '₦500,000' },
      { key: 'prize.third', label: '3rd place', type: 'text', def: '₦250,000' },
      { key: 'prize.rest', label: '4th–20th place (each)', type: 'text', def: '₦50,000' },
      { key: 'prize.top100', label: 'Top 100 finalists text', type: 'textarea', def: 'certificates, recognition, a place at the Creative-Tech Lab, and a spot at the December grand final' },
    ],
  },
  {
    id: 'entry',
    label: 'Entry page',
    page: '/prize/enter',
    keys: [
      { key: 'enter.hero_sub', label: 'Entry hero subtitle', type: 'text', def: 'Entries close October 30, 2026.' },
      { key: 'enter.card_desc', label: 'Platform card description', type: 'textarea', def: 'Create your free account to get your personal dashboard. Explore the Spark Pack, save a draft, and submit your poem whenever you are ready — your guardian verifies with an email code before anything is submitted.' },
      { key: 'spark.closing', label: 'Spark Pack closing line', type: 'text', def: 'Now go write something only you could have written.' },
    ],
  },
  {
    id: 'community',
    label: 'Community & contact',
    page: '/prize/contact',
    keys: [
      { key: 'community.whatsapp_link', label: 'WhatsApp invite link', type: 'url', def: 'https://chat.whatsapp.com/EDm92HpP6k26FCbvWq5V7P' },
      { key: 'community.whatsapp_count', label: 'Member count', type: 'text', def: '200+' },
      { key: 'contact.email', label: 'Contact email', type: 'text', def: 'contactfirestartermethod@gmail.com' },
    ],
  },
  {
    id: 'visibility',
    label: 'Section visibility',
    page: '/prize',
    keys: [
      { key: 'show.prizes', label: 'Show prizes section', type: 'toggle', def: true },
      { key: 'show.countdown', label: 'Show countdown', type: 'toggle', def: true },
      { key: 'show.whatsapp', label: 'Show WhatsApp band', type: 'toggle', def: true },
    ],
  },
]

export const SETTING_DEFAULTS = Object.fromEntries(
  SETTING_GROUPS.flatMap((g) => g.keys.map((k) => [k.key, k.def])),
)
