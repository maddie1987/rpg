import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class NoUpdatableEntityException extends RuntimeException {
  public readonly id: number;
  constructor(id: number) {
    super(`No updatable entity with id ${id}`);
    this.id = id;
  }
}

export const throwNoUpdatableEntityException = (id: number): never => {
  throw new NoUpdatableEntityException(id);
};
