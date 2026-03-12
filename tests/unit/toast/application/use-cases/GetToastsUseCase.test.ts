import type { IdGeneratorInterface } from '@Shared/domain/utils/IdGeneratorInterface';
import { AddToastDTO } from '@Toast/application/dtos/AddToastDTO';
import { AddToastUseCase } from '@Toast/application/use-cases/AddToastUseCase';
import { GetToastsUseCase } from '@Toast/application/use-cases/GetToastsUseCase';
import { ImmutableInMemoryToastRepository } from '@Toast/infrastructure/persistence/ImmutableInMemoryToastRepository';
import { describe, expect, it } from 'vitest';

class SequentialIdGenerator implements IdGeneratorInterface {
  private count = 0;

  generate(): string {
    this.count += 1;
    return `test-id-${this.count}`;
  }
}

const createUseCase = () => {
  const repository = new ImmutableInMemoryToastRepository();
  return {
    repository,
    addUseCase: new AddToastUseCase(repository, new SequentialIdGenerator()),
    getToastsUseCase: new GetToastsUseCase(repository),
  };
};

describe('GetToastsUseCase', () => {
  describe('execute', () => {
    it('should return an empty array when there are no toasts', () => {
      const { getToastsUseCase } = createUseCase();

      expect(getToastsUseCase.execute().unwrap()).toStrictEqual([]);
    });

    it('should return all toasts currently in the repository', () => {
      const { addUseCase, getToastsUseCase } = createUseCase();
      addUseCase.execute(new AddToastDTO('First', 'info'));
      addUseCase.execute(new AddToastDTO('Second', 'success'));

      const toasts = getToastsUseCase.execute().unwrap();
      expect(toasts).toHaveLength(2);
      expect(toasts[0].getMessage()).toBe('First');
      expect(toasts[1].getMessage()).toBe('Second');
    });

    it('should return the same stable reference on consecutive calls without changes', () => {
      const { addUseCase, getToastsUseCase } = createUseCase();
      addUseCase.execute(new AddToastDTO('Hello', 'warning'));

      const ref1 = getToastsUseCase.execute().unwrap();
      const ref2 = getToastsUseCase.execute().unwrap();

      expect(ref1).toBe(ref2);
    });

    it('should return a new reference after a toast is added', () => {
      const { addUseCase, getToastsUseCase } = createUseCase();

      const ref1 = getToastsUseCase.execute().unwrap();
      addUseCase.execute(new AddToastDTO('Hello', 'info'));
      const ref2 = getToastsUseCase.execute().unwrap();

      expect(ref1).not.toBe(ref2);
    });
  });
});
