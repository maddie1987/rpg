import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ChapterOutput,
  ChapterInput,
  PostInput,
  PostOutput,
} from './model/schema/story.schema';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { StoryFacade } from './story.facade';
import { NoUpdatableEntityException } from '../shared/exceptions/data-handling.exceptions';

@ApiTags('Story CRUD')
@ApiProduces('application/json')
@ApiConsumes('application/json')
@UsePipes(ZodValidationPipe)
@Controller()
export class StoryController {
  constructor(private readonly storyFacade: StoryFacade) {}

  @Post('chapter')
  @ApiOperation({
    summary: 'Chapter creation',
    description: 'Create a new chapter of the story.',
  })
  @ApiBody({
    type: ChapterInput,
    description: 'Metadata of the chapter to be created.',
  })
  @ApiCreatedResponse({
    description: 'The new chapter has been created.',
  })
  @ApiBadRequestResponse({
    description: 'The given metadata is not valid.',
  })
  async createChapter(@Body() chapterInput: ChapterInput) {
    await this.storyFacade.createChapter(chapterInput);
  }

  @Patch('chapter/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Chapter update',
    description: 'Update the metadata of a chapter.',
  })
  @ApiBody({
    type: ChapterInput,
    description: 'New metadata of the chapter to be updated.',
  })
  @ApiNoContentResponse({
    description: 'Update successful.',
  })
  @ApiNotFoundResponse({
    description: 'The entity does not exist.',
  })
  @ApiBadRequestResponse({
    description: 'The given metadata is not valid.',
  })
  async updateChapter(
    @Param('id') id: number,
    @Body() chapterInput: ChapterInput,
  ) {
    try {
      await this.storyFacade.updateChapter(id, chapterInput);
    } catch (error) {
      if (error instanceof NoUpdatableEntityException) {
        throw new NotFoundException(`There is no chapter with Id ${error.id}`);
      } else {
        throw error;
      }
    }
  }

  @Delete('chapter/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a chapter',
    description: 'Delete a chapter by id along with all of its posts.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
    description: 'The id of the chapter to be deleted.',
  })
  @ApiNoContentResponse({
    description: 'Deletion was successful.',
  })
  @ApiNotFoundResponse({
    description: 'The given Chapter does not exist.',
  })
  async deleteChapter(@Param('id') id: number): Promise<void> {
    try {
      await this.storyFacade.deleteChapter(id);
    } catch (error) {
      if (error instanceof NoUpdatableEntityException) {
        throw new NotFoundException(`There is no chapter with Id ${error.id}`);
      } else {
        throw error;
      }
    }
  }

  @Get('chapters')
  @ApiOperation({
    summary: 'Retrieve chapters',
    description: 'Retrieve all chapters in chronological order.',
  })
  @ApiOkResponse({
    type: [ChapterOutput],
    description: 'All available chapters in chronological order',
  })
  async getChapters(): Promise<ChapterOutput[]> {
    return this.storyFacade.retrieveChapters();
  }

  @Post('chapter/:chapterId/post')
  @ApiOperation({
    summary: 'Post creation',
    description: 'Create a new part of the story.',
  })
  @ApiParam({
    name: 'chapterId',
    type: 'number',
    required: true,
    description: 'The id of the chapter to which the post belongs.',
  })
  @ApiBody({
    type: PostInput,
    description: 'Text and Metadata for the new part to be created.',
  })
  @ApiCreatedResponse({
    description: 'The new post has been created.',
  })
  @ApiBadRequestResponse({
    description: 'The given data is not valid.',
  })
  async createPost(
    @Param('chapterId') chapterId: number,
    @Body() postInput: PostInput,
  ) {
    try {
      await this.storyFacade.createPost(chapterId, postInput);
    } catch (error) {
      if (error instanceof NoUpdatableEntityException) {
        throw new NotFoundException(`There is no chapter with Id ${error.id}`);
      } else {
        throw error;
      }
    }
  }

  @Get('chapter/:chapterId/posts')
  @ApiOperation({
    summary: 'Retrieve posts from a chapter',
    description: 'Retrieve all posts in positional order.',
  })
  @ApiParam({
    name: 'chapterId',
    type: 'number',
    required: true,
    description: 'The id of the chapter to which the post belongs.',
  })
  @ApiOkResponse({
    type: [PostOutput],
    description: 'All posts for a chapter in positional order',
  })
  async getPosts(@Param('chapterId') chapterId: number): Promise<PostOutput[]> {
    try {
      return this.storyFacade.retrievePostsForChapter(chapterId);
    } catch (error) {
      if (error instanceof NoUpdatableEntityException) {
        throw new NotFoundException(`There is no chapter with Id ${error.id}`);
      } else {
        throw error;
      }
    }
  }

  @Delete('chapter/:chapterId/post/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a chapter',
    description: 'Delete a chapter by id along with all of its posts.',
  })
  @ApiParam({
    name: 'chapterId',
    type: 'number',
    required: true,
    description: 'The id of the chapter to which the post belongs.',
  })
  @ApiParam({
    name: 'postId',
    type: 'number',
    required: true,
    description: 'The id of the post to be deleted.',
  })
  @ApiNoContentResponse({
    description: 'Deletion was successful.',
  })
  @ApiNotFoundResponse({
    description: 'The given post does not exist in the given chapter.',
  })
  async deletePost(
    @Param('chapterId') chapterId: number,
    @Param('postId') postId: number,
  ): Promise<void> {
    try {
      await this.storyFacade.deletePost(chapterId, postId);
    } catch (error) {
      if (error instanceof NoUpdatableEntityException) {
        throw new NotFoundException(
          `There is no post with Id ${error.id} in chapter with Id ${chapterId}`,
        );
      } else {
        throw error;
      }
    }
  }
}
