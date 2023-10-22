import { Game } from '@/db/game/schema'
import { createQueryString } from '@/utils/filters'
import { auth } from '@clerk/nextjs/server'

export const useGames = async <T = Game>(
  page: number,
  searchParams?: { [key: string]: string | string[] | undefined },
  endpoint?: string,
  pageSize?: number,
): Promise<{ data: T[]; hasNextPage: boolean }> => {
  const { getToken } = auth()
  const apiPath = endpoint ? endpoint : 'game'

  const perPage = pageSize ? pageSize : 12
  const pageOffset = (page - 1) * perPage
  const nextPageOffset = pageOffset + perPage

  const query = {
    limit: perPage.toString(),
    offset: pageOffset.toString(),
    ...searchParams,
  }

  const nextQuery = {
    limit: perPage.toString(),
    offset: nextPageOffset.toString(),
    ...searchParams,
  }

  const currentPageQuery = createQueryString(query)
  const nextPageQuey = createQueryString(nextQuery)

  const { data } = (await fetch(
    `${process.env.BASE_URL}/api/${apiPath}${currentPageQuery}`,
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    },
  )
    .then((res) => res.json())
    .catch((e) => console.log(e))) as {
    data: T[]
  }
  const nextPage = (await fetch(
    `${process.env.BASE_URL}/api/${apiPath}${nextPageQuey}`,
    { headers: { Authorization: `Bearer ${await getToken()}` } },
  )
    .then((res) => res.json())
    .catch((e) => console.log(e))) as {
    data: T[]
  }
  const hasNextPage = nextPage.data.length > 0

  return {
    data,
    hasNextPage,
  }
}
