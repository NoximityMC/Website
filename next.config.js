/** @type {import('next').NextConfig} */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'cdn.discordapp.com',
			},
			{
				hostname: 'www.gravatar.com',
			}
		],
	},
	swcMinify: true,
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.plugins.push(
			new CopyPlugin({
				patterns: [
					{
						from: path.join(__dirname, "node_modules/tinymce"),
						to: path.join(__dirname, "public/assets/libs/tinymce"),
					},
				],
			})
		);
		return config;
	},
	experimental: {
		serverActions: true,
	},
	reactStrictMode: true
}

module.exports = nextConfig
