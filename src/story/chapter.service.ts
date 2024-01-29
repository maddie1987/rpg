import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/mariadb';
import { Chapter } from './model/entity/chapter.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { throwNoUpdatableEntityException } from '../shared/exceptions/data-handling.exceptions';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: EntityRepository<Chapter>,
    private readonly em: EntityManager,
  ) {}

  async create(chapter: Chapter): Promise<void> {
    const newChapter = this.em.create(Chapter, chapter);
    await this.em.persistAndFlush(newChapter);
  }

  async update(chapter: Chapter): Promise<void> {
    await this.em.persistAndFlush(chapter);
  }

  async findById(id: number): Promise<Chapter> {
    return this.chapterRepository.findOneOrFail(
      { id },
      { failHandler: () => throwNoUpdatableEntityException(id) },
    );
  }

  async findAllSortedByYear(): Promise<Chapter[]> {
    return this.chapterRepository.findAll({
      orderBy: { posts: { year: 'DESC' } },
    });
  }

  async checkExistence(id: number): Promise<void> {
    const count = await this.chapterRepository.count({ id });
    if (count === 0) throwNoUpdatableEntityException(id);
  }

  async deleteById(id: number): Promise<void> {
    await this.chapterRepository.nativeDelete({ id });
  }
}
