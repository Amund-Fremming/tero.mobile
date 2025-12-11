export function getHeaders(pseudo_id: string, token: string | null): Record<string, string> {
  let headers: Record<string, string> = {};
  if (!token) {
    headers = {
      "X-Guest-Authentication": pseudo_id,
    };
  } else {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}
