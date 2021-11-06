// webpack doesn't allow esm imports without babel
/* eslint @typescript-eslint/no-var-requires:"off" */
const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    index: "./src/client/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist/public"),
  },
  mode: "development",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          onlyCompileBundledFiles: true,
          configFile: "./tsconfig.json",
        },
      },
    ],
  },
}
