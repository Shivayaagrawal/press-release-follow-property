import { NextRequest } from "next/server";

export function verifyApiKey(request: NextRequest): boolean {
  const key = process.env.ADMIN_API_KEY;
  if (!key) return false;

  const headerKey =
    request.headers.get("x-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return headerKey === key;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized — invalid or missing API key" }, { status: 401 });
}
