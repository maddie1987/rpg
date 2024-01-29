import { Injectable } from '@nestjs/common';
import { ChapterDto } from './model/schema/chapter.schema';
import { Chapter } from './model/entity/chapter.entity';
import { ChapterService } from './chapter.service';

@Injectable()
export class ChapterFacade {
  constructor(private readonly chapterService: ChapterService) {}

  async createChapter(input: ChapterDto): Promise<void> {
    const newChapter = {
      title: input.title,
    } as Chapter;
    await this.chapterService.create(newChapter);
  }

  async updateChapter(id: number, input: ChapterDto): Promise<void> {
    const existingChapter = await this.chapterService.findById(id);
    existingChapter.title = input.title;
    await this.chapterService.update(existingChapter);
  }

  async retrieveChapters(): Promise<ChapterDto[]> {
    return this.chapterService.findAllSortedByYear().then((chapters) =>
      chapters.map((chapter) => {
        return {
          id: chapter.id,
          title: chapter.title,
        } as ChapterDto;
      }),
    );
  }

  async deleteChapter(id: number): Promise<void> {
    await this.chapterService.deleteById(id);
  }
}
