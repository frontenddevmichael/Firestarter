import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import styles from './CompanyHome.module.css';

const WHATSAPP = 'https://wa.me/2347039343468?text=';

function waMsg(msg) {
  return `${WHATSAPP}${encodeURIComponent(msg)}`;
}

const forces = [
  {
    name: 'FORGE',
    text: 'First you set the foundation: who you actually are, tested, not assumed. Skip this, and everything you build afterward sits on ground you never checked. It holds, until pressure comes. Then it doesn\'t.',
  },
  {
    name: 'ILLUMINATE',
    text: 'Then you decide, without borrowing anyone else\'s answer, what this season is actually for. Skip this, and you can spend years arriving somewhere you never meant to go.',
  },
  {
    name: 'ENACT',
    text: 'Then the thing that\'s been sitting inside you finally leaves your hands and enters the world. This is the Point-To-It Standard: if you can\'t point to it, you haven\'t done it yet. Miss this, and your best work stays potential instead of proof.',
  },
  {
    name: 'REGENERATE',
    text: 'Somewhere in all of that, you protect what the building could cost you: your body, your people, your joy. So the life you\'re building doesn\'t quietly replace the person meant to live it. Otherwise, the building starts costing you pieces of yourself that were never meant to be payment.',
  },
  {
    name: 'AMPLIFY',
    text: 'Then what you\'ve built learns to travel: reaching people you\'ll never meet, running in rooms you\'re not in, carried by tools and systems built to spread work further than one person alone ever could. Leave this out, and what you built dies the day you stop showing up for it.',
  },
];

const faqs = [
  {
    q: 'IS THIS COACHING, THERAPY, OR A COURSE?',
    a: 'It is a structured method with a clear sequence and a standard of proof at each stage. It is not therapy and does not replace therapy.',
  },
  {
    q: 'DO I HAVE TO BE CREATIVE OR A POET?',
    a: 'No. The Method began in poetry, but it is designed for anyone willing to examine their choices honestly and do the work.',
  },
  {
    q: 'IS THIS A RELIGIOUS PROGRAMME?',
    a: 'My own life is shaped by faith, and the Method grew out of that context. The Method itself asks you for evidence, not religious affiliation, and people of every background use it.',
  },
  {
    q: 'HOW LONG DOES IT TAKE?',
    a: 'Each force has its own pace. Some move faster, some take longer. The full Method is not designed to be completed in a weekend.',
  },
  {
    q: 'WHERE ARE YOU BASED? CAN I DO THIS ONLINE?',
    a: 'I am based between Lagos and Paris. The Method can be taught and completed online, in English.',
  },
  {
    q: 'WHERE DO I START?',
    a: 'Begin with the free 15-minute video on this page. It\'ll show you exactly where you stand, and give you one clear move to make next.',
  },
];

