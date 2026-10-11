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
  zhName: '劉承威',
  handle: 'willweimike',
  headline: 'AI Inference Engineer | AI PM',
  tagline:
    'Bridging production-grade LLM inference optimization (vLLM, SGLang, llama.cpp) and on-prem GPU infrastructure with pragmatic AI product management.',
  statusBadge: 'Active OSS Contributor · vLLM · SGLang · llama.cpp',
  location: 'Taichung City, Taiwan',
  about: [
    'I am an AI Inference Engineer who works across the stack—from benchmarking quantized LLMs and deploying on-premises GPU clusters to aligning model capabilities with real production workflows and user trust.',
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
        { number: 29309, url: 'https://github.com/ggml-org/llama.cpp/pull/29309' },
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
        'NVIDIA DGX Spark',
        'AMD Strix Halo',
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
