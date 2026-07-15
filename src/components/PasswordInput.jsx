import { useState } from 'react'
import Icon from './Icon'
import styles from './PasswordInput.module.css'

export default function PasswordInput({ value, onChange, placeholder, id, autoComplete }) {
  const [show, setShow] = useState(false)

  return (
    <div className={styles.wrapper}>
      <input
        type={show ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={styles.input}
      />
      <button type="button" className={styles.toggle} onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
        <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
      </button>
    </div>
  )
}
