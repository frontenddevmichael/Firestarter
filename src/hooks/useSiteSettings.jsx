import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { SETTING_DEFAULTS } from '../lib/siteSettings'

// Module-level cache shared across all hook users.
let cache = null
let cacheAt = 0
let inflight = null
const STALE_MS = 60 * 1000

async function loadAll() {
  if (cache && Date.now() - cacheAt < STALE_MS) return cache
  if (inflight) return inflight
  inflight = supabase
    .from('site_settings')
    .select('key, value')
    .then(({ data }) => {
      const next = { ...SETTING_DEFAULTS }
      if (data) {
        for (const row of data) {
          if (row.key in SETTING_DEFAULTS) next[row.key] = row.value
        }
      }
      cache = next
      cacheAt = Date.now()
      inflight = null
      return next
    })
    .catch(() => {
      inflight = null
      return cache || { ...SETTING_DEFAULTS }
    })
  return inflight
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(cache || { ...SETTING_DEFAULTS })

  useEffect(() => {
    let live = true
    loadAll().then((s) => {
      if (live) setSettings(s)
    })
    return () => { live = false }
  }, [])

  const setting = useCallback(
    (key, fallback) => {
      if (key in settings) return settings[key]
      if (fallback !== undefined) return fallback
      return SETTING_DEFAULTS[key]
    },
    [settings],
  )

  return { settings, setting }
}
