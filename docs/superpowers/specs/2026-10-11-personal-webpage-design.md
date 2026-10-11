# Personal Webpage & Technical Blog Design Specification — Cheng-Wei (Will) Liu

- **Date:** 2026-10-11
- **Owner:** Cheng-Wei (Will) Liu (`willweimike`)
- **Status:** Draft for Review
- **Target Hosting:** GitHub Pages (via GitHub Actions static deployment)

---

## 1. Purpose, Audience & Positioning

### 1.1 Purpose
Build a high-craft, fast, easily maintainable personal portfolio and technical blog for **Cheng-Wei (Will) Liu**, showcasing his hybrid expertise as an **AI Inference Engineer & AI Product/Project Manager (AI PM)**.

### 1.2 Target Audience
- **Engineering Leaders, Recruiters & Hiring Managers:** Looking for concrete evidence of production LLM inference engineering (`vLLM`, `SGLang`, `llama.cpp`, quantization, CUDA, on-prem GPU clusters) combined with cross-team technical leadership and product execution.
- **Open-Source Maintainers & AI Engineers:** Looking for Will's upstream pull requests, inference benchmarking insights, and security contributions (`Agent-Threat-Rules`).
- **Product Managers & Tech Peers:** Reading Will's bilingual technical essays, including his *《AI 時代的 PM 指南》* (PM Guide in the AI Era) series and open-source contribution notes.

### 1.3 Privacy & Content Boundaries
- **Included Public Contact Channels:**
  - GitHub: `https://github.com/willweimike/`
  - LinkedIn: `https://www.linkedin.com/in/willweimike`
  - Email: `mailto:willie20220101@gmail.com`
  - Location: `Taichung City, Taiwan`
- **Excluded Private Data:** Mobile phone number and birthday are intentionally excluded from all public repository files and rendered pages.

---

## 2. Visual Direction & User Experience

### 2.1 Aesthetic Persona: "Systems-Grade Editorial"
Inspired by modern developer-focused platforms (Linear, Vercel, Raycast), the visual design emphasizes technical precision, scannability, and typographic clarity:
- **Color Palette:**
  - **Dark Mode (Default):** Deep slate canvas (`#0B0F17`), elevated card surface (`#111827`), subtle 1px hairline border (`#1F2937`), crisp primary text (`#F9FAFB`), muted secondary text (`#9CA3AF`), and electric cyan/emerald accents (`#38BDF8` / `#10B981`) for active status indicators and merged PR badges.
  - **Light Mode (Toggleable):** Warm alabaster canvas (`#F8FAFC`), pure white surface (`#FFFFFF`), slate borders (`#E2E8F0`), deep ink text (`#0F172A`), muted slate (`#475569`), and deep cobalt/emerald accents (`#0284C7` / `#059669`).
- **Typography:**
  - **UI & English Prose:** `Inter` (system-ui fallback).
  - **Traditional Chinese (`正體中文`) Prose:** `Noto Sans TC` paired harmoniously with `Inter` for mixed English/Chinese articles.
  - **Code, PR Numbers, Metrics & Metadata:** `JetBrains Mono` (`monospace` fallback) with `font-variant-numeric: tabular-nums`.
- **Layout & Navigation:**
  - Centered single-column container (`max-width: 840px`, `padding: 0 1.5rem`) optimized for both 30-second recruiter scanning and long-form technical reading.
  - Sticky top navigation bar with backdrop blur (`About`, `Open Source`, `Experience`, `Skills`, `Writing`, `Contact`, plus Theme Toggle).
  - Fully responsive across desktop (`>= 1024px`), tablet (`768px - 1023px`), and mobile (`< 768px`).

---

## 3. Information Architecture & Page Specifications

The site consists of four routes:

### 3.1 Homepage (`/`)
1. **Hero Section:**
   - **Status Pill:** `Available for AI Inference & Technical PM Opportunities · Active OSS Contributor`
   - **Name & Headline:** `Cheng-Wei (Will) Liu` — `AI Inference Engineer | AI PM`
   - **Value Proposition:** *"Bridging low-level LLM inference optimization (`vLLM`, `SGLang`, `llama.cpp`) and on-prem GPU infrastructure with pragmatic AI product management."*
   - **Primary Actions:** Direct social links (GitHub, LinkedIn, Email) and quick navigation to Open-Source PRs and Writing.

