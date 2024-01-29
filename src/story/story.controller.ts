import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse, ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags
} from "@nestjs/swagger";
import {
  Body,
  Controller, Delete,
  Get, HttpCode, HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes
} from "@nestjs/common";
import {
  Chapter,
  ChapterInput,
  ChapterDto,
} from './model/schema/chapter.schema';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ChapterFacade } from './chapter.facade';
import { NoUpdateableEntityException } from '../shared/exceptions/data-handling.exceptions';

@ApiTags('Chapter CRUD')
@ApiProduces('application/json')
@ApiConsumes('application/json')
@UsePipes(ZodValidationPipe)
@Controller()
export class ChapterController {
  constructor(private readonly chapterFacade: ChapterFacade) {}

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
    await this.chapterFacade.createChapter(chapterInput);
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
      await this.chapterFacade.updateChapter(id, chapterInput);
    } catch (error) {
      if (error instanceof NoUpdateableEntityException) {
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
  @ApiNoContentResponse({
    description: 'Deletion was successful.',
  })
  async deleteChapter(@Param('id') id: number): Promise<void> {
    try {
      await this.chapterFacade.deleteChapter(id);
    } catch (error) {
      if (error instanceof NoUpdateableEntityException) {
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
    type: [Chapter],
    description: 'All available chapters in chronological order',
  })
  async getChapters(): Promise<ChapterDto[]> {
    return this.chapterFacade.retrieveChapters();
  }
}
