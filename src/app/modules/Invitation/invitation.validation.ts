import { z } from 'zod';

const sendInviteUserValidationSchema = z.object({
    body: z.object({
        receiverId: z.string({ message: 'receiverId is required' })
    })
});

export const InvitationSValidation = {
    sendInviteUserValidationSchema
};
