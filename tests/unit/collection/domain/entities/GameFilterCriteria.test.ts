import { GameFilterCriteria } from '@Collection/domain/entities/GameFilterCriteria';
import { describe, expect, it } from 'vitest';

describe('GameFilterCriteria', () => {
  describe('create', () => {
    it('should create criteria with title filter', () => {
      const result = GameFilterCriteria.create({ title: 'Mario' });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBe('Mario');
      expect(criteria.getTitleFilterNormalized()).toBe('mario');
      expect(criteria.isEmpty()).toBeFalsy();
    });

    it('should create criteria with platforms filter', () => {
      const result = GameFilterCriteria.create({ platforms: ['PlayStation 5', 'Nintendo Switch'] });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getPlatforms()).toStrictEqual(['PlayStation 5', 'Nintendo Switch']);
      expect(criteria.isEmpty()).toBeFalsy();
    });

    it('should create criteria with both title and platforms filter', () => {
      const result = GameFilterCriteria.create({ title: 'Mario', platforms: ['Nintendo Switch'] });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBe('Mario');
      expect(criteria.getPlatforms()).toStrictEqual(['Nintendo Switch']);
      expect(criteria.isEmpty()).toBeFalsy();
    });

    it('should create empty criteria when no params provided', () => {
      const result = GameFilterCriteria.create({});

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBeUndefined();
      expect(criteria.getTitleFilterNormalized()).toBeUndefined();
      expect(criteria.getPlatforms()).toBeUndefined();
      expect(criteria.isEmpty()).toBeTruthy();
    });

    it('should create empty criteria when no arguments', () => {
      const result = GameFilterCriteria.create();

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.isEmpty()).toBeTruthy();
    });

    it('should treat empty platforms array as no platform filter', () => {
      const result = GameFilterCriteria.create({ platforms: [] });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getPlatforms()).toBeUndefined();
      expect(criteria.isEmpty()).toBeTruthy();
    });

    it('should return error for empty title string', () => {
      const result = GameFilterCriteria.create({ title: '' });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('title');
      expect(error.message).toContain('cannot be empty');
    });

    it('should return error for whitespace-only title', () => {
      const result = GameFilterCriteria.create({ title: '   ' });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('title');
      expect(error.message).toContain('cannot be empty');
    });

    it('should return error for empty platform string in platforms array', () => {
      const result = GameFilterCriteria.create({ platforms: ['PlayStation 5', ''] });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('platform');
      expect(error.message).toContain('cannot be empty');
    });

    it('should trim whitespace from title', () => {
      const result = GameFilterCriteria.create({ title: '  Mario  ' });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBe('Mario');
      expect(criteria.getTitleFilterNormalized()).toBe('mario');
    });

    it('should preserve title casing in the raw filter', () => {
      const result = GameFilterCriteria.create({ title: 'The Legend of Zelda' });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBe('The Legend of Zelda');
    });

    it('should normalize title to lowercase for search', () => {
      const result = GameFilterCriteria.create({ title: 'The Legend of Zelda' });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilterNormalized()).toBe('the legend of zelda');
    });

    it('should return error for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      const result = GameFilterCriteria.create({ title: longTitle });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe('title');
      expect(error.message).toContain('cannot exceed 200 characters');
    });

    it('should accept title with exactly 200 characters', () => {
      const maxTitle = 'a'.repeat(200);
      const result = GameFilterCriteria.create({ title: maxTitle });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBe(maxTitle);
      expect(criteria.getTitleFilterNormalized()).toBe(maxTitle.toLowerCase());
    });
  });

  describe('getTitleFilter', () => {
    it('should return raw title when title is set', () => {
      const criteria = GameFilterCriteria.create({ title: 'Super Mario Bros' }).unwrap();

      expect(criteria.getTitleFilter()).toBe('Super Mario Bros');
    });

    it('should return undefined when no title filter', () => {
      const criteria = GameFilterCriteria.create({}).unwrap();

      expect(criteria.getTitleFilter()).toBeUndefined();
    });
  });

  describe('getTitleFilterNormalized', () => {
    it('should return normalized title when title is set', () => {
      const criteria = GameFilterCriteria.create({ title: 'Super Mario Bros' }).unwrap();

      expect(criteria.getTitleFilterNormalized()).toBe('super mario bros');
    });

    it('should return undefined when no title filter', () => {
      const criteria = GameFilterCriteria.create({}).unwrap();

      expect(criteria.getTitleFilterNormalized()).toBeUndefined();
    });
  });

  describe('getPlatforms', () => {
    it('should return platform names when platforms are set', () => {
      const criteria = GameFilterCriteria.create({ platforms: ['PlayStation 5', 'Xbox Series X|S'] }).unwrap();

      expect(criteria.getPlatforms()).toStrictEqual(['PlayStation 5', 'Xbox Series X|S']);
    });

    it('should return undefined when no platform filter', () => {
      const criteria = GameFilterCriteria.create({}).unwrap();

      expect(criteria.getPlatforms()).toBeUndefined();
    });

    it('should return undefined when platforms is an empty array', () => {
      const criteria = GameFilterCriteria.create({ platforms: [] }).unwrap();

      expect(criteria.getPlatforms()).toBeUndefined();
    });
  });

  describe('isEmpty', () => {
    it('should return true when no criteria are set', () => {
      const criteria = GameFilterCriteria.create({}).unwrap();

      expect(criteria.isEmpty()).toBeTruthy();
    });

    it('should return true when platforms is an empty array', () => {
      const criteria = GameFilterCriteria.create({ platforms: [] }).unwrap();

      expect(criteria.isEmpty()).toBeTruthy();
    });

    it('should return false when title is set', () => {
      const criteria = GameFilterCriteria.create({ title: 'Mario' }).unwrap();

      expect(criteria.isEmpty()).toBeFalsy();
    });

    it('should return false when platforms is set', () => {
      const criteria = GameFilterCriteria.create({ platforms: ['Nintendo Switch'] }).unwrap();

      expect(criteria.isEmpty()).toBeFalsy();
    });

    it('should return false when both title and platforms are set', () => {
      const criteria = GameFilterCriteria.create({ title: 'Mario', platforms: ['Nintendo Switch'] }).unwrap();

      expect(criteria.isEmpty()).toBeFalsy();
    });
  });
});
