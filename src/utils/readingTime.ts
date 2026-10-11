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
