import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca uma rota como pública (sem necessidade de JWT).
 * Usado pelo JwtAuthGuard global para liberar /auth/login, /auth/register, etc.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
