import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  serverExternalPackages: ['@libsql/client', 'libsql'],
  // Old /games/<numeric id> links can't be mapped to the new catalog.
  async redirects() {
    return [{ source: '/games/:id(\\d+)', destination: '/', permanent: false }]
  },
}

export default nextConfig
