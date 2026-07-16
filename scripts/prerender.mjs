import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const BASE = 'https://firestartermethod.com';

const OG_IMAGE = `${BASE}/FireStarter%20collective%20logo%201.png`;

const routes = [
  { path: '/',           title: 'The Firestarter Method — Ignite Creative Voices',            desc: 'A five-force system that turns what you have seen into what you can show. Forge, Illuminate, Enact, Regenerate, Amplify.', noindex: false },
  { path: '/about',      title: 'About — Shola Amaraibi & The Firestarter Method',            desc: 'The story behind the Firestarter Method and the founder, Shola Amaraibi.', noindex: false },
  { path: '/contact',    title: 'Contact — The Firestarter Method',                           desc: 'Get in touch with Shola Amaraibi and the Firestarter team.', noindex: false },
  { path: '/training',   title: 'Free Training — The Firestarter Method',                     desc: 'Fifteen minutes. The whole Firestarter Method applied to one real life.', noindex: false },
  { path: '/deluxe',     title: 'The Firestarter Deluxe — Complete Training',                  desc: 'The complete method, taught in one sitting. Training and workbook included.', noindex: false },
  { path: '/forge',      title: 'The Forge Intensive — One-to-One Coaching',                  desc: 'Three hours, one to one. Work Force One properly with Shola Amaraibi.', noindex: false },
  { path: '/assessment', title: 'Creative Assessment — The Firestarter Method',               desc: 'Discover where you are in the five forces. A personalised creative assessment.', noindex: false },
  { path: '/musical',    title: 'Firestarter Musical — Coming Soon',                          desc: 'Music, theatre, and performance under the Firestarter umbrella.', noindex: false },
  { path: '/prize',      title: 'Firestarter Young Poets Prize 2026',                         desc: 'A poetry competition for secondary school students across Lagos State, Nigeria — Junior Poets (ages 10–13) and Senior Poets (ages 14–17).', noindex: false },
  { path: '/prize/about',   title: 'About — Firestarter Young Poets Prize 2026',             desc: 'Why the prize exists, the 2026 theme, and what judges are looking for.', noindex: false },
  { path: '/prize/how-to-enter', title: 'How to Enter — Firestarter Young Poets Prize 2026', desc: 'Three steps to submit your poem: write, reflect, perform.', noindex: false },
  { path: '/prize/key-dates', title: 'Key Dates — Firestarter Young Poets Prize 2026',       desc: 'Competition timeline: entries close 30 September 2026.', noindex: false },
  { path: '/prize/parents-and-teachers', title: 'Parents & Teachers — Firestarter Young Poets', desc: 'Information for parents and teachers supporting young poets.', noindex: false },
  { path: '/prize/contact', title: 'Contact — Firestarter Young Poets Prize',                desc: 'Get in touch with the Firestarter Young Poets Prize team.', noindex: false },
  { path: '/prize/enter', title: 'Submit Your Entry — Firestarter Young Poets Prize 2026',   desc: 'Enter the Firestarter Young Poets Prize. Submit your poem, reflection, and performance video.', noindex: false },
  { path: '/prize/spark-pack', title: 'Spark Pack — Firestarter Young Poets Prize',          desc: 'Download the Spark Pack — everything you need to prepare your entry.', noindex: false },
  { path: '/prize/auth', title: 'Sign In — Firestarter Young Poets Prize',                   desc: 'Sign in to the Firestarter Young Poets Prize.', noindex: true },
  { path: '/prize/reset-password', title: 'Reset Password — Firestarter Young Poets Prize',  desc: 'Reset your Firestarter Young Poets Prize password.', noindex: true },
];

console.log('Prerendering routes...');

const html = readFileSync(join(dist, 'index.html'), 'utf-8');

for (const route of routes) {
  const pageUrl = `${BASE}${route.path}`;

  let output = html
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${route.desc}"`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${route.title}"`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${route.desc}"`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${pageUrl}"`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${route.title}"`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${route.desc}"`
    )
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${pageUrl}"`
    )
    .replace(
      /<meta name="robots" content="[^"]*"/,
      `<meta name="robots" content="${route.noindex ? 'noindex' : 'index, follow'}"`
    );

  const outDir = join(dist, route.path.slice(1));
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), output);
  console.log(`  ✓ ${route.path}`);
}

console.log(`Prerendered ${routes.length} routes.`);
