/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import '@testing-library/jest-dom/vitest';
import ResizeObserver from 'resize-observer-polyfill';
import { server } from './mocks/server';
import { PropsWithChildren, ReactNode } from 'react';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// mocking auth0 for serveral suite case
vi.mock('@auth0/auth0-react', () => {
  return {
    useAuth0: vi.fn().mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    }),
    Auth0Provider: ({ children }: PropsWithChildren) => children,
    withAuthenticationRequired: (component: ReactNode) => component,
  }
});

global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
