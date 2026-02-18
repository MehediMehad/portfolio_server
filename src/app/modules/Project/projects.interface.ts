import type { z } from 'zod';
import { createProjectSchema } from './projects.validation';

export type TCreateProjectPayload = z.infer<typeof createProjectSchema>;

export type TProjectsFilter = {
    searchTerm?: string;
    techStack?: string;
    is_public?: boolean;
}
