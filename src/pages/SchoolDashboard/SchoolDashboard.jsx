import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import { useCompetition } from '../../hooks/useCompetition'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import Skeleton from '../../components/Skeleton'
import Icon from '../../components/Icon'
import ConfirmModal from '../../components/ConfirmModal'
import styles from './SchoolDashboard.module.css'

const EMPTY_FORM = {
  id: null,
  full_name: '',
  category: 'junior',
  guardian_name: '',
  guardian_email: '',
  media_choice: '',
  consent_confirmed: false,
  consent_reference: '',
  locked: false,
}

const CSV_HEADERS = [
  'full_name', 'category', 'student_ref', 'guardian_name', 'guardian_email',
  'media_consent', 'media_opt_out', 'consent_confirmed', 'consent_reference',
  'poem_text', 'voice_reflection',
]

function consentOf(student) {
  if (!student) return null
  return Array.isArray(student.school_student_consents)
    ? student.school_student_consents[0]
    : student.school_student_consents
}

function entryOf(student) {
  if (!student) return null
  return Array.isArray(student.entries) ? student.entries[0] : student.entries
}

function statusLabel(status) {
  if (!status) return 'Not started'
  if (status === 'draft') return 'Draft'
  if (status === 'submitted') return 'Submitted'
  if (status === 'shortlisted') return 'Shortlisted'
  if (status === 'finalist') return 'Finalist'
  if (status === 'withdrawn') return 'Withdrawn'
  return status
}

function statusClass(status) {
  if (status === 'draft') return styles.badgeDraft
  if (status === 'submitted') return styles.badgeSubmitted
  if (status === 'shortlisted') return styles.badgeShortlisted
  if (status === 'finalist') return styles.badgeFinalist
  if (status === 'withdrawn') return styles.badgeWithdrawn
  return styles.badgeMuted
}

function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (c !== '\r') {
      field += c
    }
  }
  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter(r => r.some(cell => cell.trim() !== ''))
}

function toBool(value) {
  return ['true', 'yes', '1', 'y', 'consent', 'consented'].includes(String(value || '').trim().toLowerCase())
}

