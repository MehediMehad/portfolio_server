import type { z } from 'zod';
import type {
    createBlogSchema,
    updateBlogSchema,
} from './blog.validation';

export type TCreateBlogPayload = z.infer<typeof createBlogSchema>;
export type TUpdateBlogPayload = z.infer<typeof updateBlogSchema>;


export type TBlogFilter = {
    searchTerm?: string;
    tags?: string;
}
