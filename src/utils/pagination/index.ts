export function constructURL(
  searchParams?: { [key: string]: string | string[] | undefined },

  overrideParam?: { key: string; value: string | string[] }
): string {
  // Create a copy of the searchParams object to avoid modifying the original
  const updatedSearchParams = { ...searchParams };

  // Override the specified parameter if provided
  if (overrideParam) {
    updatedSearchParams[overrideParam.key] = overrideParam.value;
  }

  // Filter out undefined values and convert the object to a key-value array
  const queryParamsArray = Object.entries(updatedSearchParams)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        // If the value is an array, join its elements with commas
        return `${key}=${value.join(",")}`;
      } else {
        return `${key}=${value}`;
      }
    });

  // Join the key-value pairs with '&' if there is more than one element in the array
  const queryString =
    queryParamsArray.length > 1
      ? queryParamsArray.join("&")
      : queryParamsArray[0];

  // Construct the full URL with the query string
  return `?${queryString}`;
}
