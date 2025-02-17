import { delay, http, HttpResponse } from "msw";
import { server } from "./mocks/server";
import { useAuth0, User } from "@auth0/auth0-react";
import { vi } from 'vitest'

export const simulteDelay = (endpoint: string) => {
  server.use(http.get(endpoint, async () => {
    await delay();
    HttpResponse.json([]);
  }));
}

export const simulteError = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()));
}

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
}

export const mockAuthState = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue('a'),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),

  })
}
