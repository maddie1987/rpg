import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { StoryModule } from './story/story.module';

@Module({
  imports: [DatabaseModule, StoryModule],
})
export class AppModule {}
