import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

export const ChapterInputSchema = extendApi(
  z.object({
    title: extendApi(z.string(), {
      description: 'The title of the chapter',
      example: 'Chapter One',
    }),
  }),
);

export class ChapterInput extends createZodDto(ChapterInputSchema) {}

export const ChapterSchema = extendApi(
  z.object({
    id: extendApi(z.number(), {
      description: 'The id of the chapter if one already exists',
      example: 1,
    }),
    title: extendApi(z.string(), {
      description: 'The title of the chapter',
      example: 'Chapter One',
    }),
  }),
);

export class Chapter extends createZodDto(ChapterSchema) {}

export type ChapterDto = z.infer<typeof ChapterSchema>;
