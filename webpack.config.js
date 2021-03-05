const path = require("path");
module.exports = {
  entry: "./app/src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "/app/dist"),
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
  mode: "development",
};
