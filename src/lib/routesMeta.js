// Single source of truth for per-route SEO metadata.
// Imported by the client (src/App.jsx) and by the build prerenderer
// (scripts/prerender.mjs) so titles/descriptions can never drift apart.
// Keep this file dependency-free plain ESM: it runs in Node, not just Vite.

export const ROUTE_META = {
  '/': {
    title: 'The Firestarter Method — Shola Amaraibi',
    desc: 'A five-force system that helps you name the life you want, own the choices it requires, and make it real. Forge, Illuminate, Enact, Regenerate, Amplify.',
  },
  '/work': {
    title: 'Work With Me — The Firestarter Method',
    desc: 'Choose the path that fits where you are: Unstoppable Workshop, Forge Intensive, Firestarter Deluxe, or Firestarter Business Lane.',
  },
  '/briefing': {
    title: 'The Firestarter Briefing',
    desc: 'The work only you can make. In this 17-minute briefing, Shola Amaraibi shows you the method that carries a life from foundation to impact.',
  },
  '/musical': {
    title: 'Firestarter: The Musical — Creative-TechFormance at MUSON Centre',
    desc: "Eight poems, one woman's journey, told in 90 minutes. December 19–20, 2026 at MUSON Centre, Lagos.",
  },
  '/contact': {
    title: 'Contact — The Firestarter Method',
    desc: 'Get in touch with Shola Amaraibi and the Firestarter team. Questions about the Method, collaboration, or just want to say hello.',
  },
  '/prize': {
    title: 'Firestarter Young Poets Prize 2026',
    desc: 'A poetry competition building future skills for secondary school students across Lagos State, Nigeria — Junior Poets (ages 10–13) and Senior Poets (ages 14–17).',
  },
  '/prize/about': {
    title: 'About — Firestarter Young Poets Prize 2026',
    desc: 'Why the prize exists, the 2026 theme, and what judges are looking for.',
  },
  '/prize/how-to-enter': {
    title: 'How to Enter — Firestarter Young Poets Prize 2026',
    desc: 'Two stages to enter: write and submit your poem and Voice Reflection, then perform if you are shortlisted.',
  },
  '/prize/enter': {
    title: 'Submit Your Entry — Firestarter Young Poets Prize 2026',
    desc: 'Enter the Firestarter Young Poets Prize 2026. Create your free account and submit your poem and Voice Reflection.',
  },
  '/prize/key-dates': {
    title: 'Key Dates — Firestarter Young Poets Prize 2026',
    desc: 'Competition timeline: entries close 30 October 2026, shortlist in November, and the grand final in December.',
  },
  '/prize/parents-and-teachers': {
    title: 'Parents & Teachers — Firestarter Young Poets Prize',
    desc: 'Information for parents and teachers supporting young poets.',
  },
  '/prize/consent-form': {
    title: 'Participant Commitment & Parental Consent — Firestarter Young Poets Prize',
    desc: 'Read or print the Participant Commitment and Parental Consent Form for the Firestarter Young Poets Prize 2026, including publication and photography choices.',
  },
  '/prize/spark-pack': {
    title: 'Spark Pack — Firestarter Young Poets Prize',
    desc: 'Download the Spark Pack — everything you need to prepare your entry.',
  },
  '/prize/contact': {
    title: 'Contact — Firestarter Young Poets Prize',
    desc: 'Get in touch with the Firestarter Young Poets Prize team.',
  },
  '/prize/auth': {
    title: 'Sign In — Firestarter Young Poets Prize',
    desc: 'Sign in to the Firestarter Young Poets Prize.',
    noindex: true,
  },
  '/prize/reset-password': {
    title: 'Reset Password — Firestarter Young Poets Prize',
    desc: 'Reset your Firestarter Young Poets Prize password.',
    noindex: true,
  },
  '/prize/dashboard': {
    title: 'My Entry — Firestarter Young Poets Prize',
    desc: 'Your Firestarter Young Poets Prize entry dashboard.',
    noindex: true,
  },
  '/prize/judge': {
    title: 'Judge Dashboard — Firestarter Young Poets Prize',
    desc: 'Score and review assigned entries.',
    noindex: true,
  },
  '/prize/admin': {
    title: 'Admin — Firestarter Young Poets Prize',
    desc: 'Admin panel for the Firestarter Young Poets Prize.',
    noindex: true,
  },
};
