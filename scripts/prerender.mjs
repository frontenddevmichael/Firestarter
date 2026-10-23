import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ROUTE_META } from '../src/lib/routesMeta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const BASE = 'https://firestartermethod.com';
const LOGO = `${BASE}/FireStarter%20collective%20logo%201.png`;

// Titles, descriptions and robots directives come from src/lib/routesMeta.js,
// the same file the client uses — one source, no drift.
const routes = [
  { path: '/',                         ogImage: LOGO,                                  ogImageAlt: 'The Firestarter Method',                                     ogType: 'website' },
  { path: '/work',                     ogImage: LOGO,                                  ogImageAlt: 'Work With Me — Firestarter Method',                          ogType: 'website' },
  { path: '/contact',                  ogImage: LOGO,                                  ogImageAlt: 'Contact Firestarter Method',                                ogType: 'website' },
  { path: '/briefing',                 ogImage: LOGO,                                  ogImageAlt: 'The Firestarter Briefing',                                  ogType: 'website' },
  { path: '/musical',                  ogImage: LOGO,                                  ogImageAlt: 'Firestarter: The Musical',                                   ogType: 'website' },
  { path: '/prize',                    ogImage: `${BASE}/prize-og-image.jpg`,          ogImageAlt: 'Firestarter Young Poets Prize 2026',                         ogType: 'website' },
  { path: '/prize/about',              ogImage: `${BASE}/prize-og-image.jpg`,          ogImageAlt: 'About the Firestarter Young Poets Prize',                    ogType: 'website' },
  { path: '/prize/how-to-enter',       ogImage: `${BASE}/prize-og-image.jpg`,          ogImageAlt: 'How to Enter the Firestarter Young Poets Prize',             ogType: 'website' },
  { path: '/prize/key-dates',          ogImage: `${BASE}/prize-og-image.jpg`,          ogImageAlt: 'Key Dates — Firestarter Young Poets Prize',                  ogType: 'website' },
  { path: '/prize/parents-and-teachers', ogImage: `${BASE}/prize-og-image.jpg`,        ogImageAlt: 'Parents & Teachers — Firestarter Young Poets Prize',         ogType: 'website' },
  { path: '/prize/consent-form',       ogImage: `${BASE}/prize-og-image.jpg`,          ogImageAlt: 'Participant Commitment & Parental Consent — Firestarter Young Poets Prize', ogType: 'website' },
  { path: '/prize/contact',            ogImage: `${BASE}/prize-og-image.jpg`,          ogImageAlt: 'Contact — Firestarter Young Poets Prize',                    ogType: 'website' },
  { path: '/prize/enter',              ogImage: `${BASE}/prize-og-image.jpg`,          ogImageAlt: 'Submit Your Entry — Firestarter Young Poets Prize',          ogType: 'website' },
  { path: '/prize/spark-pack',         ogImage: `${BASE}/prize-og-image.jpg`,          ogImageAlt: 'Spark Pack — Firestarter Young Poets Prize',                 ogType: 'website' },
  { path: '/prize/auth',               ogImage: LOGO,                                  ogImageAlt: 'Sign In — Firestarter Young Poets Prize',                    ogType: 'website' },
  { path: '/prize/reset-password',     ogImage: LOGO,                                  ogImageAlt: 'Reset Password — Firestarter Young Poets Prize',             ogType: 'website' },
  // App pages: prerendered as noindex shells so a crawler never sees the
  // base index.html's "index, follow" before JavaScript runs.
  { path: '/prize/dashboard',          ogImage: LOGO,                                  ogImageAlt: 'My Entry — Firestarter Young Poets Prize',                   ogType: 'website' },
  { path: '/prize/judge',              ogImage: LOGO,                                  ogImageAlt: 'Judge Dashboard — Firestarter Young Poets Prize',            ogType: 'website' },
  { path: '/prize/admin',              ogImage: LOGO,                                  ogImageAlt: 'Admin — Firestarter Young Poets Prize',                      ogType: 'website' },
];

// ── Schema definitions (mirrors src/components/SchemaMarkup.jsx for prerender) ──
const org = { '@type': 'Organization', name: 'Firestarter Method', url: BASE, logo: LOGO };
const person = { '@type': 'Person', name: 'Shola Amaraibi', jobTitle: 'Founder & Creative Director', description: 'Founder of the Firestarter Method — a five-force creative system.', url: BASE, sameAs: [] };

function breadcrumbFor(path) {
  const parts = path.split('/').filter(Boolean);
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: BASE }];
  let current = '';
  parts.forEach((p, i) => {
    current += `/${p}`;
    const label = p === 'prize' ? 'Young Poets Prize' : p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ');
    items.push({ '@type': 'ListItem', position: i + 2, name: label, item: `${BASE}${current}` });
  });
  return { '@type': 'BreadcrumbList', itemListElement: items };
}

