import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import Skeleton from '../../components/Skeleton'
import SparkMark from '../../components/SparkMark'
import styles from './JudgeDashboard.module.css'

export default function JudgeDashboard() {
  const { user, profile } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [existingScores, setExistingScores] = useState({})
  const [scoreInputs, setScoreInputs] = useState({})
  const [noteInputs, setNoteInputs] = useState({})
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user) return
    loadAssignments()
  }, [user])

  async function loadAssignments() {
    setLoading(true)
    const { data: asgn } = await supabase
      .from('judge_assignments')
      .select('*, entries(*)')
      .eq('judge_id', user.id)
    if (!asgn) { setLoading(false); return }

    const { data: scoreData } = await supabase
      .from('scores')
      .select('*')
      .eq('judge_id', user.id)

    const scoreMap = {}
    if (scoreData) {
      scoreData.forEach(s => { scoreMap[s.entry_id] = s })
    }
    setExistingScores(scoreMap)
    setAssignments(asgn)
    setLoading(false)
  }

  const handleScore = async (entryId) => {
    setMsg('')
    const score = scoreInputs[entryId]
    const note = noteInputs[entryId] || ''
    if (!score || score < 1 || score > 100) { setMsg('Score must be between 1 and 100'); return }
    const { error } = await supabase.from('scores').upsert({
      judge_id: user.id,
      entry_id: entryId,
      score: Number(score),
      notes: note,
    }, { onConflict: 'judge_id, entry_id' })
    if (error) { setMsg(error.message); return }
    setMsg('Score saved!')
    loadAssignments()
  }

  const scoredCount = Object.keys(existingScores).length
  const pendingCount = Math.max(0, assignments.length - scoredCount)

  const poemTitle = (entry) => {
    if (!entry?.poem_text) return 'Untitled'
    return entry.poem_text.split('\n')[0].substring(0, 60) || 'Untitled'
  }

  const getStatusColor = (status) => {
    if (status === 'shortlisted') return styles.shortlisted
    if (status === 'finalist') return styles.finalist
    return ''
  }

  const pendingEntries = assignments.filter(a => !existingScores[a.entries?.id])
  const scoredEntries = assignments.filter(a => existingScores[a.entries?.id])

  if (loading) return <div className={styles.page}><Skeleton width="100%" height="60vh" /></div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SparkMark />
        <h1 className={styles.title}>Judge Dashboard</h1>
        <p className={styles.email}>{profile?.email}</p>
        {msg && <p className={msg.includes('error') || msg.includes('Error') ? styles.errorMsg : styles.successMsg}>{msg}</p>}

        <div className={styles.summaryBar}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{assignments.length}</span>
            <span className={styles.summaryLabel}>Assigned</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{scoredCount}</span>
            <span className={styles.summaryLabel}>Scored</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{pendingCount}</span>
            <span className={styles.summaryLabel}>Pending</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${assignments.length ? (scoredCount / assignments.length) * 100 : 0}%` }} />
          </div>
        </div>

        {assignments.length === 0 && (
          <div className={styles.empty}>
            <p>No entries assigned yet.</p>
            <p className={styles.emptyHint}>Once the admin assigns entries for judging, they'll appear here.</p>
          </div>
        )}

        {pendingEntries.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>To Score ({pendingEntries.length})</h3>
            {pendingEntries.map(a => renderCard(a, false))}
          </>
        )}

        {scoredEntries.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>Scored ({scoredEntries.length})</h3>
            {scoredEntries.map(a => renderCard(a, true))}
          </>
        )}
      </div>
    </div>
  )

  function renderCard(a, isScored) {
    const entry = a.entries
    const s = existingScores[entry?.id]
    return (
      <div key={a.id} className={`${styles.card} ${isScored ? styles.cardScored : ''}`}>
        <div className={styles.cardHeader}>
          <h2>{poemTitle(entry)}</h2>
          <span className={styles.categoryBadge}>{entry?.category}</span>
          {entry?.status !== 'submitted' && <span className={`${styles.statusBadge} ${getStatusColor(entry?.status)}`}>{entry?.status}</span>}
          {isScored ? <span className={styles.scoredBadge}>Scored</span> : <span className={styles.pendingBadge}>Pending</span>}
        </div>

        <div className={styles.poemSection}>
          <p className={styles.poemText}>{entry?.poem_text}</p>
          {entry?.voice_reflection && (
            <div className={styles.voiceSection}>
              <h4>Voice Reflection</h4>
              <p className={styles.voiceText}>{entry.voice_reflection}</p>
            </div>
          )}
          {entry?.video_link && (
            <p className={styles.videoLink}>
              <a href={entry.video_link} target="_blank" rel="noreferrer">Watch performance video →</a>
            </p>
          )}
        </div>

        <div className={styles.scoreSection}>
          <div className={styles.scoreRow}>
            <div className={styles.field}>
              <label>Score (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                className={styles.scoreInput}
                value={scoreInputs[entry?.id] ?? (s?.score ?? '')}
                onChange={e => setScoreInputs({ ...scoreInputs, [entry?.id]: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Notes (optional)</label>
              <textarea
                className={styles.noteInput}
                rows={2}
                value={noteInputs[entry?.id] ?? (s?.notes || '')}
                onChange={e => setNoteInputs({ ...noteInputs, [entry?.id]: e.target.value })}
              />
            </div>
          </div>
          <button className="btnPrimary" onClick={() => handleScore(entry?.id)}>
            {isScored ? 'Update Score' : 'Submit Score'}
          </button>
        </div>
      </div>
    )
  }
}
