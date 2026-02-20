export function getHeaders(pseudo_id: string, token: string | null): Record<string, string> {
  if (!token) {
    return {
      "X-Guest-Authentication": pseudo_id,
    };
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
