import { useLocation } from 'react-router-dom';

const url = 'https://firestartermethod.com';

const schemas = {
  '/': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'The Firestarter Method — Shola Amaraibi',
    description: 'A five-force system that turns what you have seen into what you can show. Forge, Illuminate, Enact, Regenerate, Amplify.',
    url: url,
    publisher: { '@type': 'Organization', name: 'Firestarter Method', url: url, logo: `${url}/FireStarter%20collective%20logo%201.png` },
    mainEntity: { '@type': 'Course', name: 'The Firestarter Method', description: 'Five forces. Fifteen stages. Forty-five steps. Every step ends with proof you can point to.', provider: { '@type': 'Person', name: 'Shola Amaraibi' } },
  },
  '/about': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'About — The Firestarter Method',
    description: 'The story behind the Firestarter Method — a philosophy of creative ignition.',
    url: `${url}/about`,
  },
  '/training': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Free Training — The Firestarter Method',
    description: 'Fifteen minutes. The whole Firestarter Method applied to one real life.',
    url: `${url}/training`,
  },
  '/deluxe': {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'The Firestarter Deluxe',
    description: 'The complete method, taught in one sitting. Training and workbook.',
    url: `${url}/deluxe`,
    offers: { '@type': 'Offer', price: '135', priceCurrency: 'USD', availability: 'https://schema.org/PreOrder' },
  },
  '/forge': {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'The Forge Intensive',
    description: 'Three hours, one to one. Work Force One properly.',
    url: `${url}/forge`,
    offers: { '@type': 'Offer', price: '250', priceCurrency: 'USD', availability: 'https://schema.org/PreOrder' },
  },
  '/prize': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'The Firestarter Young Poets Prize 2026',
    description: 'A poetry competition for secondary school students across Lagos State, Nigeria — Junior Poets (ages 10–13) and Senior Poets (ages 14–17).',
    url: `${url}/prize`,
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
    '@type': 'WebPage',
    name: 'Key Dates — Firestarter Young Poets Prize',
    description: 'Competition timeline: entries close 30 September 2026.',
    url: `${url}/prize/key-dates`,
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
    '@type': 'WebPage',
    name: 'Contact — Firestarter Young Poets Prize',
    description: 'Get in touch with the Firestarter Young Poets Prize team.',
    url: `${url}/prize/contact`,
  },
  '/assessment': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Creative Assessment — The Firestarter Method',
    description: 'A personalised creative assessment to discover where you are in the five forces.',
    url: `${url}/assessment`,
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
