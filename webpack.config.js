const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function template({template}, _, {componentName, props, jsx}) {
	return template.ast`
		import React from "react";
		const ${componentName} = (${props}) => ${jsx};
		export default ${componentName};
	`;
}

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
		}, {
			test: /.svg$/,
			use: [{
				loader: "@svgr/webpack",
				options: {template},
			}],
		}, {
			test: /.png$/,
			use: [{
				loader: "file-loader",
				options: {
					publicPath: "/dist",
				},
			}],
		}],
	},
	resolve: {extensions: [".js", ".json", ".css", ".svg"]},
	mode: env === "prod" ? "production" : "development",
	devtool: env === "prod" ? "" : "eval-source-map",
	devServer: {open: true, publicPath: "/dist", port: 8080},
});
