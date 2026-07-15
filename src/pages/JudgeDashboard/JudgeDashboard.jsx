import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import Skeleton from '../../components/Skeleton'
import CompetitionBanner from '../../components/CompetitionBanner'
import SparkMark from '../../components/SparkMark'
import styles from './JudgeDashboard.module.css'

const RUBRIC = [
  { area: 'Voice & Originality', desc: 'Does the poem have a distinct voice? Is it original?' },
  { area: 'Craft & Technique', desc: 'Use of language, imagery, rhythm, structure.' },
  { area: 'Emotional Impact', desc: 'Does it move the reader? Is the emotion authentic?' },
  { area: 'Theme Engagement', desc: 'How well does it engage with the competition theme?' },
]

export default function JudgeDashboard() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const [assignments, setAssignments] = useState([])
  const [existingScores, setExistingScores] = useState({})
  const [scoreInputs, setScoreInputs] = useState({})
  const [noteInputs, setNoteInputs] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [saving, setSaving] = useState(null)
  const [savingTimeout, setSavingTimeout] = useState(null)

  useEffect(() => {
    if (!user) return
    loadAssignments()
  }, [user])

  useEffect(() => {
    setCurrentIdx(0)
  }, [filter, filterStatus])

  async function loadAssignments() {
    setLoading(true)
    const [asgnRes, scoreRes] = await Promise.all([
      supabase.from('judge_assignments').select('*, entries(*)').eq('judge_id', user.id),
      supabase.from('scores').select('*').eq('judge_id', user.id),
    ])
    if (asgnRes.data) setAssignments(asgnRes.data)
    const scoreMap = {}
    if (scoreRes.data) scoreRes.data.forEach(s => { scoreMap[s.entry_id] = s })
    setExistingScores(scoreMap)
    setLoading(false)
  }

  const handleScoreChange = (entryId, value) => {
    setScoreInputs(s => ({ ...s, [entryId]: value }))
    if (savingTimeout) clearTimeout(savingTimeout)
    const timeout = setTimeout(() => autoSave(entryId), 1500)
    setSavingTimeout(timeout)
  }

  const autoSave = async (entryId) => {
    const val = scoreInputs[entryId]
    if (!val || val < 1 || val > 100) return
    setSaving(entryId)
    const { error } = await supabase.from('scores').upsert({
      judge_id: user.id,
      entry_id: entryId,
      score: Number(val),
      notes: noteInputs[entryId] || '',
    }, { onConflict: 'judge_id, entry_id' })
    setSaving(false)
    if (error) { toast(error.message, 'error'); return }
    toast('Score saved!', 'success', 2000)
    loadAssignments()
  }

  const saveNow = async (entryId) => {
    if (savingTimeout) clearTimeout(savingTimeout)
    await autoSave(entryId)
  }

  const filtered = useMemo(() => {
    let result = [...assignments]
    if (filter === 'scored') result = result.filter(a => existingScores[a.entries?.id])
    if (filter === 'pending') result = result.filter(a => !existingScores[a.entries?.id])
    if (filterStatus !== 'all') result = result.filter(a => a.entries?.status === filterStatus)
    return result
  }, [assignments, existingScores, filter, filterStatus])

  const entry = filtered[currentIdx]
  const s = entry ? existingScores[entry.entries?.id] : null
  const scoredCount = Object.keys(existingScores).length
  const totalCount = assignments.length

  if (loading) return <div className={styles.page}><Skeleton width="100%" height="60vh" /></div>

  if (fullscreen && entry) {
    return (
      <div className={styles.fullscreenOverlay} onClick={() => setFullscreen(false)}>
        <div className={styles.fullscreenContent} onClick={e => e.stopPropagation()}>
          <button className={styles.fsClose} onClick={() => setFullscreen(false)}>✕</button>
          <span className={styles.fsCategory}>{entry.entries?.category}</span>
          <p className={styles.fsPoem}>{entry.entries?.poem_text}</p>
          {entry.entries?.voice_reflection && (
            <div className={styles.fsVoice}>
              <h4>Voice Reflection</h4>
              <p>{entry.entries.voice_reflection}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SparkMark />
        <CompetitionBanner compact />
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Judge Dashboard</h1>
            <p className={styles.email}>{profile?.email}</p>
          </div>
        </div>

        <div className={styles.progressCard}>
          <div className={styles.progressStat}>
            <span className={styles.progressValue}>{scoredCount}</span>
            <span className={styles.progressLabel}>Scored</span>
          </div>
          <div className={styles.progressStat}>
            <span className={styles.progressValue}>{totalCount - scoredCount}</span>
            <span className={styles.progressLabel}>Remaining</span>
          </div>
          <div className={styles.progressStat}>
            <span className={styles.progressValue}>{totalCount}</span>
            <span className={styles.progressLabel}>Total</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: totalCount ? `${(scoredCount / totalCount) * 100}%` : '0%' }} />
          </div>
          <span className={styles.progressPct}>{totalCount ? Math.round((scoredCount / totalCount) * 100) : 0}% complete</span>
        </div>

        <details className={styles.rubricBox}>
          <summary className={styles.rubricSummary}>Scoring Rubric</summary>
          <div className={styles.rubricBody}>
            {RUBRIC.map(r => (
              <div key={r.area} className={styles.rubricItem}>
                <strong>{r.area}</strong>
                <span>{r.desc}</span>
              </div>
            ))}
            <p className={styles.rubricNote}>Score each entry holistically 1–100 based on these criteria.</p>
          </div>
        </details>

        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            {['all', 'pending', 'scored'].map(f => (
              <button key={f} className={filter === f ? styles.filterActive : styles.filterBtn} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <select className={styles.filterSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All categories</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
            <option value="adult">Adult</option>
          </select>
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <p>{assignments.length === 0 ? 'No entries assigned yet.' : 'No entries match the current filter.'}</p>
            <p className={styles.emptyHint}>Entries will appear here once the admin assigns them for judging.</p>
          </div>
        )}

        {entry && (
          <>
            <div className={styles.navBar}>
              <button className={styles.navBtn} disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)}>← Previous</button>
              <span className={styles.navPos}>Entry {currentIdx + 1} of {filtered.length}</span>
              <button className={styles.navBtn} disabled={currentIdx >= filtered.length - 1} onClick={() => setCurrentIdx(i => i + 1)}>Next →</button>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Entry #{currentIdx + 1}</h2>
                <span className={styles.categoryBadge}>{entry.entries?.category}</span>
                {entry.entries?.status !== 'submitted' && (
                  <span className={`${styles.statusBadge} ${entry.entries?.status === 'shortlisted' ? styles.shortlisted : ''} ${entry.entries?.status === 'finalist' ? styles.finalist : ''}`}>
                    {entry.entries?.status}
                  </span>
                )}
                {s ? <span className={styles.scoredBadge}>Scored: {s.score}/100</span> : <span className={styles.pendingBadge}>Pending</span>}
                <button className={styles.fsBtn} onClick={() => setFullscreen(true)} title="Fullscreen reading mode">⛶</button>
              </div>

              <div className={styles.poemSection}>
                <p className={styles.poemText}>{entry.entries?.poem_text}</p>
                {entry.entries?.voice_reflection && (
                  <div className={styles.voiceSection}>
                    <h4>Voice Reflection</h4>
                    <p className={styles.voiceText}>{entry.entries.voice_reflection}</p>
                  </div>
                )}
                {entry.entries?.video_link && (
                  <p className={styles.videoLink}>
                    <a href={entry.entries.video_link.startsWith('http') ? entry.entries.video_link : `https://${entry.entries.video_link}`} target="_blank" rel="noreferrer">Watch performance video →</a>
                  </p>
                )}
              </div>

              <div className={styles.scoreSection}>
                <div className={styles.scoreRow}>
                  <div className={styles.field}>
                    <label>Score (1–100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className={styles.scoreInput}
                      value={scoreInputs[entry.entries?.id] ?? (s?.score ?? '')}
                      onChange={e => handleScoreChange(entry.entries?.id, e.target.value)}
                      onBlur={() => scoreInputs[entry.entries?.id] && saveNow(entry.entries?.id)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Notes (optional)</label>
                    <textarea
                      className={styles.noteInput}
                      rows={2}
                      value={noteInputs[entry.entries?.id] ?? (s?.notes || '')}
                      onChange={e => setNoteInputs(n => ({ ...n, [entry.entries?.id]: e.target.value }))}
                    />
                  </div>
                </div>
                <div className={styles.scoreActions}>
                  <button className="btnPrimary" onClick={() => saveNow(entry.entries?.id)} disabled={saving === entry.entries?.id}>
                    {saving === entry.entries?.id ? 'Saving...' : s ? 'Update Score' : 'Submit Score'}
                  </button>
                  {s && <span className={styles.savedAt}>Saved</span>}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
