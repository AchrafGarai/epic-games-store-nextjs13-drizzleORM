import { z } from 'zod'

export const createGameSchema = z.object({
  title: z.string(),
  releaseDate: z.string().pipe(z.coerce.date()),
  screenshots: z.array(
    z.object({
      mediaUrl: z.string().url(),
      mediaType: z.enum(['image', 'video']),
    }),
  ),
  categories: z.array(z.string()),
  price: z.number().pipe(z.coerce.string()),
  coverImageUrl: z.string().url().optional(),
  bannerImageUrl: z.string().url().optional(),
  gameDescription: z.string().optional(),
})
