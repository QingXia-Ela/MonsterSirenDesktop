import { defineCollection, z } from 'astro:content';
export const collections = {
  'docs': defineCollection({
    type: 'content',
    schema: z.any()
  }),
};