import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateReadingTime } from '../src/utils/readingTime';

describe('Feature: Bilingual Technical Blog & Reading Time Estimation (calculateReadingTime)', () => {
  it('Scenario: Given empty or very short input, When calculating reading time, Then returns a minimum of 1 min read', () => {
    expect(calculateReadingTime('').minutes).toBe(1);
    expect(calculateReadingTime('Hello world').label).toBe('1 min read');
  });

  it('Scenario: Given English prose (~220 wpm), When calculating reading time, Then returns accurate minutes', () => {
    const englishWords = Array.from({ length: 450 }, () => 'inference').join(' ');
    const result = calculateReadingTime(englishWords);
    expect(result.minutes).toBe(3);
    expect(result.label).toBe('3 min read');
  });

  it('Scenario: Given Traditional Chinese CJK prose (~350 cpm) without spaces, When calculating reading time, Then counts CJK characters accurately', () => {
    const cjkChars = '推'.repeat(700);
    const result = calculateReadingTime(cjkChars);
    expect(result.minutes).toBe(2);
    expect(result.wordCount).toBe(700);
  });

  it('Scenario: Given Markdown with large fenced code blocks, When calculating reading time, Then code blocks do not inflate reading time', () => {
    const prose = 'Short intro paragraph.';
    const hugeCodeBlock = '```python\n' + 'x = 1\n'.repeat(1000) + '```';
    const result = calculateReadingTime(`${prose}\n\n${hugeCodeBlock}`);
    expect(result.minutes).toBe(1);
  });
});

describe('Feature: Seeded Markdown Blog Posts Schema & Content', () => {
  const blogDir = path.resolve(process.cwd(), 'src/content/blog');

  it('Scenario: Given src/content/blog/, When checking initial seeded articles, Then both articles exist with valid frontmatter and non-empty body', () => {
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
