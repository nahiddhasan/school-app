import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const fetcher = async (
  url: string,
  options?: RequestInit,
  cache: RequestCache = "no-store"
) => {
  const cookieStore = cookies();

  const res = await fetch(url.startsWith("http") ? url : `${baseUrl}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      Cookie: cookieStore.toString(),
    },
    cache: cache,
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }

  return res.json();
};
