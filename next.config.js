/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '/u/**',
                port: ''
            },
            {
                hostname: 'cdn.discordapp.com',
            }
        ],
    },
}

module.exports = nextConfig
