export type ContentMode = "json" | "html";

/**
 * Chooses JSON vs HTML using Accept quality values. The wildcard media range counts toward both; ties favor JSON.
 */
export function negotiateJsonOrHtml(accept: string | undefined): ContentMode {
  if (!accept || accept.trim() === "") {
    return "json";
  }
  let bestJson = 0;
  let bestHtml = 0;
  for (const part of accept.split(",")) {
    const trimmed = part.trim();
    const semi = trimmed.indexOf(";");
    const type = semi === -1 ? trimmed : trimmed.slice(0, semi).trim();
    let q = 1;
    if (semi !== -1) {
      const rest = trimmed.slice(semi + 1);
      const qMatch = /q\s*=\s*([0-9.]+)/i.exec(rest);
      if (qMatch) {
        const parsed = parseFloat(qMatch[1]);
        if (!Number.isNaN(parsed)) {
          q = parsed;
        }
      }
    }
    if (type === "application/json" || type === "application/*" || type === "*/*") {
      bestJson = Math.max(bestJson, q);
    }
    if (type === "text/html" || type === "text/*" || type === "*/*") {
      bestHtml = Math.max(bestHtml, q);
    }
  }
  if (bestHtml > bestJson) {
    return "html";
  }
  return "json";
}
