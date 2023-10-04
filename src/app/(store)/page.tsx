import FeaturedGames from "@/components/FeaturedGames";
import { GamesGrid } from "@/components/Games";
import Pagination from "@/components/Pagination";
import { Game } from "@/db/game/schema";

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { data } = (await fetch("http://localhost:3000/api/game?limit=4")
    .then((res) => res.json())
    .catch((e) => console.log(e))) as {
    data: Game[];
  };

  const page = Number(searchParams?.page) || 1;
  const featuredId = Number(searchParams?.featured) || undefined;
  return (
    <main>
      <>
        <FeaturedGames games={data} featuredGame={featuredId} />
        <h2 className=" font-medium text-2xl my-6 mt-16">Featured games</h2>
        <GamesGrid games={data} />
        <Pagination page={page} searchParams={searchParams} />
      </>
    </main>
  );
}

export const revalidate = 3600; // revalidate at most every hour
