import type { IdGeneratorInterface } from '@Shared/domain/utils/IdGeneratorInterface';
import { AddToastDTO } from '@Toast/application/dtos/AddToastDTO';
import { AddToastUseCase } from '@Toast/application/use-cases/AddToastUseCase';
import { ImmutableInMemoryToastRepository } from '@Toast/infrastructure/persistence/ImmutableInMemoryToastRepository';
import { describe, expect, it } from 'vitest';

class SequentialIdGenerator implements IdGeneratorInterface {
  private count = 0;

  generate(): string {
    this.count += 1;
    return `test-id-${this.count}`;
  }
}

const createUseCase = (repository = new ImmutableInMemoryToastRepository()) =>
  new AddToastUseCase(repository, new SequentialIdGenerator());

describe('AddToastUseCase', () => {
  describe('execute', () => {
    it('should create and persist a Toast from a valid DTO with default duration', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const useCase = new AddToastUseCase(repository, new SequentialIdGenerator());
      const dto = new AddToastDTO('Game saved', 'success');
      const result = useCase.execute(dto);

      expect(result.isOk()).toBeTruthy();

      const toast = result.unwrap();
      expect(toast.getMessage()).toBe('Game saved');
      expect(toast.getType()).toBe('success');
      expect(toast.getDuration()).toBe(3000);
      expect(toast.getId()).toBeDefined();
      expect(toast.getId().length).toBeGreaterThan(0);

      expect(repository.getAll().unwrap()).toHaveLength(1);
      expect(repository.getAll().unwrap()[0]).toBe(toast);
    });

    it('should create a Toast with a custom duration', () => {
      const useCase = createUseCase();
      const dto = new AddToastDTO('An error occurred', 'error', 5000);
      const result = useCase.execute(dto);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getDuration()).toBe(5000);
    });

    it('should use the id provided by the generator', () => {
      const idGenerator: IdGeneratorInterface = { generate: () => 'fixed-id' };
      const useCase = new AddToastUseCase(new ImmutableInMemoryToastRepository(), idGenerator);

      const result = useCase.execute(new AddToastDTO('Hello', 'info'));

      expect(result.unwrap().getId()).toBe('fixed-id');
    });

    it('should generate unique IDs for each created toast', () => {
      const useCase = createUseCase();

      const result1 = useCase.execute(new AddToastDTO('First', 'info'));
      const result2 = useCase.execute(new AddToastDTO('Second', 'warning'));

      expect(result1.unwrap().getId()).not.toBe(result2.unwrap().getId());
    });

    it('should persist multiple toasts to the repository', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const useCase = new AddToastUseCase(repository, new SequentialIdGenerator());

      useCase.execute(new AddToastDTO('First', 'info'));
      useCase.execute(new AddToastDTO('Second', 'success'));

      expect(repository.getAll().unwrap()).toHaveLength(2);
    });

    it('should return a Validation error for an empty message', () => {
      const useCase = createUseCase();
      const dto = new AddToastDTO('', 'success');
      const result = useCase.execute(dto);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError().type).toBe('Validation');
      expect(result.getError().field).toBe('message');
    });

    it('should not persist a toast to the repository when validation fails', () => {
      const repository = new ImmutableInMemoryToastRepository();
      const useCase = new AddToastUseCase(repository, new SequentialIdGenerator());

      useCase.execute(new AddToastDTO('', 'success'));

      expect(repository.getAll().unwrap()).toHaveLength(0);
    });
  });
});
