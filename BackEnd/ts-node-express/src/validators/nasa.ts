import { z } from 'zod';


export const apodQuerySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    count: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
}).refine(
    (data) => !data.start_date || !data.end_date ||
        (new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) <= 7 * 24 * 60 * 60 * 1000,
    { message: 'Date range must not exceed 7 days' }
);

export const epicTypeSchema = z.object({
    type: z.enum(['natural', 'enhanced']).default('natural'),
});
export const epicDateSchema = z.object({
    type: z.enum(['natural', 'enhanced']).default('natural'),
});

export const asteroidsQuerySchema = z.object({
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).refine(
    (data) => !data.start_date || !data.end_date ||
        (new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) <= 7 * 24 * 60 * 60 * 1000,
    { message: 'Date range must not exceed 7 days' }
);
export const asteroidIdSchema = z.object({
    id: z.string().min(1, 'Asteroid ID is required'),
});

export const earthImagerySchema = z.object({
    lon: z.string().transform(Number).pipe(
        z.number().min(-180).max(180, 'Longitude must be between -180 and 180')
    ),
    lat: z.string().transform(Number).pipe(
        z.number().min(-90).max(90, 'Latitude must be between -90 and 90')
    ),
    dim: z.string().transform(Number).pipe(
        z.number().min(0.001).max(1, 'Dim must be between 0.001 and 1')
    ).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).strict();
export const earthAssetsSchema = z.object({
    lon: z.string().transform(Number).pipe(
        z.number().min(-180).max(180)
    ),
    lat: z.string().transform(Number).pipe(
        z.number().min(-90).max(90)
    ),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date is required'),
    dim: z.string().transform(Number).pipe(
        z.number().min(0.001).max(1)
    ).optional(),
}).strict();

export const imagesSearchSchema = z.object({
  q: z.string().optional(),
  nasa_id: z.string().optional(),
  media_type: z.enum(['image', 'video', 'audio']).optional(),
  page: z.string().transform(Number).pipe(z.number().min(1).max(1000)).optional(),
}).strict().refine(
  (data) => data.q || data.nasa_id,
  { message: 'Either q or nasa_id is required' }
);
export const imageIdSchema = z.object({
  id: z.string().min(1, 'Image ID is required'),
});