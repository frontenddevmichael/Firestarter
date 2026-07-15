import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import Skeleton from '../../components/Skeleton'
import SparkMark from '../../components/SparkMark'
import styles from './EntrantDashboard.module.css'

const STEPS = ['consent', 'submit', 'submitted', 'shortlisted', 'finalist']

function stepIndex(status) {
  return status === 'finalist' ? 4
    : status === 'shortlisted' ? 3
    : 2
}

export default function EntrantDashboard() {
  const { user, profile, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [guardian, setGuardian] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('none')

  const [category, setCategory] = useState('junior')
  const [poemText, setPoemText] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [voiceReflection, setVoiceReflection] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')
  const [msg, setMsg] = useState('')

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
    setMsg('')
    if (!guardianName.trim() || !guardianEmail.trim()) { setMsg('Please fill in guardian details'); return }
    const { error } = await supabase.from('guardians').insert({
      entrant_id: user.id,
      guardian_name: guardianName.trim(),
      guardian_email: guardianEmail.trim(),
      consent_given: true,
    })
    if (error) { setMsg(error.message); return }
    setGuardian({ guardian_name: guardianName.trim(), guardian_email: guardianEmail.trim() })
    setMode('submit')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    if (!poemText.trim()) { setMsg('Please provide your poem'); return }
    const { error } = await supabase.from('entries').insert({
      entrant_id: user.id,
      poem_text: poemText.trim(),
      video_link: videoLink.trim() || null,
      voice_reflection: voiceReflection.trim() || null,
      category,
    })
    if (error) { setMsg(error.message); return }
    const { data } = await supabase.from('entries').select('*').eq('entrant_id', user.id).single()
    if (data) setEntry(data)
    setMode('status')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure? This will permanently delete your account and entry.')) return
    const { error } = await deleteAccount()
    if (error) { setMsg(error.message); return }
    navigate('/prize')
  }

  if (loading) return <div className={styles.page}><Skeleton width="100%" height="60vh" /></div>

  const status = entry?.status || 'submitted'
  const currentStep = entry ? stepIndex(status) : (guardian ? 1 : 0)
  const isShortlisted = status === 'shortlisted'
  const isFinalist = status === 'finalist'

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SparkMark />
        <h1 className={styles.title}>My Entry</h1>
        <p className={styles.email}>{profile?.email}</p>
        {msg && <p className={styles.msg}>{msg}</p>}

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
            {msg && <p className={styles.error}>{msg}</p>}
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
            {msg && <p className={styles.error}>{msg}</p>}
            <button type="submit" className="btnPrimary">Submit Entry</button>
          </form>
        )}

        {entry && mode !== 'consent' && mode !== 'submit' && (
          <div className={styles.statusSection}>
            {isShortlisted && (
              <div className={styles.alert}>
                <span className={styles.alertIcon}>🎉</span>
                <div><strong>Congratulations!</strong> Your poem has been shortlisted. We'll be in touch with next steps.</div>
              </div>
            )}
            {isFinalist && (
              <div className={styles.alert}>
                <span className={styles.alertIcon}>🏆</span>
                <div><strong>Amazing!</strong> You are a finalist! We'll contact you about the awards ceremony.</div>
              </div>
            )}

            <div className={styles.entryCard}>
              <div className={styles.entryHeader}>
                <span className={styles.categoryBadge}>{entry.category}</span>
                <span className={`${styles.statusBadge} ${styles[entry.status]}`}>{entry.status}</span>
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
                    <a href={entry.video_link} target="_blank" rel="noreferrer">Watch performance video →</a>
                  </p>
                )}
                <p className={styles.entryMeta}>Submitted {new Date(entry.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {guardian && (
              <div className={styles.guardianCard}>
                <h4>Guardian</h4>
                <p>{guardian.guardian_name} — {guardian.guardian_email}</p>
              </div>
            )}

            <button className={styles.deleteBtn} onClick={handleDelete}>Delete Account & Entry</button>
          </div>
        )}
      </div>
    </div>
  )
}
