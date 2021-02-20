const path = require("path"); // NodeJs의 경로 조작 기능 가져옴
const refereshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  name: "word-relay-setting", //웹팩 설정 이름
  mode: "development", // 실서비스: production
  devtool: "eval", // 빠르게?
  resolve: {
    extensions: [".js", ".jsx"], // 이 확장자로 끝나는 걸 읽어 와
  },
  entry: {
    app: ["./client"], // client.jsx 가 이미 WordRelay.jsx 를 불러오고 있으므로, 웹팩이 알아서 묶어 준다.
  }, // 입력

  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "react-refresh/babel",
          ],
        },
      },
    ],
  },
  plugins: [new refereshWebpackPlugin()],
  output: {
    path: path.join(__dirname, "dist"), // 폴더를 dist 로
    filename: "app.js",
    publicPath: "/dist",
  }, // 출력
  devServer: {
    publicPath: "/dist",
    hot: true,
  },
};
