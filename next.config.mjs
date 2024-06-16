/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'test.taxivoshod.ru',
				pathname: '/**',
			},
		],
	},
	experimental: {
		reactCompiler: process.env.NODE_ENV !== 'development',
	},
}

export default nextConfig
