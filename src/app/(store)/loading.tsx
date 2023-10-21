export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <div className="animate-pulse grid grid-cols-2 gap-4 md:grid-cols-4">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </>
  )
}

function LoadingCard() {
  return (
    <>
      <div className=" bg-neutral-800 h-96 rounded-sm"></div>
    </>
  )
}
