import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    author: z.string(),
    date: z.string(),
    githubUrl: z.string().url(),
    liveUrl: z.string().optional(),
    primaryLanguage: z.string(),
    stack: z.array(z.string()),
    metrics: z.object({
      throughput: z.string(),
      latency: z.string(),
      memoryUsage: z.string(),
      binarySize: z.string().optional(),
      uptime: z.string().optional(),
    }),
    seo: z.object({
      focusKeyword: z.string(),
      secondaryKeywords: z.array(z.string()),
      schemaType: z.string(),
    }),
  }),
});

export const collections = {
  projects,
};
