import type { IdGeneratorInterface } from '@Shared/domain/utils/IdGeneratorInterface';
import { AddToastDTO } from '@Toast/application/dtos/AddToastDTO';
import { AddToastUseCase } from '@Toast/application/use-cases/AddToastUseCase';
import { RemoveToastUseCase } from '@Toast/application/use-cases/RemoveToastUseCase';
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
    removeUseCase: new RemoveToastUseCase(repository),
  };
};

describe('RemoveToastUseCase', () => {
  describe('execute', () => {
    it('should remove an existing toast from the repository', () => {
      const { repository, addUseCase, removeUseCase } = createUseCase();
      const addResult = addUseCase.execute(new AddToastDTO('Hello', 'info'));
      const toastId = addResult.unwrap().getId();

      expect(repository.getAll().unwrap()).toHaveLength(1);

      const result = removeUseCase.execute(toastId);

      expect(result.isOk()).toBeTruthy();
      expect(repository.getAll().unwrap()).toHaveLength(0);
    });

    it('should return a NotFound error when removing a non-existent ID', () => {
      const { removeUseCase } = createUseCase();
      const result = removeUseCase.execute('non-existent-id');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().type).toBe('NotFound');
    });

    it('should include the toast ID in the NotFound error', () => {
      const { removeUseCase } = createUseCase();
      const result = removeUseCase.execute('unknown-id');

      expect(result.getError()).toMatchObject({ type: 'NotFound', toastId: 'unknown-id' });
    });

    it('should return a Validation error for an empty ID', () => {
      const { removeUseCase } = createUseCase();
      const result = removeUseCase.execute('');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().type).toBe('Validation');
      expect(result.getError().field).toBe('id');
    });

    it('should return a Validation error for a whitespace-only ID', () => {
      const { removeUseCase } = createUseCase();
      const result = removeUseCase.execute('   ');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().type).toBe('Validation');
    });

    it('should not alter the repository when validation fails', () => {
      const { repository, addUseCase, removeUseCase } = createUseCase();
      addUseCase.execute(new AddToastDTO('Hello', 'success'));

      removeUseCase.execute('');

      expect(repository.getAll().unwrap()).toHaveLength(1);
    });
  });
});
