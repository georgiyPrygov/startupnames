/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    sassOptions: {
        includePaths: ['./styles'],
    },
    // In Next.js 14, App Router is now the default
    // so no need for experimental.appDir anymore
}

module.exports = nextConfig
