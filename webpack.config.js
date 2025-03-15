const webpack = require('webpack');
module.exports = {
    // ... другие настройки ...
    plugins: [
      new webpack.ProvidePlugin({
        chrome: 'chrome' // Это ключевая строка
      }),
      // другие плагины...
    ]
  };