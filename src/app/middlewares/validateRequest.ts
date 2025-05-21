import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validateRequest =
    (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body
            });
            console.log('☑️ validateRequest middleware...');
            return next();
        } catch (err) {
            console.log('🟥 validateRequest middleware...');
            next(err);
        }
    };
