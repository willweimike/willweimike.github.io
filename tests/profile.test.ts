import { describe, expect, it } from 'vitest';
import { profileData } from '../src/data/profile';
import { withBase } from '../src/utils/url';

describe('Feature: GitHub Pages Subpath Resilience (withBase URL helper)', () => {
  it('Scenario: Given root base path "/", When resolving internal routes, Then paths remain root-relative', () => {
    expect(withBase('/writing', '/')).toBe('/writing');
    expect(withBase('/', '/')).toBe('/');
    expect(withBase('/#open-source', '/')).toBe('/#open-source');
  });

  it('Scenario: Given repository subpath "/personal_webpage", When resolving internal routes, Then paths are prefixed cleanly', () => {
    expect(withBase('/writing', '/personal_webpage')).toBe('/personal_webpage/writing');
    expect(withBase('/writing/', '/personal_webpage/')).toBe('/personal_webpage/writing/');
    expect(withBase('/', '/personal_webpage')).toBe('/personal_webpage/');
    expect(withBase('/#open-source', '/personal_webpage')).toBe('/personal_webpage/#open-source');
  });
});

describe('Feature: Portfolio Identity, Open-Source Contributions, and Privacy Protection', () => {
  it('Scenario: Visitor views Will Liu core identity and public contact channels', () => {
    expect(profileData.name).toBe('Cheng-Wei (Will) Liu');
    expect(profileData.headline).toBe('AI Inference Engineer | AI PM');
    expect(profileData.location).toBe('Taichung City, Taiwan');
    expect(profileData.contact.github).toBe('https://github.com/willweimike/');
    expect(profileData.contact.linkedin).toBe('https://www.linkedin.com/in/willweimike');
    expect(profileData.contact.email).toBe('willie20220101@gmail.com');
  });

  it('Scenario: Sensitive personal data from LinkedIn (phone and birthday) is strictly excluded', () => {
    const serialized = JSON.stringify(profileData);
    expect(serialized).not.toContain('0906065826');
    expect(serialized.toLowerCase()).not.toContain('october 3');
    expect(serialized).not.toContain('10月3日');
    expect(serialized).not.toContain('10 月 3 日');
  });

  it('Scenario: Visitor inspects all 4 open-source projects and exact upstream PR links', () => {
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

  it('Scenario: Visitor inspects verified experience, education, skill categories, and Credly certifications', () => {
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
