import { useState } from 'react'
import type { FormEvent } from 'react'

type FieldName = 'nome' | 'email' | 'whatsapp'

const EMAIL_ERROR = 'Confere o e-mail, é nele que o acesso chega.'
const EMPTY_ERROR = 'Falta preencher esse.'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FIELDS: Array<{
  name: FieldName
  label: string
  placeholder: string
  type: string
  inputMode?: 'tel' | 'email'
  autoComplete: string
}> = [
  { name: 'nome', label: 'Seu nome', placeholder: 'Seu nome', type: 'text', autoComplete: 'name' },
  {
    name: 'email',
    label: 'Seu melhor e-mail',
    placeholder: 'Seu melhor e-mail',
    type: 'email',
    inputMode: 'email',
    autoComplete: 'email',
  },
  {
    name: 'whatsapp',
    label: 'WhatsApp',
    placeholder: 'WhatsApp com DDD',
    type: 'tel',
    inputMode: 'tel',
    autoComplete: 'tel',
  },
]

export default function LeadForm() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    nome: '',
    email: '',
    whatsapp: '',
  })
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  function setValue(name: FieldName, value: string) {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<FieldName, string>> = {}
    ;(['nome', 'email', 'whatsapp'] as FieldName[]).forEach((name) => {
      if (!values[name].trim()) next[name] = EMPTY_ERROR
    })
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) next.email = EMAIL_ERROR
    setErrors(next)
    if (Object.keys(next).length) {
      const first = FIELDS.find((f) => next[f.name])
      document.getElementById(`campo-${first?.name}`)?.focus()
      return false
    }
    return true
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending' || !validate()) return
    setStatus('sending')
    // PONTO DE INTEGRAÇÃO: trocar o timeout por um POST para o backend/CRM
    // (ex.: fetch('https://SEU-ENDPOINT', { method: 'POST', body: JSON.stringify(values) }))
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl bg-mint px-6 py-8 text-center" role="status" aria-live="polite">
        <svg viewBox="0 0 24 24" className="mx-auto h-12 w-12" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#00A870" />
          <path
            d="M7 12.5l3 3 7-7"
            stroke="#fff"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-4 font-display text-xl font-medium leading-snug tracking-display text-forest">
          Pronto. O acesso está indo pro seu e-mail, chega em até 5 minutos.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      {FIELDS.map(({ name, label, placeholder, type, inputMode, autoComplete }) => (
        <div key={name}>
          <label htmlFor={`campo-${name}`} className="sr-only">
            {label}
          </label>
          <input
            id={`campo-${name}`}
            name={name}
            type={type}
            inputMode={inputMode}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={values[name]}
            onChange={(e) => setValue(name, e.target.value)}
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? `erro-${name}` : undefined}
            className={`w-full rounded-xl border-2 bg-white px-4 py-3.5 text-base text-ink transition-colors duration-150 placeholder:text-ink-faint ${
              errors[name] ? 'border-alert focus:border-alert' : 'border-mint focus:border-brand'
            }`}
          />
          {errors[name] && (
            <p
              id={`erro-${name}`}
              className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-alert"
            >
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7.5v5M12 16.2v.1" />
              </svg>
              {errors[name]}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-brand px-8 py-4 font-display text-lg font-semibold text-white transition-[background-color,transform] duration-200 ease-out hover:bg-brand-dark active:scale-[0.99] disabled:cursor-wait disabled:bg-brand-dark"
      >
        {status === 'sending' && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
            aria-hidden="true"
          />
        )}
        {status === 'sending' ? 'Liberando o acesso…' : 'Quero o Destrava'}
      </button>

      <p className="flex items-center justify-center gap-2 pt-1 text-center text-sm text-ink-soft">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="5" y="10" width="14" height="10" rx="2.5" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        O acesso chega no seu e-mail em até 5 minutos.
      </p>
    </form>
  )
}
