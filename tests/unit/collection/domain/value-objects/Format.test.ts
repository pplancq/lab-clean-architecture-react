import { Format } from "@Collection/domain/value-objects/Format";
import { describe, expect, it } from "vitest";

describe("Format", () => {
  describe("create", () => {
    it("should create a valid Format", () => {
      const result = Format.create("Physical");

      expect(result.isOk()).toBeTruthy();
      const format = result.unwrap();
      expect(format.getFormat()).toBe("Physical");
    });

    it("should create Format with different types", () => {
      const formats = ["Physical", "Digital", "Collector's Edition", "Steelbook", "Limited Edition"];

      formats.forEach((name) => {
        const result = Format.create(name);
        expect(result.isOk()).toBeTruthy();
        expect(result.unwrap().getFormat()).toBe(name);
      });
    });

    it("should trim format name", () => {
      const result = Format.create("  Physical  ");

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap().getFormat()).toBe("Physical");
    });

    it("should return error for empty format", () => {
      const result = Format.create("");

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe("format");
      expect(error.message).toBe("format cannot be empty");
    });

    it("should return error for whitespace-only format", () => {
      const result = Format.create("   ");

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe("format");
      expect(error.message).toBe("format cannot be empty");
    });

    it("should return error for format name exceeding 50 characters", () => {
      const longName = "a".repeat(51);
      const result = Format.create(longName);

      expect(result.isErr()).toBeTruthy();
      const error = result.getError();
      expect(error.field).toBe("format");
      expect(error.message).toBe("format cannot exceed 50 characters");
    });

    it("should accept format name with exactly 50 characters", () => {
      const maxName = "a".repeat(50);
      const result = Format.create(maxName);

      expect(result.isOk()).toBeTruthy();
    });
  });
});
