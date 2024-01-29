import { Injectable } from '@nestjs/common';
import {
  ChapterInput,
  ChapterOutput,
  PostInput,
  PostOutput,
} from './model/schema/story.schema';
import { Chapter } from './model/entity/chapter.entity';
import { ChapterService } from './chapter.service';
import { PostService } from './post.service';
import { PositionProvider } from './position.provider';
import { Post } from './model/entity/post.entity';

@Injectable()
export class StoryFacade {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly postService: PostService,
    private readonly positionProvider: PositionProvider,
  ) {}

  async createChapter(input: ChapterInput): Promise<void> {
    const newChapter = {
      title: input.title,
    } as Chapter;
    await this.chapterService.create(newChapter);
  }

  async createPost(chapterId: number, input: PostInput): Promise<void> {
    const chapter = await this.chapterService.findById(chapterId);
    const predecessor = input.predecessor;

    const newPost: Post = {
      position: await this.positionProvider.determinePosition(
        chapterId,
        predecessor,
      ),
      year: input.year,
      text: input.text,
      chapter,
      roleName: input.roleName,
    } as Post;
    await this.postService.create(newPost);
  }

  async updateChapter(id: number, input: ChapterInput): Promise<void> {
    const existingChapter = await this.chapterService.findById(id);
    existingChapter.title = input.title;
    await this.chapterService.update(existingChapter);
  }

  async retrieveChapters(): Promise<ChapterOutput[]> {
    return this.chapterService.findAllSortedByYear().then((chapters) =>
      chapters.map((chapter) => {
        return {
          id: chapter.id,
          title: chapter.title,
        } as ChapterOutput;
      }),
    );
  }

  async retrievePostsForChapter(chapterId: number): Promise<PostOutput[]> {
    await this.chapterService.checkExistence(chapterId);
    return this.postService.findAllSortedByPosition(chapterId).then((posts) =>
      posts.map((post) => {
        return {
          id: post.id,
          position: post.position,
          year: post.year,
          text: post.text,
          roleName: post.roleName,
          chapter: {
            id: post.chapter.id,
            title: post.chapter.title,
          },
        } as PostOutput;
      }),
    );
  }

  async deleteChapter(id: number): Promise<void> {
    await this.chapterService.checkExistence(id);
    await this.chapterService.deleteById(id);
  }

  async deletePost(chapterId: number, id: number): Promise<void> {
    await this.postService.checkExistence(chapterId, id);
    await this.postService.deleteById(chapterId, id);
  }
}
