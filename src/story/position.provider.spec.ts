import { Test, TestingModule } from '@nestjs/testing';
import { PositionProvider } from './position.provider';
import { PostService } from './post.service';

let moduleRef: TestingModule;
let toBeTested: PositionProvider;
const createTestingModule = (
  existsPost: boolean,
  lastPosition: string | undefined,
  nextPosition: string | undefined,
) =>
  Test.createTestingModule({
    providers: [PositionProvider],
  })
    .useMocker((token) => {
      if (token == PostService) {
        return {
          existsPostForChapter: jest.fn().mockResolvedValue(existsPost),
          getLastPosition: jest.fn().mockResolvedValue(lastPosition),
          getNextPosition: jest.fn().mockResolvedValue(nextPosition),
        };
      }
    })
    .compile();

describe('Position provider test', () => {
  it('should return 1 if chapter is empty', async () => {
    moduleRef = await createTestingModule(false, undefined, undefined);
    toBeTested = moduleRef.get(PositionProvider);
    expect(await toBeTested.determinePosition(1, undefined)).toBe('1');
  });
  it('should return 2 if chapter is not empty and position before starts with 1', async () => {
    moduleRef = await createTestingModule(true, '1.0.4', undefined);
    toBeTested = moduleRef.get(PositionProvider);
    expect(await toBeTested.determinePosition(1, '1.0.4')).toBe('2');
  });
  it('should return 1.1 if chapter is not empty and lastPos=2 and nextPos=2 and beforePos=1', async () => {
    moduleRef = await createTestingModule(true, '2', '2');
    toBeTested = moduleRef.get(PositionProvider);
    expect(await toBeTested.determinePosition(1, '1')).toBe('1.1');
  });
  it('should return 1.2.3.4.5.1 if chapter is not empty and lastPos=13 and nextPos=1.2.3.4.5.5 and beforePos=1.2.3.4.5', async () => {
    moduleRef = await createTestingModule(true, '13', '1.2.3.4.5.5');
    toBeTested = moduleRef.get(PositionProvider);
    expect(await toBeTested.determinePosition(1, '1.2.3.4.5'));
  });
});
