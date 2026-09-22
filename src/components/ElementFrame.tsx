import type { ReactNode } from 'react'

export type ElementNamespace =
  | 'ads'
  | 'websites'
  | 'verifications'
  | 'dashboard'
  | 'wallet'
  | 'payments'

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
