import { z } from 'zod';

const createEvents = z.object({
    organizerId: z.string({ required_error: 'organizerId is required' }),
    event: z.object({
        title: z.string({ required_error: 'title is required' }),
        description: z.string({ required_error: 'description is required' }),
        date_time: z.string({ required_error: 'date_time is required' }).refine(
            (value) => {
                const eventDate = new Date(value);
                const now = new Date();
                return eventDate >= now;
            },
            {
                message: 'date_time cannot be in the past'
            }
        ),
        venue: z.string({ required_error: 'venue is required' }),
        location: z.string({ required_error: 'location is required' }),
        is_public: z.boolean().optional().default(true),
        is_paid: z.boolean().optional().default(false),
        registration_fee: z
            .number({ required_error: 'registration_fee is required' })
            .nonnegative({
                message: 'registration_fee must be positive or zero'
            }),
        status: z
            .enum(['UPCOMING', 'ONGOING', 'COMPLETED'], {
                required_error: 'status is required'
            })
            .optional()
    })
});

const updateEvent = z.object({
    event: z.object({
        title: z.string({ required_error: 'title is required' }).optional(),
        description: z
            .string({ required_error: 'description is required' })
            .optional(),
        date_time: z
            .string({ required_error: 'date_time is required' })
            .refine(
                (value) => {
                    const eventDate = new Date(value);
                    const now = new Date();
                    return eventDate >= now;
                },
                {
                    message: 'date_time cannot be in the past'
                }
            )
            .optional(),
        venue: z.string({ required_error: 'venue is required' }).optional(),
        location: z
            .string({ required_error: 'location is required' })
            .optional(),
        is_public: z.boolean().optional().default(true).optional(),
        is_paid: z.boolean().optional().default(false).optional(),
        registration_fee: z
            .number({ required_error: 'registration_fee is required' })
            .nonnegative({
                message: 'registration_fee must be positive or zero'
            })
            .optional(),
        status: z
            .enum(['UPCOMING', 'ONGOING', 'COMPLETED'], {
                required_error: 'status is required'
            })
            .optional()
    })
});

const joinEventSchema = z.object({
    body: z.object({
        eventId: z.string({ required_error: 'eventId is required' }),
        paymentId: z
            .string({ required_error: 'paymentId is required' })
            .optional(),
        payment_status: z.enum(['FREE', 'COMPLETED', 'REFUNDED'], {
            required_error: 'payment_status is required',
            invalid_type_error:
                'payment_status must be FREE, COMPLETED, or REFUNDED'
        })
    })
});

export const EventsValidation = {
    createEvents,
    updateEvent,
    joinEventSchema
};
