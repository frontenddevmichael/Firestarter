import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext()

let nextId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const toast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++nextId
    setToasts(t => [...t, { id, message, type }])
    timers.current[id] = setTimeout(() => remove(id), duration)
    return id
  }, [remove])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => remove(t.id)}>
            <span className="toast-icon">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="toast-message">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
