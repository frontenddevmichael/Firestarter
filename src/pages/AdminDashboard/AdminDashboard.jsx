import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import Skeleton from '../../components/Skeleton'
import PasswordInput from '../../components/PasswordInput'
import SparkMark from '../../components/SparkMark'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [entries, setEntries] = useState([])
  const [judges, setJudges] = useState([])
  const [stats, setStats] = useState({ total: 0, judged: 0, phase: 'open' })
  const [emailLogs, setEmailLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const [judgeForm, setJudgeForm] = useState({ name: '', email: '', password: '' })
  const [judgeFormMsg, setJudgeFormMsg] = useState('')

  const fetchData = useCallback(async () => {
    const [entriesRes, judgesRes, statsRes, logsRes] = await Promise.all([
      supabase.from('entries').select('*, profiles!entries_entrant_id_fkey(email, full_name), scores(score), judge_assignments(judge_id, profiles!judge_assignments_judge_id_fkey(email, full_name))'),
      supabase.from('profiles').select('id, email, full_name, role').eq('role', 'judge'),
      supabase.from('entries').select('id, phase, status, scores(score)', { count: 'exact' }),
      supabase.from('email_logs').select('*').order('sent_at', { ascending: false }).limit(50),
    ])
    if (entriesRes.data) setEntries(entriesRes.data)
    if (judgesRes.data) setJudges(judgesRes.data)
    if (statsRes.data) {
      const total = statsRes.data.length
      const judged = statsRes.data.filter(e => e.scores?.length > 0).length
      const phase = statsRes.data[0]?.phase || 'open'
      setStats({ total, judged, phase })
    }
    if (logsRes.data) setEmailLogs(logsRes.data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const createJudge = async (e) => {
    e.preventDefault()
    setJudgeFormMsg('')
    if (!judgeForm.name.trim() || !judgeForm.email.trim() || !judgeForm.password) {
      setJudgeFormMsg('All fields required'); return
    }
    const { data, error } = await supabase.rpc('create_judge_user', {
      judge_email: judgeForm.email,
      judge_password: judgeForm.password,
      judge_name: judgeForm.name.trim(),
    })
    if (error || data?.error) {
      setJudgeFormMsg(error?.message || data?.error || 'Failed to create judge')
      return
    }
    const { error: credErr } = await supabase.rpc('send_judge_credentials', {
      judge_email: judgeForm.email,
      judge_name: judgeForm.name.trim(),
      judge_password: judgeForm.password,
    })
    if (credErr) setJudgeFormMsg(`Judge created but credential email failed: ${credErr.message}`)
    else setJudgeFormMsg(`Judge account created. Credentials sent to ${judgeForm.email}.`)
    setJudgeForm({ name: '', email: '', password: '' })
    fetchData()
  }

  const changePhase = async (phase) => {
    await supabase.from('entries').update({ phase }).neq('phase', 'closed')
    fetchData()
  }

  const updateEntryStatus = async (entryId, status) => {
    await supabase.from('entries').update({ status }).eq('id', entryId)
    fetchData()
  }

  const assignJudge = async (entryId, judgeId) => {
    if (!judgeId) return
    await supabase.from('judge_assignments').insert({ entry_id: entryId, judge_id: judgeId })
    fetchData()
  }

  const entriesWithAvg = entries.map(e => ({
    ...e,
    avgScore: e.scores?.length ? (e.scores.reduce((s, sc) => s + sc.score, 0) / e.scores.length).toFixed(1) : '-',
  })).sort((a, b) => {
    if (a.avgScore === '-' && b.avgScore === '-') return 0
    if (a.avgScore === '-') return 1
    if (b.avgScore === '-') return -1
    return b.avgScore - a.avgScore
  })

  if (loading) return <div className={styles.page}><Skeleton width="100%" height="60vh" /></div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SparkMark />
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.email}>{profile?.email}</p>

        <div className={styles.stats}>
          <div className={styles.stat}><strong>{stats.total}</strong> Entries</div>
          <div className={styles.stat}><strong>{stats.judged}</strong> Judged</div>
          <div className={styles.stat}><strong>{stats.phase}</strong> Phase</div>
          <div className={styles.stat}><strong>{judges.length}</strong> Judges</div>
        </div>

        <div className={styles.section}>
          <h2>Phase Control</h2>
          <div className={styles.phaseBtns}>
            {['open', 'judging', 'shortlisted', 'finalists', 'closed'].map(p => (
              <button key={p} className={`btnPrimary ${stats.phase === p ? styles.activePhase : ''}`} onClick={() => changePhase(p)} disabled={stats.phase === p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Create Judge</h2>
          <form onSubmit={createJudge} className={styles.judgeForm}>
            <input placeholder="Full Name" value={judgeForm.name} onChange={e => setJudgeForm({ ...judgeForm, name: e.target.value })} className={styles.input} />
            <input type="email" placeholder="Email" value={judgeForm.email} onChange={e => setJudgeForm({ ...judgeForm, email: e.target.value })} className={styles.input} />
            <PasswordInput placeholder="Password" value={judgeForm.password} onChange={e => setJudgeForm({ ...judgeForm, password: e.target.value })} />
            <button type="submit" className="btnPrimary">Create Judge</button>
          </form>
          {judgeFormMsg && <p className={judgeFormMsg.includes('created') ? styles.success : styles.error}>{judgeFormMsg}</p>}
        </div>

        <div className={styles.section}>
          <h2>Judges ({judges.length})</h2>
          <table className={styles.table}>
            <thead>
              <tr><th>Name</th><th>Email</th></tr>
            </thead>
            <tbody>
              {judges.map(j => (
                <tr key={j.id}>
                  <td>{j.full_name || '—'}</td>
                  <td>{j.email}</td>
                </tr>
              ))}
              {judges.length === 0 && <tr><td colSpan="2" className={styles.empty}>No judges yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Entries ({entriesWithAvg.length})</h2>
            <button className="btnPrimary" onClick={() => {
              const csv = [['Entrant Name','Entrant Email','Poem Title','Score','Status'].join(',')].concat(
                entriesWithAvg.map(e => [
                  `"${e.profiles?.full_name || ''}"`,
                  `"${e.profiles?.email || ''}"`,
                  `"${e.poem_title || ''}"`,
                  e.avgScore,
                  e.status || e.phase,
                ].join(','))
              ).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = 'entries.csv'; a.click()
              URL.revokeObjectURL(url)
            }} style={{ fontSize: 'var(--fs-caption)', padding: '0.5rem 1rem' }}>Download CSV</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr><th>Entrant</th><th>Poem</th><th>Score</th><th>Status</th><th>Assign Judge</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {entriesWithAvg.map(e => (
                <tr key={e.id}>
                  <td>
                    <div className={styles.entrantInfo}>
                      <span className={styles.entrantName}>{e.profiles?.full_name || '—'}</span>
                      <span className={styles.entrantEmail}>{e.profiles?.email || '—'}</span>
                    </div>
                  </td>
                  <td>{e.poem_title}</td>
                  <td>{e.avgScore}</td>
                  <td>{e.status || e.phase}</td>
                  <td>
                    <select className={styles.select} onChange={ev => assignJudge(e.id, ev.target.value)} defaultValue="">
                      <option value="" disabled>Assign judge</option>
                      {judges.map(j => (
                        <option key={j.id} value={j.id}>{j.full_name || j.email}</option>
                      ))}
                    </select>
                    {e.judge_assignments?.map(ja => (
                      <div key={ja.judge_id} className={styles.assignedJudge}>
                        {ja.profiles?.full_name || ja.profiles?.email || 'Assigned'}
                      </div>
                    ))}
                  </td>
                  <td>
                    <select className={styles.select} onChange={ev => updateEntryStatus(e.id, ev.target.value)} defaultValue="">
                      <option value="" disabled>Set status</option>
                      <option value="shortlisted">Shortlist</option>
                      <option value="finalist">Finalist</option>
                    </select>
                  </td>
                </tr>
              ))}
              {entriesWithAvg.length === 0 && <tr><td colSpan="6" className={styles.empty}>No entries yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <h2>Email Logs</h2>
          <table className={styles.table}>
            <thead>
              <tr><th>Recipient</th><th>Type</th><th>Status</th><th>Sent At</th></tr>
            </thead>
            <tbody>
              {emailLogs.map(l => (
                <tr key={l.id}>
                  <td>{l.recipient}</td>
                  <td>{l.email_type}</td>
                  <td><span className={l.status === 'sent' ? styles.success : styles.error}>{l.status}</span></td>
                  <td>{new Date(l.sent_at).toLocaleString()}</td>
                </tr>
              ))}
              {emailLogs.length === 0 && <tr><td colSpan="4" className={styles.empty}>No email logs.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
