import { useEffect, useMemo, useRef, useState } from 'react'
import { marked } from 'marked'
import { articles, categories } from './data/articles.js'

const THEME_KEY = 'mtv-theme'
const FAVORITES_KEY = 'mtv-favorites'
const RECENT_KEY = 'mtv-recent'

function useLocalStorageArray(key) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) || []
    } catch {
      return []
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue]
}

function getHeadings(markdown) {
  const lines = markdown.split('\n')
  return lines
    .filter((l) => /^#{2,3}\s/.test(l))
    .map((l) => {
      const level = l.startsWith('###') ? 3 : 2
      const text = l.replace(/^#{2,3}\s/, '').trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return { level, text, id }
    })
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const renderer = new marked.Renderer()
renderer.heading = (text, level) => {
  if (level !== 2 && level !== 3) return `<h${level}>${text}</h${level}>`
  const id = slugify(text)
  return `<h${level} id="${id}">${text}</h${level}>`
}
marked.use({ renderer })

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedSlug, setSelectedSlug] = useState(articles[0]?.slug || null)
  const [favorites, setFavorites] = useLocalStorageArray(FAVORITES_KEY)
  const [recent, setRecent] = useLocalStorageArray(RECENT_KEY)
  const contentRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const selected = useMemo(
    () => articles.find((a) => a.slug === selectedSlug) || null,
    [selectedSlug],
  )

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory = activeCategory === 'All' || a.category === activeCategory
      const haystack = `${a.title} ${a.summary} ${a.tags.join(' ')} ${a.body}`.toLowerCase()
      const matchesQuery = query.trim() === '' || haystack.includes(query.trim().toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  function openArticle(slug) {
    setSelectedSlug(slug)
    setRecent((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 5))
  }

  function toggleFavorite(slug) {
    setFavorites((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  }

  // Add copy-to-clipboard buttons to rendered code blocks
  useEffect(() => {
    if (!contentRef.current) return
    const blocks = contentRef.current.querySelectorAll('pre')
    blocks.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return
      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.textContent = 'Copy'
      btn.onclick = () => {
        const code = pre.querySelector('code')?.innerText || ''
        navigator.clipboard.writeText(code)
        btn.textContent = 'Copied!'
        setTimeout(() => (btn.textContent = 'Copy'), 1500)
      }
      pre.style.position = 'relative'
      pre.appendChild(btn)
    })
  }, [selected])

  const headings = useMemo(() => (selected ? getHeadings(selected.body) : []), [selected])
  const html = useMemo(() => (selected ? marked.parse(selected.body) : ''), [selected])

  const recentArticles = recent.map((slug) => articles.find((a) => a.slug === slug)).filter(Boolean)
  const favoriteArticles = favorites.map((slug) => articles.find((a) => a.slug === slug)).filter(Boolean)

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">📚 Mohan Tech Vault</div>
        <input
          className="search"
          type="text"
          placeholder="Search articles, tags, code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h4>Categories</h4>
            <ul>
              <li className={activeCategory === 'All' ? 'active' : ''} onClick={() => setActiveCategory('All')}>
                All ({articles.length})
              </li>
              {categories.map((c) => (
                <li key={c} className={activeCategory === c ? 'active' : ''} onClick={() => setActiveCategory(c)}>
                  {c} ({articles.filter((a) => a.category === c).length})
                </li>
              ))}
            </ul>
          </div>

          {favoriteArticles.length > 0 && (
            <div className="sidebar-section">
              <h4>⭐ Favorites</h4>
              <ul>
                {favoriteArticles.map((a) => (
                  <li key={a.slug} onClick={() => openArticle(a.slug)}>{a.title}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="sidebar-section">
            <h4>Articles ({filtered.length})</h4>
            <ul>
              {filtered.map((a) => (
                <li
                  key={a.slug}
                  className={a.slug === selectedSlug ? 'active' : ''}
                  onClick={() => openArticle(a.slug)}
                >
                  {a.title}
                </li>
              ))}
              {filtered.length === 0 && <li className="empty">No matches</li>}
            </ul>
          </div>
        </aside>

        <main className="content" ref={contentRef}>
          {selected ? (
            <>
              <div className="article-header">
                <span className="category-pill">{selected.category}</span>
                <h1>{selected.title}</h1>
                <button className="fav-btn" onClick={() => toggleFavorite(selected.slug)}>
                  {favorites.includes(selected.slug) ? '★ Favorited' : '☆ Add to favorites'}
                </button>
              </div>
              {selected.tags.length > 0 && (
                <div className="tags">
                  {selected.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              )}
              <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
            </>
          ) : (
            <p>Select an article to get started.</p>
          )}
        </main>

        <aside className="rightcol">
          {headings.length > 0 && (
            <div className="toc">
              <h4>On this page</h4>
              <ul>
                {headings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? 'toc-sub' : ''}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recentArticles.length > 0 && (
            <div className="recentbox">
              <h4>🕘 Recently Viewed</h4>
              <ul>
                {recentArticles.map((a) => (
                  <li key={a.slug} onClick={() => openArticle(a.slug)}>{a.title}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
