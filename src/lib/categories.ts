import { Category } from "@/db/game/schema";
import { auth } from "@clerk/nextjs/server";

export const useCategories = async () => {
  const { getToken } = auth();
  const categories = (await fetch("http://localhost:3000/api/categories", {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })
    .then((res) => res.json())
    .catch((e) => console.log(e))) as {
    data: Category[];
  };
  return categories;
};
