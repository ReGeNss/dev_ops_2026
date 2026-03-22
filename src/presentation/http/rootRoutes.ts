import type { FastifyPluginAsync } from "fastify";
import { escapeHtml } from "./html.js";
import { rootAcceptsHtml } from "./rootAcceptsHtml.js";

const BUSINESS_ENDPOINTS: readonly { method: string; path: string }[] = [
  { method: "GET", path: "/tasks" },
  { method: "POST", path: "/tasks" },
  { method: "POST", path: "/tasks/:id/done" },
];

export const rootRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    if (!rootAcceptsHtml(request.headers.accept)) {
      reply
        .code(406)
        .type("text/plain; charset=utf-8")
        .send("Not Acceptable: this endpoint only serves text/html");
      return;
    }
    const rows = BUSINESS_ENDPOINTS.map(
      (e) =>
        `<tr><td>${escapeHtml(e.method)}</td><td>${escapeHtml(e.path)}</td></tr>`,
    ).join("");
    reply
      .type("text/html; charset=utf-8")
      .send(
        `<!DOCTYPE html><html><head><meta charset="utf-8"><title>mywebapp</title></head><body><table border="1"><thead><tr><th>method</th><th>path</th></tr></thead><tbody>${rows}</tbody></table></body></html>`,
      );
  });
};
