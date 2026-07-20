import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const BASE = 'https://firestartermethod.com';
const LOGO = `${BASE}/FireStarter%20collective%20logo%201.png`;

const routes = [
  { path: '/',           title: 'The Firestarter Method — Ignite Creative Voices',            desc: 'A five-force system that turns what you have seen into what you can show. Forge, Illuminate, Enact, Regenerate, Amplify.',                                                                   ogImage: LOGO, ogImageAlt: 'The Firestarter Method',                                     ogType: 'website', noindex: false },
  { path: '/about',      title: 'About — Shola Amaraibi & The Firestarter Method',            desc: 'The story behind the Firestarter Method and the founder, Shola Amaraibi.',                                                                                                                     ogImage: LOGO, ogImageAlt: 'Shola Amaraibi — Firestarter Method',                        ogType: 'website', noindex: false },
  { path: '/contact',    title: 'Contact — The Firestarter Method',                           desc: 'Get in touch with Shola Amaraibi and the Firestarter team.',                                                                                                                                      ogImage: LOGO, ogImageAlt: 'Contact Firestarter Method',                                ogType: 'website', noindex: false },
  { path: '/training',   title: 'Free Training — The Firestarter Method',                     desc: 'Fifteen minutes. The whole Firestarter Method applied to one real life.',                                                                                                                       ogImage: LOGO, ogImageAlt: 'Free Training — Firestarter Method',                        ogType: 'website', noindex: false },
  { path: '/deluxe',     title: 'The Firestarter Deluxe — Complete Training',                  desc: 'The complete method, taught in one sitting. Training and workbook included.',                                                                                                                   ogImage: LOGO, ogImageAlt: 'The Firestarter Deluxe',                                    ogType: 'website', noindex: false },
  { path: '/forge',      title: 'The Forge Intensive — One-to-One Coaching',                  desc: 'Three hours, one to one. Work Force One properly with Shola Amaraibi.',                                                                                                                          ogImage: LOGO, ogImageAlt: 'The Forge Intensive',                                       ogType: 'website', noindex: false },
  { path: '/assessment', title: 'Creative Assessment — The Firestarter Method',               desc: 'Discover where you are in the five forces. A personalised creative assessment.',                                                                                                                ogImage: LOGO, ogImageAlt: 'Creative Assessment — Firestarter Method',                  ogType: 'website', noindex: false },
  { path: '/musical',    title: 'Firestarter Musical — Coming Soon',                          desc: 'Music, theatre, and performance under the Firestarter umbrella.',                                                                                                                               ogImage: LOGO, ogImageAlt: 'Firestarter Musical',                                       ogType: 'website', noindex: false },
  { path: '/prize',      title: 'Firestarter Young Poets Prize 2026',                         desc: 'A poetry competition for secondary school students across Lagos State, Nigeria — Junior Poets (ages 10–13) and Senior Poets (ages 14–17).',                                                  ogImage: `${BASE}/prize-og-image.jpg`, ogImageAlt: 'Firestarter Young Poets Prize 2026', ogType: 'website', noindex: false },
  { path: '/prize/about',   title: 'About — Firestarter Young Poets Prize 2026',             desc: 'Why the prize exists, the 2026 theme, and what judges are looking for.',                                                                                                                       ogImage: `${BASE}/prize-og-image.jpg`, ogImageAlt: 'About the Firestarter Young Poets Prize', ogType: 'website', noindex: false },
  { path: '/prize/how-to-enter', title: 'How to Enter — Firestarter Young Poets Prize 2026', desc: 'Three steps to submit your poem: write, reflect, perform.',                                                                                                                                        ogImage: `${BASE}/prize-og-image.jpg`, ogImageAlt: 'How to Enter the Firestarter Young Poets Prize', ogType: 'website', noindex: false },
  { path: '/prize/key-dates', title: 'Key Dates — Firestarter Young Poets Prize 2026',       desc: 'Competition timeline: entries close 30 September 2026.',                                                                                                                                           ogImage: `${BASE}/prize-og-image.jpg`, ogImageAlt: 'Key Dates — Firestarter Young Poets Prize', ogType: 'website', noindex: false },
  { path: '/prize/parents-and-teachers', title: 'Parents & Teachers — Firestarter Young Poets', desc: 'Information for parents and teachers supporting young poets.',                                                                                                                              ogImage: `${BASE}/prize-og-image.jpg`, ogImageAlt: 'Parents & Teachers — Firestarter Young Poets Prize', ogType: 'website', noindex: false },
  { path: '/prize/contact', title: 'Contact — Firestarter Young Poets Prize',                desc: 'Get in touch with the Firestarter Young Poets Prize team.',                                                                                                                                       ogImage: `${BASE}/prize-og-image.jpg`, ogImageAlt: 'Contact — Firestarter Young Poets Prize', ogType: 'website', noindex: false },
  { path: '/prize/enter', title: 'Submit Your Entry — Firestarter Young Poets Prize 2026',   desc: 'Enter the Firestarter Young Poets Prize. Submit your poem, reflection, and performance video.',                                                                                               ogImage: `${BASE}/prize-og-image.jpg`, ogImageAlt: 'Submit Your Entry — Firestarter Young Poets Prize', ogType: 'website', noindex: false },
  { path: '/prize/spark-pack', title: 'Spark Pack — Firestarter Young Poets Prize',          desc: 'Download the Spark Pack — everything you need to prepare your entry.',                                                                                                                         ogImage: `${BASE}/prize-og-image.jpg`, ogImageAlt: 'Spark Pack — Firestarter Young Poets Prize', ogType: 'website', noindex: false },
  { path: '/prize/auth', title: 'Sign In — Firestarter Young Poets Prize',                   desc: 'Sign in to the Firestarter Young Poets Prize.',                                                                                                                                                   ogImage: LOGO, ogImageAlt: 'Sign In — Firestarter Young Poets Prize',                   ogType: 'website', noindex: true },
  { path: '/prize/reset-password', title: 'Reset Password — Firestarter Young Poets Prize',  desc: 'Reset your Firestarter Young Poets Prize password.',                                                                                                                                              ogImage: LOGO, ogImageAlt: 'Reset Password — Firestarter Young Poets Prize',            ogType: 'website', noindex: true },
];

