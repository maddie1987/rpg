import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Chapter } from './model/entity/chapter.entity';
import { StoryController } from './story.controller';
import { StoryFacade } from './story.facade';
import { ChapterService } from './chapter.service';
import { PositionProvider } from './position.provider';
import { PostService } from './post.service';
import { Post } from './model/entity/post.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Chapter, Post] })],
  controllers: [StoryController],
  providers: [PostService, ChapterService, StoryFacade, PositionProvider],
})
export class StoryModule {}
