import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../lib/toast'
import { SETTING_GROUPS, SETTING_DEFAULTS } from '../../lib/siteSettings'
import Skeleton from '../../components/Skeleton'
import Icon from '../../components/Icon'
import styles from './AdminDashboard.module.css'

export default function SiteContent() {
  const toast = useToast()
  const [values, setValues] = useState({ ...SETTING_DEFAULTS })
  const [saved, setSaved] = useState({ ...SETTING_DEFAULTS })
  const [loading, setLoading] = useState(true)
  const [savingGroup, setSavingGroup] = useState(null)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .then(({ data, error }) => {
        if (error) {
          toast('Could not load site content', 'error')
        } else if (data) {
          const next = { ...SETTING_DEFAULTS }
          for (const row of data) {
            if (row.key in next) next[row.key] = row.value
          }
          setValues(next)
          setSaved(next)
        }
        setLoading(false)
      })
  }, [])

  const setVal = (key, v) => setValues((prev) => ({ ...prev, [key]: v }))

  const groupDirty = (group) => group.keys.some((k) => values[k.key] !== saved[k.key])

  const handleSaveGroup = async (group) => {
    setSavingGroup(group.id)
    const rows = group.keys.map((k) => ({ key: k.key, value: values[k.key] }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    setSavingGroup(null)
    if (error) {
      toast(error.message, 'error')
      return
    }
    setSaved((prev) => {
      const next = { ...prev }
      for (const k of group.keys) next[k.key] = values[k.key]
      return next
    })
    toast(`${group.label} saved — live on the site now`)
  }

  const handleResetKey = async (k) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: k.key, value: k.def }, { onConflict: 'key' })
    if (error) {
      toast(error.message, 'error')
      return
    }
    setValues((prev) => ({ ...prev, [k.key]: k.def }))
    setSaved((prev) => ({ ...prev, [k.key]: k.def }))
    toast(`${k.label} reset to default`)
  }

  if (loading) return <Skeleton width="100%" height="40vh" />

  return (
    <div>
      <p className={styles.sectionDesc}>
        Edit the words, dates, prizes and links on the prize site yourself. Changes go
        live immediately. Anything you clear falls back to the original copy, so a
        mistake can never blank the page.
      </p>
      {SETTING_GROUPS.map((group) => (
        <div key={group.id} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>
              {group.label}
              {groupDirty(group) && <span className={styles.unsavedDot} title="Unsaved changes" />}
            </h2>
            <Link to={group.page} target="_blank" rel="noreferrer" className={styles.viewPageLink}>
              View page <Icon name="arrowRight" size={14} />
            </Link>
          </div>
          {group.keys.map((k) => (
            <div key={k.key} className={styles.contentField}>
              <label className={styles.contentLabel}>
                {k.label}
                {values[k.key] !== k.def && <span className={styles.customBadge}>custom</span>}
              </label>
              {k.type === 'textarea' ? (
                <textarea
                  className={styles.input}
                  rows={3}
                  value={values[k.key] ?? ''}
                  onChange={(e) => setVal(k.key, e.target.value)}
                />
              ) : k.type === 'toggle' ? (
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${values[k.key] ? styles.toggleOn : ''}`}
                  onClick={() => setVal(k.key, !values[k.key])}
                >
                  {values[k.key] ? 'On' : 'Off'}
                </button>
              ) : (
                <input
                  className={styles.input}
                  type={k.type === 'url' ? 'url' : 'text'}
                  value={values[k.key] ?? ''}
                  onChange={(e) => setVal(k.key, e.target.value)}
                />
              )}
              {values[k.key] !== k.def && (
                <button type="button" className={styles.resetLink} onClick={() => handleResetKey(k)}>
                  Reset to default
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btnPrimary"
            disabled={!groupDirty(group) || savingGroup === group.id}
            onClick={() => handleSaveGroup(group)}
          >
            {savingGroup === group.id ? 'Saving…' : `Save ${group.label}`}
          </button>
        </div>
      ))}
    </div>
  )
}
