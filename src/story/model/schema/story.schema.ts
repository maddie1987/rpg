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

export class ChapterOutput extends createZodDto(ChapterSchema) {}

export const PostInputSchema = extendApi(
  z.object({
    text: extendApi(z.string(), {
      description: 'The content of the post',
    }),
    year: extendApi(z.number().optional(), {
      description: 'The year in which the plot is currently placed.',
      example: 2023,
    }),
    roleName: extendApi(z.string(), {
      description: 'The name of the role developed in this post.',
      example: 'Bert the Beetle',
    }),
    predecessor: extendApi(z.string().optional(), {
      description: 'The position of the post before this one.',
      example: 1,
    }),
  }),
);

export class PostInput extends createZodDto(PostInputSchema) {}

export const PostSchema = extendApi(
  z.object({
    id: extendApi(z.number(), {
      description: 'The id of the post if one already exists',
      example: 1,
    }),
    position: extendApi(z.string(), {
      description: 'The position of the post in the chapter',
      example: '1.2.0.2',
    }),
    text: extendApi(z.string(), {
      description: 'The content of the post',
    }),
    year: extendApi(z.number().optional(), {
      description: 'The year in which the plot is currently placed.',
      example: 2023,
    }),
    chapter: ChapterSchema,
    lastUpdate: extendApi(z.string(), {
      description: 'The timestamp of the last update of the post',
      example: '2021-04-23T18:25:43.511Z',
    }),
    roleName: extendApi(z.string(), {
      description: 'The name of the role developed in this post.',
      example: 'Bert the Beetle',
    }),
  }),
);

export class PostOutput extends createZodDto(PostSchema) {}
