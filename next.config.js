/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
    }
}

module.exports = nextConfig 