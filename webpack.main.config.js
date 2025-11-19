const path = require('path');

module.exports = [
  // Main process
  {
    entry: './src/main/main.ts',
    target: 'electron-main',
    mode: process.env.NODE_ENV || 'development',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    node: {
      __dirname: false,
      __filename: false
    }
  },
  // Preload script
  {
    entry: './src/main/preload.ts',
    target: 'electron-preload',
    mode: process.env.NODE_ENV || 'development',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'preload.js'
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    node: {
      __dirname: false,
      __filename: false
    }
  }
];
