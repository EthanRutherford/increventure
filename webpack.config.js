const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function template({template}, _, {componentName, props, jsx}) {
	return template.ast`
		const ${componentName} = (${props}) => ${jsx};
		export default ${componentName};
	`;
}

module.exports = (env) => ({
	entry: "./src/main.jsx",
	output: {publicPath: "/dist/"},
	mode: env === "prod" ? "production" : "development",
	devtool: env === "prod" ? "" : "eval-cheap-module-source-map",
	devServer: {open: true, publicPath: "/dist", port: 8080},
	plugins: [new MiniCssExtractPlugin({filename: "styles.css"})],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"cache-loader",
					{
						loader: "css-loader", options: {
							modules: {
								exportLocalsConvention: "camelCaseOnly",
								localIdentName: "[name]__[local]--[hash:base64:5]",
							},
						},
					},
				],
			}, {
				test: /.svg$/,
				use: [
					"cache-loader",
					"babel-loader",
					{
						loader: "@svgr/webpack",
						options: {babel: false, template},
					},
				],
			}, {
				test: /.png$/,
				use: [
					{
						loader: "file-loader",
						options: {
							publicPath: "/dist",
						},
					},
				],
			}, {
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					"cache-loader",
					"babel-loader",
				],
			},
		],
	},
	resolve: {extensions: [".js", ".jsx", ".json", ".css", ".svg"]},
});
