import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js'
import Skeleton from '../../components/Skeleton'
import CompetitionBanner from '../../components/CompetitionBanner'
import ConfirmModal from '../../components/ConfirmModal'
import PasswordInput from '../../components/PasswordInput'
import Icon from '../../components/Icon'
import SparkMark from '../../components/SparkMark'
import styles from './AdminDashboard.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

export default function AdminDashboard() {
  const { profile } = useAuth()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'overview'
  const [entries, setEntries] = useState([])
  const [judges, setJudges] = useState([])
  const [allScores, setAllScores] = useState([])
  const [phaseHistory, setPhaseHistory] = useState([])
  const [currentPhase, setCurrentPhase] = useState('open')
  const [emailLogs, setEmailLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('submitted_at')
  const [sortDir, setSortDir] = useState('desc')
  const [selected, setSelected] = useState(new Set())
  const [bulkMode, setBulkMode] = useState(false)
  const [detailEntry, setDetailEntry] = useState(null)
  const [showWithdraw, setShowWithdraw] = useState(null)

  const [judgeForm, setJudgeForm] = useState({ name: '', email: '', password: '' })
  const [judgeFormMsg, setJudgeFormMsg] = useState('')

  const setTab = (t) => setSearchParams({ tab: t })

  async function fetchData() {
    const [entriesRes, judgesRes, roundsRes, logsRes, scoresRes] = await Promise.all([
      supabase.from('entries').select('*, profiles!entries_entrant_id_fkey(email, full_name), scores(score, judge_id), judge_assignments(judge_id, profiles!judge_assignments_judge_id_fkey(email, full_name))'),
      supabase.from('profiles').select('id, email, full_name, role').eq('role', 'judge'),
      supabase.from('rounds').select('phase, phase_started').order('phase_started', { ascending: false }),
      supabase.from('email_logs').select('*').order('sent_at', { ascending: false }).limit(50),
      supabase.from('scores').select('judge_id, entry_id, score'),
    ])
    if (entriesRes.data) setEntries(entriesRes.data)
    if (judgesRes.data) setJudges(judgesRes.data)
    if (roundsRes.data) {
      const latest = roundsRes.data[0]
      if (latest) setCurrentPhase(latest.phase)
      const history = Object.entries(
        roundsRes.data.reduce((acc, r) => {
          if (!acc[r.phase] || new Date(r.phase_started) > new Date(acc[r.phase])) acc[r.phase] = r.phase_started
          return acc
        }, {})
      ).map(([phase, phase_started]) => ({ phase, phase_started }))
      setPhaseHistory(history)
    }
    if (logsRes.data) setEmailLogs(logsRes.data)
    if (scoresRes.data) setAllScores(scoresRes.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const toggleSelect = (id) => {
    setSelected(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }

  const toggleAll = () => {
    if (selected.size === filteredEntries.length) setSelected(new Set())
    else setSelected(new Set(filteredEntries.map(e => e.id)))
  }

  const entriesWithMeta = useMemo(() => entries.map(e => ({
    ...e,
    poemTitle: e.poem_text ? e.poem_text.split('\n')[0].substring(0, 60) : '(no poem)',
    avgScore: e.scores?.length ? (e.scores.reduce((s, sc) => s + sc.score, 0) / e.scores.length).toFixed(1) : '-',
    judgeNames: e.judge_assignments?.map(ja => ja.profiles?.full_name || ja.profiles?.email).filter(Boolean).join(', ') || '',
  })), [entries])

  const filteredEntries = useMemo(() => {
    let result = [...entriesWithMeta]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(e =>
        (e.profiles?.full_name || '').toLowerCase().includes(q) ||
        (e.profiles?.email || '').toLowerCase().includes(q) ||
        (e.poem_text || '').toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.status?.toLowerCase().includes(q)
      )
    }
    result.sort((a, b) => {
      let va, vb
      if (sortKey === 'avgScore') { va = a.avgScore === '-' ? -1 : parseFloat(a.avgScore); vb = b.avgScore === '-' ? -1 : parseFloat(b.avgScore) }
      else if (sortKey === 'entrant') { va = (a.profiles?.full_name || '').toLowerCase(); vb = (b.profiles?.full_name || '').toLowerCase() }
      else { va = a[sortKey] || ''; vb = b[sortKey] || '' }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return result
  }, [entriesWithMeta, search, sortKey, sortDir])

  // Entry trend data
  const trendData = useMemo(() => {
    const byDate = {}
    entries.forEach(e => {
      const day = e.submitted_at?.substring(0, 10)
      if (day) byDate[day] = (byDate[day] || 0) + 1
    })
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([day, count]) => ({ day, count }))
  }, [entries])

  // Score distribution
  const scoreDist = useMemo(() => {
    const buckets = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 }
    allScores.forEach(s => {
      if (s.score <= 20) buckets['0-20']++
      else if (s.score <= 40) buckets['21-40']++
      else if (s.score <= 60) buckets['41-60']++
      else if (s.score <= 80) buckets['61-80']++
      else buckets['81-100']++
    })
    return buckets
  }, [allScores])

  // Judge activity
  const judgeActivity = useMemo(() => {
    return judges.map(j => ({
      ...j,
      scored: allScores.filter(s => s.judge_id === j.id).length,
    }))
  }, [judges, allScores])

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
      toast(error?.message || data?.error || 'Failed to create judge', 'error')
      return
    }
    const { error: credErr } = await supabase.rpc('send_judge_credentials', {
      judge_email: judgeForm.email,
      judge_name: judgeForm.name.trim(),
      judge_password: judgeForm.password,
    })
    if (credErr) {
      setJudgeFormMsg(`Judge created but credential email failed: ${credErr.message}`)
      toast('Judge created but email failed', 'error')
    } else {
      setJudgeFormMsg(`Judge created. Credentials sent to ${judgeForm.email}.`)
      toast(`Judge created! Credentials sent to ${judgeForm.email}`)
    }
    setJudgeForm({ name: '', email: '', password: '' })
    fetchData()
  }

  const changePhase = async (phase) => {
    await supabase.from('rounds').insert({ phase })
    toast(`Phase advanced to ${phase}`)
    fetchData()
  }

  const updateEntryStatus = async (entryId, status) => {
    await supabase.from('entries').update({ status }).eq('id', entryId)
    toast(`Entry status updated to ${status}`)
    fetchData()
  }

  const assignJudge = async (entryId, judgeId) => {
    if (!judgeId) return
    await supabase.from('judge_assignments').insert({ entry_id: entryId, judge_id: judgeId })
    toast('Judge assigned')
    fetchData()
  }

  const bulkAssign = async (judgeId) => {
    if (!judgeId || selected.size === 0) return
    const inserts = Array.from(selected).map(entryId => ({ entry_id: entryId, judge_id: judgeId }))
    const { error } = await supabase.from('judge_assignments').insert(inserts)
    if (error) { toast(error.message, 'error'); return }
    toast(`Assigned judge to ${selected.size} entries`)
    setSelected(new Set())
    setBulkMode(false)
    fetchData()
  }

  const bulkStatus = async (status) => {
    const ids = Array.from(selected)
    const { error } = await supabase.from('entries').update({ status }).in('id', ids)
    if (error) { toast(error.message, 'error'); return }
    toast(`Updated ${ids.length} entries to ${status}`)
    setSelected(new Set())
    fetchData()
  }

  const withdrawEntry = async () => {
    if (!showWithdraw) return
    await supabase.from('entries').update({ status: 'withdrawn' }).eq('id', showWithdraw.id)
    toast('Entry withdrawn')
    setShowWithdraw(null)
    setWithdrawReason('')
    fetchData()
  }

  const judgedCount = entries.filter(e => e.scores?.length > 0).length
  const shortlistedCount = entries.filter(e => e.status === 'shortlisted').length
  const finalistCount = entries.filter(e => e.status === 'finalist').length
  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  if (loading) return <div className={styles.page}><Skeleton width="100%" height="60vh" /></div>

  const tabNav = [
    { id: 'overview', label: 'Overview', icon: 'barChart' },
    { id: 'entries', label: 'Entries', icon: 'fileText' },
    { id: 'judges', label: 'Judges', icon: 'users' },
    { id: 'phases', label: 'Phases', icon: 'clock' },
    { id: 'logs', label: 'Logs', icon: 'search' },
  ]

  const renderOverview = () => (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}><Icon name="fileText" size={20} className={styles.statIcon} strokeWidth={1.8} /><span className={styles.statValue}>{entries.length}</span><span className={styles.statLabel}>Entries</span></div>
        <div className={styles.statCard}><Icon name="checkCircle" size={20} className={styles.statIcon} strokeWidth={1.8} /><span className={styles.statValue}>{judgedCount}</span><span className={styles.statLabel}>Judged</span></div>
        <div className={styles.statCard}><Icon name="star" size={20} className={styles.statIcon} strokeWidth={1.8} /><span className={styles.statValue}>{shortlistedCount}</span><span className={styles.statLabel}>Shortlisted</span></div>
        <div className={styles.statCard}><Icon name="award" size={20} className={styles.statIcon} strokeWidth={1.8} /><span className={styles.statValue}>{finalistCount}</span><span className={styles.statLabel}>Finalists</span></div>
        <div className={styles.statCard}><Icon name="users" size={20} className={styles.statIcon} strokeWidth={1.8} /><span className={styles.statValue}>{judges.length}</span><span className={styles.statLabel}>Judges</span></div>
        <div className={styles.statCard}><Icon name="target" size={20} className={styles.statIcon} strokeWidth={1.8} /><span className={styles.statValue}>{allScores.length}</span><span className={styles.statLabel}>Scores Cast</span></div>
      </div>

      <div className={styles.dualCol}>
        <div className={styles.section}>
          <h2>Entry Trend</h2>
          <div className={styles.chartWrap}>
            {trendData.length > 0 ? (
              <Bar data={{
                labels: trendData.map(d => d.day.substring(5)),
                datasets: [{ label: 'Submissions', data: trendData.map(d => d.count), backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: 0 }],
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.06)' } } } }} />
            ) : <p className={styles.empty}>No entries yet.</p>}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Score Distribution</h2>
          <div className={styles.chartWrap}>
            <Bar data={{
              labels: Object.keys(scoreDist),
              datasets: [{ label: 'Scores', data: Object.values(scoreDist), backgroundColor: Object.values(scoreDist).map(c => c > 0 ? '#d32f2f' : '#e0e0e0'), borderRadius: 0 }],
            }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.06)' } } } }} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Phase Timeline</h2>
        <div className={styles.timeline}>
          {['open', 'judging', 'shortlisted', 'finalists', 'closed'].map(p => {
            const hist = phaseHistory.find(h => h.phase === p)
            return (
              <div key={p} className={`${styles.tlItem} ${hist ? styles.tlDone : ''} ${p === currentPhase ? styles.tlCurrent : ''}`}>
                <div className={styles.tlDot}>{hist ? '✓' : '○'}</div>
                <div className={styles.tlContent}>
                  <span className={styles.tlPhase}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                  {hist && <span className={styles.tlDate}>{new Date(hist.phase_started).toLocaleDateString()}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )

  const renderEntries = () => (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Entries ({filteredEntries.length})</h2>
        <div className={styles.headerActions}>
          {bulkMode && selected.size > 0 && (
            <div className={styles.bulkBar}>
              <span className={styles.bulkCount}>{selected.size} selected</span>
              <select className={styles.select} onChange={e => bulkAssign(e.target.value)} defaultValue="">
                <option value="" disabled>Assign judge</option>
                {judges.map(j => <option key={j.id} value={j.id}>{j.full_name || j.email}</option>)}
              </select>
              <select className={styles.select} onChange={e => bulkStatus(e.target.value)} defaultValue="">
                <option value="" disabled>Set status</option>
                <option value="shortlisted">Shortlist</option>
                <option value="finalist">Finalist</option>
                <option value="submitted">Reset to Submitted</option>
              </select>
              <button className={styles.filterBtn} onClick={() => { setSelected(new Set()); setBulkMode(false) }}>Cancel</button>
            </div>
          )}
          <button className={styles.filterBtn} onClick={() => { setBulkMode(!bulkMode); if (bulkMode) setSelected(new Set()) }}>
            {bulkMode ? 'Exit Bulk' : 'Bulk Select'}
          </button>
          <input className={styles.searchInput} placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btnPrimary" onClick={() => {
            const csv = [['Ref','Entrant Name','Entrant Email','Category','Poem (first line)','Score','Status'].join(',')].concat(
              entriesWithMeta.map(e => [
                `FS-${e.submitted_at?.substring(0, 4) || '2026'}-${e.id.substring(0, 4)}`,
                `"${(e.profiles?.full_name || '').replace(/"/g, '""')}"`,
                `"${(e.profiles?.email || '').replace(/"/g, '""')}"`,
                e.category,
                `"${(e.poem_text || '').split('\n')[0].replace(/"/g, '""')}"`,
                e.avgScore,
                e.status || 'submitted',
              ].join(','))
            ).join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = `entries-${new Date().toISOString().substring(0, 10)}.csv`; a.click()
            URL.revokeObjectURL(url)
            toast('CSV downloaded')
          }} style={{ fontSize: 'var(--fs-caption)', padding: '0.5rem 1rem' }}>Download CSV</button>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {bulkMode && <th><input type="checkbox" checked={selected.size === filteredEntries.length && filteredEntries.length > 0} onChange={toggleAll} /></th>}
              <th className={styles.sortTh} onClick={() => toggleSort('entrant')}>Entrant{sortIcon('entrant')}</th>
              <th className={styles.sortTh} onClick={() => toggleSort('poemTitle')}>Poem{sortIcon('poemTitle')}</th>
              <th className={styles.sortTh} onClick={() => toggleSort('category')}>Cat{sortIcon('category')}</th>
              <th className={styles.sortTh} onClick={() => toggleSort('avgScore')}>Score{sortIcon('avgScore')}</th>
              <th className={styles.sortTh} onClick={() => toggleSort('status')}>Status{sortIcon('status')}</th>
              <th>Judge</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map(e => (
              <tr key={e.id} className={e.status === 'withdrawn' ? styles.withdrawnRow : ''}>
                {bulkMode && <td><input type="checkbox" checked={selected.has(e.id)} onChange={() => toggleSelect(e.id)} /></td>}
                <td>
                  <div className={styles.entrantInfo}>
                    <span className={styles.entrantName}>{e.profiles?.full_name || '—'}</span>
                    <span className={styles.entrantEmail}>{e.profiles?.email || '—'}</span>
                  </div>
                </td>
                <td className={styles.poemPreview} onClick={() => setDetailEntry(e)} style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'var(--color-cream)' }}>
                  {e.poemTitle}
                </td>
                <td><span className={styles.catBadge}>{e.category}</span></td>
                <td className={styles.scoreCell}>{e.avgScore}</td>
                <td><span className={`${styles.statusBadge} ${e.status === 'shortlisted' ? styles.s_shortlisted : ''} ${e.status === 'finalist' ? styles.s_finalist : ''} ${e.status === 'withdrawn' ? styles.s_withdrawn : ''}`}>{e.status}</span></td>
                <td>
                  <select className={styles.select} onChange={ev => assignJudge(e.id, ev.target.value)} defaultValue="">
                    <option value="" disabled>Assign judge</option>
                    {judges.map(j => <option key={j.id} value={j.id}>{j.full_name || j.email}</option>)}
                  </select>
                  {e.judgeNames && <div className={styles.assignedJudge}>{e.judgeNames}</div>}
                </td>
                <td>
                  <div className={styles.actionCell}>
                    <select className={styles.select} onChange={ev => updateEntryStatus(e.id, ev.target.value)} defaultValue="">
                      <option value="" disabled>Set status</option>
                      <option value="shortlisted">Shortlist</option>
                      <option value="finalist">Finalist</option>
                      <option value="submitted">Reset to Submitted</option>
                    </select>
                    <button className={styles.withdrawBtn} onClick={() => setShowWithdraw(e)} title="Withdraw entry"><Icon name="x" size={12} strokeWidth={2.5} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredEntries.length === 0 && <tr><td colSpan={bulkMode ? 8 : 7} className={styles.empty}>No entries found.</td></tr>}
          </tbody>
        </table>
      </div>

      {detailEntry && (
        <div className={styles.overlay} onClick={() => setDetailEntry(null)}>
          <div className={styles.detailPanel} onClick={e => e.stopPropagation()}>
            <button className={styles.detailClose} onClick={() => setDetailEntry(null)}><Icon name="x" size={18} strokeWidth={2} /></button>
            <h2 className={styles.detailTitle}>Entry Detail</h2>
            <div className={styles.detailGrid}>
              <div className={styles.detailField}>
                <label>Entrant</label>
                <span>{detailEntry.profiles?.full_name || '—'} ({detailEntry.profiles?.email || '—'})</span>
              </div>
              <div className={styles.detailField}>
                <label>Category</label>
                <span>{detailEntry.category}</span>
              </div>
              <div className={styles.detailField}>
                <label>Status</label>
                <span>{detailEntry.status}</span>
              </div>
              <div className={styles.detailField}>
                <label>Score</label>
                <span>{detailEntry.scores?.length ? `${detailEntry.scores.map(s => s.score).join(', ')} (avg ${(detailEntry.scores.reduce((a, s) => a + s.score, 0) / detailEntry.scores.length).toFixed(1)})` : 'Not yet scored'}</span>
              </div>
              <div className={styles.detailField}>
                <label>Submitted</label>
                <span>{new Date(detailEntry.submitted_at).toLocaleString()}</span>
              </div>
            </div>
            <div className={styles.detailBody}>
              <h3>Poem</h3>
              <p>{detailEntry.poem_text}</p>
              {detailEntry.voice_reflection && (
                <>
                  <h3>Voice Reflection</h3>
                  <p className={styles.detailVoice}>{detailEntry.voice_reflection}</p>
                </>
              )}
              {detailEntry.video_link && (
                <p><a href={detailEntry.video_link.startsWith('http') ? detailEntry.video_link : `https://${detailEntry.video_link}`} target="_blank" rel="noreferrer">Watch video →</a></p>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!showWithdraw}
        title="Withdraw Entry"
        onConfirm={withdrawEntry}
        onCancel={() => { setShowWithdraw(null) }}
        confirmLabel="Withdraw"
        danger
      >
        Withdraw the entry from {showWithdraw?.profiles?.full_name || 'this entrant'}? This marks it as withdrawn.
      </ConfirmModal>
    </>
  )

  const renderJudges = () => (
    <div className={styles.dualCol}>
      <div className={styles.section}>
        <h2>Judges ({judges.length})</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Name</th><th>Email</th><th>Scored</th></tr></thead>
            <tbody>
              {judgeActivity.map(j => (
                <tr key={j.id}>
                  <td className={styles.judgeName}>{j.full_name || '—'}</td>
                  <td>{j.email}</td>
                  <td><span className={styles.scoredCount}>{j.scored}</span></td>
                </tr>
              ))}
              {judgeActivity.length === 0 && <tr><td colSpan="3" className={styles.empty}>No judges.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Create Judge</h2>
        {judgeFormMsg && <p className={judgeFormMsg.includes('created') ? styles.success : styles.error}>{judgeFormMsg}</p>}
        <form onSubmit={createJudge} className={styles.judgeForm}>
          <input placeholder="Full Name" value={judgeForm.name} onChange={e => setJudgeForm({ ...judgeForm, name: e.target.value })} className={styles.input} />
          <input type="email" placeholder="Email" value={judgeForm.email} onChange={e => setJudgeForm({ ...judgeForm, email: e.target.value })} className={styles.input} />
          <PasswordInput placeholder="Password" value={judgeForm.password} onChange={e => setJudgeForm({ ...judgeForm, password: e.target.value })} />
          <button type="submit" className="btnPrimary">Create Judge</button>
        </form>
      </div>
    </div>
  )

  const renderPhases = () => (
    <div className={styles.dualCol}>
      <div className={styles.section}>
        <h2>Phase Timeline</h2>
        <div className={styles.timeline}>
          {['open', 'judging', 'shortlisted', 'finalists', 'closed'].map(p => {
            const hist = phaseHistory.find(h => h.phase === p)
            return (
              <div key={p} className={`${styles.tlItem} ${hist ? styles.tlDone : ''} ${p === currentPhase ? styles.tlCurrent : ''}`}>
                <div className={styles.tlDot}>{hist ? '✓' : '○'}</div>
                <div className={styles.tlContent}>
                  <span className={styles.tlPhase}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                  {hist && <span className={styles.tlDate}>{new Date(hist.phase_started).toLocaleDateString()}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Advance Phase</h2>
        <p className={styles.phaseDesc}>Move the competition to the next stage. Each phase locks the previous actions.</p>
        <div className={styles.phaseGrid}>
          {['open', 'judging', 'shortlisted', 'finalists', 'closed'].map(p => (
            <button key={p} className={p === currentPhase ? styles.phaseBtnActive : styles.phaseBtn} onClick={() => changePhase(p)} disabled={p === currentPhase}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderLogs = () => (
    <div className={styles.section}>
      <h2>Email Logs</h2>
      <p className={styles.sectionDesc}>Recent emails sent by the system, ordered by send time.</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Recipient</th><th>Type</th><th>Status</th><th>Sent</th></tr></thead>
          <tbody>
            {emailLogs.map(l => (
              <tr key={l.id}>
                <td>{l.recipient}</td>
                <td><span className={styles.emailType}>{l.email_type}</span></td>
                <td><span className={l.status === 'sent' ? styles.success : styles.error}>{l.status}</span></td>
                <td className={styles.dateCell}>{new Date(l.sent_at).toLocaleString()}</td>
              </tr>
            ))}
            {emailLogs.length === 0 && <tr><td colSpan="4" className={styles.empty}>No email logs.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SparkMark />
        <CompetitionBanner compact />
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>Admin</h1>
            <p className={styles.email}>{profile?.email}</p>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className={styles.tabNav}>
          {tabNav.map(t => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} size={14} className={styles.tabIcon} />
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'overview' && renderOverview()}
        {tab === 'entries' && renderEntries()}
        {tab === 'judges' && renderJudges()}
        {tab === 'phases' && renderPhases()}
        {tab === 'logs' && renderLogs()}
      </div>
    </div>
  )
}
