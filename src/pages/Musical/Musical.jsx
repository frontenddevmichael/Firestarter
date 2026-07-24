import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import Styles from './Musical.module.css';

const testimonials = [
  '"One might describe it as heavenly, what a program! 90 minutes of beauty, the Elevate Poetry Crew nailed it."',
  '"A poetic investigation into human nature and God\'s heart for us. We were blown away, almost falling off our seats."',
  '"It was an awesome show, I won\'t forget this experience in a hurry."',
  '"It was worth it, worth the money, worth my time."',
  '"I heard Firestarter differently, and now it resonated deeply."',
  '"Being a first-timer to such an event, I will say it was worth my time, and somehow I regretted not coming with someone I knew would like the setting and event package."',
  '"Elevate is an eye opener to the reality of who one ought to be despite all odds. I was amazed that a meaningful poetry of such can be directed by a Nigerian, especially because of Africa\'s beliefs. I am glad I was there, and it came at just the right time of a phase in my life."',
];

const team = [
  { name: 'Shola Amaraibi', role: 'Founder & Poetic Visionary', bio: 'A poet who has spent over thirty years using language and performance to help people change direction. She pioneered Creative-TechFormance™ and leads The Firestarter Collective Africa.' },
  { name: 'Kenneth Uphopho', role: 'Artistic Director', bio: 'Over two decades in performance and artistic direction, with more than 500 productions and 25 international showcases. Founding director of Lagos Fringe and Abuja Fringe.' },
  { name: 'Ayo Alade', role: 'Music Director', bio: 'A Nigerian producer, film-score composer, and theatrical music director who blends traditional and contemporary sounds into immersive musical experiences.' },
  { name: 'Malik Afegbua', role: 'Creative Technology Director', bio: 'A Nigerian filmmaker and creative technologist whose AI-driven artwork has been featured by CNN and exhibited internationally. CEO of Slickcity Media.' },
];

const tiers = [
  { name: 'Legacy Partner', price: '₦25,000,000', qty: '2 organizations', desc: 'The most visible, top-of-campaign association, with co-presenter billing, box seat tables, and first position for the 2027 international expansion.' },
  { name: 'Founding Partner', price: '₦10,000,000', qty: '12 organizations', desc: 'Headline digital billing across the music-catalogue release, premium reserved seats, and recognition as a Founding Partner of the decade campaign.' },
  { name: 'Performance Partner', price: '₦5,000,000', qty: '6 organizations, one per performance', desc: 'Named partnership of a single show night, with branded presence and stage acknowledgment at that performance.' },
  { name: 'Music Catalogue Partner', price: '₦5,000,000', qty: '6 organizations', desc: 'Sustained brand association across the full music-release campaign, June through December, for partners prioritizing year-round digital presence.' },
  { name: 'SHEISAVOICE Foundation Partner', price: '₦2,000,000 to ₦20,000,000', qty: 'Multiple positions available', desc: 'A named foundation partnership for organizations with a health, disability, or child-welfare focus.' },
  { name: 'Community Partner', price: '₦1,000,000', qty: '15 organizations', desc: 'An entry-tier association with reserved seats and logo placement, built for smaller organizations and growing brands.' },
];

const ticketTypes = [
  { label: 'Youth/Student', price: '₦20,000' },
  { label: 'Standard Ticket', price: '₦30,000' },
  { label: 'VIP Experience', price: '₦50,000' },
  { label: 'Premium VIP', price: '₦75,000' },
  { label: 'Group of 3', price: '₦80,000' },
  { label: 'Family Ticket', price: '₦100,000', note: 'admits 2 adults + up to 3 children' },
  { label: 'Box Seat Table of 10', price: '₦1,000,000', note: '₦100,000 per person' },
];

const faqs = [
  { q: 'What is Creative-TechFormance?', a: 'A performance ecosystem that uses technology to create live, evidence-based identity transformation experiences at the intersection of creativity, community, and commerce.' },
  { q: 'Is this a play, a concert, or something else?', a: 'It\'s musical theatre. Poetry, live music, dance, and immersive technology, woven into one continuous story rather than a set of separate acts.' },
  { q: 'Is this suitable for children and families?', a: 'Firestarter: The Musical is family-friendly, but it carries mature emotional themes, including depictions of an abusive relationship, mental health struggles, and personal loss, handled with care rather than graphic content. Recommended for ages 12 and up. Younger children are welcome but may not follow the deeper themes.' },
];

