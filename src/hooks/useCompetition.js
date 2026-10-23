import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

// Canonical 2026 timeline. Keep these dates aligned with the copy in
// src/lib/siteSettings.js and the site pages:
//   entries close 30 Oct 2026 → shortlist November → videos late November
//   → Creative-Tech Lab early December → grand final December.
// Each phase counts down to the next milestone.
const PHASES = {
  open: { date: '2026-10-30', label: 'entries close' },
  judging: { date: '2026-11-15', label: 'the shortlist is announced' },
  shortlisted: { date: '2026-11-25', label: 'performance videos are due' },
  finalists: { date: '2026-12-19', label: 'the grand final' },
  closed: null,
}

export function useCompetition() {
  const [phase, setPhase] = useState('open')
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, target: '', label: '' })
  const [loading, setLoading] = useState(true)
  const cleanupRef = useRef(null)

  const calcCountdown = useCallback((currentPhase) => {
    if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null }
    const milestone = PHASES[currentPhase]
    if (!milestone) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, target: '', label: '' })
      return
    }
    const targetDate = milestone.date
    const label = milestone.label
    const target = new Date(targetDate + 'T23:59:59')

    const tick = () => {
      const now = new Date()
      const diff = target - now
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, target: targetDate, label })
        return
      }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        target: targetDate,
        label,
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    cleanupRef.current = () => clearInterval(interval)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('rounds')
        .select('phase')
        .order('phase_started', { ascending: false })
        .limit(1)
        .maybeSingle()
      const currentPhase = data?.phase || 'open'
      setPhase(currentPhase)
      calcCountdown(currentPhase)
    } catch {
      calcCountdown('open')
    }
    setLoading(false)
  }, [calcCountdown])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch is async; state updates after the response
    refresh()
    return () => { if (cleanupRef.current) cleanupRef.current() }
  }, [refresh])

  return { phase, countdown, loading, refresh }
}
