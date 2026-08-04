import { GameFilterCriteria } from "@Collection/domain/entities/GameFilterCriteria";
import { describe, expect, it } from "vitest";

describe("GameFilterCriteria", () => {
  describe("create", () => {
    it("should create criteria with title filter", () => {
      const result = GameFilterCriteria.create({ title: "Mario" });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBe("Mario");
      expect(criteria.getTitleFilterNormalized()).toBe("mario");
      expect(criteria.isEmpty()).toBeFalsy();
    });

    it("should create empty criteria when no params provided", () => {
      const result = GameFilterCriteria.create({});

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBeUndefined();
      expect(criteria.getTitleFilterNormalized()).toBeUndefined();
      expect(criteria.isEmpty()).toBeTruthy();
    });

    it("should create empty criteria when no arguments", () => {
      const result = GameFilterCriteria.create();

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.isEmpty()).toBeTruthy();
    });

    it("should return error for empty title string", () => {
      const result = GameFilterCriteria.create({ title: "" });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe("title");
      expect(error.message).toContain("cannot be empty");
    });

    it("should return error for whitespace-only title", () => {
      const result = GameFilterCriteria.create({ title: "   " });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe("title");
      expect(error.message).toContain("cannot be empty");
    });

    it("should trim whitespace from title", () => {
      const result = GameFilterCriteria.create({ title: "  Mario  " });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBe("Mario");
      expect(criteria.getTitleFilterNormalized()).toBe("mario");
    });

    it("should preserve title casing in the raw filter", () => {
      const result = GameFilterCriteria.create({ title: "The Legend of Zelda" });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBe("The Legend of Zelda");
    });

    it("should normalize title to lowercase for search", () => {
      const result = GameFilterCriteria.create({ title: "The Legend of Zelda" });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilterNormalized()).toBe("the legend of zelda");
    });

    it("should return error for title exceeding 200 characters", () => {
      const longTitle = "a".repeat(201);
      const result = GameFilterCriteria.create({ title: longTitle });

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe("title");
      expect(error.message).toContain("cannot exceed 200 characters");
    });

    it("should accept title with exactly 200 characters", () => {
      const maxTitle = "a".repeat(200);
      const result = GameFilterCriteria.create({ title: maxTitle });

      expect(result.isOk()).toBeTruthy();
      const criteria = result.unwrap();
      expect(criteria.getTitleFilter()).toBe(maxTitle);
      expect(criteria.getTitleFilterNormalized()).toBe(maxTitle.toLowerCase());
    });
  });

  describe("getTitleFilter", () => {
    it("should return raw title when title is set", () => {
      const criteria = GameFilterCriteria.create({ title: "Super Mario Bros" }).unwrap();

      expect(criteria.getTitleFilter()).toBe("Super Mario Bros");
    });

    it("should return undefined when no title filter", () => {
      const criteria = GameFilterCriteria.create({}).unwrap();

      expect(criteria.getTitleFilter()).toBeUndefined();
    });
  });

  describe("getTitleFilterNormalized", () => {
    it("should return normalized title when title is set", () => {
      const criteria = GameFilterCriteria.create({ title: "Super Mario Bros" }).unwrap();

      expect(criteria.getTitleFilterNormalized()).toBe("super mario bros");
    });

    it("should return undefined when no title filter", () => {
      const criteria = GameFilterCriteria.create({}).unwrap();

      expect(criteria.getTitleFilterNormalized()).toBeUndefined();
    });
  });

  describe("isEmpty", () => {
    it("should return true when no criteria are set", () => {
      const criteria = GameFilterCriteria.create({}).unwrap();

      expect(criteria.isEmpty()).toBeTruthy();
    });

    it("should return false when title is set", () => {
      const criteria = GameFilterCriteria.create({ title: "Mario" }).unwrap();

      expect(criteria.isEmpty()).toBeFalsy();
    });
  });
});
