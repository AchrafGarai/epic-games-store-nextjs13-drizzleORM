import { Category } from "@/db/game/schema";
import { Platform } from "@/db/platforms/schema";

export function getCategoryNames(
  response: {
    category: Category;
  }[]
) {
  // Use a Set to store unique category names
  const categorySet = new Set();

  response.forEach((item) => {
    if (item.category && item.category.name) {
      categorySet.add(item.category.name);
    }
  });

  // Convert the Set to an array and join the category names with a comma
  const categoryNames = Array.from(categorySet).join(",");

  return categoryNames;
}

export function getPlatformNames(
  response: {
    platform: Platform;
  }[]
) {
  // Use a Set to store unique category names
  const platformSet = new Set();

  response.forEach((item) => {
    if (item.platform && item.platform.name) {
      platformSet.add(item.platform.name);
    }
  });

  // Convert the Set to an array and join the category names with a comma
  const platformNames = Array.from(platformSet).join(",");

  return platformNames;
}
