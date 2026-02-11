import { Result } from '@Shared/domain/result/Result';
import { describe, expect, it } from 'vitest';

describe('Result Type', () => {
  describe('Ok', () => {
    it('should create a successful Result with value', () => {
      const result = Result.ok(42);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toStrictEqual(42);
    });

    it('should create Ok Result with string value', () => {
      const result = Result.ok('success');

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toStrictEqual('success');
    });

    it('should create Ok Result with object value', () => {
      const value = { id: 1, name: 'Test' };
      const result = Result.ok(value);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toStrictEqual(value);
    });

    it('should return false for Err Result', () => {
      const result: Result<number, string> = Result.err('error');

      expect(result.isOk()).toBeFalsy();
    });
  });

  describe('Err', () => {
    it('should create a failed Result with error', () => {
      const result = Result.err('Something went wrong');

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toStrictEqual('Something went wrong');
    });

    it('should create Err Result with Error object', () => {
      const error = new Error('Test error');
      const result = Result.err(error);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toStrictEqual(error);
    });

    it('should create Err Result with custom error type', () => {
      type CustomError = { code: string; message: string };
      const error: CustomError = { code: 'ERR_001', message: 'Custom error' };
      const result = Result.err(error);

      expect(result.isErr()).toBeTruthy();
      expect(result.getError()).toStrictEqual(error);
    });

    it('should return false for Ok Result', () => {
      const result: Result<number, string> = Result.ok(42);

      expect(result.isErr()).toBeFalsy();
    });
  });

  describe('unwrap', () => {
    it('should return value for Ok Result', () => {
      const result = Result.ok(42);
      const value = result.unwrap();

      expect(value).toStrictEqual(42);
    });

    it('should return value for Ok Result ignoring default', () => {
      const result = Result.ok(42);
      const value = result.unwrap(0);

      expect(value).toStrictEqual(42);
    });

    it('should throw for Err Result without default', () => {
      const result: Result<number, string> = Result.err('error');

      expect(() => result.unwrap()).toThrow('error');
    });

    it('should return default value for Err Result', () => {
      const result: Result<number, string> = Result.err('error');
      const value = result.unwrap(0);

      expect(value).toStrictEqual(0);
    });
  });

  describe('getError', () => {
    it('should throw for Ok Result', () => {
      const result: Result<number, string> = Result.ok(42);

      expect(() => result.getError()).toThrow('Called getError on an Ok value');
    });

    it('should return error for Err Result', () => {
      const result: Result<number, string> = Result.err('error');
      const error = result.getError();

      expect(error).toStrictEqual('error');
    });
  });

  describe('transform', () => {
    it('should transform Ok value', () => {
      const result = Result.ok(42);
      const transformed = result.transform(n => n.toString());

      expect(transformed.isOk()).toBeTruthy();
      expect(transformed.unwrap()).toStrictEqual('42');
    });

    it('should pass through Err unchanged', () => {
      const result: Result<number, string> = Result.err('error');
      const transformed = result.transform(n => n.toString());

      expect(transformed.isErr()).toBeTruthy();
      expect(transformed.getError()).toStrictEqual('error');
    });
  });

  describe('transformErr', () => {
    it('should transform Err value', () => {
      const result: Result<number, string> = Result.err('error');
      const transformed = result.transformErr(e => new Error(e));

      expect(transformed.isErr()).toBeTruthy();
      const error = transformed.getError();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toStrictEqual('error');
    });

    it('should pass through Ok unchanged', () => {
      const result: Result<number, string> = Result.ok(42);
      const transformed = result.transformErr(e => new Error(e));

      expect(transformed.isOk()).toBeTruthy();
      expect(transformed.unwrap()).toStrictEqual(42);
    });
  });
});
