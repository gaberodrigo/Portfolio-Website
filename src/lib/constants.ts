export type Service = {
  title: string;
  description: string;
  href?: string;
};

export type ArticleItem = {
  source: string;
  title: string;
  href: string;
  previewImage: string;
};

export type Testimonial = {
  rating: number; // 0-5
  quote: string;
};

export const services: Service[] = [
  {
    title: "Web Design",
    description: "High-contrast, minimal, conversion-focused UI.",
  },
  {
    title: "Web Development",
    description: "Composable Next.js apps with strong UX fundamentals.",
  },
  {
    title: "SEO",
    description: "Performance-first SEO structure for consistent growth.",
  },
  {
    title: "Content & Strategy",
    description: "Clear messaging that turns visitors into leads.",
  },
  {
    title: "Performance",
    description: "Fast loads, smooth interactions, and pragmatic UX.",
  },
  {
    title: "Photography & Videography",
    description: "Professional visual storytelling for brands and businesses.",
    href: "/vellichor-visions",
  },
];

export const articles: ArticleItem[] = [
  {
    source: "BBC News",
    title: "Reddit's human content wins amid the AI flood",
    href: "https://www.bbc.com/news/articles/c5y4zl0w062o",
    previewImage: "/images/articles/article-01.png",
  },
  {
    source: "National Gallery of Art",
    title: "10 Ways to Cultivate Everyday Awe",
    href: "https://www.nga.gov/stories/articles/10-ways-cultivate-everyday-awe",
    previewImage: "/images/articles/article-02.png",
  },
  {
    source: "IBM",
    title: "What is artificial intelligence (AI)?",
    href: "https://www.ibm.com/think/topics/artificial-intelligence",
    previewImage: "/images/articles/article-03.png",
  },
  {
    source: "The Wall Street Journal",
    title: "Anthropic’s Claude Code and AI developer tooling",
    href: "https://www.wsj.com/tech/ai/anthropic-claude-code-ai-7a46460e",
    previewImage: "/images/articles/article-04.png",
  },
  {
    source: "The New Stack",
    title: "Hands-On With Antigravity: Google’s Newest AI Coding Experiment",
    href: "https://thenewstack.io/hands-on-with-antigravity-googles-newest-ai-coding-experiment/",
    previewImage: "/images/articles/article-05.png",
  },
];

export const testimonials: Testimonial[] = [
  {
    rating: 5,
    quote: "Clarity, speed, and polish. The result felt premium from day one.",
  },
  {
    rating: 5,
    quote: "The backend is clean and reliable. The UI holds up as we scale.",
  },
  {
    rating: 5,
    quote: "Great communication and excellent execution. Highly recommended.",
  },
];

