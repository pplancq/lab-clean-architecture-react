/* eslint-disable class-methods-use-this */
import type { IdGeneratorInterface } from '@Shared/domain/utils/IdGeneratorInterface';

/**
 * ID generator implementation using the Web Crypto API (crypto.randomUUID).
 *
 * Generates RFC 4122 compliant UUIDs. Available in all modern browsers and
 * Node.js 14.17+.
 */
export class CryptoIdGenerator implements IdGeneratorInterface {
  generate(): string {
    return globalThis.crypto.randomUUID();
  }
}
