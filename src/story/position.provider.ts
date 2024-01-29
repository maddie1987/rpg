import { Injectable } from '@nestjs/common';
import { PostService } from './post.service';

@Injectable()
export class PositionProvider {
  constructor(private readonly postService: PostService) {}

  async determinePosition(
    chapterId: number,
    positionBefore: string,
  ): Promise<string> {
    if (await this.isNewChapter(chapterId)) return '1';
    if (await this.isAppendable(chapterId, positionBefore))
      return this.increaseAndRetrieveFirstPlace(positionBefore);

    return this.findPositionInBounds(chapterId, positionBefore);
  }

  private async isNewChapter(chapterId: number): Promise<boolean> {
    return !(await this.postService.existsPostForChapter(chapterId));
  }

  private async isAppendable(
    chapterId: number,
    positionBefore: string,
  ): Promise<boolean> {
    return (
      (await this.postService.getLastPosition(chapterId)) === positionBefore
    );
  }

  private increaseAndRetrieveFirstPlace(position: string): string {
    return (parseInt(position.split('.')[0]) + 1).toString();
  }

  private async findPositionInBounds(
    chapterId: number,
    positionBefore: string,
  ): Promise<string> {
    const lowerBound = this.determineLowerBound(positionBefore);
    const upperBound = await this.determineUpperBound(chapterId, lowerBound);
    let candidate = this.countUpLastPart(lowerBound);
    while (candidate >= upperBound) {
      candidate = this.downgradeUpcounting(candidate);
    }
    return candidate;
  }

  private determineLowerBound(positionBefore: string): string {
    return positionBefore ?? '0';
  }

  private async determineUpperBound(
    chapterId: number,
    positionBefore: string,
  ): Promise<string> {
    return await this.postService.getNextPosition(chapterId, positionBefore);
  }

  private countUpLastPart(position: string): string {
    const positionParts = position.split('.');
    const firstParts = positionParts.slice(0, positionParts.length - 1);
    const prefix = firstParts.length > 0 ? firstParts.join('.') + '.' : '';
    const lastPart = parseInt(positionParts[positionParts.length - 1]);
    return `${prefix}${lastPart + 1}`;
  }

  private downgradeUpcounting(position: string): string {
    const positionParts = position.split('.');
    const firstParts = positionParts.slice(0, positionParts.length - 1);
    const lastPart = parseInt(positionParts[positionParts.length - 1]);
    const prefix = firstParts.length > 0 ? firstParts.join('.') + '.' : '';
    return `${prefix}${lastPart - 1}.1`;
  }
}
