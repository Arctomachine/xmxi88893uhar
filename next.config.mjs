/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		reactCompiler: process.env.NODE_ENV !== 'development',
	},
}

export default nextConfig