// ── Schema definitions (mirrors src/components/SchemaMarkup.jsx for prerender) ──
const org = { '@type': 'Organization', name: 'Firestarter Method', url: BASE, logo: LOGO };
const person = { '@type': 'Person', name: 'Shola Amaraibi', jobTitle: 'Founder & Creative Director', description: 'Founder of the Firestarter Method — a five-force creative system.', url: `${BASE}/about`, sameAs: [] };

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
    description: 'A five-force system. Forge, Illuminate, Enact, Regenerate, Amplify.', url: BASE, publisher: org,
    mainEntity: { '@type': 'Course', name: 'The Firestarter Method', description: 'Five forces. Fifteen stages. Forty-five steps.', provider: person },
  },
  '/about': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'About — The Firestarter Method', description: 'The story behind the Firestarter Method.', url: `${BASE}/about`, mainEntity: person },
  '/training': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Free Training — The Firestarter Method', description: 'Fifteen minutes. The whole method on one real life.', url: `${BASE}/training` },
  '/deluxe': { '@context': 'https://schema.org', '@type': 'Product', name: 'The Firestarter Deluxe', description: 'The complete method, taught in one sitting.', url: `${BASE}/deluxe`, offers: { '@type': 'Offer', price: '135', priceCurrency: 'USD', availability: 'https://schema.org/PreOrder' } },
  '/forge': { '@context': 'https://schema.org', '@type': 'Product', name: 'The Forge Intensive', description: 'Three hours, one to one.', url: `${BASE}/forge`, offers: { '@type': 'Offer', price: '250', priceCurrency: 'USD', availability: 'https://schema.org/PreOrder' } },
  '/assessment': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Creative Assessment', description: 'Discover where you are in the five forces.', url: `${BASE}/assessment` },
  '/musical': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Firestarter Musical', description: 'Music, theatre, and performance.', url: `${BASE}/musical` },
  '/contact': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Contact — The Firestarter Method', description: 'Get in touch.', url: `${BASE}/contact` },
  '/prize': {
    '@context': 'https://schema.org', '@type': 'Event', name: 'The Firestarter Young Poets Prize 2026',
    description: 'A poetry competition for secondary school students across Lagos State.', url: `${BASE}/prize`,
    startDate: '2026-01-01', endDate: '2026-12-15', eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: 'Lagos State, Nigeria', address: { '@type': 'PostalAddress', addressRegion: 'Lagos', addressCountry: 'NG' } },
    organizer: org, breadcrumb: breadcrumbFor('/prize'),
  },
  '/prize/about': { '@context': 'https://schema.org', '@type': 'Article', headline: 'About the Prize', description: 'Why the prize exists, the 2026 theme, and what judges look for.', url: `${BASE}/prize/about`, breadcrumb: breadcrumbFor('/prize/about') },
  '/prize/how-to-enter': { '@context': 'https://schema.org', '@type': 'HowTo', name: 'How to Enter', description: 'Three steps to submit your poem.', url: `${BASE}/prize/how-to-enter`, step: [
    { '@type': 'HowToStep', name: 'Write the Poem', text: 'One original poem exploring the 2026 theme.' },
    { '@type': 'HowToStep', name: 'Voice Reflection', text: 'A short written reflection.' },
    { '@type': 'HowToStep', name: 'Performance Video', text: 'A video of you performing the poem.' },
  ], breadcrumb: breadcrumbFor('/prize/how-to-enter') },
  '/prize/key-dates': { '@context': 'https://schema.org', '@type': 'Event', name: 'Prize Key Dates', description: 'Competition timeline.', url: `${BASE}/prize/key-dates`, startDate: '2026-09-30', endDate: '2026-12-15', eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', location: { '@type': 'Place', name: 'Lagos, Nigeria', address: { '@type': 'PostalAddress', addressRegion: 'Lagos', addressCountry: 'NG' } }, organizer: org, breadcrumb: breadcrumbFor('/prize/key-dates') },
  '/prize/enter': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Submit Your Entry', description: 'Enter the prize.', url: `${BASE}/prize/enter`, breadcrumb: breadcrumbFor('/prize/enter') },
  '/prize/parents-and-teachers': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Parents & Teachers', description: 'Supporting young poets.', url: `${BASE}/prize/parents-and-teachers`, breadcrumb: breadcrumbFor('/prize/parents-and-teachers') },
  '/prize/spark-pack': { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Spark Pack', description: 'Download the Spark Pack.', url: `${BASE}/prize/spark-pack`, breadcrumb: breadcrumbFor('/prize/spark-pack') },
  '/prize/contact': { '@context': 'https://schema.org', '@type': 'FAQPage', name: 'Contact — Young Poets Prize', description: 'Get in touch.', url: `${BASE}/prize/contact`, mainEntity: [
    { '@type': 'Question', name: 'Who can enter?', acceptedAnswer: { '@type': 'Answer', text: 'Open to secondary school students across Lagos State — Junior Poets (10–13) and Senior Poets (14–17).' } },
    { '@type': 'Question', name: 'What do I need to submit?', acceptedAnswer: { '@type': 'Answer', text: 'One original poem, a Voice Reflection, and a performance video.' } },
    { '@type': 'Question', name: 'Is there an entry fee?', acceptedAnswer: { '@type': 'Answer', text: 'Contact us for the latest on fees.' } },
    { '@type': 'Question', name: 'How is judging decided?', acceptedAnswer: { '@type': 'Answer', text: 'Our panel reviews every entry blind, focused on voice and honesty.' } },
  ], breadcrumb: breadcrumbFor('/prize/contact') },
};

console.log('Prerendering routes...');

const html = readFileSync(join(dist, 'index.html'), 'utf-8');

for (const route of routes) {
  const pageUrl = `${BASE}${route.path}`;
  const schema = schemas[route.path] ? JSON.stringify(schemas[route.path]) : '';
  const schemaTag = schema ? `<script type="application/ld+json">${schema}</script>` : '';

  let output = html
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${route.desc}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${route.title}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${route.desc}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${pageUrl}"`)
    .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${route.ogImage}"`)
    .replace(/<meta property="og:image:alt" content="[^"]*"/, `<meta property="og:image:alt" content="${route.ogImageAlt}"`)
    .replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="${route.ogType}"`)
    .replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${route.ogImage}"`)
    .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${route.title}"`)
    .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${route.desc}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${pageUrl}"`)
    .replace(/<meta name="robots" content="[^"]*"/, `<meta name="robots" content="${route.noindex ? 'noindex' : 'index, follow'}"`);

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