function downloadFile(name, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export default function SchoolDashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const competition = useCompetition()
  const { setting } = useSiteSettings()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'results' ? 'results' : 'students'

  const [school, setSchool] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [studentForm, setStudentForm] = useState(null)
  const [savingStudent, setSavingStudent] = useState(false)
  const [studentError, setStudentError] = useState('')

  const [entryStudent, setEntryStudent] = useState(null)
  const [entryForm, setEntryForm] = useState({ poem_text: '', voice_reflection: '' })
  const [savingEntry, setSavingEntry] = useState(false)
  const [entryError, setEntryError] = useState('')
  const [submitConfirm, setSubmitConfirm] = useState(false)

  const [importOpen, setImportOpen] = useState(false)
  const [importRows, setImportRows] = useState([])
  const [importErrors, setImportErrors] = useState([])
  const [importFileName, setImportFileName] = useState('')
  const [importSubmit, setImportSubmit] = useState(false)
  const [importing, setImporting] = useState(false)

  async function load() {
    if (!user) return
    setLoading(true)
    const { data: member, error: memberError } = await supabase
      .from('school_members')
      .select('school_id, role, schools(id, name, contact_name, contact_email, results_visible)')
      .eq('user_id', user.id)
      .maybeSingle()

    if (memberError || !member) {
      toast('No school is linked to this account.', 'error')
      setLoading(false)
      return
    }

    setSchool(member.schools)

    const [studentsRes, resultsRes] = await Promise.all([
      supabase
        .from('school_students')
        .select('*, school_student_consents(*), entries(*)')
        .eq('school_id', member.school_id)
        .order('full_name'),
      supabase.rpc('school_entry_results'),
    ])

    if (studentsRes.error) {
      toast('Failed to load students. Please try again.', 'error')
    } else {
      const results = Object.fromEntries(
        (resultsRes.data || []).map(row => [row.student_id, row])
      )
      setStudents((studentsRes.data || []).map(s => ({
        ...s,
        consent: consentOf(s),
        entry: entryOf(s),
        result: results[s.id] || null,
      })))
      if (resultsRes.error) toast('Scores could not be loaded. Entry status is still available.', 'error')
    }
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { load() }, [user])

  const stats = useMemo(() => {
    const total = students.length
    const consent = students.filter(s => s.consent?.verified_at).length
    const drafts = students.filter(s => s.entry?.status === 'draft').length
    const submitted = students.filter(s => s.entry && s.entry.status !== 'draft').length
    const scored = students.filter(s => Number(s.result?.score_count) > 0).length
    const scoredRows = students.filter(s => s.result?.average_score != null)
    const average = scoredRows.length
      ? (scoredRows.reduce((sum, s) => sum + Number(s.result.average_score), 0) / scoredRows.length).toFixed(1)
      : '—'
    return { total, consent, drafts, submitted, scored, average }
  }, [students])

  const filteredStudents = useMemo(() => {
    let list = [...students]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(s =>
        s.full_name.toLowerCase().includes(q) ||
        (s.guardian_name || '').toLowerCase().includes(q) ||
        (s.guardian_email || '').toLowerCase().includes(q)
      )
    }
    if (statusFilter === 'consent_missing') list = list.filter(s => !s.consent?.verified_at)
    if (statusFilter === 'draft') list = list.filter(s => s.entry?.status === 'draft')
    if (statusFilter === 'submitted') list = list.filter(s => s.entry && s.entry.status !== 'draft')
    if (statusFilter === 'scored') list = list.filter(s => Number(s.result?.score_count) > 0)
    return list.sort((a, b) => a.full_name.localeCompare(b.full_name))
  }, [students, search, statusFilter])

  const allImportConfirmed = importRows.length > 0 && importRows.every(row => row.consent_confirmed)

  const setTab = (next) => {
    setSearchParams(next === 'results' ? { tab: 'results' } : {})
  }

  function openAddStudent() {
    setStudentError('')
    setStudentForm({ ...EMPTY_FORM })
  }

  function openEditStudent(s) {
    setStudentError('')
    setStudentForm({
      id: s.id,
      full_name: s.full_name,
      category: s.category || 'junior',
      guardian_name: s.guardian_name || s.consent?.guardian_name || '',
      guardian_email: s.guardian_email || s.consent?.guardian_email || '',
      media_choice: s.consent?.media_opt_out ? 'opt_out' : s.consent?.media_consent ? 'consent' : '',
      consent_confirmed: Boolean(s.consent?.verified_at),
      consent_reference: s.consent?.consent_reference || '',
      locked: Boolean(s.consent?.verified_at && s.entry && s.entry.status !== 'draft'),
    })
  }

  async function saveStudent(e) {
    e.preventDefault()
    setStudentError('')
    const form = studentForm
    if (!form.full_name.trim()) { setStudentError('Student name is required.'); return }
    if (form.consent_confirmed && !form.media_choice) {
      setStudentError('Choose the photography/media option from the signed form.')
      return
    }
    if (form.consent_confirmed && !form.guardian_name.trim()) {
      setStudentError('Guardian name is required when confirming consent.')
      return
    }

    setSavingStudent(true)
    const { error } = await supabase.rpc('school_save_student', {
      p_student_id: form.id,
      p_full_name: form.full_name.trim(),
      p_category: form.category,
      p_guardian_name: form.guardian_name.trim(),
      p_guardian_email: form.guardian_email.trim(),
      p_media_consent: form.media_choice === 'consent',
      p_media_opt_out: form.media_choice === 'opt_out',
      p_consent_confirmed: form.consent_confirmed,
      p_consent_reference: form.consent_reference.trim(),
    })
    setSavingStudent(false)

    if (error) {
      setStudentError(error.message || 'Could not save this student.')
      return
    }
    toast(form.id ? 'Student updated.' : 'Student added.')
    setStudentForm(null)
    load()
  }

  function openEntry(s) {
    setEntryError('')
    setEntryStudent(s)
    setEntryForm({
      poem_text: s.entry?.poem_text || '',
      voice_reflection: s.entry?.voice_reflection || '',
    })
  }

  async function saveEntry(status) {
    if (!entryStudent) return
    setEntryError('')
    if (!entryForm.poem_text.trim()) {
      setEntryError('The poem is required.')
      return
    }
    if (status === 'submitted' && !entryStudent.consent?.verified_at) {
      setEntryError('Add signed guardian consent before submitting.')
      return
    }

    setSavingEntry(true)
    const { error } = await supabase
      .from('entries')
      .upsert({
        entrant_id: null,
        school_student_id: entryStudent.id,
        poem_text: entryForm.poem_text.trim(),
        voice_reflection: entryForm.voice_reflection.trim() || null,
        category: entryStudent.category,
        status,
        guardian_consent_verified: Boolean(entryStudent.consent?.verified_at),
        ...(status === 'submitted' ? { submitted_at: new Date().toISOString() } : {}),
      }, { onConflict: 'school_student_id' })
    setSavingEntry(false)

    if (error) {
      setEntryError(error.message || 'Could not save this entry.')
      return
    }
    toast(status === 'submitted' ? 'Poem submitted.' : 'Draft saved.')
    setSubmitConfirm(false)
    setEntryStudent(null)
    load()
  }

  function confirmSubmit() {
    saveEntry('submitted')
  }

  async function handleCsvFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setImportFileName(file.name)
    setImportErrors([])
    setImportRows([])
    const text = (await file.text()).replace(/^\uFEFF/, '')
    const rows = parseCsv(text)
    if (rows.length < 2) {
      setImportErrors(['The CSV needs a header row and at least one student.'])
      return
    }
    const headers = rows[0].map(h => h.trim().toLowerCase())
    const missing = ['full_name', 'poem_text'].filter(h => !headers.includes(h))
    if (missing.length) {
      setImportErrors([`Missing required column(s): ${missing.join(', ')}. Download the template to see the expected format.`])
      return
    }

    const parsed = []
    const errors = []
    rows.slice(1).forEach((cells, index) => {
      const get = (key) => cells[headers.indexOf(key)]?.trim() || ''
      const fullName = get('full_name')
      const poemText = get('poem_text')
      if (!fullName) errors.push(`Row ${index + 2}: student name is missing.`)
      if (!poemText) errors.push(`Row ${index + 2}: poem is missing.`)
      const mediaConsent = toBool(get('media_consent'))
      const mediaOptOut = toBool(get('media_opt_out'))
      if (mediaConsent && mediaOptOut) errors.push(`Row ${index + 2}: choose media consent or opt-out, not both.`)
      const category = (get('category') || 'junior').toLowerCase()
      if (!['junior', 'senior'].includes(category)) errors.push(`Row ${index + 2}: category must be junior or senior.`)
      parsed.push({
        full_name: fullName,
        category,
        student_ref: get('student_ref'),
        guardian_name: get('guardian_name'),
        guardian_email: get('guardian_email'),
        media_consent: mediaConsent,
        media_opt_out: mediaOptOut,
        consent_confirmed: toBool(get('consent_confirmed')),
        consent_reference: get('consent_reference'),
        poem_text: poemText,
        voice_reflection: get('voice_reflection'),
      })
    })
    if (parsed.length > 200) errors.push('Import is limited to 200 students at a time.')
    setImportRows(parsed)
    setImportErrors(errors)
  }

  async function runImport() {
    if (!importRows.length || importErrors.length) return
    if (importSubmit && !allImportConfirmed) {
      toast('Every row needs confirmed consent before submitting immediately.', 'error')
      return
    }
    setImporting(true)
    const { data, error } = await supabase.rpc('school_bulk_import', {
      p_students: importRows,
      p_submit: importSubmit,
    })
    setImporting(false)
    if (error) {
      toast(error.message || 'Import failed. Nothing was saved.', 'error')
      return
    }
    toast(`${data?.imported ?? importRows.length} students imported.`)
    setImportOpen(false)
    setImportRows([])
    setImportErrors([])
    setImportFileName('')
    setImportSubmit(false)
    load()
  }

  function exportStudents() {
    const header = [
      'Student', 'Category', 'Guardian', 'Guardian email', 'Consent',
      'Consent reference', 'Entry status', 'Average score', 'Score count',
      'Feedback', 'Poem (first line)', 'School',
    ]
    const rows = students.map(s => [
      s.full_name,
      s.category,
      s.guardian_name,
      s.guardian_email,
      s.consent?.verified_at ? 'Verified' : 'Missing',
      s.consent?.consent_reference || '',
      statusLabel(s.entry?.status),
      s.result?.average_score ?? '',
      s.result?.score_count ?? 0,
      (s.result?.feedback || []).join(' | '),
      (s.entry?.poem_text || '').split('\n')[0],
      school?.name || '',
    ])
    const csv = [header, ...rows].map(row => row.map(csvEscape).join(',')).join('\n')
    downloadFile(`school-students-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  function downloadTemplate() {
    const sample = CSV_HEADERS.map(h => {
      if (h === 'category') return 'junior'
      if (h === 'media_consent' || h === 'consent_confirmed') return 'true'
      if (h === 'media_opt_out') return 'false'
      if (h === 'full_name') return 'Student Name'
      if (h === 'poem_text') return 'The poem text'
      if (h === 'voice_reflection') return 'What the poem is about'
      if (h === 'guardian_name') return 'Guardian Name'
      if (h === 'guardian_email') return 'guardian@example.com'
      if (h === 'consent_reference') return 'Signed form 2026-11-01'
      return ''
    })
    downloadFile('school-student-import-template.csv', [CSV_HEADERS, sample].map(r => r.map(csvEscape).join(',')).join('\n'))
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Skeleton width="100%" height="60vh" />
        </div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h1>School portal</h1>
            <p>No school is linked to this account. Please contact the organizer.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>School Portal</p>
            <h1 className={styles.title}>{school.name}</h1>
            <p className={styles.subtitle}>
              {school.contact_name || 'School account'}
              {school.contact_email ? ` · ${school.contact_email}` : ''}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button type="button" className="btnPrimary" onClick={openAddStudent}>
              <Icon name="plus" size={14} /> Add student
            </button>
            <button type="button" className={styles.filterBtn} onClick={() => setImportOpen(true)}>
              Import CSV
            </button>
            <button type="button" className={styles.filterBtn} onClick={exportStudents}>
              Export CSV
            </button>
          </div>
        </header>

        <div className={styles.deadlineBanner}>
          <div>
            <strong>Entries close {setting('dates.deadline_full', 'Sunday, 15 November 2026, 11:59 PM (WAT)')}.</strong>
            <span> Add students, record signed consent, and submit their poems before the deadline.</span>
          </div>
          {competition.countdown?.target && (
            <span className={styles.countdown}>
              {competition.countdown.days}d {competition.countdown.hours}h left
            </span>
          )}
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}><span className={styles.statValue}>{stats.total}</span><span className={styles.statLabel}>Students</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{stats.consent}</span><span className={styles.statLabel}>Consent on file</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{stats.drafts}</span><span className={styles.statLabel}>Drafts</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{stats.submitted}</span><span className={styles.statLabel}>Submitted</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{stats.scored}</span><span className={styles.statLabel}>Scored</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{stats.average}</span><span className={styles.statLabel}>Average score</span></div>
        </div>

        <nav className={styles.tabs} aria-label="School portal sections">
          <button type="button" className={`${styles.tab} ${tab === 'students' ? styles.tabActive : ''}`} onClick={() => setTab('students')}>
            Students ({students.length})
          </button>
          <button type="button" className={`${styles.tab} ${tab === 'results' ? styles.tabActive : ''}`} onClick={() => setTab('results')}>
            Results
          </button>
        </nav>

        {tab === 'students' ? (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Student roster</h2>
              <div className={styles.tableFilters}>
                <input className={styles.searchInput} type="search" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All students</option>
                  <option value="consent_missing">Consent missing</option>
                  <option value="draft">Drafts</option>
                  <option value="submitted">Submitted</option>
                  <option value="scored">Scored</option>
                </select>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Consent</th>
                    <th>Entry</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className={styles.studentCell}>
                          <span className={styles.studentName}>{s.full_name}</span>
                          <span className={styles.studentMeta}>
                            {s.guardian_name || 'Guardian not recorded'}
                            {s.guardian_email ? ` · ${s.guardian_email}` : ''}
                          </span>
                        </div>
                      </td>
                      <td><span className={styles.catBadge}>{s.category}</span></td>
                      <td>
                        <span className={`${styles.badge} ${s.consent?.verified_at ? styles.badgeOk : styles.badgeWarn}`} title={s.consent?.consent_reference || ''}>
                          {s.consent?.verified_at ? 'On file' : 'Missing'}
                        </span>
                      </td>
                      <td><span className={`${styles.badge} ${statusClass(s.entry?.status)}`}>{statusLabel(s.entry?.status)}</span></td>
                      <td className={styles.score}>{s.result?.average_score != null ? s.result.average_score : '—'}</td>
                      <td>
                        <div className={styles.rowActions}>
                          <button type="button" className={styles.rowBtn} onClick={() => openEntry(s)}>
                            <Icon name={s.entry?.status && s.entry.status !== 'draft' ? 'eye' : 'fileText'} size={13} />
                            {s.entry?.status === 'draft' ? 'Continue' : s.entry ? 'View' : 'Start poem'}
                          </button>
                          <button type="button" className={styles.rowBtnMuted} onClick={() => openEditStudent(s)}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr><td colSpan={6} className={styles.empty}>No students match this view.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Results &amp; feedback</h2>
                <p className={styles.sectionDesc}>Scores and feedback for your students. Judge names are not shown.</p>
              </div>
            </div>
            {!school.results_visible && (
              <div className={styles.notice}>Scores are currently hidden by the organizer. Entry status is still shown.</div>
            )}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Average</th>
                    <th>Scores</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className={styles.studentCell}>
                          <span className={styles.studentName}>{s.full_name}</span>
                          <span className={styles.studentMeta}>{s.category}</span>
                        </div>
                      </td>
                      <td><span className={`${styles.badge} ${statusClass(s.entry?.status)}`}>{statusLabel(s.entry?.status)}</span></td>
                      <td className={styles.score}>{s.result?.average_score != null ? s.result.average_score : '—'}</td>
                      <td>{s.result?.score_count ?? 0}</td>
                      <td>
                        {s.result?.feedback?.length ? (
                          <ul className={styles.feedbackList}>
                            {s.result.feedback.map((note, i) => <li key={i}>{note}</li>)}
                          </ul>
                        ) : <span className={styles.muted}>Not scored yet</span>}
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan={5} className={styles.empty}>Add students to see results here.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {studentForm && (
        <div className={styles.overlay} onClick={() => setStudentForm(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{studentForm.id ? 'Edit student' : 'Add student'}</h2>
              <button type="button" className={styles.modalClose} onClick={() => setStudentForm(null)} aria-label="Close"><Icon name="x" size={18} /></button>
            </div>
            <form onSubmit={saveStudent} className={styles.form}>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Full name</span>
                  <input className={styles.input} value={studentForm.full_name} onChange={e => setStudentForm(f => ({ ...f, full_name: e.target.value }))} required />
                </label>
                <label className={styles.field}>
                  <span>Category</span>
                  <select className={styles.input} value={studentForm.category} onChange={e => setStudentForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Guardian name</span>
                  <input className={styles.input} value={studentForm.guardian_name} onChange={e => setStudentForm(f => ({ ...f, guardian_name: e.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>Guardian email</span>
                  <input className={styles.input} type="email" value={studentForm.guardian_email} onChange={e => setStudentForm(f => ({ ...f, guardian_email: e.target.value }))} />
                </label>
              </div>

              <div className={styles.consentBox}>
                <div className={styles.consentHead}>
                  <strong>Participant commitment &amp; parental consent</strong>
                  <Link to="/prize/consent-form" target="_blank" rel="noopener noreferrer" className={styles.formLink}>Read the form</Link>
                </div>
                <p className={styles.help}>Record the signed form your school holds for this student. This unlocks submission.</p>
                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={studentForm.consent_confirmed}
                    disabled={studentForm.locked}
                    onChange={e => setStudentForm(f => ({ ...f, consent_confirmed: e.target.checked }))}
                  />
                  <span>I confirm a signed Participant Commitment &amp; Parental Consent form is on file for this student.</span>
                </label>
                <div className={styles.radioGroup} role="radiogroup" aria-label="Photography and media consent">
                  <label>
                    <input
                      type="radio"
                      name="media_choice"
                      value="consent"
                      checked={studentForm.media_choice === 'consent'}
                      disabled={studentForm.locked}
                      onChange={e => setStudentForm(f => ({ ...f, media_choice: e.target.value }))}
                    />
                    <span>Photography/media consent</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="media_choice"
                      value="opt_out"
                      checked={studentForm.media_choice === 'opt_out'}
                      disabled={studentForm.locked}
                      onChange={e => setStudentForm(f => ({ ...f, media_choice: e.target.value }))}
                    />
                    <span>Opt out of photography/media</span>
                  </label>
                </div>
                <label className={styles.field}>
                  <span>Consent reference <span className={styles.helpInline}>(date, folder or form number)</span></span>
                  <input className={styles.input} value={studentForm.consent_reference} disabled={studentForm.locked} onChange={e => setStudentForm(f => ({ ...f, consent_reference: e.target.value }))} placeholder="e.g. signed form 2026-11-01" />
                </label>
                {studentForm.locked && <p className={styles.lockedNote}>Consent is locked because this student’s poem has been submitted. Contact the organizer to change it.</p>}
              </div>

              {studentError && <p className={styles.error}>{studentError}</p>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnOutline} onClick={() => setStudentForm(null)}>Cancel</button>
                <button type="submit" className="btnPrimary" disabled={savingStudent}>{savingStudent ? 'Saving…' : 'Save student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {entryStudent && (
        <div className={styles.overlay} onClick={() => !savingEntry && setEntryStudent(null)}>
          <div className={`${styles.modal} ${styles.entryModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{entryStudent.full_name}</h2>
                <p className={styles.modalSub}>{entryStudent.category} · {statusLabel(entryStudent.entry?.status)}</p>
              </div>
              <button type="button" className={styles.modalClose} onClick={() => setEntryStudent(null)} aria-label="Close"><Icon name="x" size={18} /></button>
            </div>

            {entryStudent.entry && entryStudent.entry.status !== 'draft' ? (
              <div className={styles.readOnly}>
                {entryStudent.consent?.verified_at ? (
                  <div className={styles.noticeOk}>Consent on file{entryStudent.consent.consent_reference ? ` · ${entryStudent.consent.consent_reference}` : ''}</div>
                ) : (
                  <div className={styles.notice}>Consent is not recorded.</div>
                )}
                <div className={styles.resultStrip}>
                  <div><span className={styles.resultLabel}>Status</span><strong>{statusLabel(entryStudent.entry.status)}</strong></div>
                  <div><span className={styles.resultLabel}>Average</span><strong>{entryStudent.result?.average_score ?? '—'}</strong></div>
                  <div><span className={styles.resultLabel}>Scores</span><strong>{entryStudent.result?.score_count ?? 0}</strong></div>
                </div>
                <h3>Poem</h3>
                <p className={styles.poemText}>{entryStudent.entry.poem_text}</p>
                {entryStudent.entry.voice_reflection && (
                  <>
                    <h3>Voice reflection</h3>
                    <p className={styles.reflection}>{entryStudent.entry.voice_reflection}</p>
                  </>
                )}
                <h3>Feedback</h3>
                {entryStudent.result?.feedback?.length ? (
                  <ul className={styles.feedbackList}>
                    {entryStudent.result.feedback.map((note, i) => <li key={i}>{note}</li>)}
                  </ul>
                ) : <p className={styles.muted}>No feedback yet.</p>}
              </div>
            ) : (
              <>
                {entryStudent.consent?.verified_at ? (
                  <div className={styles.noticeOk}>Consent on file{entryStudent.consent.consent_reference ? ` · ${entryStudent.consent.consent_reference}` : ''}. You can submit when the poem is ready.</div>
                ) : (
                  <div className={styles.notice}>Add signed guardian consent before submitting. You can still save a draft now.</div>
                )}
                <label className={styles.field}>
                  <span>Poem <span className={styles.helpInline}>(up to 40 lines)</span></span>
                  <textarea className={styles.textarea} rows={12} value={entryForm.poem_text} onChange={e => setEntryForm(f => ({ ...f, poem_text: e.target.value }))} />
                  <span className={styles.help}>{entryForm.poem_text.split('\n').length} line(s)</span>
                </label>
                <label className={styles.field}>
                  <span>Voice reflection <span className={styles.helpInline}>(3–5 sentences)</span></span>
                  <textarea className={styles.textarea} rows={4} value={entryForm.voice_reflection} onChange={e => setEntryForm(f => ({ ...f, voice_reflection: e.target.value }))} />
                </label>
                {entryError && <p className={styles.error}>{entryError}</p>}
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnOutline} onClick={() => setEntryStudent(null)} disabled={savingEntry}>Cancel</button>
                  <button type="button" className={styles.btnOutline} onClick={() => saveEntry('draft')} disabled={savingEntry}>{savingEntry ? 'Saving…' : 'Save draft'}</button>
                  <button type="button" className="btnPrimary" onClick={() => setSubmitConfirm(true)} disabled={savingEntry || !entryStudent.consent?.verified_at}>Submit poem</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {importOpen && (
        <div className={styles.overlay} onClick={() => !importing && setImportOpen(false)}>
          <div className={`${styles.modal} ${styles.importModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Import students from CSV</h2>
                <p className={styles.modalSub}>Each row creates one student, one consent record and one poem entry.</p>
              </div>
              <button type="button" className={styles.modalClose} onClick={() => setImportOpen(false)} disabled={importing} aria-label="Close"><Icon name="x" size={18} /></button>
            </div>
            <div className={styles.importBody}>
              <p className={styles.help}>Required columns: <code>full_name</code>, <code>poem_text</code>. Optional: category, guardian_name, guardian_email, media_consent, media_opt_out, consent_confirmed, consent_reference, voice_reflection, student_ref.</p>
              <div className={styles.importActions}>
                <button type="button" className={styles.btnOutline} onClick={downloadTemplate}>Download template</button>
                <label className={styles.fileLabel}>
                  Choose CSV
                  <input type="file" accept=".csv,text/csv" onChange={handleCsvFile} hidden />
                </label>
                {importFileName && <span className={styles.fileName}>{importFileName}</span>}
              </div>
              {importErrors.length > 0 && (
                <div className={styles.errorBox}>
                  <strong>Fix these before importing:</strong>
                  <ul>{importErrors.map((err, i) => <li key={i}>{err}</li>)}</ul>
                </div>
              )}
              {importRows.length > 0 && importErrors.length === 0 && (
                <>
                  <p className={styles.help}>{importRows.length} student{importRows.length === 1 ? '' : 's'} ready to import. Preview:</p>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead><tr><th>Name</th><th>Category</th><th>Consent</th><th>Poem</th></tr></thead>
                      <tbody>
                        {importRows.slice(0, 5).map((row, i) => (
                          <tr key={i}>
                            <td>{row.full_name}</td>
                            <td>{row.category}</td>
                            <td>{row.consent_confirmed ? 'On file' : 'Missing'}</td>
                            <td className={styles.poemPreview}>{row.poem_text.split('\n')[0]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <label className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={importSubmit}
                      disabled={!allImportConfirmed}
                      onChange={e => setImportSubmit(e.target.checked && allImportConfirmed)}
                    />
                    <span>Submit these poems immediately. Only available when every row has <code>consent_confirmed=true</code>.</span>
                  </label>
                  <p className={styles.help}>If you leave this unchecked, the poems are saved as drafts for review.</p>
                </>
              )}
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btnOutline} onClick={() => setImportOpen(false)} disabled={importing}>Cancel</button>
              <button type="button" className="btnPrimary" onClick={runImport} disabled={importing || !importRows.length || importErrors.length > 0}>
                {importing ? 'Importing…' : `Import ${importRows.length || ''} student${importRows.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={submitConfirm}
        title="Submit this poem?"
        confirmLabel={savingEntry ? 'Submitting…' : 'Submit poem'}
        confirmDisabled={savingEntry}
        onCancel={() => setSubmitConfirm(false)}
        onConfirm={confirmSubmit}
      >
        {entryStudent ? `Submit ${entryStudent.full_name}'s poem? It cannot be edited after submission.` : ''}
      </ConfirmModal>
    </div>
  )
}