const schemas = {
  '/': {
    '@context': 'https://schema.org', '@type': 'WebPage', name: 'The Firestarter Method — Shola Amaraibi',
    description: 'A five-force system that helps you name the life you want, own the choices it requires, and make it real.', url: BASE, publisher: org,
    mainEntity: { '@type': 'Course', name: 'The Firestarter Method', description: 'A five-force system. Forge, Illuminate, Enact, Regenerate, Amplify.', provider: person },
  },
  '/work': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Work With Me — The Firestarter Method', description: 'Unstoppable Workshop, Forge Intensive, Firestarter Deluxe, Business Lane.', url: `${BASE}/work` },
  '/briefing': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'The Firestarter Briefing', description: 'The work only you can make. A 17-minute briefing on the method that carries a life from foundation to impact.', url: `${BASE}/briefing` },
  '/musical': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Firestarter Musical', description: 'Music, theatre, and performance.', url: `${BASE}/musical` },
  '/contact': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Contact — The Firestarter Method', description: 'Get in touch.', url: `${BASE}/contact` },
  '/prize': {
    '@context': 'https://schema.org', '@type': 'Event', name: 'The Firestarter Young Poets Prize 2026',
    description: 'A poetry competition building future skills for secondary school students across Lagos State.', url: `${BASE}/prize`,
    startDate: '2026-01-01', endDate: '2026-12-20', eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: 'Lagos State, Nigeria', address: { '@type': 'PostalAddress', addressRegion: 'Lagos', addressCountry: 'NG' } },
    organizer: org, breadcrumb: breadcrumbFor('/prize'),
  },
  '/prize/about': { '@context': 'https://schema.org', '@type': 'Article', headline: 'About the Prize', description: 'Why the prize exists, the 2026 theme, and what judges look for.', url: `${BASE}/prize/about`, breadcrumb: breadcrumbFor('/prize/about') },
  '/prize/how-to-enter': { '@context': 'https://schema.org', '@type': 'HowTo', name: 'How to Enter', description: 'Two stages: write your poem and Voice Reflection, then perform if shortlisted.', url: `${BASE}/prize/how-to-enter`, step: [
    { '@type': 'HowToStep', name: 'Write the Poem', text: 'One original poem exploring the 2026 theme.' },
    { '@type': 'HowToStep', name: 'Voice Reflection', text: 'Three to five sentences on what your poem is really about and why you wrote it.' },
  ], breadcrumb: breadcrumbFor('/prize/how-to-enter') },
  '/prize/key-dates': { '@context': 'https://schema.org', '@type': 'Event', name: 'Prize Key Dates', description: 'Competition timeline: entries close 30 October 2026, grand final in December.', url: `${BASE}/prize/key-dates`, startDate: '2026-10-30', endDate: '2026-12-20', eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', location: { '@type': 'Place', name: 'Lagos, Nigeria', address: { '@type': 'PostalAddress', addressRegion: 'Lagos', addressCountry: 'NG' } }, organizer: org, breadcrumb: breadcrumbFor('/prize/key-dates') },
  '/prize/enter': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Submit Your Entry', description: 'Create your free account and submit your poem and Voice Reflection.', url: `${BASE}/prize/enter`, breadcrumb: breadcrumbFor('/prize/enter') },
  '/prize/parents-and-teachers': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Parents & Teachers', description: 'Supporting young poets.', url: `${BASE}/prize/parents-and-teachers`, breadcrumb: breadcrumbFor('/prize/parents-and-teachers') },
  '/prize/spark-pack': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Spark Pack', description: 'Download the Spark Pack.', url: `${BASE}/prize/spark-pack`, breadcrumb: breadcrumbFor('/prize/spark-pack') },
  '/prize/contact': { '@context': 'https://schema.org', '@type': 'FAQPage', name: 'Contact — Young Poets Prize', description: 'Get in touch.', url: `${BASE}/prize/contact`, mainEntity: [
    { '@type': 'Question', name: 'Who can enter?', acceptedAnswer: { '@type': 'Answer', text: 'Open to secondary school students across Lagos State — Junior Poets (10–13) and Senior Poets (14–17).' } },
    { '@type': 'Question', name: 'What do I need to submit?', acceptedAnswer: { '@type': 'Answer', text: 'One original poem and a short Voice Reflection (three to five sentences). Performance videos are only needed if you are shortlisted.' } },
    { '@type': 'Question', name: 'Is there an entry fee?', acceptedAnswer: { '@type': 'Answer', text: 'No. Entry is free, and payment is never requested at any stage.' } },
    { '@type': 'Question', name: 'How is judging decided?', acceptedAnswer: { '@type': 'Answer', text: 'Our panel reviews every entry blind, focused on voice and honesty.' } },
  ], breadcrumb: breadcrumbFor('/prize/contact') },
};

console.log('Prerendering routes...');

const html = readFileSync(join(dist, 'index.html'), 'utf-8');

for (const route of routes) {
  const meta = ROUTE_META[route.path];
  if (!meta) {
    console.warn(`  ! no metadata for ${route.path} — skipped`);
    continue;
  }
  const pageUrl = `${BASE}${route.path}`;
  const schema = schemas[route.path] ? JSON.stringify(schemas[route.path]) : '';
  const schemaTag = schema ? `<script type="application/ld+json">${schema}</script>` : '';

  let output = html
    .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${meta.desc}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${meta.title}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${meta.desc}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${pageUrl}"`)
    .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${route.ogImage}"`)
    .replace(/<meta property="og:image:alt" content="[^"]*"/, `<meta property="og:image:alt" content="${route.ogImageAlt}"`)
    .replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="${route.ogType}"`)
    .replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${route.ogImage}"`)
    .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${meta.title}"`)
    .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${meta.desc}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${pageUrl}"`)
    .replace(/<meta name="robots" content="[^"]*"/, `<meta name="robots" content="${meta.noindex ? 'noindex, nofollow' : 'index, follow'}"`);

  // Inject JSON-LD schema before closing </head>
  if (schemaTag) {
    output = output.replace('</head>', `${schemaTag}\n  </head>`);
  }

  const outDir = join(dist, route.path.slice(1));
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), output);
  console.log(`  ✓ ${route.path}`);
}

console.log(`Prerendered ${routes.length} routes.`);
