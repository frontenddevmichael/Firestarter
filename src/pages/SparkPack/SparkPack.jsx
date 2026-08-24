import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './SparkPack.module.css';

function handlePrint() {
  window.print();
}

function scrollToContent() {
  const el = document.getElementById('spark-pack-start');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function SparkPack() {
  return (
    <div className={styles.page}>
      {/* Online hero — hidden when printing */}
      <section className={`${styles.hero} ${styles.noPrint}`}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Free Spark Kit</span>
            <h1 className={styles.heroTitle}>The Spark Pack.</h1>
            <p className={styles.heroSub}>
              Everything you need to enter the Firestarter Young Poets Prize 2026: the
              theme, what to write, how long it should be, and exactly how to send it in.
            </p>
            <div className={styles.heroActions}>
              <button onClick={scrollToContent} className={`btnPrimary ${styles.downloadBtn}`}>
                Read the Pack <Icon name="arrowRight" size={16} />
              </button>
              <button onClick={handlePrint} className="btnSecondary">
                Save as PDF
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Printable content */}
      <div className={styles.sparkPackContent} id="spark-pack-start">
        {/* Cover — logo only online, full content for print */}
        <section className={`${styles.cover} ${styles.printSection}`}>
          <div className={styles.coverInner}>
            <SparkMark size="large" className={styles.coverSpark} />
            {/* These are hidden online, shown in print */}
            <div className={styles.printOnly}>
              <span className={styles.coverEyebrow}>Firestarter Young Poets Prize 2026</span>
              <h1 className={styles.coverTitle}>My Voice, My Future</h1>
              <h2 className={styles.coverSubtitle}>The Spark Pack</h2>
              <p className={styles.coverQuote}>
                Dear Firestarter, start something.<br />
                Burn by all means divinely given.<br />
                Start a revolution. Be one.<br />
                Let the earth feel your heat.<br />
                We do not eat cold or lukewarm.<br />
                You are not a bundle of excuses.<br />
                You are not a cliché.<br />
                You are the standard.<br />
                Stand and be seen. Now.
              </p>
              <p className={styles.coverAuthor}>— Shola Amaraibi</p>
            </div>
          </div>
        </section>

        {/* Welcome */}
        <section className={`${styles.section} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Welcome, Firestarter</h2>
            <p className={styles.bodyText}>
              This pack is yours. It has everything you need to enter the Firestarter Young
              Poets Prize 2026: the theme, what to write, how long it should be, and
              exactly how to send it in.
            </p>
            <p className={styles.bodyText}>
              You do not have to be "good at poetry" already. You just have to be honest.
              This year's theme is <strong>My Voice, My Future</strong>, and the only
              person who can write that poem is you.
            </p>
            <p className={styles.bodyText}>
              This Prize is about more than poems. It is built to grow the abilities that
              will carry you into any future: thinking for yourself, communicating with
              confidence, imagining what does not exist yet, and using technology without
              letting it think for you. Poetry is how we practise all of it.
            </p>
            <p className={styles.bodyText}>
              Read this pack with a parent, guardian, or teacher if that helps. Then start
              writing.
            </p>
          </div>
        </section>

        {/* The Theme */}
        <section className={`${styles.section} ${styles.sectionAlt} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>The Theme: My Voice, My Future</h2>
            <p className={styles.bodyText}>
              Your voice is the way you see the world that no one else sees in exactly the
              same way. Your future is what you are walking toward. The person you are
              becoming, the thing you want to build, change, or say before anyone tells you
              it is impossible.
            </p>
            <p className={styles.bodyText}>
              This poem is your chance to say something true about your own voice and your
              own future, in your own words, your own rhythm, your own style. It can be
              hopeful, angry, funny, quiet, or loud. It just has to be yours.
            </p>
          </div>
        </section>

        {/* Who Can Enter */}
        <section className={`${styles.section} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Who Can Enter</h2>
            <ul className={styles.bulletList}>
              <li>Junior Poets, ages 10 to 13</li>
              <li>Senior Poets, ages 14 to 17</li>
              <li>Any secondary school student in Lagos State</li>
              <li>Entry is free</li>
            </ul>
          </div>
        </section>

        {/* Age Group Prompts */}
        <section className={`${styles.section} ${styles.sectionAlt} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>A Way In, For Each Age Group</h2>
            <p className={styles.bodyText}>
              The prompt below is a door, not a fence. Start there, then take it wherever
              your voice leads. If your own idea is already forming, follow that instead.
            </p>

            <div className={styles.promptCards}>
              <div className={styles.promptCard}>
                <h3 className={styles.promptLabel}>Junior Poets · ages 10 to 13</h3>
                <p className={styles.bodyText}>
                  Write a poem about a future you can picture. It might be the person you
                  want to become, a change you want to see in your home, your school, your
                  street, or your country, or a moment when you felt brave, seen, or full
                  of hope. Begin with something real, something you have felt or noticed,
                  and let it grow. You don't have to write about the whole world. Start
                  with your corner of it.
                </p>
              </div>
              <div className={styles.promptCard}>
                <h3 className={styles.promptLabel}>Senior Poets · ages 14 to 17</h3>
                <p className={styles.bodyText}>
                  Write a poem that speaks into the future. What do you want to build,
                  change, protect, or become? What do you see that others around you are
                  not yet saying? You might write about identity, family, community,
                  technology, leadership, the environment, or the Nigeria you imagine.
                  Whatever you choose, make it yours: say the thing only you can say, in
                  language only you would use.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* More Ways In */}
        <section className={`${styles.section} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>More Ways In, If You Need One</h2>
            <ul className={styles.bulletList}>
              <li>Write about a version of your future nobody has given you permission to want yet.</li>
              <li>Write to your 25-year-old self. What do you want them to remember about being you right now?</li>
              <li>Write about a moment you were told to be quiet, and what you would say now.</li>
              <li>Write about something you have never said out loud to your family.</li>
              <li>Write about what "voice" means when you feel unheard.</li>
            </ul>
          </div>
        </section>

        {/* What Makes a Strong Entry */}
        <section className={`${styles.section} ${styles.sectionAlt} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>What Makes a Strong Entry</h2>
            <p className={styles.bodyText}>
              Every entry, Junior and Senior, is read for the same five things. Think of
              them as five questions your poem should be able to answer:
            </p>

            <div className={styles.criteriaGrid}>
              {[
                { name: 'Voice', desc: 'Does this sound like you, and no one else? Not a poem you think a judge wants. The one only you could have written.' },
                { name: 'Thought', desc: 'Is there a real idea here? Something you noticed, questioned, or figured out, not just a nice-sounding line.' },
                { name: 'Craft', desc: 'Have you shaped your words on purpose: the images, the rhythm, the way lines break? Craft is what separates a poem from a paragraph.' },
                { name: 'Presence', desc: 'This one matters later, not now. If you are shortlisted, you will be asked to perform your poem on video. Presence is how you carry your words out loud.' },
                { name: 'Tools', desc: 'Technology can help you think. It should never think for you. Your Reflection (see below) is where you show the poem is genuinely yours.' },
              ].map((item) => (
                <div key={item.name} className={styles.criteriaItem}>
                  <h3 className={styles.criteriaName}>{item.name}</h3>
                  <p className={styles.criteriaDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Write in Your Own Voice */}
        <section className={`${styles.section} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>How to Write in Your Own Voice</h2>
            <p className={styles.bodyText}>
              Most people freeze because they think a poem has to sound a certain way:
              fancy, serious, full of words they do not normally use. Do not do that. Here
              is how to start:
            </p>
            <ul className={styles.bulletList}>
              <li>Start with something true, not something impressive. "I'm scared of failing my exams" beats a big word you don't fully understand.</li>
              <li>Say it the way you would say it out loud to someone you trust. Then shape it.</li>
              <li>Use a real memory, a real place, a real person, even if you change the details after.</li>
              <li>Read it back out loud. If it does not sound like you talking, rewrite the line, not the idea.</li>
              <li>You do not need rhyme. Free verse, which is poetry without a rhyme pattern, is completely welcome and often stronger.</li>
            </ul>
          </div>
        </section>

        {/* Using AI */}
        <section className={`${styles.section} ${styles.sectionAlt} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Using AI: What Is Allowed</h2>
            <p className={styles.bodyText}>
              At Firestarter, we believe the human provides the spark and technology does
              the amplifying, never the other way round. AI tools (like ChatGPT, Claude,
              or similar) can be useful for thinking, but they cannot write your poem for
              you.
            </p>
            <ul className={styles.bulletList}>
              <li><strong>Allowed:</strong> using AI to look up a word, understand a poetic form, or check your spelling, the same way a dictionary would help you.</li>
              <li><strong>Not allowed:</strong> asking an AI tool to write, finish, or substantially rewrite your poem.</li>
              <li>Every entry is reviewed for originality, and your Reflection helps us understand where each poem came from. A poem that is copied, or not genuinely the student's own work, will be disqualified.</li>
            </ul>
            <p className={styles.bodyText}>
              If you are not sure whether something counts, ask yourself: did I do the
              thinking, or did I let something else do it for me? If it is the second one,
              do not submit it that way.
            </p>
          </div>
        </section>

        {/* What to Submit */}
        <section className={`${styles.section} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>What to Submit</h2>
            <p className={styles.bodyText}>
              Every student submits the same two things. There is no video at this stage.
              That only comes later, and only for students who are shortlisted.
            </p>

            <div className={styles.numberedBlocks}>
              <div className={styles.numberedBlock}>
                <span className={styles.number}>1</span>
                <div>
                  <h3 className={styles.blockTitle}>Your Poem</h3>
                  <ul className={styles.bulletList}>
                    <li>Junior Poets (10 to 13): 10 to 20 lines, roughly 125 to 250 words.</li>
                    <li>Senior Poets (14 to 17): 25 to 40 lines, roughly 300 to 500 words.</li>
                    <li>One original poem. Include a title.</li>
                  </ul>
                  <p className={styles.bodyText}>
                    The upper number is a ceiling, not a target. Write what the poem needs,
                    no more and no less.
                  </p>
                </div>
              </div>
              <div className={styles.numberedBlock}>
                <span className={styles.number}>2</span>
                <div>
                  <h3 className={styles.blockTitle}>Your Voice Reflection</h3>
                  <p className={styles.bodyText}>
                    A short piece of writing, not a recording, of 3 to 5 sentences (roughly
                    60 to 100 words). In your own words, tell us:
                  </p>
                  <ul className={styles.bulletList}>
                    <li>What gave you the idea for this poem?</li>
                    <li>What were you trying to say, or figure out, by writing it?</li>
                  </ul>
                  <p className={styles.bodyText}>
                    This is not a test, and there is no right answer. It makes your thinking
                    visible, and your thinking is part of the work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Submit */}
        <section className={`${styles.section} ${styles.sectionAlt} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>How to Submit</h2>
            <p className={styles.bodyText}>
              Fill in the official entry form at <strong>firestartermethod.com/prize</strong>.
              It takes about ten minutes. You will need:
            </p>
            <ul className={styles.bulletList}>
              <li>Your poem title</li>
              <li>Your full poem, typed or pasted in</li>
              <li>Your Voice Reflection</li>
              <li>Basic details: your name, age category, school, and a parent or guardian contact</li>
            </ul>
            <p className={styles.bodyText}>
              You do not need a Google account to submit. Please enter only one poem per
              student.
            </p>

            <div className={styles.callout}>
              <h3>If You Need Another Way to Enter</h3>
              <p>
                If a student cannot use the online form, for any reason, including
                disability or lack of a device, contact the Firestarter team and we will
                find another way for that student to take part. No student should be left
                out because of how the form works.
              </p>
            </div>
          </div>
        </section>

        {/* Deadline */}
        <section className={`${styles.section} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Deadline</h2>
            <p className={styles.bodyText}>
              <strong>Friday, 30 October 2026, 11:59 PM (WAT).</strong> Entries close at
              the deadline. Build in time before then. Do not wait for the last hour.
            </p>
          </div>
        </section>

        {/* What Happens After */}
        <section className={`${styles.section} ${styles.sectionAlt} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>What Happens After You Submit</h2>
            <ul className={styles.bulletList}>
              <li><strong>November:</strong> every entry is read and scored on the poem and the Reflection alone. No video yet.</li>
              <li><strong>November:</strong> the shortlist is announced. Shortlisted students are invited to record a video of themselves performing their own poem, upload it to YouTube as an unlisted video, and share the link with the Firestarter team. Simple phone footage is fine. We are watching your presence, not your camera.</li>
              <li><strong>Late November:</strong> the video round closes. This is where Presence is scored, and the top 100 finalists are chosen.</li>
              <li><strong>Early December:</strong> the 100 finalists attend the Firestarter Creative-Tech Lab, a hands-on session with the Firestarter team, working with mentors and creative technology to bring their poems to life.</li>
              <li><strong>19 and 20 December:</strong> winners are celebrated at the grand final, connected to Firestarter: The Musical at MUSON Centre, Lagos. Details are shared directly with finalists, their parents, and their schools.</li>
            </ul>
            <p className={styles.bodyText}>
              Only students on the shortlist will be asked for a video. If you are not
              shortlisted, that does not happen, so do not worry about filming anything
              until you hear from us.
            </p>
          </div>
        </section>

        {/* What You Could Win */}
        <section className={`${styles.section} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>What You Could Win</h2>
            <ul className={styles.bulletList}>
              <li><strong>Top 100 finalists:</strong> certificates, recognition, a place at the Creative-Tech Lab, and a spot at the December grand final.</li>
              <li><strong>Top 3 students:</strong> education-support awards worth ₦1,000,000 in total, paid toward school fees or approved learning needs.</li>
            </ul>
            <p className={styles.bodyText}>
              This Prize is built around growth, not just prizes. The goal is to open doors
              for young voices, not only to reward one winning poem.
            </p>
          </div>
        </section>

        {/* Note for Parents */}
        <section className={`${styles.section} ${styles.sectionAlt} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>A Note for Parents and Guardians</h2>
            <p className={styles.bodyText}>
              Thank you for supporting your child through this. A few things worth knowing:
            </p>
            <ul className={styles.bulletList}>
              <li>The Firestarter Young Poets Prize is a future-skills programme that uses poetry, reflection and spoken-word performance to help young people develop original thinking, confident communication and the responsible use of technology. These are skills your child will need well beyond this Prize, and our approach is informed by UNESCO's work on the future skills young people need in a changing world.</li>
              <li>Entry is free, and no purchase or payment is ever required at any stage. If anyone asks a family for money to enter or advance, that is not part of this programme. Please contact us directly.</li>
              <li>Your child's poem and Reflection will be read by Firestarter judges for scoring purposes. No child's name, video, photo, or written work will be shared publicly without your explicit, separate consent.</li>
              <li>If your child is shortlisted and a video is requested, the video is uploaded as an unlisted YouTube link, visible only to people who have the link, and will only be used for judging unless you separately agree to further use. We will always ask first.</li>
              <li>You are welcome to help your child understand this pack and the form, but the poem and Reflection must be genuinely your child's own work.</li>
            </ul>
            <p className={styles.bodyText}>
              If you have questions at any point, reach out to the Firestarter team. Contact
              details are on the official entry page.
            </p>
          </div>
        </section>

        {/* Consent, Privacy, Safeguarding */}
        <section className={`${styles.section} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Consent, Privacy and Safeguarding</h2>
            <p className={styles.bodyText}>
              Because this programme works directly with children, we hold ourselves to a
              clear standard:
            </p>
            <ul className={styles.bulletList}>
              <li>Parental or guardian consent is required for every entry before a student's work is judged.</li>
              <li>No child's name, image, video, or written work is published, posted, or shared outside the judging process without separate, explicit parental consent.</li>
              <li>Personal information collected through the entry form is used only to run the Prize, meaning to contact students and families and to verify eligibility. It is not shared beyond the Firestarter team and its judging panel.</li>
              <li>Any video submitted at the shortlist stage is used only for judging purposes unless further, specific permission is given.</li>
              <li>Any concern about a child's safety or wellbeing connected to this programme should be raised immediately with the Firestarter team.</li>
            </ul>
          </div>
        </section>

        {/* Closing */}
        <section className={`${styles.closing} ${styles.printSection}`}>
          <div className={styles.sectionInner}>
            <p className={styles.closingText}>
              Now go write something only you could have written.
            </p>
            <p className={styles.closingFooter}>
              The Firestarter Collective Africa &nbsp;|&nbsp; firestartermethod.com
            </p>
          </div>
        </section>
      </div>

      {/* Online CTA — hidden when printing */}
      <section className={`${styles.cta} ${styles.noPrint}`}>
        <Reveal className="container">
          <h2>Your voice is the spark.</h2>
          <p>When you're ready, submit your entry.</p>
          <Link to="/prize/enter" className="btnPrimary">
            Enter Now <Icon name="arrowRight" size={16} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
