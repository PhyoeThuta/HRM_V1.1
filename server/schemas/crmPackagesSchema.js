import { z } from 'zod';

export const packageBodySchema = z.object({
  name: z.string().min(1, 'Package name is required'),
  duration: z.string().min(1, 'Duration is required'),
  meal_type: z.enum([
    'LUNCH, DINNER',
    'LUNCH ONLY',
    'DINNER ONLY',
    'BREAKFAST, LUNCH, DINNER'
  ], {
    errorMap: () => ({ message: 'Invalid meal type. Must be one of the predefined options.' })
  }),
  meal_count: z.number().int().positive('Meal count must be a positive integer'),
  amount: z.number().nonnegative('Amount cannot be negative'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start_date format (YYYY-MM-DD)'),
  expires_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid expires_at format (YYYY-MM-DD)'),
  payment_status: z.enum(['Paid', 'Unpaid', 'Refunded', 'Partial']).default('Unpaid'),
  status: z.enum(['Active', 'Upcoming', 'Paused', 'Completed', 'Cancelled', 'Refunded']).default('Active')
});

export const resumePackageSchema = z.object({
  days_paused: z.number().int().nonnegative('Days paused cannot be negative').optional().default(0)
});
