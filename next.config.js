/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@libsql/client', '@prisma/adapter-libsql', 'prisma'],
  },
  webpack: (config, { isServer }) => {
    // Ignorer les fichiers README, LICENSE et binaires dans node_modules
    config.module.rules.push({
      test: /\.(md|node)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext]',
      },
    })

    // Ignorer les fichiers non-JS dans @libsql
    config.resolve.alias = {
      ...config.resolve.alias,
    }

    return config
  },
}

module.exports = nextConfig