const cards = [
  {
    title: 'Unstoppable Workshop',
    desc: 'Unstoppable Workshop is a monthly, 90-minute group session built around the Firestarter Method.',
    msg: "Hi, I'd like to talk about the Unstoppable Workshop",
  },
  {
    title: 'Forge Intensive',
    desc: 'Three hours, one to one. We work Force One properly: who you are under pressure, and the standard you will hold to. You leave with your Forge Standard started, in writing.',
    msg: "Hi, I'd like to talk about the Forge Intensive",
  },
  {
    title: 'Firestarter Deluxe',
    desc: 'The complete method, taught in one sitting. Training and workbook. Watch it in an evening.',
    msg: "Hi, I'd like to talk about the Firestarter Deluxe",
  },
  {
    title: 'Firestarter Business Lane',
    desc: 'Finds the money hiding in your business using the Firestarter Method, then helps you go get it. One scan shows you where. One 14-day sprint makes it real. You leave with proof you can build with.',
    msg: "Hi, I'd like to talk about the Firestarter Business Lane",
  },
];

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function CompanyHome() {
  return (
    <>
      {/* 1. Hero */}
      <section className={`${styles.hero} grain`}>
        <div className={styles.heroBg}>
          <img src="/WEBSITEIMAGE.jpeg" alt="Shola Amaraibi" className={styles.heroPhoto} />
        </div>
        <div className={`${styles.heroOverlay} container`}>
          <Reveal>
            <SparkMark drawIn />
            <span className="eyebrow">The Firestarter Method</span>
            <h1 className={styles.heroBig}>
              You have had the breakthroughs. You have taken the notes.<br />
              You still cannot point to what you built.
            </h1>
            <p className={styles.heroSub}>
              A breakthrough is a door. It was never meant to be the house.
            </p>
            <p className={styles.heroDesc}>
              The Firestarter Method is a five-force system that helps you name the life you want, own the choices it requires, and make it real.
            </p>
            <Link to="/training" className="btnPrimary">
              See how it works <Icon name="arrowRight" size={16} />
            </Link>
            <p className={styles.heroFootnote}>
              Fifteen minutes. Get an accurate mirror. Name the real constraint. Leave with one move that creates movement.
            </p>
            <a href="#method" className={styles.heroRead}>Or read the whole method</a>
          </Reveal>
        </div>
      </section>

      {/* 2. What This Is */}
      <section className={styles.whatThis}>
        <div className="container">
          <Reveal className={styles.whatThisGrid}>
            <div className={styles.whatThisText}>
              <span className={styles.smallHeading}>What this is</span>
              <p>
                I'm Shola Amaraibi. I'm a poet, a performance facilitator, and the creator of the Firestarter Method: five forces that turn what you've had (the breakthroughs, the notes, the ideas) into something you can point to.
              </p>
              <p>
                See how it works in the video above. The full shape of the method is laid out below.
              </p>
            </div>
            <div className={styles.whatThisImageWrap}>
              <img src="/WEBSITEIMAGE.jpeg" alt="Shola Amaraibi" className={styles.whatThisImage} loading="lazy" decoding="async" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. The Problem */}
      <section className={styles.problem}>
        <div className="container">
          <Reveal className={styles.problemInner}>
            <span className={styles.smallHeading}>The problem</span>
            <p>
              You are not lazy or unmotivated. You have been to the conferences and trainings. You have had breakthroughs. Real ones. The kind where you sit in the car afterwards and something in your chest has actually moved.
            </p>
            <p>
              And then Monday comes, you go looking for the next breakthrough. Another workshop, another book, another prayer, another planner. Each one seems to work for about eleven days.
            </p>
            <p>
              A breakthrough is a door. It is not a house. You have been collecting doors.
            </p>
            <p>
              Sometimes that looks dramatic. More often it looks ordinary. Another postponed decision. Another project half built. Another promise quietly renegotiated with yourself.
            </p>
            <p>
              That is the real cost. Not the business you never launched. Whether you still believe you're the kind of person who builds the life they meant to build.
            </p>
            <p>That is where it starts.</p>
          </Reveal>
        </div>
      </section>

      {/* 4. Who This Is For */}
      <section className={styles.whoFor}>
        <div className="container">
          <Reveal className={styles.whoForInner}>
            <span className={styles.smallHeading}>Who this is for</span>
            <div className={styles.whoForGrid}>
              <div className={styles.whoForCard}>
                <h3>BUILDERS</h3>
                <p>You are productive, capable and respected. And the one thing that matters most stays unfinished, unreleased, or too dependent on you to survive without you.</p>
              </div>
              <div className={styles.whoForCard}>
                <h3>STARTERS</h3>
                <p>The thing is inside you. You have never fully brought it into the world.</p>
              </div>
              <div className={styles.whoForCard}>
                <h3>RETURNERS</h3>
                <p>You had it. You lost it. And you are not sure you are allowed to want it again.</p>
              </div>
            </div>
            <p className={styles.whoForFooter}>Different doors, same house. The method works the same way for all three. Start at the beginning.</p>
          </Reveal>
        </div>
      </section>

      {/* 5. The Firestarter Method */}
      <section id="method" className={`${styles.methodSection} grain`}>
        <div className="container">
          <Reveal className={styles.methodIntro}>
            <SparkMark />
            <span className="eyebrow">The Firestarter Method</span>
            <p className={styles.methodLead}>
              Five forces, each one setting up the next.
            </p>
          </Reveal>

          <div className={styles.forces}>
            {forces.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.06} className={styles.forceBlock}>
                <span className={styles.forceNum}>0{i + 1}.</span>
                <h3 className={styles.forceName}>{f.name}</h3>
                <p className={styles.forceProse}>{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Where This Came From */}
      <section className={styles.origin}>
        <div className="container">
          <Reveal className={styles.originInner}>
            <span className={styles.smallHeading}>Where this came from</span>
            <p className={styles.originLead}>The work is decades old. This poem is the moment it caught fire. Here is the closing verse.</p>
            <div className={styles.originLayout}>
              <div className={styles.originImageWrap}>
                <img src="/WEBSITEIMAGE.jpeg" alt="Shola Amaraibi" className={styles.originImage} loading="lazy" decoding="async" />
              </div>
              <div className={styles.originProse}>
                <p>The philosophy behind this work has been mine for a long time, worked out slowly, across years, in rooms most people never saw.</p>
                <p>Then in 2020, I wrote it into a poem. I called it Firestarter. I knew it was good. I didn't know that in a few days, it would reach more than 10,000 people across the world, women and men both.</p>
                <p>The day before, almost nobody knew my work. The day after, everything changed. People weren't just moved. They wanted to know how to become one: a firestarter, in their own life.</p>
              </div>
            </div>
            <div className={styles.poemBlock}>
              <p className={styles.poemLine}>Dear Firestarter, start something.</p>
              <p className={styles.poemLine}>Burn by all means divinely given.</p>
              <p className={styles.poemLine}>Start a revolution. Be one.</p>
              <p className={styles.poemLine}>Be remembered as the woman who harnessed her fire,</p>
              <p className={styles.poemLine}>who burned to the ground what she knew was wrong,</p>
              <p className={styles.poemLine}>who did not apologise for existing by being quiet.</p>
              <p className={styles.poemLine}>Let the earth feel your heat.</p>
              <p className={styles.poemLine}>We do not eat cold or lukewarm.</p>
              <p className={styles.poemLine}>You are not a bundle of excuses.</p>
              <p className={styles.poemLine}>You are not a clich&eacute;.</p>
              <p className={styles.poemLine}>You are the standard.</p>
              <p className={styles.poemLine}>Stand and be seen. Now.</p>
            </div>
            <Link to="/about" className={styles.textLink}>The full story <Icon name="arrowRight" size={14} /></Link>
          </Reveal>
        </div>
      </section>

      {/* 7. Why You Can Trust Me */}
      <section className={`${styles.trust} grain`}>
        <div className="container">
          <Reveal className={styles.trustInner}>
            <span className={styles.smallHeading}>Why you can trust me</span>
            <div className={styles.trustProse}>
              <p>I did the inner work first: honest self-examination, deep searching and paid work with experts, long before I asked anyone else to look at themselves.</p>
              <p>In 2013, I decided what my life was for, and I have turned down work that didn't fit it, including work that paid.</p>
              <p>I did not leave the work inside me. I turned ideas into finished projects, public experiences, and organisations that exist without me having to explain them.</p>
              <p>I built recovery into the work itself: protecting time to rest, reset, and return, before the next demanding season. Meaningful work should stretch you. It should not require you to disappear inside it.</p>
              <p>SHEISAVOICE reaches children I have never met.</p>
              <p>I built this method by needing it.</p>
            </div>
          </Reveal>

          <Reveal className={styles.clientResults}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialImageWrap}>
                <img src="/testimonial%20image.jpeg" alt="Annie Ogoshe" className={styles.testimonialImage} loading="lazy" decoding="async" />
              </div>
              <div className={styles.testimonialText}>
                <p>&ldquo;Working with Shola Amaraibi has impacted my life so much. In my Firestarter conversations with Shola, she asked me one question that shook me. It stripped away the false narratives I'd told myself about my love life and my business, and showed me how much I'd been deceiving myself. In the Unstoppable Workshop, she showed me a way to go after what I actually wanted. That same week, I asked five people to invest in my business, something I'd never had the courage to do. I hit a milestone I'd been chasing for six years, and the coaching ultimately led me and my team to China.&rdquo;</p>
                <span className={styles.testimonialAttribution}>Annie Ogoshe</span>
              </div>
            </div>
          </Reveal>

          <Reveal className={styles.pressLogos}>
            <p className={styles.pressLabel}>As featured in</p>
            <div className={styles.pressRow}>
              <span className={styles.pressLogo}>The Guardian</span>
              <span className={styles.pressLogo}>BBC</span>
              <span className={styles.pressLogo}>TEDX</span>
              <span className={styles.pressLogo}>Vogue</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. Work With Me */}
      <section id="work" className={styles.work}>
        <div className="container">
          <Reveal className={styles.workInner}>
            <span className={styles.smallHeading}>Work with me</span>
            <div className={styles.workCards}>
              {cards.map((c) => (
                <div key={c.title} className={styles.workCard}>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <a
                    href={waMsg(c.msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.workCta}
                  >
                    Talk to me about this <Icon name="arrowRight" size={14} />
                  </a>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. Also In This House */}
      <section className={`${styles.house} grain`}>
        <div className="container">
          <Reveal className={styles.houseInner}>
            <span className={styles.smallHeading}>Also in this house</span>
            <p className={styles.houseLead}>Where else does the method show up?</p>
            <div className={styles.houseLinks}>
              <a href="/musical" className={styles.houseLink}>
                <strong>Firestarter: The Musical.</strong> The method, on a stage, ticketed and open to the public.
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className={styles.houseLink}>
                <strong>SHEISAVOICE.</strong> We give ten percent of every Firestarter performance to SHEISAVOICE, our sister foundation supporting children with special needs.
              </a>
              <a href="/prize" className={styles.houseLink}>
                <strong>Firestarter Young Poets Prize.</strong> We also kicked off the Firestarter Young Poets Prize. This year's theme: My Voice, My Future.
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10. What To Do Next */}
      <section className={styles.next}>
        <div className="container">
          <Reveal className={styles.nextInner}>
            <span className={styles.smallHeading}>What to do next</span>
            <div className={styles.nextSteps}>
              <div className={styles.nextStep}>
                <span className={styles.nextNum}>Step 1. <mark>Free</mark></span>
                <p>Watch the video. Fifteen minutes. Get an accurate mirror. Name the real constraint. Leave with one move that creates movement.</p>
                <Link to="/training" className={styles.textLink}>See how it works <Icon name="arrowRight" size={14} /></Link>
              </div>
              <div className={styles.nextStep}>
                <span className={styles.nextNum}>Step 2.</span>
                <p>From there, you'll hear about the Pathfinding Session, or go straight to any of the four ways to work with me.</p>
                <a href="#work" className={styles.textLink}>See how to work with me <Icon name="arrowRight" size={14} /></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 11. Questions */}
      <section className={styles.faq}>
        <div className="container">
          <Reveal className={styles.faqInner}>
            <span className={styles.smallHeading}>Questions</span>
            <div className={styles.faqList}>
              {faqs.map((item) => (
                <div key={item.q} className={styles.faqItem}>
                  <p className={styles.faqQ}>{item.q}</p>
                  <p className={styles.faqA}>{item.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 12. Closing */}
      <section className={`${styles.closing} grain`}>
        <div className="container">
          <Reveal className={styles.closingInner}>
            <p className={styles.closingLead}>A breakthrough is a door. Firestarter is the life you build after it.</p>
            <Link to="/training" className="btnPrimary">
              See how it works <Icon name="arrowRight" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
