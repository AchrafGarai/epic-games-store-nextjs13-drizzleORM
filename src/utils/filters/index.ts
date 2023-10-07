export function constructFilterUrl(obj: {
  [key: string]: string | string[] | undefined;
}): string {
  return Object.entries(obj)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}=${v}`).join("&");
      }
      return `${key}=${value}`;
    })
    .join("&");
}

export function createQueryString(params: {
  [key: string]: string | string[] | undefined;
}): string {
  const queryString = Object.entries(params)
    .map(([key, value]) => {
      if (value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          return value
            .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
            .join("&");
        } else {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      }
      return "";
    })
    .filter((param) => param !== "")
    .join("&");

  return `?${queryString}`;
}
