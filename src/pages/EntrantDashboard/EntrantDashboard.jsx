import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import { useCompetition } from '../../hooks/useCompetition'
import Skeleton from '../../components/Skeleton'
import CompetitionBanner from '../../components/CompetitionBanner'
import ConfirmModal from '../../components/ConfirmModal'
import Icon from '../../components/Icon'
import SparkMark from '../../components/SparkMark'
import styles from './EntrantDashboard.module.css'

const STEPS = ['consent', 'submit', 'submitted', 'shortlisted', 'finalist']

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
  const [entry, setEntry] = useState(null)
  const [guardian, setGuardian] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('none')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [animState, setAnimState] = useState('')

  const [category, setCategory] = useState('junior')
  const [poemText, setPoemText] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [voiceReflection, setVoiceReflection] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('entries').select('*').eq('entrant_id', user.id).maybeSingle(),
      supabase.from('guardians').select('*').eq('entrant_id', user.id).maybeSingle(),
    ]).then(([eRes, gRes]) => {
      if (eRes.data) setEntry(eRes.data)
      if (gRes.data) setGuardian(gRes.data)
      if (!eRes.data && !gRes.data) setMode('consent')
      if (!eRes.data && gRes.data) setMode('submit')
      setLoading(false)
    })
  }, [user])

  const handleConsent = async (e) => {
    e.preventDefault()
    if (!guardianName.trim() || !guardianEmail.trim()) { toast('Please fill in guardian details', 'error'); return }
    const { error } = await supabase.from('guardians').insert({
      entrant_id: user.id,
      guardian_name: guardianName.trim(),
      guardian_email: guardianEmail.trim(),
      consent_given: true,
    })
    if (error) { toast(error.message, 'error'); return }
    toast('Guardian consent recorded!')
    setGuardian({ guardian_name: guardianName.trim(), guardian_email: guardianEmail.trim() })
    setMode('submit')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!poemText.trim()) { toast('Please provide your poem', 'error'); return }
    const { error } = await supabase.from('entries').insert({
      entrant_id: user.id,
      poem_text: poemText.trim(),
      video_link: videoLink.trim() || null,
      voice_reflection: voiceReflection.trim() || null,
      category,
    })
    if (error) { toast(error.message, 'error'); return }
    const { data } = await supabase.from('entries').select('*').eq('entrant_id', user.id).single()
    if (data) setEntry(data)
    setAnimState('just-submitted')
    setTimeout(() => setAnimState(''), 2000)
    toast('Your poem has been submitted!')
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

  const status = entry?.status || 'submitted'
  const humanStatus = status === 'submitted' ? 'Submitted' : status.charAt(0).toUpperCase() + status.slice(1)
  const currentStep = entry ? (status === 'finalist' ? 4 : status === 'shortlisted' ? 3 : 2) : (guardian ? 1 : 0)

  const statusIcon = status === 'finalist' ? 'award' : status === 'shortlisted' ? 'star' : 'fileText'

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SparkMark />
        <CompetitionBanner compact />
        <h1 className={styles.title}>My Entry</h1>
        <p className={styles.email}>{profile?.email}</p>

        <div className={`${animState === 'just-submitted' ? styles.entryFlash : ''}`}>
          <div className={styles.progressBar}>
            {STEPS.map((s, i) => (
              <div key={s} className={`${styles.step} ${i <= currentStep ? styles.activeStep : ''} ${i === currentStep ? styles.currentStep : ''}`}>
                <div className={styles.stepDot}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={styles.stepLabel}>
                  {s === 'consent' ? 'Consent' : s === 'submit' ? 'Submit' : s === 'submitted' ? 'Submitted' : s === 'shortlisted' ? 'Shortlisted' : 'Finalist'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {entry && (
          <div className={styles.welcomeCard}>
            <Icon name={statusIcon} size={32} className={styles.welcomeIcon} strokeWidth={1.6} />
            <div>
              <p className={styles.welcomeText}>
                {status === 'finalist' ? "You're a finalist!" : status === 'shortlisted' ? "You've been shortlisted!" : 'Entry submitted!'}
              </p>
              <p className={styles.welcomeSub}>
                {profile?.full_name || profile?.email} &middot; {entry.category} &middot; <strong>{humanStatus}</strong>
              </p>
            </div>
          </div>
        )}

        {entry && (
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

        {mode === 'consent' && (
          <form onSubmit={handleConsent} className={styles.form}>
            <h2 className={styles.formTitle}>Guardian Consent</h2>
            <p className={styles.formDesc}>Since you're under 18, a parent or guardian must give permission.</p>
            <div className={styles.field}>
              <label>Guardian Name</label>
              <input value={guardianName} onChange={e => setGuardianName(e.target.value)} className={styles.input} required />
            </div>
            <div className={styles.field}>
              <label>Guardian Email</label>
              <input type="email" value={guardianEmail} onChange={e => setGuardianEmail(e.target.value)} className={styles.input} required />
            </div>
            <button type="submit" className="btnPrimary">Continue to Entry</button>
          </form>
        )}

        {mode === 'submit' && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formTitle}>Your Poem</h2>
            <div className={styles.field}>
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={styles.input}>
                <option value="junior">Junior (11 & under)</option>
                <option value="senior">Senior (12–17)</option>
                <option value="adult">Adult (18+)</option>
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
            <button type="submit" className="btnPrimary">Submit Entry</button>
          </form>
        )}

        {entry && mode !== 'consent' && mode !== 'submit' && (
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
                <p className={styles.entryMeta}>Submitted {new Date(entry.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className={styles.stagesCard}>
              <h4>What Happens Next</h4>
              <div className={styles.stagesList}>
                {STAGE_INFO.map(st => {
                  const done = STEPS.indexOf(st.phase) <= currentStep
                  const current = STEPS.indexOf(st.phase) === currentStep
                  return (
                    <div key={st.phase} className={`${styles.stageItem} ${done ? styles.stageDone : ''} ${current ? styles.stageCurrent : ''}`}>
                      <div className={styles.stageDot}>{done ? '✓' : current ? '●' : '○'}</div>
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
                <a key={r.title} href={r.link} className={styles.resourceCard}>
                  <strong>{r.title}</strong>
                  <span>{r.desc}</span>
                </a>
              ))}
            </div>

            <button className={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>Delete Account & Entry</button>
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
    </div>
  )
}
