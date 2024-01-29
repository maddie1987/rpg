import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/mariadb';
import { Post } from './model/entity/post.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { throwNoUpdatableEntityException } from '../shared/exceptions/data-handling.exceptions';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: EntityRepository<Post>,
    private readonly em: EntityManager,
  ) {}

  async create(post: Post): Promise<void> {
    const newPost = this.em.create(Post, post);
    await this.em.persistAndFlush(newPost);
  }

  async existsPostForChapter(chapterId: number): Promise<boolean> {
    const count = await this.postRepository.count({
      chapter: { id: chapterId },
    });
    return count > 0;
  }

  async getLastPosition(chapterId: number): Promise<string | undefined> {
    return this.postRepository
      .find(
        { chapter: { id: chapterId } },
        {
          orderBy: { position: 'DESC' },
          limit: 1,
          populate: ['position'],
        },
      )
      .then((posts) => {
        if (posts.length === 0) return undefined;
        else return posts[0].position;
      });
  }

  async getNextPosition(
    chapterId: number,
    position: string,
  ): Promise<string | undefined> {
    return this.postRepository
      .find(
        {
          chapter: { id: chapterId },
          position: { $gt: position },
        },
        {
          orderBy: { position: 'ASC' },
          limit: 1,
          populate: ['position'],
        },
      )
      .then((posts) => {
        if (posts.length === 0) return undefined;
        else return posts[0].position;
      });
  }

  async findAllSortedByPosition(chapterId: number): Promise<Post[]> {
    return this.postRepository.find(
      {
        chapter: { id: chapterId },
      },
      {
        populate: [
          'id',
          'position',
          'text',
          'chapter.id',
          'chapter.title',
          'lastUpdate',
          'year',
          'roleName',
        ],
        orderBy: { position: 'ASC' },
      },
    );
  }

  async checkExistence(chapterId: number, id: number): Promise<void> {
    const count = await this.postRepository.count({
      id,
      chapter: { id: chapterId },
    });
    if (count === 0) throwNoUpdatableEntityException(id);
  }

  async deleteById(chapterId: number, id: number): Promise<void> {
    await this.postRepository.nativeDelete({
      id,
      chapter: { id: chapterId },
    });
  }
}
