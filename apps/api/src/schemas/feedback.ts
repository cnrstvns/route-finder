import { z } from '@hono/zod-openapi';

export const FeedbackSchema = z
  .object({
    id: z.number().openapi({
      description: 'The unique identifier for the feedback',
      example: 1,
    }),
    userId: z.number().openapi({
      description: 'The unique identifier for the user',
      example: 1,
    }),
    feedbackText: z.string().max(500).openapi({
      description: 'The feedback text',
      example: 'This is a feedback',
    }),
    createdAt: z.string().datetime().openapi({
      description: 'The date and time the feedback was created',
      example: '2021-01-01T00:00:00.000Z',
    }),
  })
  .openapi('Feedback');

export const CreateFeedbackSchema = FeedbackSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
}).openapi('CreateFeedback');

export const PopulatedFeedbackSchema = FeedbackSchema.extend({
  userName: z.string().openapi({
    description: 'The name of the user',
    example: 'John Doe',
  }),
  emailAddress: z.string().email().openapi({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  }),
  profilePictureUrl: z.string().url().openapi({
    description: 'The URL of the user profile picture',
    example: 'https://example.com/profile.png',
  }),
});
