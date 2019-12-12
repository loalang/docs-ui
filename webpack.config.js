const path = require("path");

module.exports = {
  entry: "./src/Local/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, ".local")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    index: "./src/Local/index.html"
  }
};