2. **Open-Source Contributions & Featured Projects (`#open-source`):**
   - Highlights upstream contributions to major LLM inference engines and AI security tooling with direct links to merged/active Pull Requests:
     - **SGLang (`sgl-project/sglang`)** — *Contributor (Mar 2026 – Present)*
       - Fast serving framework for Large Language Models and Vision-Language Models.
       - Linked PRs: [`#43293`](https://github.com/sgl-project/sglang/pull/43293), [`#42596`](https://github.com/sgl-project/sglang/pull/42596), [`#42595`](https://github.com/sgl-project/sglang/pull/42595)
       - Tags: `AI Inferencing`, `LLMOps`, `MLOps`
     - **vLLM (`vllm-project/vllm`)** — *Contributor (Mar 2026 – Present)*
       - High-throughput and memory-efficient inference and serving engine for LLMs.
       - Linked PRs: [`#60775`](https://github.com/vllm-project/vllm/pull/60775), [`#58822`](https://github.com/vllm-project/vllm/pull/58822), [`#58666`](https://github.com/vllm-project/vllm/pull/58666)
       - Tags: `AI Inferencing`, `LLMOps`, `MLOps`
     - **llama.cpp (`ggml-org/llama.cpp`)** — *Contributor (Mar 2026 – Present)*
       - Local and edge LLM inference engine in C/C++ with wide hardware acceleration support.
       - Linked PRs: [`#30268`](https://github.com/ggml-org/llama.cpp/pull/30268), [`#29408`](https://github.com/ggml-org/llama.cpp/pull/29408)
       - Tags: `AI Inferencing`, `C/C++`, `Local LLM`
     - **Agent-Threat-Rules** — *Contributor (Mar 2026 – May 2026)*
       - Added support for OpenAI-compatible and local Ollama model integrations, CLI testing workflows, and JSON-mode compatibility options for agent security evaluation.
       - Tags: `AI Security`, `Intelligent Agents`, `Ollama`, `CLI`

3. **Experience & Education Timeline (`#experience`):**
   - **Work Experience:**
     - **AI Inference Engineer and PM** · *Mobiletron Electronics Co Ltd* (Apr 2026 – Present · Taichung City, Taiwan · On-site)
       - Led deployment of on-premises AI infrastructure across two engineering teams, aligning GPU/hardware selection with production workload requirements.
       - Benchmarked and optimized open-source LLMs via quantization and runtime tuning to deliver production-grade throughput and latency.
       - *Skills:* `AI Inferencing`, `Project Management`, `Intelligent Agents`, `Information Security`, `DevOps`, `AWS`
     - **Machine Learning Engineer** · *Saturn Imaging* (Oct 2022 – Sep 2023 · Taipei City, Taiwan · On-site)
       - Independently trained and deployed clinical semantic segmentation models into production medical imaging workflows.
       - Architected a real-time automated notification pipeline integrating LINE Messaging API with CUDA inference servers, saving physicians 2 hours of processing time per workflow cycle.
       - *Skills:* `Semantic Segmentation`, `CUDA`, `System Deployment`, `API Development`, `Data Engineering`
   - **Education:**
     - **National Cheng Kung University (NCKU / 國立成功大學)** — *M.S. in Computer Science (Master of Engineering)* (Feb 2024 – Apr 2026 · Tainan, Taiwan) · **GPA: 3.82** (`MLOps`, `LLMOps`, `Software Design`, `Data Mining`)
     - **National Central University (NCU / 國立中央大學)** — *Bachelor's Degree* (Sep 2017 – Aug 2021 · Taoyuan, Taiwan) · **GPA: 3.70**

4. **Skills & Verified Certifications (`#skills`):**
   - **Categorized Skill Matrix:**
     - **LLM Inference & MLOps:** AI Inferencing, LLMOps, MLOps, Model Quantization & Benchmarking, System Deployment, Deep Learning, Artificial Intelligence (AI)
     - **AI Product & Software Engineering:** Project Management (AI PM), Intelligent Agents, Software Design, Software Development, REST API Development, Python, Java, PostgreSQL, Data Engineering, Data Mining
     - **Cloud, DevOps & Security:** Amazon Web Services (AWS), DevOps, Information Security, LLM & API Security
   - **Licenses & Certifications:**
     - **Certificate of Achievement: Fundamentals of Agents** — *Hugging Face* (Issued Feb 2025)
     - **Securing LLM and NLP APIs** — *APIsec University* (Issued Feb 2025 · [Verify Credential](https://www.credly.com/badges/dd1d57fc-d6cf-4c5a-88e3-14432bec7ef0/linked_in_profile))
     - **API Security Fundamentals** — *APIsec University* (Issued Feb 2025 · [Verify Credential](https://www.credly.com/badges/9b93fafe-d117-4e15-9156-61edcd63a66f/linked_in_profile))

5. **Recent Writing Preview (`#writing`):**
   - Displays the latest 3 blog posts with publication date, language badge (`EN` / `ZH-TW`), estimated reading time, tags, and a "View all articles →" link to `/writing`.

6. **Contact & Footer (`#contact`):**
   - Direct call-to-action for engineering/PM opportunities and open-source collaboration, with email copy/mailto button, GitHub, LinkedIn, and RSS link.

### 3.2 Writing Index (`/writing`)
- Chronological list of all published (`draft: false`) Markdown articles.
- Client-side instant tag/language filter (`All`, `AI PM`, `LLM Inference`, `Open Source`, `ZH-TW`, `EN`).

### 3.3 Article Detail Page (`/writing/[slug]`)
- Clean editorial reading layout with:
  - Title, publication date, estimated reading time, tags, and language indicator.
  - Syntax-highlighted code blocks (Shiki `github-dark` / `github-light`).
  - Automatic table of contents for longer technical posts.
  - "Back to Writing" navigation and previous/next article links.
- **Seeded Initial Articles (based on Will's LinkedIn posts):**
  1. `pm-guide-in-the-ai-era-part-1.md`: *「當 AI 太強，使用者慌了，怎麼應對？」— AI 時代的 PM 指南 (Part 1)* — Explores user anxiety around high-capability AI systems and lessons learned transitioning from a pure AI Inference Engineer to an AI Inference Engineer & PM.
  2. `contributing-to-llm-inference-engines.md`: *Contributing to the Open-Source LLM Inference Ecosystem: Lessons from vLLM, SGLang, and llama.cpp* — Technical reflections on becoming a regular contributor across the three major open-source LLM serving engines.

### 3.4 Custom 404 Page (`/404.html`)
- Styled fallback page matching the site theme with direct links back to `/` and `/writing`.

---

## 4. Technical Architecture & Component Isolation

### 4.1 Stack Choice
- **Framework:** **Astro 5** (`output: 'static'`) — compiles to zero-JS static HTML/CSS by default, with Astro Content Collections (Zod schema validation) for Markdown blog posts.
- **Styling:** Scoped CSS + global CSS custom properties (`src/styles/global.css`) for design tokens, light/dark theming, and responsive grid utilities — zero runtime CSS-in-JS overhead.
- **Testing & Verification:** Vitest + JSDOM/Linkedom build verification tests to validate profile data integrity, Markdown frontmatter schema, rendered HTML output, and absence of broken internal links or leaked private fields.

### 4.2 Directory & Module Structure
Each file has a single, clear responsibility:

```text
personal_webpage/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # Automated GitHub Pages build & deployment
├── public/
│   ├── favicon.svg                     # Custom monochrome/accent SVG monogram ("WL")
│   └── robots.txt                      # Search engine crawler directives
├── src/
│   ├── content.config.ts               # Zod schema for 'blog' Markdown collection
│   ├── content/
│   │   └── blog/
│   │       ├── pm-guide-in-the-ai-era-part-1.md
│   │       └── contributing-to-llm-inference-engines.md
│   ├── data/
│   │   └── profile.ts                  # Single source of truth for Will's profile, PRs, experience, skills
│   ├── components/
│   │   ├── Header.astro                # Sticky nav + theme toggle
│   │   ├── Hero.astro                  # Identity, value prop, status badge, social links
│   │   ├── OpenSourceSection.astro     # OSS cards with clickable GitHub PR pills
│   │   ├── ExperienceTimeline.astro    # Work experience & education timeline
│   │   ├── SkillsAndCerts.astro        # Categorized skills + verified Credly badges
│   │   ├── WritingPreview.astro        # Latest articles section on homepage
│   │   └── Footer.astro                # Contact CTA & links
│   ├── layouts/
│   │   ├── BaseLayout.astro            # HTML head, SEO/OpenGraph tags, theme init script, Header/Footer
│   │   └── PostLayout.astro            # Article typography, metadata header, prev/next nav
│   ├── pages/
│   │   ├── index.astro                 # Portfolio homepage assembling all sections
│   │   ├── 404.astro                   # Custom 404 page
│   │   ├── rss.xml.ts                  # RSS 2.0 feed generator for blog posts
│   │   └── writing/
│   │       ├── index.astro             # Full blog archive with tag filtering
│   │       └── [slug].astro            # Dynamic static path generation for each Markdown post
│   ├── styles/
│   │   └── global.css                  # Design tokens (colors, spacing, typography), prose styles
│   └── utils/
│       └── readingTime.ts              # Pure utility calculating word/character reading time (EN + CJK)
├── tests/
│   ├── profile.test.ts                 # Validates profile data completeness & privacy rules
│   ├── readingTime.test.ts             # Unit tests for English + CJK reading time calculation
│   └── build.test.ts                   # Verifies built dist/ HTML pages, PR links, and RSS output
├── astro.config.mjs                    # Astro configuration with dynamic GitHub Pages site/base support
├── package.json
└── tsconfig.json
```

### 4.3 Data Interfaces
- **`src/data/profile.ts`:** Exports strongly typed interfaces (`ProfileData`, `OssContribution`, `ExperienceItem`, `EducationItem`, `SkillCategory`, `CertificationItem`). Adding a new merged PR to `vLLM` or `SGLang` requires only adding `{ number: 60775, url: 'https://github.com/vllm-project/vllm/pull/60775' }` to the `pullRequests` array.
- **`src/content.config.ts`:** Enforces frontmatter validation at build time:
  - `title`: `string`
  - `description`: `string`
  - `pubDate`: `Date`
  - `updatedDate`: `Date` (optional)
  - `tags`: `string[]`
  - `lang`: `'en' | 'zh-tw' | 'bilingual'`
  - `draft`: `boolean` (default `false`)

### 4.4 GitHub Pages Base Path Resilience
Whether the repository is named `willweimike.github.io` (root path `/`) or a project repository like `personal_webpage` (subpath `/personal_webpage/`), `.github/workflows/deploy.yml` uses `actions/configure-pages` to inject `SITE` and `BASE_PATH` into `astro.config.mjs` automatically at build time, ensuring zero broken asset or internal navigation links.

---

## 5. Error Handling, Testing & Verification Criteria

1. **Build-Time Schema Validation:** Invalid Markdown frontmatter or missing required fields fail the build immediately with descriptive Zod errors.
2. **Privacy Regression Test (`tests/profile.test.ts`):** Automated test asserts that sensitive personal details (phone number `0906065826`, birthday) never appear in `src/data/profile.ts` or the compiled `dist/` directory.
3. **Bilingual Reading Time Utility (`tests/readingTime.test.ts`):** Accurately counts both whitespace-delimited English words and CJK characters so Chinese posts like *《AI 時代的 PM 指南》* display realistic reading times.
4. **Static Output Verification (`tests/build.test.ts`):** Confirms `npm run build` succeeds and generates `dist/index.html`, `dist/writing/index.html`, both seeded blog post pages, `dist/rss.xml`, and `dist/404.html` with all expected PR links (`sglang`, `vllm`, `llama.cpp`).
