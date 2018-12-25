const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => ({
	entry: "./src/main.js",
	output: {filename: "main.js"},
	plugins: [new MiniCssExtractPlugin({filename: "styles.css"})],
	module: {
		rules: [{
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				{loader: "css-loader", options: {
					camelCase: "only",
					localIdentName: "[name]__[local]--[hash:base64:5]",
					modules: true,
				}},
			],
		}],
	},
	resolve: {extensions: [".js", ".json", ".css"]},
	mode: env === "prod" ? "production" : "development",
	devtool: env === "prod" ? "" : "eval-source-map",
	devServer: {open: true, publicPath: "/dist"},
});
