# Personal Webpage & Technical Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a static personal portfolio and bilingual Markdown technical blog for Cheng-Wei (Will) Liu (`AI Inference Engineer | AI PM`) ready for automated GitHub Pages deployment.

**Architecture:** An Astro 5 static site (`output: 'static'`) backed by a strongly-typed single source of truth (`src/data/profile.ts`) for portfolio data and Zod-validated Astro Content Collections (`src/content/blog/*.md`) for bilingual blog posts. Zero-JS default pages with lightweight progressive enhancement for theme switching and tag filtering, verified by Vitest unit and build-output integration tests.

**Tech Stack:** Astro 5, TypeScript, Vanilla Scoped CSS + CSS Custom Properties (`Inter`, `Noto Sans TC`, `JetBrains Mono`), `@astrojs/rss`, Vitest, GitHub Actions (`actions/deploy-pages`).

**Spec:** `docs/superpowers/specs/2026-10-11-personal-webpage-design.md`

## Global Constraints

- **Target Hosting:** GitHub Pages via GitHub Actions static deployment (`output: 'static'`).
- **Included Public Contact Channels:** GitHub (`https://github.com/willweimike/`), LinkedIn (`https://www.linkedin.com/in/willweimike`), Email (`mailto:willie20220101@gmail.com`), Location (`Taichung City, Taiwan`).
- **Excluded Private Data:** Mobile phone number (`0906065826`) and birthday (`October 3` / `10 月 3 日`) are intentionally excluded from all public repository files and rendered pages.
- **Color Palette (Dark Default):** Canvas `#0B0F17`, Surface `#111827`, Border `#1F2937`, Primary text `#F9FAFB`, Secondary text `#9CA3AF`, Accents `#38BDF8` and `#10B981`.
- **Color Palette (Light Toggleable):** Canvas `#F8FAFC`, Surface `#FFFFFF`, Border `#E2E8F0`, Primary text `#0F172A`, Secondary text `#475569`, Accents `#0284C7` and `#059669`.
- **Typography:** `Inter` (UI & English prose), `Noto Sans TC` (Traditional Chinese prose), `JetBrains Mono` (code, PR numbers, metrics, dates).
- **Base Path Resilience:** `astro.config.mjs` must honor `process.env.SITE` and `process.env.BASE_PATH` so the site works at either `/` (`willweimike.github.io`) or a repository subpath (`/personal_webpage/`).

## Review Focus

1. **Subpath routing breakage on GitHub Pages (`/personal_webpage` vs `/`):** Internal navigation links (`/writing`, `/writing/<slug>`, `/rss.xml`) must prepend `import.meta.env.BASE_URL` via a helper so deploying to a project repo subpath never produces broken links (tested in Task 1 & Task 4).
2. **CJK + English mixed reading-time miscalculation:** Standard whitespace word splitters treat an entire Chinese paragraph as 1 word (`1 min read`); `calculateReadingTime` must count CJK characters separately from Latin words and strip Markdown fenced code blocks/frontmatter (tested in Task 2).
3. **Accidental leakage of private LinkedIn fields:** Phone number (`0906065826`) or birthday (`October 3` / `10月3日`) must never appear in `src/data/profile.ts` or any built file in `dist/` (tested in Task 1 & Task 4).
4. **Draft posts leaking into production pages or RSS feed:** Markdown posts with `draft: true` must be filtered out of the homepage preview, `/writing` archive, static route generation, and `/rss.xml` (tested in Task 2 & Task 4).
5. **External security & PR links missing `rel="noopener noreferrer"` or malformed URLs:** Every GitHub PR badge and Credly verification link must be a valid `https://` URL and render safely in built HTML (tested in Task 1 & Task 4).

---

### Task 1: Project Scaffolding, Typed Profile Data & URL/Privacy Unit Tests

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `src/utils/url.ts`
- Create: `src/data/profile.ts`
- Test: `tests/profile.test.ts`

**Interfaces:**
- Consumes: none (foundational task)
- Produces:
  - `src/utils/url.ts`: `withBase(path: string, base?: string): string`
  - `src/data/profile.ts`: `profileData: ProfileData`, `PullRequestLink`, `OssContribution`, `ExperienceItem`, `EducationItem`, `SkillCategory`, `CertificationItem`

- [ ] **Step 1: Create `package.json`, `tsconfig.json`, `astro.config.mjs`, `vitest.config.ts`, and `.gitignore`**

Create `package.json`:
```json
{
  "name": "will-liu-personal-webpage",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@astrojs/rss": "^4.0.11",
    "astro": "^5.5.0"
  },
  "devDependencies": {
    "@types/node": "^22.13.0",
    "typescript": "^5.8.2",
    "vitest": "^3.0.8"
  }
}
```

Create `tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```

Create `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';

const site = process.env.SITE || 'https://willweimike.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
```

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
```

Create `.gitignore`:
```text
dist/
.astro/
node_modules/
.DS_Store
*.log
.env
.env.*
```

- [ ] **Step 2: Install dependencies and write the failing test `tests/profile.test.ts`**

Run: `npm install`

Create `tests/profile.test.ts`:
```typescript
import { describe, expect, it } from 'vitest';
import { profileData } from '../src/data/profile';
import { withBase } from '../src/utils/url';

describe('withBase URL helper', () => {
  it('handles root base path cleanly', () => {
    expect(withBase('/writing', '/')).toBe('/writing');
    expect(withBase('/', '/')).toBe('/');
    expect(withBase('/#open-source', '/')).toBe('/#open-source');
  });

  it('prefixes repository subpath when deployed to project GitHub Pages', () => {
    expect(withBase('/writing', '/personal_webpage')).toBe('/personal_webpage/writing');
    expect(withBase('/writing/', '/personal_webpage/')).toBe('/personal_webpage/writing/');
    expect(withBase('/', '/personal_webpage')).toBe('/personal_webpage/');
    expect(withBase('/#open-source', '/personal_webpage')).toBe('/personal_webpage/#open-source');
  });
});

