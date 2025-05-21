import { z } from 'zod';
const ratingValues = [1, 2, 3, 4, 5] as const;
// Create review schema
const createReviewSchema = z.object({
    body: z.object({
        eventId: z.string({
            required_error: 'Event ID is required',
            invalid_type_error: 'Event ID must be a string'
        }),

        rating: z
            .enum(ratingValues.map(String) as [string, ...string[]], {
                errorMap: () => ({
                    message: 'Rating must be one of 1, 2, 3, 4, or 5'
                })
            })
            .transform(Number), // Convert to number if needed in service

        comment: z
            .string()
            .max(1000, 'Comment cannot exceed 1000 characters')
            .optional()
            .nullable()
            .default(null)
    })
});

export const ReviewsValidation = {
    createReviewSchema
};
