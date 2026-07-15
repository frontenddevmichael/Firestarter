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

  const getStatusBadge = (entry) => {
    if (entry?.status === 'shortlisted') return <span className={`${styles.badge} ${styles.shortlisted}`}>Shortlisted</span>
    if (entry?.status === 'finalist') return <span className={`${styles.badge} ${styles.finalist}`}>Finalist</span>
    return null
  }

  const poemTitle = (entry) => {
    if (!entry?.poem_text) return 'Untitled'
    return entry.poem_text.split('\n')[0].substring(0, 60) || 'Untitled'
  }

  if (loading) return <div className={styles.page}><Skeleton width="100%" height="60vh" /></div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SparkMark />
        <h1 className={styles.title}>Judge Dashboard</h1>
        <p className={styles.email}>{profile?.email}</p>
        {msg && <p className={styles.msg}>{msg}</p>}

        {assignments.length === 0 && <p className={styles.empty}>No entries assigned yet.</p>}

        {assignments.map(a => {
          const entry = a.entries
          const s = existingScores[entry?.id]
          return (
            <div key={a.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{poemTitle(entry)}</h2>
                <span className={styles.category}>{entry?.category}</span>
                {getStatusBadge(entry)}
                {s ? <span className={styles.badge}>Scored</span> : <span className={`${styles.badge} ${styles.pending}`}>Pending</span>}
              </div>
              <p className={styles.poemText}>{entry?.poem_text}</p>
              {entry?.video_link && (
                <p><a href={entry.video_link} target="_blank" rel="noreferrer">Watch performance video</a></p>
              )}
              <div className={styles.scoreSection}>
                <div className={styles.field}>
                  <label>Score (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className={styles.input}
                    value={scoreInputs[entry?.id] ?? (s?.score ?? '')}
                    onChange={e => setScoreInputs({ ...scoreInputs, [entry?.id]: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Notes (optional)</label>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={noteInputs[entry?.id] ?? (s?.notes || '')}
                    onChange={e => setNoteInputs({ ...noteInputs, [entry?.id]: e.target.value })}
                  />
                </div>
                <button className="btnPrimary" onClick={() => handleScore(entry?.id)}>Save Score</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
