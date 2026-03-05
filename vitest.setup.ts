/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom/vitest';
import { server } from '@Mocks/server';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import * as matchers from 'vitest-axe/matchers';
import 'fake-indexeddb/auto';

expect.extend(matchers);

// jsdom may not implement HTMLDialogElement methods; mock them to simulate open/close behavior when missing
if (typeof HTMLDialogElement !== 'undefined') {
  const dialogPrototype = HTMLDialogElement.prototype;

  if (typeof dialogPrototype.showModal !== 'function') {
    dialogPrototype.showModal = vi.fn(function showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
  }

  if (typeof dialogPrototype.close !== 'function') {
    dialogPrototype.close = vi.fn(function close(this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
  }
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});
