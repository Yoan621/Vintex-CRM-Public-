/** @type {import('next').NextConfig} */
const EXTERNAL_PACKAGES = [
  '@libsql/client',
  '@libsql/hrana-client',
  '@libsql/core',
  '@libsql/darwin-x64',
  '@libsql/isomorphic-fetch',
  '@prisma/adapter-libsql',
  'libsql',
  'better-sqlite3',
]

const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverComponentsExternalPackages: EXTERNAL_PACKAGES,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Forcer ces packages en external côté serveur
      const existing = config.externals || []
      config.externals = [
        ...existing,
        ...EXTERNAL_PACKAGES.map(pkg => ({ [pkg]: `commonjs ${pkg}` })),
      ]
    }

    config.module.rules.push({ test: /LICENSE$/, type: 'asset/resource' })
    config.module.rules.push({ test: /\.(md|node|wasm)$/, type: 'asset/resource' })

    return config
  },
}

module.exports = nextConfig
