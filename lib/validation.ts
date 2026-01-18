import { z } from 'zod';

// Common validation schemas
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)/,
    'Password must contain at least one letter and one number'
  );

const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(254, 'Email address too long');

const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number too long');

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters long')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, 'Name can only contain letters and spaces');

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Tour schemas
export const tourCreateSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(2000, 'Description too long'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters long')
    .max(100, 'Location too long'),
  price: z
    .number()
    .min(0, 'Price must be non-negative')
    .max(999999, 'Price too high'),
  maxParticipants: z
    .number()
    .int('Max participants must be an integer')
    .min(1, 'Max participants must be at least 1')
    .max(100, 'Max participants too high'),
  duration: z
    .number()
    .int('Duration must be an integer')
    .min(1, 'Duration must be at least 1 day')
    .max(30, 'Duration too long'),
  latitude: z
    .number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude')
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude')
    .optional(),
  photoURL: z
    .string()
    .url('Invalid photo URL')
    .optional()
    .nullable(),
});

export const tourUpdateSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  location: z.string().min(2, 'Location must be at least 2 characters').optional(),
  price: z.number().positive('Price must be positive').optional(),
  maxParticipants: z.number().positive('Max participants must be positive').optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photoURL: z.string().url().optional(),
});

// Booking schemas
export const bookingCreateSchema = z.object({
  tourId: z
    .number()
    .int('Tour ID must be an integer')
    .positive('Tour ID must be positive'),
  guestName: nameSchema,
  guestEmail: emailSchema,
  guestPhone: phoneSchema,
  participants: z
    .number()
    .int('Number of participants must be an integer')
    .min(1, 'At least 1 participant required')
    .max(20, 'Too many participants'),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED']).optional(),
  paymentInfo: z.object({
    cardHolderName: z.string(),
    paymentMethod: z.enum(['card', 'mobile', 'wallet']),
    cardNumber: z.string(),
    expiryDate: z.string(),
    cvv: z.string(),
    billingAddress: z.object({
      street: z.string(),
      city: z.string(),
      country: z.string(),
      postalCode: z.string(),
    }),
    transactionId: z.string(),
    amount: z.number(),
    currency: z.string(),
    status: z.enum(['PENDING', 'PAID']),
    timestamp: z.string(),
  }).optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Review schemas
export const reviewCreateSchema = z.object({
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters long')
    .max(1000, 'Comment too long'),
  tourId: z
    .number()
    .int('Tour ID must be an integer')
    .positive('Tour ID must be positive'),
});

export const reviewUpdateSchema = z.object({
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters long')
    .max(1000, 'Comment too long')
    .optional(),
});

// User profile schemas
export const userUpdateSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
});

// Admin user management schemas
export const adminUserUpdateSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  role: z.enum(['user', 'admin']).optional(),
  isActive: z.boolean().optional(),
});

// Validation error response helper
export function formatZodError(error: z.ZodError) {
  return {
    error: 'Validation failed',
    details: error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    })),
  };
}

// Request validation helper
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true;
  data: T;
} | {
  success: false;
  error: ReturnType<typeof formatZodError>;
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { 
    success: false, 
    error: formatZodError(result.error) 
  };
}
