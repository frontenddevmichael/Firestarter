import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import Skeleton from '../../components/Skeleton'
import SparkMark from '../../components/SparkMark'
import styles from './JudgeDashboard.module.css'

export default function JudgeDashboard() {
  const { user, profile } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [scores, setScores] = useState({})
  const [notes, setNotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user) return
    loadAssignments()
  }, [user])

  async function loadAssignments() {
    setLoading(true)
    const { data } = await supabase
      .from('judge_assignments')
      .select('*, entries(*)')
      .eq('judge_id', user.id)
    if (data) {
      // Fetch scores separately (no FK relationship for direct join)
      const assignmentIds = data.map(a => a.id)
      const { data: scoreData } = await supabase
        .from('scores')
        .select('*')
        .in('judge_assignment_id', assignmentIds)
      const scoreMap = {}
      if (scoreData) {
        scoreData.forEach(s => { scoreMap[s.judge_assignment_id] = s })
      }
      setAssignments(data.map(a => ({ ...a, scores: scoreMap[a.id] ? [scoreMap[a.id]] : [] })))
    }
    setLoading(false)
  }

  const handleScore = async (assignmentId) => {
    setMsg('')
    const score = scores[assignmentId]
    const note = notes[assignmentId] || ''
    if (!score || score < 1 || score > 100) { setMsg('Score must be between 1 and 100'); return }
    const { error } = await supabase.from('scores').upsert({
      judge_assignment_id: assignmentId,
      score: Number(score),
      notes: note,
    }, { onConflict: 'judge_assignment_id' })
    if (error) { setMsg(error.message); return }
    setMsg('Score saved!')
    loadAssignments()
  }

  const getStatusBadge = (entry) => {
    if (entry?.status === 'shortlisted') return <span className={`${styles.badge} ${styles.shortlisted}`}>Shortlisted</span>
    if (entry?.status === 'finalist') return <span className={`${styles.badge} ${styles.finalist}`}>Finalist</span>
    return null
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

        {assignments.map(a => (
          <div key={a.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>{a.entries?.poem_title || 'Untitled'}</h2>
              {getStatusBadge(a.entries)}
              {a.scores?.[0] ? <span className={styles.badge}>Scored</span> : <span className={`${styles.badge} ${styles.pending}`}>Pending</span>}
            </div>
            <p className={styles.poemText}>{a.entries?.poem_text}</p>
            {a.entries?.youtube_url && (
              <p><a href={a.entries.youtube_url} target="_blank" rel="noreferrer">Watch performance video</a></p>
            )}
            <div className={styles.scoreSection}>
              <div className={styles.field}>
                <label>Score (1-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className={styles.input}
                  value={scores[a.id] ?? (a.scores?.[0]?.score ?? '')}
                  onChange={e => setScores({ ...scores, [a.id]: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label>Notes (optional)</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={notes[a.id] ?? (a.scores?.[0]?.notes || '')}
                  onChange={e => setNotes({ ...notes, [a.id]: e.target.value })}
                />
              </div>
              <button className="btnPrimary" onClick={() => handleScore(a.id)}>Save Score</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
