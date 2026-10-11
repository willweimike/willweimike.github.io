import { beforeAll, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');

describe('Feature: Static Production Build & GitHub Pages Output (BDD Scenarios)', () => {
  beforeAll(() => {
    fs.rmSync(distDir, { recursive: true, force: true });
    execSync('npm run build', { stdio: 'pipe' });
  }, 60000);

  it('Scenario: Given the Astro site without Writing pages, When npm run build completes, Then dist/ contains homepage and 404 page and no writing/ or rss.xml output', () => {
    expect(fs.existsSync(path.join(distDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, '404.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'writing'))).toBe(false);
    expect(fs.existsSync(path.join(distDir, 'rss.xml'))).toBe(false);
    expect(
      fs.existsSync(path.resolve(process.cwd(), 'src/components/WritingPreview.astro'))
    ).toBe(false);
    expect(
      fs.existsSync(path.resolve(process.cwd(), 'src/layouts/PostLayout.astro'))
    ).toBe(false);
    expect(
      fs.existsSync(path.resolve(process.cwd(), 'src/pages/writing'))
    ).toBe(false);
  });

  it('Scenario: Visitor inspects Hero, Open-Source PRs, Experience, Skills/Certs, and Contact on homepage with safe rel attributes and no Writing references', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const notFoundHtml = fs.readFileSync(path.join(distDir, '404.html'), 'utf-8');
    expect(indexHtml).toContain('Cheng-Wei (Will) Liu');
    expect(indexHtml).toContain('劉承威');
    expect(indexHtml).not.toContain('劉承瑋');
    expect(indexHtml).toContain('AI Inference Engineer | AI PM');
    expect(indexHtml).toContain('id="open-source"');
    expect(indexHtml).toContain('https://github.com/sgl-project/sglang/pull/43293');
    expect(indexHtml).toContain('https://github.com/vllm-project/vllm/pull/60775');
    expect(indexHtml).toContain('https://github.com/ggml-org/llama.cpp/pull/30268');
    expect(indexHtml).toContain('https://github.com/ggml-org/llama.cpp/pull/29309');
    expect(indexHtml).toContain('id="experience"');
    expect(indexHtml).toContain('Mobiletron Electronics Co Ltd');
    expect(indexHtml).toContain('Saturn Imaging');
    expect(indexHtml).toContain('id="skills"');
    expect(indexHtml).toContain('NVIDIA DGX Spark');
    expect(indexHtml).toContain('AMD Strix Halo');
    expect(indexHtml).not.toContain('id="writing"');
    expect(indexHtml).not.toContain('/writing');
    expect(indexHtml).not.toContain('Writing');
    expect(indexHtml).not.toContain('rss.xml');
    expect(indexHtml).not.toContain('RSS ↗');
    expect(notFoundHtml).not.toContain('/writing');
    expect(notFoundHtml).not.toContain('Writing');
    expect(indexHtml).toContain('id="contact"');
    expect(indexHtml).toContain('04 / CONTACT');
    expect(indexHtml).not.toContain('05 / CONTACT');
    const footerHtml = indexHtml.split('<footer')[1] ?? '';
    expect(footerHtml).not.toContain('Taichung City, Taiwan');
    expect(indexHtml).toContain(
      'https://www.credly.com/badges/dd1d57fc-d6cf-4c5a-88e3-14432bec7ef0/linked_in_profile'
    );
    expect(indexHtml).toContain('rel="noopener noreferrer"');
  });

  it('Scenario: Sensitive personal data from LinkedIn never leaks in any built HTML file', () => {
    const filesToCheck = ['index.html', '404.html'];

    for (const file of filesToCheck) {
      const content = fs.readFileSync(path.join(distDir, file), 'utf-8');
      expect(content).not.toContain('0906065826');
      expect(content.toLowerCase()).not.toContain('october 3');
      expect(content).not.toContain('10月3日');
    }
  });

  it('Scenario: GitHub Actions workflow runs the full test suite including build.test.ts', () => {
    const workflowYaml = fs.readFileSync(
      path.resolve(process.cwd(), '.github/workflows/deploy.yml'),
      'utf-8'
    );
    expect(workflowYaml).toContain('npm test');
  });
});
