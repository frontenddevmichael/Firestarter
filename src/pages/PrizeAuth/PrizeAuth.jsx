import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import PasswordInput from '../../components/PasswordInput'
import SparkMark from '../../components/SparkMark'
import styles from './PrizeAuth.module.css'

export default function PrizeAuth() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/prize/dashboard'

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    if (mode === 'login') {
      const { error, profile } = await signIn(email, password)
      if (error) { setMsg(error.message); setLoading(false); return }
      if (profile?.role === 'admin') navigate('/prize/admin', { replace: true })
      else if (profile?.role === 'judge') navigate('/prize/judge', { replace: true })
      else navigate(from, { replace: true })
    } else {
      if (!name.trim()) { setMsg('Please enter your full name'); setLoading(false); return }
      const captchaToken = window.hcaptcha?.getResponse()
      if (!captchaToken) { setMsg('Please complete the security check'); setLoading(false); return }
      const { error, profile } = await signUp(email, password, name.trim(), captchaToken)
      if (error) { setMsg(error.message); setLoading(false); return }
      if (profile?.role === 'admin') navigate('/prize/admin', { replace: true })
      else if (profile?.role === 'judge') navigate('/prize/judge', { replace: true })
      else if (profile) navigate('/prize/dashboard', { replace: true })
      else setMsg('Check your email for a confirmation link.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <SparkMark />
        <h1 className={styles.title}>{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className={styles.input} placeholder="Enter your full name" />
            </div>
          )}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder="Enter your email" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <PasswordInput id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </div>
          {mode === 'signup' && (
            <div className={styles.field}>
              <div className="h-captcha" data-sitekey="22d4b56e-0c0e-4eaa-8cc4-2e1ca7e4d7bc" />
            </div>
          )}
          {msg && <p className={msg.includes('Check') || msg.includes('successfully') || msg.includes('updated') ? styles.success : styles.error}>{msg}</p>}
          <button type="submit" className="btnPrimary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className={styles.switch}>
          {mode === 'login' ? (
            <>Don't have an account? <button className={styles.linkBtn} onClick={() => { setMode('signup'); setMsg('') }}>Sign up</button></>
          ) : (
            <>Already have an account? <button className={styles.linkBtn} onClick={() => { setMode('login'); setMsg('') }}>Sign in</button></>
          )}
        </p>
        {mode === 'login' && (
          <p className={styles.switch}>
            <button className={styles.linkBtn} onClick={() => navigate('/prize/reset-password')}>Forgot password?</button>
          </p>
        )}
      </div>
    </div>
  )
}
