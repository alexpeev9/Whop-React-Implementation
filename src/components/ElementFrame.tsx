import type { ChangeEvent, ReactNode } from 'react'

export type ElementNamespace =
  | 'ads'
  | 'websites'
  | 'tracking'
  | 'verifications'
  | 'dashboard'
  | 'wallet'
  | 'payments'
  | 'checkout'

type ElementFrameProps = {
  id: string
  name: string
  namespace: ElementNamespace
  summary: string
  children: ReactNode
}

type CatalogItem = {
  id: string
  name: string
  namespace: ElementNamespace
}

type ComponentIndexProps = {
  items: CatalogItem[]
}

type ElementGroupProps = {
  id: string
  title: string
  namespace: ElementNamespace
  children: ReactNode
}

export const ComponentIndex = ({ items }: ComponentIndexProps) => {
  return (
    <nav className="element-index" aria-label="Components on this page">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} data-namespace={item.namespace}>
          {item.name}
        </a>
      ))}
    </nav>
  )
}

export const ElementGroup = ({ id, title, namespace, children }: ElementGroupProps) => {
  return (
    <section className="element-group" aria-labelledby={id} data-namespace={namespace}>
      <header className="group-head">
        <p className="eyebrow">{namespace}</p>
        <h2 id={id}>{title}</h2>
      </header>
      {children}
    </section>
  )
}

type IdFieldProps = {
  id: string
  label: string
  hint: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export const IdField = ({ id, label, hint, placeholder, value, onChange }: IdFieldProps) => {
  const hintId = `${id}-hint`

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className="id-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        aria-describedby={hintId}
        onChange={handleChange}
      />
      <p className="hint" id={hintId}>
        {hint}
      </p>
    </div>
  )
}

export const ElementFrame = ({ id, name, namespace, summary, children }: ElementFrameProps) => {
  const headingId = `${id}-heading`
  return (
    <article className="element-frame" id={id} data-namespace={namespace} aria-labelledby={headingId}>
      <header className="element-plate">
        <span className="element-ns">{namespace}</span>
        <h3 id={headingId}>{name}</h3>
        <p>{summary}</p>
      </header>
      <div className="element-body">{children}</div>
    </article>
  )
}
