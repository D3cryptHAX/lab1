const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require('glob');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Генеруємо тільки один основний index.html
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
    }),
    // Генерація інших HTML файлів з директорії src/pages
    ...glob.sync('./src/pages/*.html').map(file => {
      return new HtmlWebpackPlugin({
        template: file,
        filename: path.basename(file), // Використовує ім'я файлу без шляху
        inject: 'body',
        // Перевірка, щоб уникнути конфлікту з index.html
        excludeChunks: ['main'], // Не використовує main.js для додаткових сторінок
      });
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // для обробки JavaScript файлів
        exclude: /node_modules/,
        use: 'babel-loader', // Якщо використовуєте babel-loader
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
    compress: true,
    port: 9000,
    open: true,
    hot: true,
  },
};
