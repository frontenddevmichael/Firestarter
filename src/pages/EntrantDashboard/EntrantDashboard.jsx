import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import { useCompetition } from '../../hooks/useCompetition'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import Skeleton from '../../components/Skeleton'
import CompetitionBanner from '../../components/CompetitionBanner'
import ConfirmModal from '../../components/ConfirmModal'
import Icon from '../../components/Icon'
import SparkMark from '../../components/SparkMark'
import styles from './EntrantDashboard.module.css'

const STEPS = ['consent', 'draft', 'submitted', 'shortlisted', 'finalist']
const WIZARD_STEPS = ['guardian', 'verify', 'poem']
const RESEND_COOLDOWN_S = 60

function formatRef(id, date) {
  const d = date ? new Date(date) : new Date()
  const year = d.getFullYear()
  const short = id ? id.substring(0, 4).toUpperCase() : '0000'
  return `FS-${year}-${short}`
}

const RESOURCES = [
  { title: 'Spark Pack', desc: 'Prompts, templates & tips', link: '/prize/spark-pack' },
  { title: 'How to Enter', desc: 'Step-by-step guide', link: '/prize/how-to-enter' },
  { title: 'Parents & Teachers', desc: 'Info for guardians', link: '/prize/parents-and-teachers' },
  { title: 'Key Dates', desc: 'Full competition timeline', link: '/prize/key-dates' },
]

const STAGE_INFO = [
  { phase: 'open', label: 'Submission', desc: 'Write and submit your poem before the deadline.', date: '30 Sep 2026' },
  { phase: 'judging', label: 'Judging', desc: 'Our panel reviews all entries anonymously.', date: 'Oct 2026' },
  { phase: 'shortlisted', label: 'Shortlist', desc: 'Top entries are shortlisted and announced.', date: '15 Oct 2026' },
  { phase: 'finalists', label: 'Finalists', desc: 'Finalists selected and invited to the ceremony.', date: '31 Oct 2026' },
  { phase: 'closed', label: 'Awards', desc: 'Winners announced at the awards ceremony.', date: '15 Nov 2026' },
]

