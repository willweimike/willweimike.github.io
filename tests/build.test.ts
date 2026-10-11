import { beforeAll, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');

describe('Feature: Static Production Build, Blog Routes, RSS Feed & GitHub Pages Output (BDD Scenarios)', () => {
  beforeAll(() => {
    execSync('npm run build', { stdio: 'pipe' });
  }, 60000);

  it('Scenario: Given the full Astro site, When npm run build completes, Then dist/ contains homepage, writing index, both blog articles, 404 page, and RSS feed', () => {
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

  it('Scenario: Visitor inspects Hero, Open-Source PRs, Experience, Skills/Certs, Writing Preview, and Contact on homepage with safe rel attributes', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    expect(indexHtml).toContain('Cheng-Wei (Will) Liu');
    expect(indexHtml).toContain('AI Inference Engineer | AI PM');
    expect(indexHtml).toContain('id="open-source"');
    expect(indexHtml).toContain('https://github.com/sgl-project/sglang/pull/43293');
    expect(indexHtml).toContain('https://github.com/vllm-project/vllm/pull/60775');
    expect(indexHtml).toContain('https://github.com/ggml-org/llama.cpp/pull/30268');
    expect(indexHtml).toContain('id="experience"');
    expect(indexHtml).toContain('Mobiletron Electronics Co Ltd');
    expect(indexHtml).toContain('Saturn Imaging');
    expect(indexHtml).toContain('id="skills"');
    expect(indexHtml).toContain('id="writing"');
    expect(indexHtml).toContain('id="contact"');
    expect(indexHtml).toContain(
      'https://www.credly.com/badges/dd1d57fc-d6cf-4c5a-88e3-14432bec7ef0/linked_in_profile'
    );
    expect(indexHtml).toContain('rel="noopener noreferrer"');
  });

  it('Scenario: Sensitive personal data from LinkedIn never leaks in any built HTML/XML file', () => {
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

  it('Scenario: Published articles appear in valid RSS 2.0 XML while drafts stay excluded', () => {
    const rssXml = fs.readFileSync(path.join(distDir, 'rss.xml'), 'utf-8');
    expect(rssXml).toContain('<rss version="2.0"');
    expect(rssXml).toContain('AI 時代的 PM 指南');
    expect(rssXml).toContain('Contributing to the Open-Source LLM Inference Ecosystem');
    const itemCount = (rssXml.match(/<item>/g) ?? []).length;
    expect(itemCount).toBe(2);
  });

  it('Scenario: GitHub Actions workflow runs the full test suite including build.test.ts', () => {
    const workflowYaml = fs.readFileSync(
      path.resolve(process.cwd(), '.github/workflows/deploy.yml'),
      'utf-8'
    );
    expect(workflowYaml).toContain('npm test');
  });

  it('Scenario: Writing archive (/writing) includes language filter buttons (ZH-TW and EN) alongside topic tags', () => {
    const writingHtml = fs.readFileSync(path.join(distDir, 'writing/index.html'), 'utf-8');
    expect(writingHtml).toContain('data-tag="ZH-TW"');
    expect(writingHtml).toContain('data-tag="EN"');
  });

  it('Scenario: Article detail pages render previous/next article navigation links', () => {
    const post1Html = fs.readFileSync(
      path.join(distDir, 'writing/pm-guide-in-the-ai-era-part-1/index.html'),
      'utf-8'
    );
    const post2Html = fs.readFileSync(
      path.join(distDir, 'writing/contributing-to-llm-inference-engines/index.html'),
      'utf-8'
    );
    expect(post1Html).toContain('class="post-nav');
    expect(post1Html).toContain('/writing/contributing-to-llm-inference-engines');
    expect(post2Html).toContain('class="post-nav');
    expect(post2Html).toContain('/writing/pm-guide-in-the-ai-era-part-1');
  });
});
