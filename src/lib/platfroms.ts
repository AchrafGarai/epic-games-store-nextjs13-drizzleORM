import { Platform } from '@/db/platforms/schema'
import { auth } from '@clerk/nextjs/server'

export const usePlatfroms = async () => {
  const { getToken } = auth()
  const platforms = (await fetch(`${process.env.API_URL}/platfroms`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })
    .then((res) => res.json())
    .catch((e) => console.log(e))) as {
    data: Platform[]
  }
  return platforms
}