export default function EntrantDashboard() {
  const { user, profile, deleteAccount } = useAuth()
  const toast = useToast()
  const competition = useCompetition()
  const { setting } = useSiteSettings()
  const showCountdown = setting('show.countdown', true)
  const [entry, setEntry] = useState(null)
  const [guardian, setGuardian] = useState(null)
  const [consent, setConsent] = useState(null)
  const [loading, setLoading] = useState(true)
  // 'welcome' = dashboard-first home; 'status' = submitted/locked view
  const [mode, setMode] = useState('welcome')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [animState, setAnimState] = useState('')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)

  // Wizard state (opened from welcome dashboard when ready to submit)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState('guardian')
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [lastSentAt, setLastSentAt] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  const [category, setCategory] = useState('junior')
  const [poemText, setPoemText] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [voiceReflection, setVoiceReflection] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')
  const [code, setCode] = useState('')

  const consentVerified = Boolean(consent?.verified_at) || guardian?.consent_given === true

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('entries').select('*').eq('entrant_id', user.id).maybeSingle(),
      supabase.from('guardians').select('*').eq('entrant_id', user.id).maybeSingle(),
      supabase.from('guardian_consents').select('*').eq('entrant_id', user.id).maybeSingle(),
    ]).then(([eRes, gRes, cRes]) => {
      if (eRes.data) {
        setEntry(eRes.data)
        if (eRes.data.status === 'draft') {
          setPoemText(eRes.data.poem_text || '')
          setVideoLink(eRes.data.video_link || '')
          setVoiceReflection(eRes.data.voice_reflection || '')
          setCategory(eRes.data.category || 'junior')
        }
      }
      if (gRes.data) {
        setGuardian(gRes.data)
        setGuardianName(gRes.data.guardian_name || '')
        setGuardianEmail(gRes.data.guardian_email || '')
      }
      if (cRes.data) {
        setConsent(cRes.data)
        if (!gRes.data) {
          setGuardianName(cRes.data.guardian_name || '')
          setGuardianEmail(cRes.data.guardian_email || '')
        }
        if (!cRes.data.verified_at) setCodeSent(true)
      }
      const s = eRes.data?.status
      if (s === 'submitted' || s === 'shortlisted' || s === 'finalist') {
        setMode('status')
      } else {
        setMode('welcome')
      }
      setLoading(false)
    }).catch(() => {
      toast('Failed to load your data. Please try again.', 'error')
      setLoading(false)
    })
  }, [user])

  // Tick for resend cooldown display
  useEffect(() => {
    if (!codeSent) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [codeSent])

  const refreshConsent = async () => {
    const { data } = await supabase.from('guardian_consents').select('*').eq('entrant_id', user.id).maybeSingle()
    if (data) {
      setConsent(data)
      return data
    }
    return null
  }

  const startEntry = () => {
    setWizardOpen(true)
    if (consentVerified) setWizardStep('poem')
    else if (codeSent || consent) setWizardStep('verify')
    else setWizardStep('guardian')
  }

  const handleSendCode = async (e) => {
    e?.preventDefault?.()
    if (!guardianName.trim() || !guardianEmail.trim()) { toast('Please fill in guardian name and email', 'error'); return }
    setSendingCode(true)
    const { data, error } = await supabase.functions.invoke('send-guardian-code', {
      body: { guardian_name: guardianName.trim(), guardian_email: guardianEmail.trim() },
    })
    setSendingCode(false)
    if (error || data?.error) {
      toast(error?.message || data?.error || 'Could not send code. Try again.', 'error')
      return
    }
    setCodeSent(true)
    setLastSentAt(Date.now())
    setNow(Date.now())
    toast(`Code sent to ${guardianEmail.trim()} (expires in 30 min)`)
    setWizardStep('verify')
    refreshConsent()
  }

  const handleVerifyCode = async (e) => {
    e?.preventDefault?.()
    if (!/^\d{6}$/.test(code.trim())) { toast('Enter the 6-digit code from the email', 'error'); return }
    setVerifyingCode(true)
    const { data, error } = await supabase.functions.invoke('verify-guardian-code', {
      body: { code: code.trim() },
    })
    setVerifyingCode(false)
    if (error || data?.error) {
      toast(error?.message || data?.error || 'Verification failed', 'error')
      refreshConsent()
      return
    }
    const fresh = await refreshConsent()
    const { data: gData } = await supabase.from('guardians').select('*').eq('entrant_id', user.id).maybeSingle()
    if (gData) {
      setGuardian(gData)
      setGuardianName(gData.guardian_name || guardianName)
      setGuardianEmail(gData.guardian_email || guardianEmail)
    }
    toast('Guardian consent verified! You can now finish your poem.')
    setCode('')
    setWizardStep('poem')
    void fresh
  }

  const handleSaveDraft = async () => {
    if (!poemText.trim()) { toast('Please provide your poem before saving', 'error'); return }
    setSavingDraft(true)
    const payload = {
      entrant_id: user.id,
      poem_text: poemText.trim(),
      video_link: videoLink.trim() || null,
      voice_reflection: voiceReflection.trim() || null,
      category,
      status: 'draft',
      guardian_consent_verified: consentVerified,
    }
    let error
    if (entry) {
      ;({ error } = await supabase.from('entries').update(payload).eq('id', entry.id))
    } else {
      ;({ error } = await supabase.from('entries').insert(payload))
    }
    if (error) { toast(error.message, 'error'); setSavingDraft(false); return }
    const { data } = await supabase.from('entries').select('*').eq('entrant_id', user.id).single()
    if (data) setEntry(data)
    setSavingDraft(false)
    toast('Draft saved — come back anytime')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!poemText.trim()) { toast('Please provide your poem', 'error'); return }
    if (!consentVerified) {
      toast('Guardian verification is required before submitting', 'error')
      setWizardOpen(true)
      setWizardStep(codeSent ? 'verify' : 'guardian')
      return
    }
    if (!entry) {
      const { error } = await supabase.from('entries').insert({
        entrant_id: user.id,
        poem_text: poemText.trim(),
        video_link: videoLink.trim() || null,
        voice_reflection: voiceReflection.trim() || null,
        category,
        status: 'draft',
        guardian_consent_verified: true,
      })
      if (error) { toast(error.message, 'error'); return }
    } else {
      const { error } = await supabase.from('entries').update({
        poem_text: poemText.trim(),
        video_link: videoLink.trim() || null,
        voice_reflection: voiceReflection.trim() || null,
        category,
        guardian_consent_verified: true,
      }).eq('id', entry.id)
      if (error) { toast(error.message, 'error'); return }
    }
    const { data } = await supabase.from('entries').select('*').eq('entrant_id', user.id).single()
    if (data) setEntry(data)
    setShowSubmitModal(true)
  }

  const handleFinalSubmit = async () => {
    // Re-check verification server-side before locking the entry
    const fresh = await refreshConsent()
    const verified = Boolean(fresh?.verified_at) || guardian?.consent_given === true
    if (!verified) {
      toast('Guardian verification is required before submitting', 'error')
      setShowSubmitModal(false)
      setWizardStep('verify')
      return
    }
    const { error } = await supabase.from('entries').update({
      status: 'submitted',
      guardian_consent_verified: true,
      submitted_at: new Date().toISOString(),
    }).eq('id', entry.id)
    if (error) { toast(error.message, 'error'); return }
    const { data } = await supabase.from('entries').select('*').eq('entrant_id', user.id).single()
    if (data) setEntry(data)
    setShowSubmitModal(false)
    setConfirmChecked(false)
    setWizardOpen(false)
    setAnimState('just-submitted')
    setTimeout(() => setAnimState(''), 2000)
    toast('Entry submitted successfully!')
    setMode('status')
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await deleteAccount()
    if (error) { toast(error.message, 'error'); setDeleting(false); return }
    toast('Account deleted')
    setShowDeleteModal(false)
  }

  if (loading) return <div className={styles.page}><Skeleton width="100%" height="60vh" /></div>

  const status = entry?.status || 'draft'
  const humanStatus = status === 'submitted' ? 'Submitted' : status.charAt(0).toUpperCase() + status.slice(1)
  const currentStep = entry
    ? (status === 'finalist' ? 4
      : status === 'shortlisted' ? 3
      : status === 'submitted' ? 2
      : status === 'draft' ? 1
      : 2)
    : (consentVerified || guardian ? 1 : 0)

  const statusIcon = status === 'finalist' ? 'award' : status === 'shortlisted' ? 'star' : 'fileText'
  const firstName = profile?.full_name?.split(' ')?.[0] || ''
  const resendWait = Math.max(0, RESEND_COOLDOWN_S - Math.floor((now - lastSentAt) / 1000))
  const wizardIndex = WIZARD_STEPS.indexOf(wizardStep)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SparkMark />
        <CompetitionBanner compact />
        <h1 className={styles.title}>{mode === 'status' ? 'My Entry' : `Welcome${firstName ? `, ${firstName}` : ''}`}</h1>
        <p className={styles.email}>{profile?.email}</p>

        <div className={`${animState === 'just-submitted' ? styles.entryFlash : ''}`}>
          <div className={styles.progressBar}>
            {STEPS.map((s, i) => (
              <div key={s} className={`${styles.step} ${i <= currentStep ? styles.activeStep : ''} ${i === currentStep ? styles.currentStep : ''}`}>
                <div className={styles.stepDot}>
                  {i < currentStep ? '\u2713' : i + 1}
                </div>
                <span className={styles.stepLabel}>
                  {s === 'consent' ? 'Consent' : s === 'draft' ? 'Draft' : s === 'submitted' ? 'Submitted' : s === 'shortlisted' ? 'Shortlisted' : 'Finalist'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {entry && mode === 'status' && (
          <div className={styles.welcomeCard}>
            <Icon name={statusIcon} size={32} className={styles.welcomeIcon} strokeWidth={1.6} />
            <div>
              <p className={styles.welcomeText}>
                {status === 'finalist' ? "You're a finalist!" : status === 'shortlisted' ? "You've been shortlisted!" : status === 'draft' ? 'Your draft is saved' : 'Entry submitted!'}
              </p>
              <p className={styles.welcomeSub}>
                {profile?.full_name || profile?.email} &middot; {entry.category} &middot; <strong>{humanStatus}</strong>
              </p>
            </div>
          </div>
        )}

        {showCountdown && (
        <div className={styles.countdownRow}>
          <div className={styles.countdownCard}>
            <span className={styles.cdValue}>{competition.countdown.days}</span>
            <span className={styles.cdLabel}>days</span>
          </div>
          <div className={styles.countdownCard}>
            <span className={styles.cdValue}>{competition.countdown.hours}</span>
            <span className={styles.cdLabel}>hours</span>
          </div>
          <div className={styles.countdownCard}>
            <span className={styles.cdValue}>{competition.countdown.minutes}</span>
            <span className={styles.cdLabel}>min</span>
          </div>
          <div className={styles.countdownDesc}>
            until {competition.countdown.label || 'competition closes'}
          </div>
        </div>
        )}

        {mode === 'welcome' && (
          <>
            <div className={styles.form}>
              <h2 className={styles.formTitle}>Your dashboard — submit when you're ready</h2>
              <p className={styles.formDesc}>
                No rush. Explore the Spark Pack, join the community, and start your entry
                whenever your poem is ready. Nothing is submitted until you decide.
              </p>
              {entry?.status === 'draft' && (
                <p className={styles.formDesc}>You have a draft saved — pick up right where you left off.</p>
              )}
              {codeSent && !consentVerified && (
                <p className={styles.formDesc}>Awaiting guardian verification — check {guardianEmail || 'the guardian inbox'} for your code.</p>
              )}
              {consentVerified && (
                <p className={styles.formDesc}>Guardian consent verified{guardianEmail ? ` (${guardianEmail})` : ''}.</p>
              )}
              <div className={styles.formActions}>
                <button type="button" className="btnPrimary" onClick={startEntry}>
                  {entry?.status === 'draft' ? 'Continue your entry' : wizardOpen ? 'Continue' : 'Start your entry when ready'}
                </button>
              </div>
            </div>

            {wizardOpen && (
              <div className={styles.form} style={{ marginTop: '1rem' }}>
                <h2 className={styles.formTitle}>Entry wizard</h2>
                <p className={styles.formDesc}>
                  Step {wizardIndex + 1} of 3: {wizardStep === 'guardian' ? 'Guardian' : wizardStep === 'verify' ? 'Verify code' : 'Your poem'}
                </p>

                {wizardStep === 'guardian' && (
                  <form onSubmit={handleSendCode}>
                    <div className={styles.field}>
                      <label>Guardian Name</label>
                      <input value={guardianName} onChange={e => setGuardianName(e.target.value)} className={styles.input} required placeholder="Parent or guardian full name" />
                    </div>
                    <div className={styles.field}>
                      <label>Guardian Email</label>
                      <input type="email" value={guardianEmail} onChange={e => setGuardianEmail(e.target.value)} className={styles.input} required placeholder="guardian@example.com" />
                    </div>
                    <p className={styles.formDesc}>
                      We email your guardian a unique 6-digit code. You need that code to unlock submission — no poem can be submitted without it.
                    </p>
                    <div className={styles.formActions}>
                      <button type="submit" className="btnPrimary" disabled={sendingCode}>
                        {sendingCode ? 'Sending…' : codeSent ? 'Resend code' : 'Send verification code'}
                      </button>
                    </div>
                  </form>
                )}

                {wizardStep === 'verify' && (
                  <form onSubmit={handleVerifyCode}>
                    <p className={styles.formDesc}>
                      Code sent to <strong>{guardianEmail || 'your guardian'}</strong>, expires in 30 minutes. Ask them to read it to you.
                    </p>
                    <div className={styles.field}>
                      <label>6-digit code</label>
                      <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className={styles.input} inputMode="numeric" placeholder="123456" required />
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" className="btnPrimary" disabled={verifyingCode}>
                        {verifyingCode ? 'Verifying…' : 'Verify & continue'}
                      </button>
                      <button type="button" className="btnOutline" onClick={handleSendCode} disabled={sendingCode || resendWait > 0}>
                        {resendWait > 0 ? `Resend in ${resendWait}s` : 'Resend code'}
                      </button>
                    </div>
                    <div className={styles.formActions} style={{ marginTop: '0.5rem' }}>
                      <button type="button" className="btnOutline" onClick={() => setWizardStep('guardian')}>
                        Change guardian email
                      </button>
                    </div>
                  </form>
                )}

                {wizardStep === 'poem' && (
                  <form onSubmit={handleSubmit}>
                    {!consentVerified && (
                      <p className={styles.formDesc}>Verify your guardian code first — submission stays locked until then.</p>
                    )}
                    <div className={styles.field}>
                      <label>Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)} className={styles.input}>
                        <option value="junior">Junior (10–13)</option>
                        <option value="senior">Senior (14–17)</option>
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label>Poem <span className={styles.charCount}>{poemText.length} characters</span></label>
                      <textarea value={poemText} onChange={e => setPoemText(e.target.value)} className={styles.textarea} rows={10} required placeholder="Write your poem here..." />
                    </div>
                    <div className={styles.field}>
                      <label>YouTube Performance URL (optional)</label>
                      <input type="url" value={videoLink} onChange={e => setVideoLink(e.target.value)} className={styles.input} placeholder="https://youtube.com/..." />
                    </div>
                    <div className={styles.field}>
                      <label>Voice Reflection <span className={styles.hint}>— Why did you write this poem? (optional)</span></label>
                      <textarea value={voiceReflection} onChange={e => setVoiceReflection(e.target.value)} className={styles.textarea} rows={4} placeholder="Tell us about your inspiration..." />
                    </div>
                    {entry && entry.updated_at && (
                      <p className={styles.hint}>Draft saved at {new Date(entry.updated_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                    )}
                    <div className={styles.formActions}>
                      <button type="button" className="btnOutline" onClick={handleSaveDraft} disabled={savingDraft}>
                        {savingDraft ? 'Saving...' : 'Save Draft'}
                      </button>
                      <button type="submit" className="btnPrimary" disabled={!consentVerified}>
                        Review & Submit
                      </button>
                    </div>
                    {!consentVerified && (
                      <div className={styles.formActions} style={{ marginTop: '0.5rem' }}>
                        <button type="button" className="btnOutline" onClick={() => setWizardStep('guardian')}>
                          Verify guardian to unlock submit
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            <div className={styles.resourcesGrid} style={{ marginTop: '1rem' }}>
              {RESOURCES.map(r => (
                <Link key={r.title} to={r.link} className={styles.resourceCard}>
                  <strong>{r.title}</strong>
                  <span>{r.desc}</span>
                </Link>
              ))}
            </div>

            <button className={styles.deleteBtn} style={{ marginTop: '1rem' }} onClick={() => setShowDeleteModal(true)}>Delete Account{entry ? ' & Entry' : ''}</button>
          </>
        )}

        {entry && mode !== 'welcome' && (
          <div className={styles.statusSection}>
            {status === 'shortlisted' && (
              <div className={styles.alert}>
                <Icon name="star" size={22} className={styles.alertIcon} strokeWidth={1.6} />
                <div><strong>Congratulations!</strong> Your poem has been shortlisted. We'll be in touch with next steps.</div>
              </div>
            )}
            {status === 'finalist' && (
              <div className={styles.alert}>
                <Icon name="award" size={22} className={styles.alertIcon} strokeWidth={1.6} />
                <div><strong>Amazing!</strong> You are a finalist! We'll contact you about the awards ceremony.</div>
              </div>
            )}

            <div className={styles.entryCard}>
              <div className={styles.entryHeader}>
                <span className={styles.categoryBadge}>{entry.category}</span>
                <span className={`${styles.statusBadge} ${styles[entry.status]}`}>{entry.status}</span>
                <span className={styles.refNumber}>{formatRef(entry.id, entry.submitted_at)}</span>
              </div>
              <div className={styles.entryBody}>
                <h3>Your Poem</h3>
                <p className={styles.entryPoem}>{entry.poem_text}</p>
                {entry.voice_reflection && (
                  <>
                    <h4>Voice Reflection</h4>
                    <p className={styles.entryVoice}>{entry.voice_reflection}</p>
                  </>
                )}
                {entry.video_link && (
                  <p className={styles.entryVideo}>
                    <a href={entry.video_link.startsWith('http') ? entry.video_link : `https://${entry.video_link}`} target="_blank" rel="noreferrer">Watch performance video →</a>
                  </p>
                )}
                <p className={styles.entryMeta}>Submitted {entry.submitted_at ? new Date(entry.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
              </div>
            </div>

            <div className={styles.stagesCard}>
              <h4>The Stages Ahead</h4>
              <div className={styles.stagesList}>
                {STAGE_INFO.map(st => {
                  const done = STEPS.indexOf(st.phase) <= currentStep
                  const current = STEPS.indexOf(st.phase) === currentStep
                  return (
                    <div key={st.phase} className={`${styles.stageItem} ${done ? styles.stageDone : ''} ${current ? styles.stageCurrent : ''}`}>
                      <div className={styles.stageDot}>{done ? '\u2713' : current ? '\u25CF' : '\u25CB'}</div>
                      <div className={styles.stageContent}>
                        <span className={styles.stageLabel}>{st.label}</span>
                        <span className={styles.stageDesc}>{st.desc}</span>
                        <span className={styles.stageDate}>{st.date}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {guardian && (
              <div className={styles.guardianCard}>
                <h4>Guardian</h4>
                <p>{guardian.guardian_name} — {guardian.guardian_email}</p>
              </div>
            )}

            <div className={styles.resourcesGrid}>
              {RESOURCES.map(r => (
                <Link key={r.title} to={r.link} className={styles.resourceCard}>
                  <strong>{r.title}</strong>
                  <span>{r.desc}</span>
                </Link>
              ))}
            </div>

            <button className={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>Delete Account &amp; Entry</button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title="Delete Account?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        danger
      >
        This will permanently delete your account, profile, and entry. This cannot be undone.
      </ConfirmModal>

      <ConfirmModal
        open={showSubmitModal}
        title="Ready to submit?"
        onConfirm={handleFinalSubmit}
        onCancel={() => { setShowSubmitModal(false); setConfirmChecked(false) }}
        confirmLabel="Submit Entry"
        confirmDisabled={!confirmChecked || !consentVerified}
      >
        <p>Once you submit, your entry is locked in and can't be edited. Take one more look, then send it in.</p>
        {!consentVerified && <p>Guardian verification is still required.</p>}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={confirmChecked} onChange={e => setConfirmChecked(e.target.checked)} />
          I've reviewed my entry and I'm ready to submit
        </label>
      </ConfirmModal>
    </div>
  )
}
