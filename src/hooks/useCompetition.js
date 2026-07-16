import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const KEY_DATES = {
  '2026-07-15': 'Competition opens',
  '2026-09-30': 'Submissions close',
  '2026-10-15': 'Shortlist announced',
  '2026-10-31': 'Finalists announced',
  '2026-11-15': 'Awards ceremony',
}

const PHASE_MILESTONES = {
  open: '2026-09-30',
  judging: '2026-10-15',
  shortlisted: '2026-10-31',
  finalists: '2026-11-15',
  closed: null,
}

export function useCompetition() {
  const [phase, setPhase] = useState('open')
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, target: '', label: '' })
  const [loading, setLoading] = useState(true)

  const calcCountdown = useCallback((currentPhase) => {
    const targetDate = PHASE_MILESTONES[currentPhase]
    if (!targetDate) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, target: '', label: '' })
      return
    }
    const target = new Date(targetDate + 'T23:59:59')
    let label = ''
    for (const [d, l] of Object.entries(KEY_DATES)) {
      if (d === targetDate) { label = l; break }
    }

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
    return () => clearInterval(interval)
  }, [])

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from('rounds')
      .select('phase')
      .order('phase_started', { ascending: false })
      .limit(1)
      .single()
    const currentPhase = data?.phase || 'open'
    setPhase(currentPhase)
    calcCountdown(currentPhase)
    setLoading(false)
  }, [calcCountdown])

  useEffect(() => { refresh() }, [refresh])

  return { phase, countdown, loading, refresh }
}
