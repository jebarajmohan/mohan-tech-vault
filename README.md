# Mohan Tech Vault

A searchable, Markdown-based technical knowledge base built with React + Vite, deployable to Netlify.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Add a new article

Create a new `.md` file in `src/content/`. Frontmatter fields:

```md
---
title: My Article Title
category: Apex
tags: tag1, tag2, tag3
summary: One-line summary shown in previews.
---

## Heading

Your content, including ```code blocks```.
```

No code changes needed — new files are picked up automatically.

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

See `KB-VSCODE-GIT-NETLIFY-GUIDE.md` (in the parent folder) for full setup instructions covering VS Code, Git/GitHub, and Netlify deployment.
