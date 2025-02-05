import { delay, http, HttpResponse } from "msw";
import { server } from "./mocks/server";

export const simulteDelay = (endpoint: string) => {
  server.use(http.get(endpoint, async () => {
    await delay();
    HttpResponse.json([]);
  }));
}
  

export const simulteError = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()));
}