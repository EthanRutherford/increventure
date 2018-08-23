const path = require("path");

module.exports = (env) => ({
	entry: "./src/main.js",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname),
	},
	mode: env === "prod" ? "production" : "development",
	devtool: env === "prod" ? "" : "eval-source-map",
	serve: {open: true},
});