export default function Musical() {
  return (
    <>

      {/* ── Hero ── */}
      <section className={Styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <span className="eyebrow">FIRESTARTER: THE MUSICAL</span>
            <h1 className={Styles.heroTitle}>You walk in carrying weight. You walk out lighter.</h1>
            <p className={Styles.heroSub}>Eight poems, one woman's journey, told in 90 minutes.</p>
            <p className={Styles.heroDate}>December 19–20, 2026 · MUSON Centre, Lagos</p>
          </Reveal>
        </div>
      </section>

      {/* ── Creative-TechFormance ── */}
      <section className={Styles.techSection}>
        <div className="container">
          <Reveal variant="soft">
            <span className="eyebrow">The Genre Behind the Show</span>
            <h2 className={Styles.sectionTitle}>What Is Creative-TechFormance</h2>
            <div className={Styles.prose}>
              <p>Firestarter: The Musical is a Creative-TechFormance™ experience. Here's what that means.</p>
              <p>Creative-TechFormance™ is a performance ecosystem that uses technology to create live, evidence-based identity transformation experiences at the intersection of creativity, community, and commerce.</p>
              <p>It draws on poetry, music, theatre, movement, and immersive technology as its instruments, not its subject. The technology extends reach. The transformation is the point.</p>
              <p>Every ticket includes access to the VR pre-show experience, a short immersive journey that begins shifting something in you before you take your seat.</p>
              <p>Firestarter: The Musical is where this methodology takes its fullest form on stage.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── About the Show ── */}
      <section className={Styles.aboutSection}>
        <div className="container">
          <Reveal variant="up">
            <h2 className={Styles.sectionTitle}>Eight Poems. Eight Angles. One Woman's Journey.</h2>
            <div className={Styles.prose}>
              <p>Firestarter: The Musical is adapted from eight original bodies of poetic work written by Shola Amaraibi. Each poem takes its own angle on a single woman's journey from uncertainty to self-assurance, layered enough that any one of the eight could carry its own separate production. On one stage, together, they tell one story.</p>
              <p>Through music, dance, poetry, and re-enactment, the show moves the audience through identity, love, family, career, and resilience, tracing a transformation from uncertainty to self-assurance.</p>
            </div>
          </Reveal>
          <Reveal className={Styles.themesBlock}>
            <h3 className={Styles.blockLabel}>Themes</h3>
            <ul className={Styles.themeList}>
              <li><strong>Identity:</strong> the search for one's true purpose beneath the roles others assign.</li>
              <li><strong>Love:</strong> romantic love, family love, and self-love, and the ways they pull against each other.</li>
              <li><strong>Family:</strong> how it shapes who we become, for better and for worse.</li>
              <li><strong>Career:</strong> pursuing a calling and surviving the obstacles in its way.</li>
              <li><strong>Resilience:</strong> staying the course through autonomy and self-sufficiency.</li>
            </ul>
          </Reveal>
          <Reveal className={Styles.soundBlock}>
            <h3 className={Styles.blockLabel}>Sound</h3>
            <p className={Styles.prose}>The score moves across soul, R&B, and Afrobeat, matching the emotional register of each chapter to the sound built for it.</p>
          </Reveal>
          <Reveal className={Styles.givingBlock}>
            <h3 className={Styles.blockLabel}>Giving Back</h3>
            <p className={Styles.prose}>10% of ticket proceeds fund SHEISAVOICE, supporting therapy and early intervention for children with special needs.</p>
          </Reveal>
        </div>
      </section>

      {/* ── Creative Team ── */}
      <section className={Styles.teamSection}>
        <div className="container">
          <Reveal variant="clip">
            <h2 className={Styles.sectionTitle}>Creative Team</h2>
          </Reveal>
          <div className={Styles.teamGrid}>
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 80} className={Styles.teamCard}>
                <div className={Styles.teamPhoto}>
                  <span className={Styles.teamInitials}>{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className={Styles.teamName}>{member.name}</h3>
                <span className={Styles.teamRole}>{member.role}</span>
                <p className={Styles.teamBio}>{member.bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Audiences Are Saying ── */}
      <section className={Styles.testimonialsSection}>
        <div className="container">
          <Reveal variant="up">
            <h2 className={Styles.sectionTitle}>What Audiences Are Saying</h2>
            <p className={Styles.testimonialLead}>From audiences of the Elevate Poetry Experience, the foundation Firestarter: The Musical builds on:</p>
          </Reveal>
          <div className={Styles.testimonialGrid}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 40} className={Styles.testimonialCard}>
                <Icon name="quote" size={18} className={Styles.quoteIcon} />
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Watch Their Stories ── */}
      <section className={Styles.videosSection}>
        <div className="container">
          <Reveal variant="soft">
            <h2 className={Styles.sectionTitle}>Watch Their Stories</h2>
            <p>Post-event feedback from the last Firestarter: The Musical.</p>
          </Reveal>
          <div className={Styles.videoGrid}>
            {[1, 2, 3].map((v) => (
              <div key={v} className={Styles.videoPlaceholder}>
                <Icon name="play" size={28} className={Styles.playIcon} />
                <span>Video {v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event Details ── */}
      <section className={Styles.detailsSection}>
        <div className="container">
          <Reveal variant="up">
            <h2 className={Styles.sectionTitle}>Event Details</h2>
            <ul className={Styles.detailsList}>
              <li><strong>Dates:</strong> December 19–20, 2026</li>
              <li><strong>Venue:</strong> AGIP Recital Hall, MUSON Centre, Lagos</li>
              <li><strong>Three performances each day</strong>, Saturday and Sunday, six in total, approximately 2,000 seats across the weekend</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Corporate & Partnership Seats ── */}
      <section className={Styles.partnerSection}>
        <div className="container">
          <Reveal variant="clip">
            <span className="eyebrow">Partner With The Story</span>
            <h2 className={Styles.sectionTitle}>Corporate & Partnership Seats</h2>
            <p className={Styles.partnerLead}>For organizations who want more than a seat. Six tiers, each built around a different scale of brand impact and involvement.</p>
          </Reveal>
          <div className={Styles.tierGrid}>
            {tiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 60} className={Styles.tierCard}>
                <h3 className={Styles.tierName}>{tier.name}</h3>
                <p className={Styles.tierPrice}>{tier.price}</p>
                <span className={Styles.tierQty}>{tier.qty}</span>
                <p className={Styles.tierDesc}>{tier.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Buy Tickets ── */}
      <section className={Styles.ticketsSection}>
        <div className="container">
          <Reveal variant="up">
            <h2 className={Styles.sectionTitle}>Buy Tickets</h2>
            <p className={Styles.ticketLead}>Select a performance, ticket type, and number of seats. Checkout is secure, powered by Paystack, right here on this page.</p>
          </Reveal>
          <div className={Styles.ticketGrid}>
            {ticketTypes.map((t) => (
              <div key={t.label} className={Styles.ticketRow}>
                <span className={Styles.ticketLabel}>{t.label}</span>
                {t.note && <span className={Styles.ticketNote}>{t.note}</span>}
                <span className={Styles.ticketPrice}>{t.price}</span>
              </div>
            ))}
          </div>
          <div className={Styles.performanceSelect}>
            <p className={Styles.perfText}>Performance: Sat, Dec 19 — 1PM | 4PM | 7PM &nbsp;&nbsp;&nbsp; Sun, Dec 20 — 1PM | 4PM | 7PM</p>
            <p className={Styles.qtyText}>Quantity: <span className={Styles.qtyPlaceholder}>—</span></p>
          </div>
          <a href="#" className={Styles.buyBtn} onClick={(e) => { e.preventDefault(); alert('Paystack checkout integration pending.'); }}>
            Buy Tickets <Icon name="arrowRight" size={16} />
          </a>
        </div>
      </section>

      {/* ── For Organizations ── */}
      <section className={Styles.orgSection}>
        <div className="container">
          <Reveal variant="up">
            <h2 className={Styles.sectionTitle}>For Organizations</h2>
            <p className={Styles.orgLead}>Corporate and foundation partnerships are arranged directly, not through checkout. Chat with our team on WhatsApp to discuss tiers and availability.</p>
            <a href="https://wa.me/2347039343468?text=I'm%20interested%20in%20partnering%20for%20Firestarter%3A%20The%20Musical" target="_blank" rel="noopener noreferrer" className={Styles.whatsappBtn}>
              Chat With Us on WhatsApp <Icon name="arrowRight" size={16} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={Styles.faqSection}>
        <div className="container">
          <Reveal variant="soft">
            <span className="eyebrow">What people ask before they book</span>
            <h2 className={Styles.sectionTitle}>FAQ</h2>
          </Reveal>
          <div className={Styles.faqList}>
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 80} className={Styles.faqItem}>
                <h3 className={Styles.faqQ}>{faq.q}</h3>
                <p className={Styles.faqA}>{faq.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
