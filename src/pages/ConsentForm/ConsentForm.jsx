import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import Reveal from '../../components/Reveal';
import styles from './ConsentForm.module.css';

/**
 * Participant Commitment & Parental Consent Form.
 *
 * This is the readable/printable version of the signed form. The same
 * consents are captured digitally in the entry dashboard's guardian step,
 * stored on guardian_consents, and confirmed when the guardian enters the
 * emailed 6-digit code.
 */
export default function ConsentForm() {
  const printForm = () => window.print();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Parents &amp; Guardians</span>
            <h1 className={styles.heroTitle}>Participant Commitment &amp; Parental Consent</h1>
            <p className={styles.heroSub}>
              The full form for the Firestarter Young Poets Prize 2026. Read it here, or
              print and save a copy. If your child enters online, the same consents are
              completed in their dashboard and confirmed with a code sent to your email.
            </p>
            <div className={styles.heroActions}>
              <button type="button" className="btnPrimary" onClick={printForm}>
                Print / Save as PDF
              </button>
              <Link to="/prize/how-to-enter" className="btnOutline">How to enter</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <article className={styles.paper}>
            <header className={styles.docHead}>
              <p className={styles.docKicker}>Firestarter Young Poets Prize 2026</p>
              <h2 className={styles.docTitle}>Participant Commitment &amp; Parental Consent Form</h2>
              <p className={styles.docMeta}>Version 1.0 · October 2026</p>
            </header>

            <p className={styles.intro}>
              This form is completed for every entrant under 18. A parent or legal guardian
              must give consent before an entry is judged. In the online entry flow, the
              guardian confirms these choices with a 6-digit code sent to their email.
            </p>

            <section className={styles.docSection}>
              <h3 className={styles.docHeading}>Child Participant Commitment</h3>
              <p className={styles.clause}>
                I am excited to take part in the Poetry Challenge! I promise to use kind
                words, respect others, and follow the safety rules online and at the event.
              </p>

              <div className={styles.fieldRow}>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.fieldLabel}>Full name of child</span>
                  <span className={styles.fill} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={`${styles.field} ${styles.fieldNarrow}`}>
                  <span className={styles.fieldLabel}>Age</span>
                  <span className={styles.fill} />
                </div>
                <div className={`${styles.field} ${styles.fieldNarrow}`}>
                  <span className={styles.fieldLabel}>Date</span>
                  <span className={styles.fill} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.fieldLabel}>Child&apos;s signature / mark</span>
                  <span className={styles.fill} />
                </div>
              </div>
            </section>

            <section className={styles.docSection}>
              <h3 className={styles.docHeading}>Parent / Legal Guardian Consent &amp; Authorization</h3>
              <p className={styles.clause}>
                I am the parent/legal guardian of the minor named above. I give full
                permission for my child to participate in the Poetry Challenge and attend
                the awards event under the following conditions:
              </p>

              <div className={styles.checkList}>
                <div className={styles.checkRow}>
                  <span className={styles.checkbox} aria-hidden="true" />
                  <p>
                    <strong>General Policy Agreement:</strong> I have read and agree to the
                    Safeguarding Policy and Incident Escalation Framework.
                  </p>
                </div>
                <div className={styles.checkRow}>
                  <span className={styles.checkbox} aria-hidden="true" />
                  <p>
                    <strong>Physical Event Supervision:</strong> I confirm I will accompany
                    my child to the physical ceremony or designate an authorized adult in
                    writing.
                  </p>
                </div>
                <div className={styles.checkRow}>
                  <span className={styles.checkbox} aria-hidden="true" />
                  <p>
                    <strong>Poetry Publication:</strong> I authorize the publication of my
                    child&apos;s poem on official channels (only first name and age displayed).
                  </p>
                </div>
                <div className={styles.checkRow}>
                  <span className={styles.checkbox} aria-hidden="true" />
                  <p>
                    <strong>Media &amp; Photography Consent:</strong> I consent to my child
                    being photographed or video recorded during the event for promotional
                    coverage.
                  </p>
                </div>
                <div className={`${styles.checkRow} ${styles.optOutRow}`}>
                  <span className={styles.checkbox} aria-hidden="true" />
                  <p>
                    <strong>OPT-OUT of Photography:</strong> I DO NOT want my child to be
                    photographed or video recorded.
                  </p>
                </div>
              </div>

              <p className={styles.clause}>
                Please tick <strong>one</strong> of the two photography options above:
                consent, or opt out.
              </p>
            </section>

            <section className={styles.docSection}>
              <h3 className={styles.docHeading}>Parent / Guardian Contact Information</h3>

              <div className={styles.fieldRow}>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.fieldLabel}>Full name of parent/guardian</span>
                  <span className={styles.fill} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.fieldLabel}>Relationship to child</span>
                  <span className={styles.fill} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.fieldLabel}>Phone number</span>
                  <span className={styles.fill} />
                </div>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.fieldLabel}>Email</span>
                  <span className={styles.fill} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.fieldLabel}>Signature</span>
                  <span className={styles.fill} />
                </div>
                <div className={`${styles.field} ${styles.fieldNarrow}`}>
                  <span className={styles.fieldLabel}>Date</span>
                  <span className={styles.fill} />
                </div>
              </div>
            </section>

            <div className={styles.docNote}>
              <strong>Entering online?</strong> You do not need to post or upload this form.
              Your child completes the same consents in the entry dashboard, and you confirm
              them by entering the 6-digit code sent to your email. You can still print this
              page for your records.
            </div>
          </article>

          <div className={styles.afterActions}>
            <button type="button" className="btnPrimary" onClick={printForm}>
              Print / Save as PDF
            </button>
            <Link to="/prize/enter" className="btnOutline">Start an entry</Link>
          </div>

          <p className={styles.smallPrint}>
            Questions about consent, safeguarding or a specific access need? Contact the
            team on the <Link to="/prize/contact" className={styles.inlineLink}>Contact page</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
