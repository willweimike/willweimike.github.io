import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const distIndex = path.resolve(process.cwd(), 'dist/index.html');

describe('Feature: Portfolio Homepage Rendering (BDD Scenarios)', () => {
  it('Scenario: Given the Astro portfolio components, When building the site, Then dist/index.html renders Hero, Open Source PRs, Experience, Skills/Certs, Writing Preview, and Contact', () => {
    execSync('npm run build', { stdio: 'pipe' });
    expect(fs.existsSync(distIndex)).toBe(true);
    const html = fs.readFileSync(distIndex, 'utf-8');
    expect(html).toContain('Cheng-Wei (Will) Liu');
    expect(html).toContain('AI Inference Engineer | AI PM');
    expect(html).toContain('id="open-source"');
    expect(html).toContain('https://github.com/sgl-project/sglang/pull/43293');
    expect(html).toContain('https://github.com/vllm-project/vllm/pull/60775');
    expect(html).toContain('https://github.com/ggml-org/llama.cpp/pull/30268');
    expect(html).toContain('id="experience"');
    expect(html).toContain('Mobiletron Electronics Co Ltd');
    expect(html).toContain('Saturn Imaging');
    expect(html).toContain('id="skills"');
    expect(html).toContain('id="writing"');
    expect(html).toContain('id="contact"');
  }, 60000);
});
