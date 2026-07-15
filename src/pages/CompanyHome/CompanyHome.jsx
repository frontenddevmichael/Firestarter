import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import PrizeBanner from '../../components/PrizeBanner';
import FieraFlow from '../../components/FieraFlow';
import styles from './CompanyHome.module.css';

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

const forces = [
  {
    num: '01',
    name: 'FORGE',
    desc: 'Strip what isn\'t you. Name what is. Claim it under pressure.',
    question: 'Who am I when I am under pressure?',
    holding: 'Your standard, in writing. Fourteen days of logged proof that it held when things got hard. One of those moments confirmed by somebody other than you. And one habit that measurably dropped, by a number you can show.',
  },
  {
    num: '02',
    name: 'ILLUMINATE',
    desc: 'See it clearly. Know it\'s yours. Prove it fits.',
    question: 'What is my life actually in service of?',
    holding: 'Your direction, in writing, and the one thing you are building this season. Seven days of real decisions proving it works. Including one real no that cost you something, and one thing you dropped and told the truth about.',
  },
  {
    num: '03',
    name: 'ENACT',
    desc: 'Design the plan. Deploy the rhythm. Deliver the proof.',
    question: 'How does the thing inside me get out of me and into the world?',
    holding: 'A finished result. Released to a standard you set before you started, not after. Confirmed by two kinds of proof, at least one of which is not your own word for it.',
  },
  {
    num: '04',
    name: 'REGENERATE',
    desc: 'Audit honestly. Architect humanely. Anchor what holds.',
    question: 'If this season lasted much longer than I planned, would I still recognise myself?',
    holding: 'Thirty days of evidence that you can build without losing your body, your joy, or the people who love you. Not a resolution. Thirty days you can point to.',
  },
  {
    num: '05',
    name: 'AMPLIFY',
    desc: 'Multiply what you do. Magnetize through what you have built. Codify what must outlast you.',
    question: 'Does any of this work when I am not in the room?',
    holding: 'Work that runs without you. Three people who acted because they saw your proof, without you asking them to. And someone else who ran your method successfully, with nobody coming to rescue them.',
  },
];

const faqs = [
  {
    q: 'Is this coaching, therapy, or a course?',
    a: 'It is a method: a fixed sequence with a standard of proof at every step. It is not therapy and it does not replace therapy. Some people do both. I did.',
  },
  {
    q: 'Do I have to be creative, or a poet?',
    a: 'No. The method began in poetry, but it runs on evidence. Accountants finish it. Founders finish it. Mothers finish it. The only requirement is that you are willing to be honest on paper.',
  },
  {
    q: 'Is this a religious programme?',
    a: 'My own life is a life of faith, and the method was built inside it. The method itself asks you for evidence, not belief, and people of every background use it.',
  },
  {
    q: 'How long does it take?',
    a: 'Each force carries its own proof window: fourteen days in Forge, seven in Illuminate, thirty in Regenerate. Most people work one force per season. This is not a weekend. That is the point of it.',
  },
  {
    q: 'Where are you based? Does this work online?',
    a: 'Lagos and Paris. Everything can be done online, live, on Zoom, in English. The training and the workbook are available everywhere, instantly.',
  },
  {
    q: 'Where do I start?',
    a: 'The free training. Fifteen minutes. Then the assessment. Both cost nothing, and by the end of them you will know exactly where you stand.',
  },
];

