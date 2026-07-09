// Loads every .md file under src/content/, parses simple YAML-style frontmatter,
// and returns an array of article objects. To add a new article, just drop a new
// .md file into src/content/ — no code changes needed.

const files = import.meta.glob('../content/*.md', { query: '?raw', import: 'default', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    return { meta: {}, body: raw }
  }
  const [, frontmatter, body] = match
  const meta = {}
  frontmatter.split('\n').forEach((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (key === 'tags') {
      meta.tags = value.split(',').map((t) => t.trim()).filter(Boolean)
    } else {
      meta[key] = value
    }
  })
  return { meta, body: body.trim() }
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

export const articles = Object.entries(files).map(([path, raw]) => {
  const { meta, body } = parseFrontmatter(raw)
  return {
    slug: slugFromPath(path),
    title: meta.title || slugFromPath(path),
    category: meta.category || 'Uncategorized',
    tags: meta.tags || [],
    summary: meta.summary || '',
    body,
  }
}).sort((a, b) => a.title.localeCompare(b.title))

export const categories = [...new Set(articles.map((a) => a.category))].sort()
