import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import Skeleton from '../../components/Skeleton'
import SparkMark from '../../components/SparkMark'
import styles from './EntrantDashboard.module.css'

export default function EntrantDashboard() {
  const { user, profile, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('status')

  const [poemTitle, setPoemTitle] = useState('')
  const [poemText, setPoemText] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')
  const [guardianPhone, setGuardianPhone] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [voiceReflection, setVoiceReflection] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user) return
    supabase.from('entries').select('*').eq('entrant_id', user.id).single()
      .then(({ data }) => {
        if (data) setEntry(data)
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
      guardian_phone: guardianPhone.trim() || null,
    })
    if (error) { setMsg(error.message); return }
    setMode('submit')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    if (!poemTitle.trim() || !poemText.trim()) { setMsg('Please provide poem title and text'); return }
    const { error } = await supabase.from('entries').insert({
      entrant_id: user.id,
      poem_title: poemTitle.trim(),
      poem_text: poemText.trim(),
      youtube_url: youtubeUrl.trim() || null,
      voice_reflection: voiceReflection.trim() || null,
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

  const phase = entry?.phase || 'draft'
  const isShortlisted = entry?.status === 'shortlisted'
  const isFinalist = entry?.status === 'finalist'

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SparkMark />
        <h1 className={styles.title}>My Entry</h1>
        <p className={styles.email}>{profile?.email}</p>

        {!entry && mode !== 'consent' && mode !== 'submit' && (
          <div className={styles.section}>
            <p>You have not submitted an entry yet.</p>
            <button className="btnPrimary" onClick={() => setMode('consent')}>Submit Entry</button>
          </div>
        )}

        {(mode === 'consent' || (!entry && !mode.startsWith('consent'))) && mode === 'consent' && (
          <form onSubmit={handleConsent} className={styles.form}>
            <h2>Guardian Consent</h2>
            <div className={styles.field}>
              <label>Guardian Name</label>
              <input value={guardianName} onChange={e => setGuardianName(e.target.value)} className={styles.input} required />
            </div>
            <div className={styles.field}>
              <label>Guardian Email</label>
              <input type="email" value={guardianEmail} onChange={e => setGuardianEmail(e.target.value)} className={styles.input} required />
            </div>
            <div className={styles.field}>
              <label>Guardian Phone (optional)</label>
              <input value={guardianPhone} onChange={e => setGuardianPhone(e.target.value)} className={styles.input} />
            </div>
            {msg && <p className={styles.error}>{msg}</p>}
            <button type="submit" className="btnPrimary">Continue to Entry</button>
          </form>
        )}

        {mode === 'submit' && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Your Poem</h2>
            <div className={styles.field}>
              <label>Poem Title</label>
              <input value={poemTitle} onChange={e => setPoemTitle(e.target.value)} className={styles.input} required />
            </div>
            <div className={styles.field}>
              <label>Poem Text</label>
              <textarea value={poemText} onChange={e => setPoemText(e.target.value)} className={styles.textarea} rows={10} required />
            </div>
            <div className={styles.field}>
              <label>YouTube Performance URL (optional)</label>
              <input type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className={styles.input} placeholder="https://youtube.com/..." />
            </div>
            <div className={styles.field}>
              <label>Voice Reflection (optional)</label>
              <textarea value={voiceReflection} onChange={e => setVoiceReflection(e.target.value)} className={styles.textarea} rows={4} placeholder="Why did you write this poem?" />
            </div>
            {msg && <p className={styles.error}>{msg}</p>}
            <button type="submit" className="btnPrimary">Submit Entry</button>
          </form>
        )}

        {entry && mode === 'status' && (
          <div className={styles.section}>
            <h2>Entry Status</h2>
            <p><strong>Title:</strong> {entry.poem_title}</p>
            <p><strong>Status:</strong> {entry.status || phase}</p>
            {isShortlisted && <div className={styles.alert}><strong>Congratulations!</strong> You have been shortlisted.</div>}
            {isFinalist && <div className={styles.alert}><strong>Amazing!</strong> You are a finalist!</div>}
            <button className="btnPrimary" style={{ marginTop: 'var(--space-md)' }} onClick={handleDelete}>Delete Account</button>
          </div>
        )}
      </div>
    </div>
  )
}
