import { useState } from 'react'
import { useAuth } from '../../lib/auth'
import PasswordInput from '../../components/PasswordInput'
import SparkMark from '../../components/SparkMark'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styles from './ResetPassword.module.css'

export default function ResetPassword() {
  const { resetPassword, updatePassword } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isRecovery = !!searchParams.get('type') || window.location.hash.includes('type=recovery')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    const { error } = await resetPassword(email)
    if (error) setMsg(error.message)
    else setMsg('Check your email for a reset link.')
    setLoading(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    if (password.length < 6) { setMsg('Password must be at least 6 characters'); setLoading(false); return }
    const { error } = await updatePassword(password)
    if (error) setMsg(error.message)
    else { setMsg('Password updated successfully.'); setTimeout(() => navigate('/prize/enter'), 2000) }
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <SparkMark />
        <h1 className={styles.title}>{isRecovery ? 'Set New Password' : 'Reset Password'}</h1>
        <form onSubmit={isRecovery ? handleUpdate : handleReset} className={styles.form}>
          {isRecovery ? (
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>New Password</label>
              <PasswordInput id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter new password" autoComplete="new-password" />
            </div>
          ) : (
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder="Enter your email" required />
            </div>
          )}
          {msg && <p className={msg.includes('success') || msg.includes('updated') || msg.includes('Check') ? styles.success : styles.error}>{msg}</p>}
          <button type="submit" className="btnPrimary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Please wait...' : isRecovery ? 'Update Password' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  )
}
