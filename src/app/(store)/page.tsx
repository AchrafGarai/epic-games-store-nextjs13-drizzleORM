import { GamesGrid } from '@/components/Games'
import Pagination from '@/components/Pagination'
import { useGames } from '@/lib/games'
import FeaturedSection from './FeaturedSection'
type Props = {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function Home({ params, searchParams }: Props) {
  const page = Number(searchParams?.page) || 1
  const { data, hasNextPage } = await useGames(page)

  return (
    <main>
      <>
        <FeaturedSection />
        <h2 className=" font-medium text-2xl my-6 mt-16">Featured games</h2>
        <GamesGrid games={data} />
        <Pagination
          page={page}
          hasNextPage={hasNextPage}
          searchParams={searchParams}
        />
      </>
    </main>
  )
}