export default function CompanyHome() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <section className={`${styles.hero} grain`}>
        <div className={styles.heroBg}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={styles.heroGhost}
              style={{ left: `${12 + i * 14}%`, top: `${18 + i * 11}%` }}
              aria-hidden="true"
            >
              {['✦', '✧', '◇', '⬟', '△', '○'][i]}
            </span>
          ))}
        </div>
        <div className="container">
          <Reveal>
            <SparkMark drawIn />
            <span className="eyebrow">The Firestarter Method</span>
            <h1 className={styles.heroBig}>
              You have had the breakthroughs.<br />
              You have taken the notes.<br />
              You still cannot point to what you built.
            </h1>
            <p className={styles.heroSub}>
              A breakthrough is a door. It was never meant to be the house.
            </p>
            <p className={styles.heroDesc}>
              I teach the Firestarter Method. Five forces that take what you have seen
              and turn it into what you can show: a decision made, a thing built,
              a rhythm that holds, work that reaches people.
              The whole method is on this page, free.
            </p>
            <Link to="/training" className="btnPrimary">
              Watch the free training <Icon name="arrowRight" size={16} />
            </Link>
            <p className={styles.heroFootnote}>
              Fifteen minutes. The whole method, on one real life.
            </p>
            <a href="#method" className={styles.heroRead}>Or read the whole method</a>
          </Reveal>
        </div>
      </section>

      {/* ── 2. What this is ── */}
      <section className={styles.whatThis}>
        <div className="container">
          <Reveal className={styles.whatThisGrid}>
            <div className={styles.whatThisText}>
              <span className={styles.smallHeading}>What this is</span>
              <p>
                My name is Shola Amaraibi. I teach the Firestarter Method. It is a five-force
                system for people who have plenty of insight and not enough evidence. Plenty
                of clarity, not enough finished work. It takes you from knowing what you want
                to holding proof that you built it.
              </p>
              <p>
                The five forces are Forge, Illuminate, Enact, Regenerate and Amplify. Forge
                settles who you are. Illuminate settles what it is for. Enact gets it built.
                Regenerate keeps you whole while you build it. Amplify gets it to the people
                it was made for.
              </p>
              <p>
                By the end you are not inspired. You are finished. Those are different things,
                and the difference changes how you carry yourself. The whole map is on this
                page, free. What I sell is the teaching, the tools, and the guided work that
                helps you apply it to your life.
              </p>
            </div>
            <div className={styles.whatThisImageWrap}>
              <img src="/WEBSITEIMAGE.jpeg" alt="Shola Amaraibi" className={styles.whatThisImage} loading="lazy" decoding="async" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3. The problem ── */}
      <section className={styles.problem}>
        <div className="container">
          <Reveal className={styles.problemInner}>
            <span className={styles.smallHeading}>The problem</span>
            <p>
              You are not lazy. You are not unmotivated. You have been to the conferences.
              You have the notebooks. You have had breakthroughs. Real ones. The kind where
              you sit in the car afterwards and something in your chest has actually moved.
            </p>
            <p>
              And then Monday comes. So you go looking for the next breakthrough. Another
              workshop, another book, another prayer, another planner. Each one seems to
              work for about eleven days.
            </p>
            <p>
              A breakthrough is a door. It is not a house. You have been collecting doors.
              And every time you walk away from something you said mattered, you learn a
              little more not to trust yourself.
            </p>
            <p>
              Sometimes that looks dramatic. More often it looks ordinary. Another postponed
              decision. Another project half built. Another promise quietly renegotiated
              with yourself.
            </p>
            <p>
              That is the real cost. Not the business you never launched. The trust in
              yourself that you spent. That is what this method is built to end.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 4. Who this is for ── */}
      <section className={styles.whoFor}>
        <div className="container">
          <Reveal className={styles.whoForInner}>
            <span className={styles.smallHeading}>Who this is for</span>
            <div className={styles.whoForGrid}>
              <div className={styles.whoForCard}>
                <h3>Builders</h3>
                <p>You are productive, capable and respected. And the one thing that matters most stays unfinished, unreleased, or too dependent on you to survive without you.</p>
              </div>
              <div className={styles.whoForCard}>
                <h3>Starters</h3>
                <p>The thing is inside you. You have never fully brought it into the world.</p>
              </div>
              <div className={styles.whoForCard}>
                <h3>Returners</h3>
                <p>You had it. You lost it. And you are not sure you are allowed to want it again.</p>
              </div>
            </div>
            <p className={styles.whoForFooter}>Different doors, same house. The method works the same way for all three. Start at the beginning.</p>
          </Reveal>
        </div>
      </section>

      {/* ── 5. The Firestarter Method ── */}
      <section id="method" className={`${styles.methodSection} grain`}>
        <div className="container">
          <Reveal className={styles.methodIntro}>
            <SparkMark />
            <span className="eyebrow">The Firestarter Method</span>
            <p className={styles.methodLead}>
              Five forces. Fifteen stages. Forty-five steps. Every step ends the same way.
              You are holding something. A document. A number. A decision you actually made.
              A thing you actually finished. Something a person other than you can confirm.
            </p>
            <p>
              If you cannot point to it, you have not done it yet. That is the standard,
              and it is the same standard in all five. What follows is the complete map.
              The deeper teaching, tools and application sit inside the work itself.
            </p>
            <div className={styles.diagram}>
              <FieraFlow className={styles.diagramSvg} />
              <p className={styles.diagramCaption}>The five forces of the Firestarter Method — a fixed sequence, each with its own standard of proof.</p>
            </div>
          </Reveal>

          <div className={styles.forces}>
            {forces.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.06} className={styles.forceBlock}>
                <span className={styles.forceNum}>{f.num}.</span>
                <h3 className={styles.forceName}>{f.name}</h3>
                <p className={styles.forceDesc}>{f.desc}</p>
                <p className={styles.forceQuestion}>The question it answers: <em>{f.question}</em></p>
                <p className={styles.forceHolding}>What you walk away holding: {f.holding}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className={styles.methodOutro}>
            <p>
              Notice what is missing from all of that. There is nothing in there you can download.
              The proof has to be built, in a real life, over real time, and confirmed by real people.
              That was always the hard part, and it is the part almost nobody survives alone.
            </p>
            <p>
              That is why I can give you the whole method and lose nothing. And it is why the people
              who finish do not sound inspired when they talk about it. They sound quiet. They point
              at the thing. It is there.
            </p>
            <Link to="/training" className="btnPrimary">
              Watch the free training <Icon name="arrowRight" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── 6. Where this came from ── */}
      <section className={styles.origin}>
        <div className="container">
          <Reveal className={styles.originInner}>
            <span className={styles.smallHeading}>Where this came from</span>
            <p className={styles.originLead}>Before any of this was a method, it was a poem.</p>
            <div className={styles.originLayout}>
              <div className={styles.originImageWrap}>
                <img src="/WEBSITEIMAGE.jpeg" alt="Shola Amaraibi" className={styles.originImage} loading="lazy" decoding="async" />
              </div>
              <div className={styles.originPoem}>
                <p>[SHOLA: the origin poem goes here, plus no more than 120 words after it. What it cost you. What came out of it.]</p>
              </div>
            </div>
            <Link to="/about" className={styles.textLink}>The full story <Icon name="arrowRight" size={14} /></Link>
          </Reveal>
        </div>
      </section>

      {/* ── 7. Why you can trust me ── */}
      <section className={`${styles.trust} grain`}>
        <div className="container">
          <Reveal className={styles.trustInner}>
            <span className={styles.smallHeading}>Why you can trust me</span>
            <p className={styles.trustLead}>I am not asking you to do anything I have not done.</p>
            <div className={styles.trustForces}>
              <div className={styles.trustItem}><strong>Forge.</strong> I did the inner work first. Years of therapy and honest self-examination, long before I taught anyone else to look at themselves.</div>
              <div className={styles.trustItem}><strong>Illuminate.</strong> In 2013 I decided what my life was for. I have turned down work that did not fit it, including work that paid.</div>
              <div className={styles.trustItem}><strong>Enact.</strong> I did not leave the work inside me. I turned ideas into finished projects, public experiences, organisations and a complete forty-five-step method that can be taught, tested and used by someone other than me.</div>
              <div className={styles.trustItem}><strong>Regenerate.</strong> I began building recovery into the work itself, protecting time to rest, reset and return before entering the next demanding season. I learned that meaningful work should stretch me, but it should not require me to disappear inside it.</div>
              <div className={styles.trustItem}><strong>Amplify.</strong> SHEISAVOICE reaches children I have never met. People who are not me now teach the method. Firestarter: The Musical is being prepared to travel.</div>
            </div>
            <p className={styles.trustClose}>I built this method by needing it.</p>
          </Reveal>

          <Reveal className={styles.clientResults}>
            <span className={styles.smallHeading}>Client Results</span>
            <div className={styles.testimonials}>
              <div className={styles.testimonial}>
                <p>"[SHOLA: real client result — something concrete: a thing finished, a decision made, a number that moved]"</p>
                <span className={styles.testimonialAttribution}>— Name, City. Forge Intensive.</span>
              </div>
              <div className={styles.testimonial}>
                <p>"[SHOLA: second client result — same standard. Name. City. Offer.]"</p>
                <span className={styles.testimonialAttribution}>— Name, City. Firestarter Deluxe.</span>
              </div>
            </div>
          </Reveal>

          <Reveal className={styles.pressLogos}>
            <p className={styles.pressLabel}>As featured in</p>
            <div className={styles.pressRow}>
              <span className={styles.pressLogo}>The Guardian</span>
              <span className={styles.pressLogo}>BBC</span>
              <span className={styles.pressLogo}>TEDx</span>
              <span className={styles.pressLogo}>Vogue</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 8. Work with me ── */}
      <section className={styles.work}>
        <div className="container">
          <Reveal className={styles.workInner}>
            <span className={styles.smallHeading}>Work with me</span>
            <div className={styles.workCards}>
              <div className={styles.workCard}>
                <h3>The Firestarter Deluxe</h3>
                <p>The complete method, taught in one sitting. Training and workbook. Watch it in an evening.</p>
                <p className={styles.workPrice}>₦185,000 / $135</p>
                <Link to="/deluxe" className={styles.workCta}>Buy now <Icon name="arrowRight" size={14} /></Link>
              </div>
              <div className={styles.workCard}>
                <h3>The Forge Intensive</h3>
                <p>Three hours, one to one. We work Force One properly: who you are under pressure, and the standard you will hold to. You leave with your Forge Standard started, in writing.</p>
                <p className={styles.workPrice}>₦350,000 / $250</p>
                <Link to="/forge" className={styles.workCta}>Book now <Icon name="arrowRight" size={14} /></Link>
              </div>
            </div>
            <p className={styles.workNote}>
              Not sure which one? The free assessment will tell you where you actually are. Start there.<br />
              <Link to="/assessment" className={styles.textLink}>Take the free assessment</Link>
            </p>
          </Reveal>
        </div>
      </section>

      <PrizeBanner />

      {/* ── 9. Also in this house ── */}
      <section className={`${styles.house} grain`}>
        <div className="container">
          <Reveal className={styles.houseInner}>
            <span className={styles.smallHeading}>Also in this house</span>
            <p className={styles.houseLead}>The method also lives outside the classroom.</p>
            <div className={styles.houseLinks}>
              <Link to="/musical" className={styles.houseLink}>
                <strong>Firestarter: The Musical.</strong> The method, on a stage. Edinburgh Fringe 2027.
              </Link>
              <a href="/prize" target="_blank" rel="noreferrer" className={styles.houseLink}>
                <strong>The Firestarter Young Poets Prize.</strong> Young voices, given a stage of their own.
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className={styles.houseLink}>
                <strong>SHEISAVOICE.</strong> The foundation. Children with special needs, and the women who raise them.
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 10. What to do next ── */}
      <section className={styles.next}>
        <div className="container">
          <Reveal className={styles.nextInner}>
            <span className={styles.smallHeading}>What to do next</span>
            <div className={styles.nextSteps}>
              <div className={styles.nextStep}>
                <span className={styles.nextNum}>Step 1. <mark>Free</mark></span>
                <p>Watch the training. Fifteen minutes. See the method working on one real life.</p>
                <Link to="/training" className={styles.textLink}>Go to training <Icon name="arrowRight" size={14} /></Link>
              </div>
              <div className={styles.nextStep}>
                <span className={styles.nextNum}>Step 2. <mark>Free</mark></span>
                <p>Take the assessment. Find out which of the five forces you are actually stuck in.</p>
                <Link to="/assessment" className={styles.textLink}>Take the assessment <Icon name="arrowRight" size={14} /></Link>
              </div>
              <div className={styles.nextStep}>
                <span className={styles.nextNum}>Step 3.</span>
                <p>Get the whole method. The Firestarter Deluxe: all five forces, taught in one sitting.</p>
                <Link to="/deluxe" className={styles.textLink}>Get the Deluxe <Icon name="arrowRight" size={14} /></Link>
              </div>
              <div className={styles.nextStep}>
                <span className={styles.nextNum}>Step 4.</span>
                <p>Do the work with me. The Forge Intensive, and the road after it.</p>
                <Link to="/forge" className={styles.textLink}>Book the Intensive <Icon name="arrowRight" size={14} /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 11. Questions ── */}
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

      {/* ── 12. Closing ── */}
      <section className={`${styles.closing} grain`}>
        <div className="container">
          <Reveal className={styles.closingInner}>
            <p className={styles.closingLead}>A breakthrough is a door. Firestarter is the life you build after it.</p>
            <Link to="/training" className="btnPrimary">
              Watch the free training <Icon name="arrowRight" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
