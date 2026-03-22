/**
 * Root endpoint serves HTML only. Returns true if the Accept header allows text/html or a wildcard media range.
 */
export function rootAcceptsHtml(accept: string | undefined): boolean {
  if (!accept || accept.trim() === "") {
    return true;
  }
  for (const part of accept.split(",")) {
    const type = part.trim().split(";")[0].trim().toLowerCase();
    if (type === "text/html" || type === "text/*" || type === "*/*") {
      return true;
    }
  }
  return false;
}
