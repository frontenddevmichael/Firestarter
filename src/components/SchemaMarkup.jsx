import { useLocation } from 'react-router-dom';

const url = 'https://firestartermethod.com';

const org = { '@type': 'Organization', name: 'Firestarter Method', url: url, logo: `${url}/FireStarter%20collective%20logo%201.png` };

const person = {
  '@type': 'Person',
  name: 'Shola Amaraibi',
  jobTitle: 'Founder & Creative Director',
  description: 'Founder of the Firestarter Method — a five-force creative system and the Firestarter Young Poets Prize.',
  url: `${url}/about`,
  sameAs: [],
};

const breadcrumbFor = (path) => {
  const parts = path.split('/').filter(Boolean);
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: url }];
  let current = '';
  parts.forEach((p, i) => {
    current += `/${p}`;
    const label = p === 'prize' ? 'Young Poets Prize' : p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ');
    items.push({ '@type': 'ListItem', position: i + 2, name: label, item: `${url}${current}` });
  });
  return { '@type': 'BreadcrumbList', itemListElement: items };
};

const schemas = {
  '/': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'The Firestarter Method — Shola Amaraibi',
    description: 'A five-force system that helps you name the life you want, own the choices it requires, and make it real. Forge, Illuminate, Enact, Regenerate, Amplify.',
    url: url,
    publisher: org,
    mainEntity: { '@type': 'Course', name: 'The Firestarter Method', description: 'A five-force system. Forge, Illuminate, Enact, Regenerate, Amplify.', provider: person },
  },
  '/about': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'About — The Firestarter Method',
    description: 'The story behind the Firestarter Method — a philosophy of creative ignition.',
    url: `${url}/about`,
    mainEntity: person,
  },
  '/training': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Free Training — The Firestarter Method',
    description: 'Fifteen minutes. The whole Firestarter Method applied to one real life.',
    url: `${url}/training`,
  },
  '/prize': {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'The Firestarter Young Poets Prize 2026',
    description: 'A poetry competition building future skills for secondary school students across Lagos State, Nigeria — Junior Poets (ages 10–13) and Senior Poets (ages 14–17).',
    url: `${url}/prize`,
    startDate: '2026-01-01',
    endDate: '2026-12-15',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: 'Lagos State, Nigeria', address: { '@type': 'PostalAddress', addressRegion: 'Lagos', addressCountry: 'NG' } },
    organizer: org,
  },
  '/prize/about': {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'About the Firestarter Young Poets Prize',
    description: 'Why the prize exists, the 2026 theme, and what judges are looking for.',
    url: `${url}/prize/about`,
  },
  '/prize/how-to-enter': {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Enter the Firestarter Young Poets Prize',
    description: 'Three steps to submit your poem: write, reflect, perform.',
    url: `${url}/prize/how-to-enter`,
    step: [
      { '@type': 'HowToStep', name: 'Write the Poem', text: 'One original poem exploring the 2026 theme.' },
      { '@type': 'HowToStep', name: 'Voice Reflection', text: 'A short written reflection on what your poem means to you.' },
      { '@type': 'HowToStep', name: 'Performance Video', text: 'A video of you performing the same poem.' },
    ],
  },
  '/prize/key-dates': {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Firestarter Young Poets Prize 2026 — Key Dates',
    description: 'Competition timeline: entries close 30 September 2026. Grand Final in December.',
    url: `${url}/prize/key-dates`,
    startDate: '2026-09-30',
    endDate: '2026-12-15',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: 'Lagos, Nigeria', address: { '@type': 'PostalAddress', addressRegion: 'Lagos', addressCountry: 'NG' } },
    organizer: org,
  },
  '/prize/enter': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Submit Your Entry — Firestarter Young Poets Prize 2026',
    description: 'Enter the Firestarter Young Poets Prize. Submit your poem, reflection, and performance video.',
    url: `${url}/prize/enter`,
  },
  '/prize/parents-and-teachers': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Parents & Teachers — Firestarter Young Poets Prize',
    description: 'Information for parents and teachers supporting young poets in the competition.',
    url: `${url}/prize/parents-and-teachers`,
  },
  '/prize/spark-pack': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Spark Pack — Firestarter Young Poets Prize',
    description: 'Download the Spark Pack with writing prompts, planning tools, and submission checklist.',
    url: `${url}/prize/spark-pack`,
  },
  '/prize/contact': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'Contact — Firestarter Young Poets Prize',
    description: 'Get in touch with the Firestarter Young Poets Prize team.',
    url: `${url}/prize/contact`,
    mainEntity: [
      { '@type': 'Question', name: 'Who can enter the 2026 Prize?', acceptedAnswer: { '@type': 'Answer', text: 'The Firestarter Young Poets Prize is open to secondary school students across Lagos State, Nigeria — Junior Poets (ages 10–13) and Senior Poets (ages 14–17).' } },
      { '@type': 'Question', name: 'What do I need to submit?', acceptedAnswer: { '@type': 'Answer', text: 'One original poem, a short Voice Reflection, and a performance video of you reading the same poem aloud.' } },
      { '@type': 'Question', name: 'Is there an entry fee?', acceptedAnswer: { '@type': 'Answer', text: 'This will be confirmed before launch — check back or contact us directly for the latest.' } },
      { '@type': 'Question', name: 'How is judging decided?', acceptedAnswer: { '@type': 'Answer', text: 'Our judging panel reviews every entry blind, focused on voice and honesty over technical polish.' } },
    ],
  },
  '/musical': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Firestarter Musical',
    description: 'Music, theatre, and performance under the Firestarter umbrella.',
    url: `${url}/musical`,
  },
  '/contact': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Contact — The Firestarter Method',
    description: 'Get in touch with Shola Amaraibi and the Firestarter team.',
    url: `${url}/contact`,
  },
};

// Add BreadcrumbList to all /prize/* routes
for (const path of Object.keys(schemas)) {
  if (path.startsWith('/prize/') || path === '/prize') {
    schemas[path].breadcrumb = breadcrumbFor(path);
  }
}

export default function SchemaMarkup() {
  const { pathname } = useLocation();
  const schema = schemas[pathname];
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
