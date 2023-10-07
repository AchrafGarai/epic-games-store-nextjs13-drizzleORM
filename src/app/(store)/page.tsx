import FeaturedGames from "@/components/FeaturedGames";
import { GamesGrid } from "@/components/Games";
import Pagination from "@/components/Pagination";
import { Game } from "@/db/game/schema";
import { useGames } from "@/lib/games";

type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Home({ params, searchParams }: Props) {
  const page = Number(searchParams?.page) || 1;
  const featuredId = Number(searchParams?.featured) || undefined;

  const { data, hasNextPage } = await useGames(page);

  return (
    <main>
      <>
        <FeaturedGames featuredGame={featuredId} page={page} />
        <h2 className=" font-medium text-2xl my-6 mt-16">Featured games</h2>
        <GamesGrid games={data} />
        <Pagination
          page={page}
          hasNextPage={hasNextPage}
          searchParams={searchParams}
        />
      </>
    </main>
  );
}

export const revalidate = 3600; // revalidate at most every hour