describe('profileData integrity and privacy constraints', () => {
  it('contains Will Liu core identity and public contact channels', () => {
    expect(profileData.name).toBe('Cheng-Wei (Will) Liu');
    expect(profileData.headline).toBe('AI Inference Engineer | AI PM');
    expect(profileData.location).toBe('Taichung City, Taiwan');
    expect(profileData.contact.github).toBe('https://github.com/willweimike/');
    expect(profileData.contact.linkedin).toBe('https://www.linkedin.com/in/willweimike');
    expect(profileData.contact.email).toBe('willie20220101@gmail.com');
  });

  it('excludes private phone number and birthday from serialized profile data', () => {
    const serialized = JSON.stringify(profileData);
    expect(serialized).not.toContain('0906065826');
    expect(serialized.toLowerCase()).not.toContain('october 3');
    expect(serialized).not.toContain('10月3日');
    expect(serialized).not.toContain('10 月 3 日');
  });

  it('includes all 4 open-source projects and exact upstream PR links', () => {
    const repoNames = profileData.openSource.map((item) => item.project);
    expect(repoNames).toEqual([
      'SGLang',
      'vLLM',
      'llama.cpp',
      'Agent-Threat-Rules',
    ]);

    const allPrUrls = profileData.openSource.flatMap((item) =>
      item.pullRequests.map((pr) => pr.url)
    );
    expect(allPrUrls).toEqual([
      'https://github.com/sgl-project/sglang/pull/43293',
      'https://github.com/sgl-project/sglang/pull/42596',
      'https://github.com/sgl-project/sglang/pull/42595',
      'https://github.com/vllm-project/vllm/pull/60775',
      'https://github.com/vllm-project/vllm/pull/58822',
      'https://github.com/vllm-project/vllm/pull/58666',
      'https://github.com/ggml-org/llama.cpp/pull/30268',
      'https://github.com/ggml-org/llama.cpp/pull/29408',
    ]);
  });

  it('includes verified experience, education, skill categories, and certifications', () => {
    expect(profileData.experience).toHaveLength(2);
    expect(profileData.experience[0].company).toBe('Mobiletron Electronics Co Ltd');
    expect(profileData.experience[1].company).toBe('Saturn Imaging');

    expect(profileData.education).toHaveLength(2);
    expect(profileData.education[0].institution).toContain('National Cheng Kung University');
    expect(profileData.education[0].gpa).toBe('3.82');

    expect(profileData.skillCategories).toHaveLength(3);
    expect(profileData.certifications).toHaveLength(3);
    for (const cert of profileData.certifications) {
      if (cert.credentialUrl) {
        expect(cert.credentialUrl.startsWith('https://www.credly.com/')).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/profile.test.ts`
Expected: FAIL with module resolution error (`Cannot find module '../src/data/profile'`).

- [ ] **Step 4: Implement `src/utils/url.ts` and `src/data/profile.ts`**

Create `src/utils/url.ts`:
```typescript
export function withBase(
  path: string,
  base: string = import.meta.env?.BASE_URL ?? '/'
): string {
  const normalizedBase = base === '/' ? '' : base.replace(/\/+$/, '');
  if (!path || path === '/') {
    return normalizedBase ? `${normalizedBase}/` : '/';
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
```

Create `src/data/profile.ts`:
```typescript
export interface PullRequestLink {
  number: number;
  url: string;
}

export interface OssContribution {
  project: string;
  repo: string;
  repoUrl: string;
  role: string;
  period: string;
  description: string;
  pullRequests: PullRequestLink[];
  tags: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  employmentType: string;
  period: string;
  location: string;
  highlights: string[];
  skills: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  gpa: string;
  focus: string[];
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  issued: string;
  credentialUrl?: string;
  skills: string[];
}

export interface ProfileData {
  name: string;
  zhName: string;
  handle: string;
  headline: string;
  tagline: string;
  statusBadge: string;
  location: string;
  about: string[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
  openSource: OssContribution[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  certifications: CertificationItem[];
}

export const profileData: ProfileData = {
  name: 'Cheng-Wei (Will) Liu',
  zhName: '劉承瑋',
  handle: 'willweimike',
  headline: 'AI Inference Engineer | AI PM',
  tagline:
    'Bridging production-grade LLM inference optimization (vLLM, SGLang, llama.cpp) and on-prem GPU infrastructure with pragmatic AI product management.',
  statusBadge: 'Active OSS Contributor · vLLM · SGLang · llama.cpp',
  location: 'Taichung City, Taiwan',
  about: [
    'I am an AI Inference Engineer and AI Product/Project Manager who works across the stack—from benchmarking quantized LLMs and deploying on-premises GPU clusters to aligning model capabilities with real production workflows and user trust.',
    'As an active contributor to SGLang, vLLM, and llama.cpp, I focus on making open-source inference engines faster, more reliable, and easier to deploy in resource-constrained and security-sensitive environments.',
  ],
  contact: {
    email: 'willie20220101@gmail.com',
    github: 'https://github.com/willweimike/',
    linkedin: 'https://www.linkedin.com/in/willweimike',
  },
  openSource: [
    {
      project: 'SGLang',
      repo: 'sgl-project/sglang',
      repoUrl: 'https://github.com/sgl-project/sglang',
      role: 'Contributor',
      period: 'Mar 2026 – Present',
      description:
        'Contributing upstream improvements and fixes to SGLang, a high-performance structured generation and serving framework for LLMs and VLMs.',
      pullRequests: [
        { number: 43293, url: 'https://github.com/sgl-project/sglang/pull/43293' },
        { number: 42596, url: 'https://github.com/sgl-project/sglang/pull/42596' },
        { number: 42595, url: 'https://github.com/sgl-project/sglang/pull/42595' },
      ],
      tags: ['AI Inferencing', 'LLMOps', 'MLOps', 'Python'],
    },
    {
      project: 'vLLM',
      repo: 'vllm-project/vllm',
      repoUrl: 'https://github.com/vllm-project/vllm',
      role: 'Contributor',
      period: 'Mar 2026 – Present',
      description:
        'Contributing to vLLM, a high-throughput and memory-efficient LLM inference and serving engine powering production AI deployments.',
      pullRequests: [
        { number: 60775, url: 'https://github.com/vllm-project/vllm/pull/60775' },
        { number: 58822, url: 'https://github.com/vllm-project/vllm/pull/58822' },
        { number: 58666, url: 'https://github.com/vllm-project/vllm/pull/58666' },
      ],
      tags: ['AI Inferencing', 'LLMOps', 'MLOps', 'CUDA'],
    },
    {
      project: 'llama.cpp',
      repo: 'ggml-org/llama.cpp',
      repoUrl: 'https://github.com/ggml-org/llama.cpp',
      role: 'Contributor',
      period: 'Mar 2026 – Present',
      description:
        'Contributing to llama.cpp, enabling efficient local and edge LLM inference in C/C++ across diverse hardware targets.',
      pullRequests: [
        { number: 30268, url: 'https://github.com/ggml-org/llama.cpp/pull/30268' },
        { number: 29408, url: 'https://github.com/ggml-org/llama.cpp/pull/29408' },
      ],
      tags: ['AI Inferencing', 'C/C++', 'Local LLM', 'Quantization'],
    },
    {
      project: 'Agent-Threat-Rules',
      repo: 'Agent-Threat-Rules',
      repoUrl: 'https://github.com/willweimike/',
      role: 'Contributor',
      period: 'Mar 2026 – May 2026',
      description:
        'Added support for OpenAI-compatible and local Ollama model integrations, CLI testing workflows, and JSON-mode compatibility options for AI agent security evaluation.',
      pullRequests: [],
      tags: ['AI Security', 'Intelligent Agents', 'Ollama', 'CLI'],
    },
  ],
  experience: [
    {
      role: 'AI Inference Engineer and PM',
      company: 'Mobiletron Electronics Co Ltd',
      employmentType: 'Permanent',
      period: 'Apr 2026 – Present',
      location: 'Taichung City, Taiwan · On-site',
      highlights: [
        'Led deployment of on-premises AI infrastructure across two engineering teams, aligning GPU hardware selection with production workload requirements.',
        'Benchmarked and optimized open-source LLMs through quantization and runtime tuning, delivering production-ready inference latency and throughput.',
      ],
      skills: [
        'AI Inferencing',
        'Project Management',
        'Intelligent Agents',
        'Information Security',
        'DevOps',
        'AWS',
      ],
    },
    {
      role: 'Machine Learning Engineer',
      company: 'Saturn Imaging',
      employmentType: 'Permanent',
      period: 'Oct 2022 – Sep 2023',
      location: 'Taipei City, Taiwan · On-site',
      highlights: [
        'Independently executed semantic segmentation model training and deployed AI models into practical clinical applications.',
        'Integrated LINE Messaging API with CUDA inference servers to construct a real-time automated notification system, saving physicians 2 hours of processing time.',
      ],
      skills: [
        'AI Inferencing',
        'System Deployment',
        'Semantic Segmentation',
        'CUDA',
        'API Development',
        'Data Engineering',
      ],
    },
  ],
  education: [
    {
      institution: 'National Cheng Kung University (國立成功大學)',
      degree: 'Master of Engineering, Computer Science',
      period: 'Feb 2024 – Apr 2026',
      location: 'Tainan City, Taiwan',
      gpa: '3.82',
      focus: ['MLOps', 'LLMOps', 'Software Design', 'Data Mining', 'Artificial Intelligence'],
    },
    {
      institution: 'National Central University (國立中央大學)',
      degree: "Bachelor's Degree",
      period: 'Sep 2017 – Aug 2021',
      location: 'Taoyuan City, Taiwan',
      gpa: '3.70',
      focus: ['Computer Science Fundamentals', 'Software Development', 'Data Engineering'],
    },
  ],
  skillCategories: [
    {
      title: 'LLM Inference & MLOps',
      description: 'High-throughput serving, quantization, and production GPU infrastructure.',
      skills: [
        'AI Inferencing',
        'LLMOps',
        'MLOps',
        'vLLM',
        'SGLang',
        'llama.cpp',
        'Model Quantization',
        'System Deployment',
        'Deep Learning',
      ],
    },
    {
      title: 'AI Product & Software Engineering',
      description: 'Bridging technical capabilities with user workflows and system design.',
      skills: [
        'Project Management (AI PM)',
        'Intelligent Agents',
        'Software Design',
        'Software Development',
        'API Development',
        'Python',
        'Java',
        'PostgreSQL',
        'Data Engineering',
        'Data Mining',
      ],
    },
    {
      title: 'Cloud, DevOps & Security',
      description: 'Resilient deployment pipelines and secure LLM/API interfaces.',
      skills: [
        'Amazon Web Services (AWS)',
        'DevOps',
        'Information Security',
        'LLM & NLP API Security',
        'On-Premises Infrastructure',
      ],
    },
  ],
  certifications: [
    {
      name: 'Certificate of Achievement: Fundamentals of Agents',
      issuer: 'Hugging Face',
      issued: 'Feb 2025',
      skills: ['Intelligent Agents', 'Artificial Intelligence', 'Deep Learning'],
    },
    {
      name: 'Securing LLM and NLP APIs',
      issuer: 'APIsec University',
      issued: 'Feb 2025',
      credentialUrl:
        'https://www.credly.com/badges/dd1d57fc-d6cf-4c5a-88e3-14432bec7ef0/linked_in_profile',
      skills: ['LLM Security', 'API Development', 'Information Security'],
    },
    {
      name: 'API Security Fundamentals',
      issuer: 'APIsec University',
      issued: 'Feb 2025',
      credentialUrl:
        'https://www.credly.com/badges/9b93fafe-d117-4e15-9156-61edcd63a66f/linked_in_profile',
      skills: ['API Security', 'API Development'],
    },
  ],
};
```

- [ ] **Step 5: Run test to verify it passes and commit**

Run: `npx vitest run tests/profile.test.ts`
Expected: PASS (6 tests passing)

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs vitest.config.ts .gitignore src/utils/url.ts src/data/profile.ts tests/profile.test.ts
git commit -m "feat: scaffold Astro project and add typed profile data with privacy tests"
```

---

### Task 2: Bilingual Reading Time Utility & Markdown Content Collection

**Files:**
- Create: `src/utils/readingTime.ts`
- Create: `src/content.config.ts`
- Create: `src/content/blog/pm-guide-in-the-ai-era-part-1.md`
- Create: `src/content/blog/contributing-to-llm-inference-engines.md`
- Test: `tests/readingTime.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `src/utils/readingTime.ts`: `calculateReadingTime(markdown: string): { minutes: number; label: string; wordCount: number }`
  - `src/content.config.ts`: `collections = { blog }` with schema `{ title, description, pubDate, updatedDate?, tags, lang, draft }`

- [ ] **Step 1: Write the failing test `tests/readingTime.test.ts`**

Create `tests/readingTime.test.ts`:
```typescript
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateReadingTime } from '../src/utils/readingTime';

describe('calculateReadingTime (English + Traditional Chinese CJK)', () => {
  it('returns 1 min read for empty or very short input', () => {
    expect(calculateReadingTime('').minutes).toBe(1);
    expect(calculateReadingTime('Hello world').label).toBe('1 min read');
  });

  it('calculates reading time for English prose (~220 wpm)', () => {
    const englishWords = Array.from({ length: 450 }, () => 'inference').join(' ');
    const result = calculateReadingTime(englishWords);
    expect(result.minutes).toBe(3);
    expect(result.label).toBe('3 min read');
  });

  it('calculates reading time for Traditional Chinese CJK prose (~350 cpm) without spaces', () => {
    const cjkChars = '推'.repeat(700);
    const result = calculateReadingTime(cjkChars);
    expect(result.minutes).toBe(2);
    expect(result.wordCount).toBe(700);
  });

  it('strips fenced code blocks so large logs do not inflate reading time', () => {
    const prose = 'Short intro paragraph.';
    const hugeCodeBlock = '```python\n' + 'x = 1\n'.repeat(1000) + '```';
    const result = calculateReadingTime(`${prose}\n\n${hugeCodeBlock}`);
    expect(result.minutes).toBe(1);
  });
});

describe('Seeded Markdown blog posts', () => {
  const blogDir = path.resolve(process.cwd(), 'src/content/blog');

  it('contains both initial seeded articles with valid frontmatter and non-empty body', () => {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
    expect(files).toContain('pm-guide-in-the-ai-era-part-1.md');
    expect(files).toContain('contributing-to-llm-inference-engines.md');

    for (const file of files) {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      expect(raw.startsWith('---\n')).toBe(true);
      expect(raw).toContain('title:');
      expect(raw).toContain('description:');
      expect(raw).toContain('pubDate:');
      expect(raw).toContain('tags:');
      expect(raw).toContain('lang:');
      const parts = raw.split('---');
      expect(parts.length).toBeGreaterThanOrEqual(3);
      expect(parts.slice(2).join('---').trim().length).toBeGreaterThan(200);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/readingTime.test.ts`
Expected: FAIL with `Cannot find module '../src/utils/readingTime'`.

- [ ] **Step 3: Implement `src/utils/readingTime.ts`, `src/content.config.ts`, and the two Markdown blog posts**

Create `src/utils/readingTime.ts`:
```typescript
export interface ReadingTimeResult {
  minutes: number;
  label: string;
  wordCount: number;
}

const CJK_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g;

export function calculateReadingTime(markdown: string): ReadingTimeResult {
  const withoutFrontmatter = markdown.replace(/^---[\s\S]*?---/, '');
  const withoutCodeBlocks = withoutFrontmatter.replace(/```[\s\S]*?```/g, '');
  const withoutInlineMarkup = withoutCodeBlocks.replace(/[#>*_`~\[\]()!]/g, ' ');

  const cjkMatches = withoutInlineMarkup.match(CJK_REGEX) ?? [];
  const cjkCount = cjkMatches.length;

  const nonCjkText = withoutInlineMarkup.replace(CJK_REGEX, ' ').trim();
  const englishWords = nonCjkText ? nonCjkText.split(/\s+/).filter(Boolean).length : 0;

  const estimatedMinutes = englishWords / 220 + cjkCount / 350;
  const minutes = Math.max(1, Math.ceil(estimatedMinutes));
  const wordCount = englishWords + cjkCount;

  return {
    minutes,
    label: `${minutes} min read`,
    wordCount,
  };
}
```

Create `src/content.config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).min(1),
    lang: z.enum(['en', 'zh-tw', 'bilingual']),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

Create `src/content/blog/pm-guide-in-the-ai-era-part-1.md`:
```markdown
---
title: "當 AI「太」強，使用者「慌」了，怎麼應對？— AI 時代的 PM 指南 (Part 1)"
description: "從純技術的 AI 推論工程師跨足 AI PM 的實務觀察：當模型能力超越預期時，為什麼使用者反而產生焦慮與抗拒？我們該如何透過產品邊界與推論體驗設計建立信任？"
pubDate: 2026-10-04
tags: ["AI PM", "LLMOps", "Product Strategy", "User Trust"]
lang: "zh-tw"
draft: false
---

## 前言：一個少有人正式討論的現象

當 AI 「太」強，使用者「慌」了，怎麼應對？

這是一個在第一線導入生成式 AI 與地端大型語言模型（On-prem LLM）時非常明顯，卻鮮少有人正式討論該如何解決的問題。

過去在做純技術的 **AI 推論工程師（AI Inference Engineer）** 時，我們的目標非常明確且可量化：

- 如何透過量化（Quantization）在有限的 GPU VRAM 中塞進更大參數量的模型？
- 如何在 `vLLM`、`SGLang` 或 `llama.cpp` 中調優吞吐量（Throughput）與首字延遲（TTFT）？
- 如何確保地端推論叢集在跨團隊高併發下依然穩定？

然而，當我同時扛起 **AI PM** 的職責、走進業務與終端使用者的工作流程時，我發現一個反直覺的事實：**並不是模型越聰明、回答越快，使用者就越買單。**

---

## 為什麼 AI 太強，使用者反而會「慌」？

在傳統軟體工程中，系統行為是確定性的（Deterministic）：輸入 A，經過固定的商業邏輯，必然得到輸出 B。使用者對系統擁有 100% 的控制感。

但在導入高能力 LLM 或智慧型代理人（Intelligent Agents）時，使用者會面臨三種深層焦慮：

### 1. 決策黑盒子帶來的責任焦慮
當模型在幾秒鐘內直接給出看似完美的結論或專業建議時，專業工作者（例如醫療人員、資深工程師或審核人員）的第一反應往往不是驚喜，而是不安：「**如果這個結論出錯了，是我要負責嗎？我該怎麼驗證它的推理過程？**」

### 2. 能力邊界模糊導致的失控感
當 AI 表現得無所不能，使用者反而不知道什麼時候該相信它、什麼時候該介入修正。一旦發生一次幻覺（Hallucination），使用者對整套系統的信任就會瞬間崩塌。

### 3. 角色價值被取代的防衛心理
如果產品設計傳遞出的訊號是「AI 來替你做決定」，使用者自然會用挑剔與抗拒的態度面對系統；反之，如果產品定位是「替你省下 2 小時繁瑣預處理的副駕駛」，接受度就會截然不同。

---

## AI 時代 PM 的三大應對原則

結合推論工程與產品管理的雙重視角，我整理出三個在實際落地時最有效的設計原則：

### 原則一：把「可解釋的中間狀態」設計進 UX，而不只追求極致低延遲
在推論引擎層面，我們追求極致的 Token 生成速度；但在產品層面，**適當呈現檢索來源、信心指標與推理步驟**，能大幅降低使用者的黑盒焦慮。讓使用者看見 AI「查了什麼資料、排除了什麼選項」，比直接丟出最終答案更能建立信任。

### 原則二：設定明確的 Human-in-the-Loop 確認節點
不要讓 Agent 在沒有人類確認的情況下直接執行高風險的寫入或外部通知。將系統拆解為：
1. **自動化預處理與草擬（AI 負責，省下 80% 時間）**
2. **關鍵決策確認（人類負責，保留最終控制權）**

### 原則三：用工程確定性包覆模型的不確定性
透過 Structured Outputs（例如 JSON Schema 強制約束）、API 安全檢核與明確的 Fallback 機制，確保就算模型遇到邊界案例，系統也能優雅降級（Graceful Degradation），而不是產出不可預測的行為。

---

## 結語與後續預告

從單純做技術的 AI 推論工程師，到成為兼顧底層基礎設施與使用者價值的 **AI Inference Engineer & PM**，我深刻體會到：**最好的 AI 產品，是讓底層推論引擎全力運轉，卻讓前端使用者感到安心、可控且被賦能。**

接下來的系列文章中，我會繼續分享更多將既有 PM 框架與 LLMOps 實務結合的心得，一步步完成這份《AI 時代的 PM 指南》。
```

Create `src/content/blog/contributing-to-llm-inference-engines.md`:
```markdown
---
title: "Contributing to the Open-Source LLM Inference Ecosystem: Lessons from vLLM, SGLang, and llama.cpp"
description: "Why I started contributing upstream to the three foundational open-source LLM serving engines—and what reading production inference codebases taught me about performance and community."
pubDate: 2026-10-10
tags: ["Open Source", "LLM Inference", "vLLM", "SGLang", "llama.cpp"]
lang: "en"
draft: false
---

## From Power User to Upstream Contributor

For a long time, I was an avid user of open-source LLM inference engines. When deploying on-premises AI infrastructure and benchmarking quantized models for production workloads, three projects consistently formed the backbone of my toolkit:

- **[vLLM](https://github.com/vllm-project/vllm):** The gold standard for high-throughput, memory-efficient paged attention and production serving.
- **[SGLang](https://github.com/sgl-project/sglang):** Fast structured generation, RadixAttention prefix caching, and clean co-design between frontend DSLs and backend runtime scheduling.
- **[llama.cpp](https://github.com/ggml-org/llama.cpp):** Unmatched portability, C/C++ efficiency, and quantization support across edge and local hardware.

Using these tools daily in production inevitably surfaces edge cases—subtle configuration behaviors, hardware-specific bottlenecks, or API compatibility gaps. Stepping across the line from filing workarounds locally to submitting upstream Pull Requests opened up a completely new world.

---

## What the Three Codebases Teach You

Contributing across `llama.cpp`, `vLLM`, and `SGLang` simultaneously offers a rare comparative view of modern AI systems engineering:

### 1. `llama.cpp`: Zero-Bloat Systems Discipline
Working on `llama.cpp` (such as PRs [`#30268`](https://github.com/ggml-org/llama.cpp/pull/30268) and [`#29408`](https://github.com/ggml-org/llama.cpp/pull/29408)) reinforces strict C/C++ discipline. Every allocation, tensor layout, and quantization kernel matters because users run it on everything from workstation GPUs to consumer laptops and embedded devices.

### 2. `vLLM`: Production Scale & Hardware Abstraction
In `vLLM` (PRs [`#60775`](https://github.com/vllm-project/vllm/pull/60775), [`#58822`](https://github.com/vllm-project/vllm/pull/58822), [`#58666`](https://github.com/vllm-project/vllm/pull/58666)), you see how a massive open-source community coordinates model architectures, distributed tensor parallelism, and continuous batching without breaking backward compatibility for thousands of enterprise deployments.

### 3. `SGLang`: Runtime Co-Design & Developer Ergonomics
In `SGLang` (PRs [`#43293`](https://github.com/sgl-project/sglang/pull/43293), [`#42596`](https://github.com/sgl-project/sglang/pull/42596), [`#42595`](https://github.com/sgl-project/sglang/pull/42595)), the focus on agentic workflows—multi-turn KV cache reuse and constrained decoding—bridges the exact gap between raw token throughput and real application latency.

---

## How Upstream Engineering Makes You a Better AI PM

As someone who wears both the **AI Inference Engineer** and **AI PM** hats, reading and contributing to upstream inference engines directly sharpens product judgment:

1. **Realistic Hardware & Latency Budgeting:** You know what is physically bounded by memory bandwidth versus what can be solved with prefix caching or quantization.
2. **Faster Root-Cause Triage:** When a production pipeline exhibits tail-latency spikes or structured-output failures, familiarity with the scheduler and sampler internals turns days of guesswork into targeted fixes.
3. **Giving Back to the Commons:** Open-source AI infrastructure only moves this fast because practitioners upstream their fixes so everyone benefits.

I am excited to keep contributing to `llama.cpp`, `vLLM`, and `SGLang`—and to share deep-dive technical notes here as new PRs land.
```

- [ ] **Step 4: Run test to verify it passes and commit**

Run: `npx vitest run tests/readingTime.test.ts`
Expected: PASS (5 tests passing)

```bash
git add src/utils/readingTime.ts src/content.config.ts src/content/blog/ tests/readingTime.test.ts
git commit -m "feat: add bilingual reading time utility and seeded Markdown blog collection"
```

---

### Task 3: Design System, Base Layout, Navigation & Portfolio Homepage Components

**Files:**
- Create: `public/favicon.svg`
- Create: `public/robots.txt`
- Create: `src/styles/global.css`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Hero.astro`
- Create: `src/components/OpenSourceSection.astro`
- Create: `src/components/ExperienceTimeline.astro`
- Create: `src/components/SkillsAndCerts.astro`
- Create: `src/components/WritingPreview.astro`
- Create: `src/pages/index.astro`

**Interfaces:**
- Consumes: `profileData` from `src/data/profile.ts`, `withBase` from `src/utils/url.ts`, `calculateReadingTime` from `src/utils/readingTime.ts`, `getCollection('blog')` from `astro:content`
- Produces: `BaseLayout.astro` (props: `{ title?: string; description?: string }`), complete `/` homepage route

- [ ] **Step 1: Create `public/favicon.svg`, `public/robots.txt`, and `src/styles/global.css`**

Create `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#0B0F17"/>
  <rect x="2" y="2" width="60" height="60" rx="12" stroke="#38BDF8" stroke-opacity="0.4" stroke-width="2"/>
  <path d="M14 20L21 44L27.5 26L34 44L41 20" stroke="#F9FAFB" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M46 20V44H54" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

Create `public/robots.txt`:
```text
User-agent: *
Allow: /
```

Create `src/styles/global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+TC:wght@400;500;700&display=swap');

:root,
[data-theme='dark'] {
  --bg-canvas: #0B0F17;
  --bg-surface: #111827;
  --bg-surface-hover: #172033;
  --bg-glass: rgba(11, 15, 23, 0.82);
  --border-subtle: #1F2937;
  --border-accent: rgba(56, 189, 248, 0.35);
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --text-muted: #6B7280;
  --accent-primary: #38BDF8;
  --accent-secondary: #10B981;
  --accent-glow: rgba(56, 189, 248, 0.12);
  --badge-bg: rgba(56, 189, 248, 0.1);
  --badge-text: #7DD3FC;
  --pr-bg: rgba(16, 185, 129, 0.12);
  --pr-text: #34D399;
  --pr-border: rgba(16, 185, 129, 0.3);
  color-scheme: dark;
}

[data-theme='light'] {
  --bg-canvas: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-surface-hover: #F1F5F9;
  --bg-glass: rgba(248, 250, 252, 0.85);
  --border-subtle: #E2E8F0;
  --border-accent: rgba(2, 132, 199, 0.35);
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  --accent-primary: #0284C7;
  --accent-secondary: #059669;
  --accent-glow: rgba(2, 132, 199, 0.08);
  --badge-bg: rgba(2, 132, 199, 0.08);
  --badge-text: #0369A1;
  --pr-bg: rgba(5, 150, 105, 0.08);
  --pr-text: #047857;
  --pr-border: rgba(5, 150, 105, 0.25);
  color-scheme: light;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-family: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-canvas);
  background-image: radial-gradient(circle at 50% 0%, var(--accent-glow), transparent 55%);
}

main {
  flex: 1;
  width: 100%;
  max-width: 840px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 5rem;
}

a {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}

code,
pre,
.mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}

.section {
  margin-top: 4.5rem;
  scroll-margin-top: 5rem;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.section-index {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--accent-primary);
  font-weight: 500;
}

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 1.35rem 1.5rem;
  transition: border-color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.card:hover {
  border-color: var(--border-accent);
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  background: var(--badge-bg);
  color: var(--badge-text);
  border: 1px solid transparent;
}

.pr-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  background: var(--pr-bg);
  color: var(--pr-text);
  border: 1px solid var(--pr-border);
}

.pr-pill:hover {
  filter: brightness(1.15);
  transform: translateY(-1px);
}

/* Editorial Prose Styles for Blog Articles */
.prose {
  color: var(--text-primary);
  font-size: 1.05rem;
  line-height: 1.8;
}

.prose h2 {
  font-size: 1.45rem;
  font-weight: 600;
  margin-top: 2.5rem;
  margin-bottom: 0.85rem;
  letter-spacing: -0.015em;
  color: var(--text-primary);
}

.prose h3 {
  font-size: 1.15rem;
  font-weight: 600;
  margin-top: 1.8rem;
  margin-bottom: 0.6rem;
  color: var(--text-primary);
}

.prose p {
  margin-bottom: 1.25rem;
  color: var(--text-secondary);
}

.prose strong {
  color: var(--text-primary);
  font-weight: 600;
}

.prose ul,
.prose ol {
  margin: 0 0 1.35rem 1.4rem;
  color: var(--text-secondary);
}

.prose li {
  margin-bottom: 0.45rem;
}

.prose a {
  color: var(--accent-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.prose hr {
  border: 0;
  border-top: 1px solid var(--border-subtle);
  margin: 2.25rem 0;
}

.prose pre {
  padding: 1.1rem 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
  overflow-x: auto;
  margin: 1.25rem 0;
  font-size: 0.88rem;
}

.prose :not(pre) > code {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 0.15rem 0.4rem;
  border-radius: 5px;
  font-size: 0.88em;
  color: var(--accent-primary);
}

@media (max-width: 640px) {
  main {
    padding: 1.75rem 1.15rem 4rem;
  }

  .section {
    margin-top: 3.25rem;
  }

  .card {
    padding: 1.15rem;
  }
}
```

- [ ] **Step 2: Create `src/components/Header.astro`, `src/components/Footer.astro`, and `src/layouts/BaseLayout.astro`**

Create `src/components/Header.astro`:
```astro
---
import { profileData } from '../data/profile';
import { withBase } from '../utils/url';
---

<header class="site-header">
  <div class="header-inner">
    <a href={withBase('/')} class="brand">
      <span class="brand-monogram mono">WL</span>
      <span class="brand-name">{profileData.name}</span>
    </a>

    <nav class="site-nav" aria-label="Primary Navigation">
      <a href={withBase('/#open-source')}>Open Source</a>
      <a href={withBase('/#experience')}>Experience</a>
      <a href={withBase('/#skills')}>Skills</a>
      <a href={withBase('/writing')}>Writing</a>
      <a href={withBase('/#contact')}>Contact</a>
      <button
        id="theme-toggle"
        type="button"
        class="theme-btn mono"
        aria-label="Toggle color theme"
        title="Toggle dark/light mode"
      >
        <span class="theme-label">THEME</span>
      </button>
    </nav>
  </div>
</header>

<script is:inline>
  (() => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch {}
    });
  })();
</script>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: var(--bg-glass);
    border-bottom: 1px solid var(--border-subtle);
  }

  .header-inner {
    max-width: 840px;
    margin: 0 auto;
    padding: 0.9rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .brand-monogram {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: var(--badge-bg);
    color: var(--accent-primary);
    border: 1px solid var(--border-accent);
    font-size: 0.78rem;
    font-weight: 600;
  }

  .site-nav {
    display: flex;
    align-items: center;
    gap: 1.15rem;
    flex-wrap: wrap;
    font-size: 0.88rem;
    color: var(--text-secondary);
  }

  .site-nav a:hover {
    color: var(--accent-primary);
  }

  .theme-btn {
    background: var(--bg-surface);
    color: var(--text-secondary);
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    padding: 0.25rem 0.55rem;
    font-size: 0.72rem;
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .theme-btn:hover {
    color: var(--text-primary);
    border-color: var(--border-accent);
  }

  @media (max-width: 640px) {
    .header-inner {
      padding: 0.75rem 1.15rem;
    }

    .brand-name {
      display: none;
    }

    .site-nav {
      gap: 0.75rem;
      font-size: 0.82rem;
    }
  }
</style>
```

Create `src/components/Footer.astro`:
```astro
---
import { profileData } from '../data/profile';
import { withBase } from '../utils/url';
---

<footer id="contact" class="site-footer">
  <div class="footer-inner">
    <div class="contact-card card">
      <div class="contact-copy">
        <p class="mono contact-eyebrow">05 / CONTACT</p>
        <h2>Let's build fast, reliable AI systems.</h2>
        <p>
          Open to discussions on LLM inference optimization, on-premises AI infrastructure, open-source collaboration, and AI Product Management roles.
        </p>
      </div>
      <div class="contact-actions">
        <a href={`mailto:${profileData.contact.email}`} class="btn-primary mono">
          {profileData.contact.email}
        </a>
        <div class="social-links mono">
          <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
          <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
          <a href={withBase('/rss.xml')}>
            RSS ↗
          </a>
        </div>
      </div>
    </div>

    <div class="footer-meta mono">
      <span>© {new Date().getFullYear()} {profileData.name} ({profileData.zhName})</span>
      <span>{profileData.location}</span>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    width: 100%;
    max-width: 840px;
    margin: 0 auto;
    padding: 0 1.5rem 3.5rem;
    scroll-margin-top: 5rem;
  }

  .contact-card {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .contact-eyebrow {
    font-size: 0.78rem;
    color: var(--accent-primary);
    margin-bottom: 0.35rem;
  }

  .contact-copy h2 {
    font-size: 1.35rem;
    margin-bottom: 0.45rem;
    letter-spacing: -0.02em;
  }

  .contact-copy p {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  .contact-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-subtle);
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    padding: 0.55rem 1rem;
    border-radius: 8px;
    background: var(--badge-bg);
    color: var(--accent-primary);
    border: 1px solid var(--border-accent);
    font-size: 0.85rem;
    font-weight: 500;
  }

  .btn-primary:hover {
    background: var(--accent-primary);
    color: #0B0F17;
  }

  .social-links {
    display: flex;
    gap: 1.15rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .social-links a:hover {
    color: var(--accent-primary);
  }

  .footer-meta {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.78rem;
    color: var(--text-muted);
  }
</style>
```

Create `src/layouts/BaseLayout.astro`:
```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { profileData } from '../data/profile';
import { withBase } from '../utils/url';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = `${profileData.name} — ${profileData.headline}`,
  description = profileData.tagline,
} = Astro.props;
---

<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="author" content={profileData.name} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href={withBase('/favicon.svg')} />
    <link
      rel="alternate"
      type="application/rss+xml"
      title={`${profileData.name} — Writing RSS Feed`}
      href={withBase('/rss.xml')}
    />
    <script is:inline>
      (() => {
        try {
          const saved = localStorage.getItem('theme');
          if (saved === 'light' || saved === 'dark') {
            document.documentElement.setAttribute('data-theme', saved);
          }
        } catch {}
      })();
    </script>
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 3: Create Portfolio Section Components (`Hero.astro`, `OpenSourceSection.astro`, `ExperienceTimeline.astro`, `SkillsAndCerts.astro`, `WritingPreview.astro`) and `src/pages/index.astro`**

Create `src/components/Hero.astro`:
```astro
---
import { profileData } from '../data/profile';
import { withBase } from '../utils/url';
---

<section id="about" class="hero">
  <div class="status-pill mono">
    <span class="status-dot"></span>
    <span>{profileData.statusBadge}</span>
  </div>

  <h1 class="hero-title">
    {profileData.name}
    <span class="zh-name">{profileData.zhName}</span>
  </h1>

  <p class="hero-headline mono">{profileData.headline} · {profileData.location}</p>

  <p class="hero-tagline">{profileData.tagline}</p>

  <div class="hero-about">
    {profileData.about.map((paragraph) => <p>{paragraph}</p>)}
  </div>

  <div class="hero-links mono">
    <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer" class="hero-btn primary">
      GitHub (@{profileData.handle}) ↗
    </a>
    <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" class="hero-btn">
      LinkedIn ↗
    </a>
    <a href={`mailto:${profileData.contact.email}`} class="hero-btn">
      Email
    </a>
    <a href={withBase('/writing')} class="hero-btn">
      Read Blog →
    </a>
  </div>
</section>

<style>
  .hero {
    padding-top: 1rem;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    background: var(--pr-bg);
    color: var(--pr-text);
    border: 1px solid var(--pr-border);
    font-size: 0.76rem;
    margin-bottom: 1.25rem;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent-secondary);
    box-shadow: 0 0 8px var(--accent-secondary);
  }

  .hero-title {
    font-size: clamp(2rem, 4.5vw, 2.75rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.15;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .zh-name {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .hero-headline {
    font-size: 0.95rem;
    color: var(--accent-primary);
    margin-bottom: 1.15rem;
  }

  .hero-tagline {
    font-size: 1.15rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 1rem;
    line-height: 1.55;
  }

  .hero-about p {
    color: var(--text-secondary);
    font-size: 0.96rem;
    margin-bottom: 0.75rem;
  }

  .hero-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .hero-btn {
    padding: 0.5rem 0.95rem;
    border-radius: 8px;
    font-size: 0.82rem;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    color: var(--text-primary);
  }

  .hero-btn:hover {
    border-color: var(--border-accent);
    color: var(--accent-primary);
  }

  .hero-btn.primary {
    background: var(--badge-bg);
    border-color: var(--border-accent);
    color: var(--accent-primary);
  }
</style>
```

Create `src/components/OpenSourceSection.astro`:
```astro
---
import { profileData } from '../data/profile';
---

<section id="open-source" class="section">
  <div class="section-header">
    <h2 class="section-title">
      <span class="section-index">01</span>
      Open-Source Contributions & Projects
    </h2>
    <span class="mono section-sub">Upstream LLM Engines & Security</span>
  </div>

  <div class="oss-grid">
    {profileData.openSource.map((item) => (
      <article class="card oss-card">
        <div class="oss-top">
          <div>
            <h3 class="oss-title">
              <a href={item.repoUrl} target="_blank" rel="noopener noreferrer">
                {item.project}
                <span class="mono oss-repo">({item.repo}) ↗</span>
              </a>
            </h3>
            <p class="mono oss-role">{item.role} · {item.period}</p>
          </div>
        </div>

        <p class="oss-desc">{item.description}</p>

        {item.pullRequests.length > 0 && (
          <div class="pr-list">
            <span class="mono pr-label">Pull Requests:</span>
            {item.pullRequests.map((pr) => (
              <a
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                class="pr-pill"
              >
                <span>PR #{pr.number}</span>
                <span>↗</span>
              </a>
            ))}
          </div>
        )}

        <div class="tag-row">
          {item.tags.map((tag) => <span class="tag">{tag}</span>)}
        </div>
      </article>
    ))}
  </div>
</section>

<style>
  .section-sub {
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .oss-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .oss-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .oss-title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .oss-title a:hover {
    color: var(--accent-primary);
  }

  .oss-repo {
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--text-secondary);
    margin-left: 0.35rem;
  }

  .oss-role {
    font-size: 0.78rem;
    color: var(--accent-primary);
    margin-top: 0.15rem;
  }

  .oss-desc {
    color: var(--text-secondary);
    font-size: 0.94rem;
  }

  .pr-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 0.2rem;
  }

  .pr-label {
    font-size: 0.76rem;
    color: var(--text-muted);
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    padding-top: 0.25rem;
  }
</style>
```

Create `src/components/ExperienceTimeline.astro`:
```astro
---
import { profileData } from '../data/profile';
---

<section id="experience" class="section">
  <div class="section-header">
    <h2 class="section-title">
      <span class="section-index">02</span>
      Experience & Education
    </h2>
    <span class="mono section-sub">Production AI & Academic Foundation</span>
  </div>

  <div class="timeline-group">
    <h3 class="mono group-label">WORK EXPERIENCE</h3>
    <div class="stack">
      {profileData.experience.map((job) => (
        <article class="card timeline-card">
          <div class="timeline-header">
            <div>
              <h4 class="role-title">{job.role}</h4>
              <p class="company-name">{job.company} · <span class="mono">{job.employmentType}</span></p>
            </div>
            <div class="timeline-meta mono">
              <span>{job.period}</span>
              <span>{job.location}</span>
            </div>
          </div>

          <ul class="highlight-list">
            {job.highlights.map((bullet) => <li>{bullet}</li>)}
          </ul>

          <div class="tag-row">
            {job.skills.map((skill) => <span class="tag">{skill}</span>)}
          </div>
        </article>
      ))}
    </div>
  </div>

  <div class="timeline-group edu-group">
    <h3 class="mono group-label">EDUCATION</h3>
    <div class="edu-grid">
      {profileData.education.map((edu) => (
        <article class="card edu-card">
          <div class="edu-top">
            <h4 class="role-title">{edu.institution}</h4>
            <span class="pr-pill">GPA {edu.gpa}</span>
          </div>
          <p class="company-name">{edu.degree}</p>
          <p class="mono edu-period">{edu.period} · {edu.location}</p>
          <div class="tag-row">
            {edu.focus.map((item) => <span class="tag">{item}</span>)}
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
  .section-sub {
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .group-label {
    font-size: 0.76rem;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .edu-group {
    margin-top: 2rem;
  }

  .stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.85rem;
  }

  .role-title {
    font-size: 1.05rem;
    font-weight: 600;
  }

  .company-name {
    font-size: 0.92rem;
    color: var(--accent-primary);
  }

  .timeline-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .highlight-list {
    margin: 0 0 1rem 1.2rem;
    color: var(--text-secondary);
    font-size: 0.93rem;
  }

  .highlight-list li {
    margin-bottom: 0.4rem;
  }

  .edu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .edu-card {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .edu-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .edu-period {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-bottom: 0.35rem;
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  @media (max-width: 640px) {
    .timeline-meta {
      align-items: flex-start;
    }
  }
</style>
```

Create `src/components/SkillsAndCerts.astro`:
```astro
---
import { profileData } from '../data/profile';
---

<section id="skills" class="section">
  <div class="section-header">
    <h2 class="section-title">
      <span class="section-index">03</span>
      Technical Skills & Certifications
    </h2>
    <span class="mono section-sub">Core Competencies</span>
  </div>

  <div class="skills-grid">
    {profileData.skillCategories.map((cat) => (
      <div class="card skill-card">
        <h3 class="skill-title">{cat.title}</h3>
        <p class="skill-desc">{cat.description}</p>
        <div class="tag-row">
          {cat.skills.map((skill) => <span class="tag">{skill}</span>)}
        </div>
      </div>
    ))}
  </div>

  <div class="certs-block">
    <h3 class="mono group-label">LICENSES & VERIFIED CERTIFICATIONS</h3>
    <div class="certs-grid">
      {profileData.certifications.map((cert) => (
        <div class="card cert-card">
          <div>
            <h4 class="cert-name">{cert.name}</h4>
            <p class="mono cert-meta">{cert.issuer} · Issued {cert.issued}</p>
          </div>
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="pr-pill"
            >
              Verify on Credly ↗
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .section-sub {
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .skill-card {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .skill-title {
    font-size: 1.02rem;
    font-weight: 600;
  }

  .skill-desc {
    font-size: 0.88rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .certs-block {
    margin-top: 2rem;
  }

  .group-label {
    font-size: 0.76rem;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .certs-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cert-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 1rem 1.35rem;
  }

  .cert-name {
    font-size: 0.96rem;
    font-weight: 600;
  }

  .cert-meta {
    font-size: 0.78rem;
    color: var(--text-secondary);
    margin-top: 0.15rem;
  }
</style>
```

Create `src/components/WritingPreview.astro`:
```astro
---
import { getCollection } from 'astro:content';
import { calculateReadingTime } from '../utils/readingTime';
import { withBase } from '../utils/url';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);
---

<section id="writing" class="section">
  <div class="section-header">
    <h2 class="section-title">
      <span class="section-index">04</span>
      Writing & Technical Notes
    </h2>
    <a href={withBase('/writing')} class="mono view-all">
      View all articles →
    </a>
  </div>

  <div class="posts-stack">
    {posts.map((post) => {
      const reading = calculateReadingTime(post.body ?? '');
      const dateStr = post.data.pubDate.toISOString().slice(0, 10);
      return (
        <a href={withBase(`/writing/${post.id}`)} class="card post-card">
          <div class="post-meta mono">
            <time datetime={dateStr}>{dateStr}</time>
            <span>·</span>
            <span>{reading.label}</span>
            <span>·</span>
            <span class="lang-badge">{post.data.lang.toUpperCase()}</span>
          </div>
          <h3 class="post-title">{post.data.title}</h3>
          <p class="post-desc">{post.data.description}</p>
          <div class="tag-row">
            {post.data.tags.map((tag) => <span class="tag">#{tag}</span>)}
          </div>
        </a>
      );
    })}
  </div>
</section>

<style>
  .view-all {
    font-size: 0.82rem;
    color: var(--accent-primary);
  }

  .view-all:hover {
    text-decoration: underline;
  }

  .posts-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .post-card {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .lang-badge {
    color: var(--accent-primary);
    font-weight: 500;
  }

  .post-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .post-card:hover .post-title {
    color: var(--accent-primary);
  }

  .post-desc {
    font-size: 0.92rem;
    color: var(--text-secondary);
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding-top: 0.2rem;
  }
</style>
```

Create `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import OpenSourceSection from '../components/OpenSourceSection.astro';
import ExperienceTimeline from '../components/ExperienceTimeline.astro';
import SkillsAndCerts from '../components/SkillsAndCerts.astro';
import WritingPreview from '../components/WritingPreview.astro';
---

<BaseLayout>
  <Hero />
  <OpenSourceSection />
  <ExperienceTimeline />
  <SkillsAndCerts />
  <WritingPreview />
</BaseLayout>
```

- [ ] **Step 4: Run existing unit tests to verify no regressions and commit**

Run: `npx vitest run`
Expected: PASS

```bash
git add public/ src/styles/ src/components/ src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add design system, base layout, and portfolio homepage sections"
```

---

### Task 4: Writing Archive, Article Detail Pages, RSS Feed, 404 Page, GitHub Actions & Build Verification Suite

**Files:**
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[slug].astro`
- Create: `src/pages/rss.xml.ts`
- Create: `src/pages/404.astro`
- Create: `.github/workflows/deploy.yml`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: `BaseLayout.astro`, `profileData`, `calculateReadingTime`, `withBase`, `getCollection('blog')`, `render` from `astro:content`
- Produces: Static build output in `dist/` (`/index.html`, `/writing/index.html`, `/writing/pm-guide-in-the-ai-era-part-1/index.html`, `/writing/contributing-to-llm-inference-engines/index.html`, `/rss.xml`, `/404.html`) and `.github/workflows/deploy.yml`

- [ ] **Step 1: Write the failing build integration test `tests/build.test.ts`**

Create `tests/build.test.ts`:
```typescript
import { beforeAll, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');

describe('Static production build and GitHub Pages output verification', () => {
  beforeAll(() => {
    execSync('npm run build', { stdio: 'pipe' });
  }, 60000);

  it('generates homepage, writing index, both blog articles, 404 page, and RSS feed', () => {
    const expectedFiles = [
      'index.html',
      '404.html',
      'rss.xml',
      'writing/index.html',
      'writing/pm-guide-in-the-ai-era-part-1/index.html',
      'writing/contributing-to-llm-inference-engines/index.html',
    ];

    for (const relPath of expectedFiles) {
      const fullPath = path.join(distDir, relPath);
      expect(fs.existsSync(fullPath), `Expected ${relPath} to exist in dist/`).toBe(true);
    }
  });

  it('renders all upstream PR links and Credly verification links on the homepage with safe rel attributes', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    expect(indexHtml).toContain('Cheng-Wei (Will) Liu');
    expect(indexHtml).toContain('AI Inference Engineer | AI PM');
    expect(indexHtml).toContain('https://github.com/sgl-project/sglang/pull/43293');
    expect(indexHtml).toContain('https://github.com/vllm-project/vllm/pull/60775');
    expect(indexHtml).toContain('https://github.com/ggml-org/llama.cpp/pull/30268');
    expect(indexHtml).toContain(
      'https://www.credly.com/badges/dd1d57fc-d6cf-4c5a-88e3-14432bec7ef0/linked_in_profile'
    );
    expect(indexHtml).toContain('rel="noopener noreferrer"');
  });

  it('never leaks excluded private phone number or birthday in any built HTML/XML file', () => {
    const filesToCheck = [
      'index.html',
      'rss.xml',
      'writing/index.html',
      'writing/pm-guide-in-the-ai-era-part-1/index.html',
      'writing/contributing-to-llm-inference-engines/index.html',
    ];

    for (const file of filesToCheck) {
      const content = fs.readFileSync(path.join(distDir, file), 'utf-8');
      expect(content).not.toContain('0906065826');
      expect(content.toLowerCase()).not.toContain('october 3');
      expect(content).not.toContain('10月3日');
    }
  });

  it('generates valid RSS 2.0 XML containing published blog posts and excludes drafts', () => {
    const rssXml = fs.readFileSync(path.join(distDir, 'rss.xml'), 'utf-8');
    expect(rssXml).toContain('<rss version="2.0"');
    expect(rssXml).toContain('AI 時代的 PM 指南');
    expect(rssXml).toContain('Contributing to the Open-Source LLM Inference Ecosystem');
    const itemCount = (rssXml.match(/<item>/g) ?? []).length;
    expect(itemCount).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/build.test.ts`
Expected: FAIL because `writing/index.html`, `rss.xml`, and `404.html` do not exist yet.

- [ ] **Step 3: Implement `PostLayout.astro`, `writing/index.astro`, `writing/[slug].astro`, `rss.xml.ts`, `404.astro`, and `.github/workflows/deploy.yml`**

Create `src/layouts/PostLayout.astro`:
```astro
---
import BaseLayout from './BaseLayout.astro';
import { withBase } from '../utils/url';

interface Props {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  tags: string[];
  lang: string;
  readingLabel: string;
}

const { title, description, pubDate, updatedDate, tags, lang, readingLabel } = Astro.props;
const pubDateStr = pubDate.toISOString().slice(0, 10);
const updatedDateStr = updatedDate ? updatedDate.toISOString().slice(0, 10) : null;
---

<BaseLayout title={`${title} — Cheng-Wei (Will) Liu`} description={description}>
  <article class="post-article">
    <a href={withBase('/writing')} class="mono back-link">
      ← Back to Writing
    </a>

    <header class="post-header">
      <div class="post-meta mono">
        <time datetime={pubDateStr}>{pubDateStr}</time>
        {updatedDateStr && <span>(Updated {updatedDateStr})</span>}
        <span>·</span>
        <span>{readingLabel}</span>
        <span>·</span>
        <span class="lang-pill">{lang.toUpperCase()}</span>
      </div>

      <h1 class="post-h1">{title}</h1>
      <p class="post-subtitle">{description}</p>

      <div class="tag-row">
        {tags.map((tag) => <span class="tag">#{tag}</span>)}
      </div>
    </header>

    <div class="prose">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  .post-article {
    padding-top: 0.5rem;
  }

  .back-link {
    display: inline-block;
    font-size: 0.84rem;
    color: var(--accent-primary);
    margin-bottom: 1.5rem;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .post-header {
    padding-bottom: 1.75rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--border-subtle);
  }

  .post-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .lang-pill {
    color: var(--accent-primary);
    font-weight: 600;
  }

  .post-h1 {
    font-size: clamp(1.65rem, 3.8vw, 2.25rem);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.025em;
    margin-bottom: 0.75rem;
  }

  .post-subtitle {
    font-size: 1.02rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }
</style>
```

Create `src/pages/writing/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { calculateReadingTime } from '../../utils/readingTime';
import { withBase } from '../../utils/url';
import { profileData } from '../../data/profile';

const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

const allTags = Array.from(new Set(posts.flatMap((post) => post.data.tags)));
---

<BaseLayout
  title={`Writing — ${profileData.name}`}
  description="Technical essays on LLM inference engines (vLLM, SGLang, llama.cpp), LLMOps, and AI Product Management."
>
  <section class="writing-page">
    <header class="writing-header">
      <p class="mono eyebrow">ARCHIVE / WRITING</p>
      <h1>Technical Notes & AI PM Guides</h1>
      <p class="subtitle">
        Essays on open-source LLM inference optimization (`vLLM`, `SGLang`, `llama.cpp`), on-prem infrastructure, and product management in the AI era.
      </p>

      <div class="filter-bar mono" id="tag-filters">
        <button type="button" class="filter-btn active" data-tag="all">All ({posts.length})</button>
        {allTags.map((tag) => (
          <button type="button" class="filter-btn" data-tag={tag}>#{tag}</button>
        ))}
      </div>
    </header>

    <div class="posts-list" id="posts-list">
      {posts.map((post) => {
        const reading = calculateReadingTime(post.body ?? '');
        const dateStr = post.data.pubDate.toISOString().slice(0, 10);
        return (
          <a
            href={withBase(`/writing/${post.id}`)}
            class="card post-item"
            data-tags={post.data.tags.join(',')}
          >
            <div class="post-meta mono">
              <time datetime={dateStr}>{dateStr}</time>
              <span>·</span>
              <span>{reading.label}</span>
              <span>·</span>
              <span class="lang-badge">{post.data.lang.toUpperCase()}</span>
            </div>
            <h2 class="post-title">{post.data.title}</h2>
            <p class="post-desc">{post.data.description}</p>
            <div class="tag-row">
              {post.data.tags.map((tag) => <span class="tag">#{tag}</span>)}
            </div>
          </a>
        );
      })}
    </div>
  </section>
</BaseLayout>

<script is:inline>
  (() => {
    const buttons = document.querySelectorAll('#tag-filters .filter-btn');
    const items = document.querySelectorAll('#posts-list .post-item');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const selected = btn.getAttribute('data-tag');
        items.forEach((item) => {
          const tags = (item.getAttribute('data-tags') || '').split(',');
          if (!selected || selected === 'all' || tags.includes(selected)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  })();
</script>

<style>
  .writing-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-subtle);
  }

  .eyebrow {
    font-size: 0.78rem;
    color: var(--accent-primary);
    margin-bottom: 0.4rem;
  }

  .writing-header h1 {
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    letter-spacing: -0.025em;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: var(--text-secondary);
    font-size: 0.98rem;
    margin-bottom: 1.25rem;
  }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-btn {
    background: var(--bg-surface);
    color: var(--text-secondary);
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    padding: 0.3rem 0.65rem;
    font-size: 0.76rem;
    cursor: pointer;
  }

  .filter-btn.active,
  .filter-btn:hover {
    color: var(--accent-primary);
    border-color: var(--border-accent);
    background: var(--badge-bg);
  }

  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .post-item {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .lang-badge {
    color: var(--accent-primary);
    font-weight: 500;
  }

  .post-title {
    font-size: 1.15rem;
    font-weight: 600;
  }

  .post-item:hover .post-title {
    color: var(--accent-primary);
  }

  .post-desc {
    color: var(--text-secondary);
    font-size: 0.93rem;
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
</style>
```

Create `src/pages/writing/[slug].astro`:
```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import { calculateReadingTime } from '../../utils/readingTime';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const reading = calculateReadingTime(post.body ?? '');
---

<PostLayout
  title={post.data.title}
  description={post.data.description}
  pubDate={post.data.pubDate}
  updatedDate={post.data.updatedDate}
  tags={post.data.tags}
  lang={post.data.lang}
  readingLabel={reading.label}
>
  <Content />
</PostLayout>
```

Create `src/pages/rss.xml.ts`:
```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { profileData } from '../data/profile';
import { withBase } from '../utils/url';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: `${profileData.name} — Writing & Technical Notes`,
    description: profileData.tagline,
    site: context.site ?? 'https://willweimike.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: withBase(`/writing/${post.id}/`),
    })),
  });
}
```

Create `src/pages/404.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { withBase } from '../utils/url';
---

<BaseLayout title="404 — Page Not Found">
  <section class="not-found card">
    <p class="mono code">404 / NOT_FOUND</p>
    <h1>Page not found</h1>
    <p class="desc">
      The route you requested does not exist or has been moved.
    </p>
    <div class="actions mono">
      <a href={withBase('/')} class="btn">← Return Home</a>
      <a href={withBase('/writing')} class="btn">Browse Writing →</a>
    </div>
  </section>
</BaseLayout>

<style>
  .not-found {
    margin-top: 3rem;
    text-align: center;
    padding: 3rem 1.5rem;
  }

  .code {
    color: var(--accent-primary);
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .not-found h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .desc {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background: var(--badge-bg);
    color: var(--accent-primary);
    border: 1px solid var(--border-accent);
    font-size: 0.84rem;
  }
</style>
```

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Personal Webpage to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Configure GitHub Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npx vitest run tests/profile.test.ts tests/readingTime.test.ts

      - name: Build static site with Astro
        env:
          SITE: ${{ steps.pages.outputs.origin }}
          BASE_PATH: ${{ steps.pages.outputs.base_path }}
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Run full test and build verification suite and commit**

Run: `npx vitest run`
Expected: PASS (all unit and build output tests pass)

```bash
git add src/layouts/PostLayout.astro src/pages/ .github/workflows/deploy.yml tests/build.test.ts
git commit -m "feat: add writing archive, article pages, RSS feed, 404 page, and GitHub Pages workflow"
```
