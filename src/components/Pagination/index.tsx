import { constructURL } from '@/utils/pagination'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons'

type Props = {
  page: number
  searchParams?: { [key: string]: string | string[] | undefined }
  hasNextPage: boolean
}

function Pagination({ page, searchParams, hasNextPage }: Props) {
  const nextPage = constructURL(searchParams, {
    key: 'page',
    value: `${page + 1}`,
  })
  const previousPage = constructURL(searchParams, {
    key: 'page',
    value: `${page > 1 ? page - 1 : 1}`,
  })

  return (
    <div className="flex gap-2 my-16">
      {page > 1 && (
        <div className="flex-grow flex">
          <Link
            className={buttonVariants({ variant: 'secondary' })}
            href={previousPage}
          >
            <CaretLeftIcon width={20} height={20} />
            Previous
          </Link>
        </div>
      )}
      {hasNextPage && (
        <div className="flex-grow flex justify-end">
          <Link
            className={buttonVariants({ variant: 'secondary' })}
            href={nextPage}
          >
            Next
            <CaretRightIcon width={20} height={20} />
          </Link>
        </div>
      )}
    </div>
  )
}

export default Pagination
