/* eslint-disable perfectionist/sort-classes */
/* eslint-disable perfectionist/sort-switch-case */
import { URL } from "node:url";

class Sanitation {
  #data: unknown;
  #sanitizedData: unknown;

  /**
   * Constructor for the Sanitation class.
   * @param data - The data to be sanitized.
   */
  public constructor(data?: unknown) {
    this.#data = data;
    this.#sanitizedData = null;
  }

  /**
   * Sanitizes the input data based on its type.
   * @returns The sanitized data.
   */
  public sanitize(): unknown {
    switch (typeof this.#data) {
      case "string":
        this.#sanitizedData = Sanitation.sanitizeString(this.#data);
        break;
      case "number":
        this.#sanitizedData = Sanitation.sanitizeNumber(this.#data);
        break;
      case "boolean":
        this.#sanitizedData = Sanitation.sanitizeBoolean(this.#data);
        break;
      case "object":
        if (this.#data instanceof Date) {
          this.#sanitizedData = Sanitation.sanitizeDate(this.#data);
        }
        if (Array.isArray(this.#data)) {
          this.#sanitizedData = Sanitation.sanitizeArray(this.#data as unknown[]);
        }
        if (this.#data instanceof URL) {
          this.#sanitizedData = Sanitation.sanitizeURL(this.#data.toString());
        }
        if (this.#data instanceof Object) {
          this.#sanitizedData = Sanitation.sanitizeObject(this.#data);
        }
        break;
      default:
        this.#sanitizedData = null;
        break;
    }

    return this.#sanitizedData;
  }

  /**
   * Static methods for sanitizing Array types.
   * @param input - The input to be sanitized.
   * @returns The sanitized input.
   */
  public static sanitizeArray(input: unknown[]): unknown[] {
    return Array.isArray(input) ? input : [];
  }

  /**
   * Static methods for sanitizing boolean types.
   * @param input - The input to be sanitized.
   * @returns The sanitized input.
   */
  public static sanitizeBoolean(input: boolean): boolean {
    return input satisfies boolean;
  }

  /**
   * Static methods for sanitizing Date types.
   * @param input - The input to be sanitized.
   * @returns The sanitized input.
   */
  public static sanitizeDate(input: Date): Date {
    return input instanceof Date && !isNaN(input.getTime()) ? input : new Date();
  }

  /**
   * Static methods for sanitizing email strings.
   * @param input - The input to be sanitized.
   * @returns The sanitized input.
   */
  public static sanitizeEmail(input: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input) ? input : "";
  }

  /**
   * Static methods for sanitizing number types.
   * @param input - The input to be sanitized.
   * @returns The sanitized input.
   */
  public static sanitizeNumber(input: number): number {
    return isNaN(input) ? 0 : input;
  }

  public static sanitizeObject(input: object): object {
    return typeof input === "object" && Object.keys(input).length === 0 ? input : {};
  }

  /**
   * Static methods for sanitizing string types.
   * @param input - The input to be sanitized.
   * @returns The sanitized input.
   */
  public static sanitizeString(input: string): string {
    return input.replace(/[^a-zA-Z0-9 ]/g, "");
  }

  /**
   * Static methods for sanitizing string types.
   * @param input - The input to be sanitized.
   * @returns The sanitized input.
   */
  public static sanitizeRedeemCode(input: string): string {
    return input.replace(/[^a-zA-Z0-9-]/g, "");
  }

  /**
   * Static methods for sanitizing URL types.
   * @param input - The input to be sanitized.
   * @returns The sanitized input.
   */
  public static sanitizeURL(input: string): string {
    try {
      return new URL(input).toString();
    } catch {
      return "";
    }
  }
}

export default Sanitation;
