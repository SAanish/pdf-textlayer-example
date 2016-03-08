module.exports = {
  entry: './index.js',

  output: {
    path: './build',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },

  resolve: {
    alias: {
      'pdfjs/shared/global': 'pdf.js/src/shared/global',
      'pdfjs/shared/util': 'pdf.js/src/shared/util',
      'pdfjs/display/dom_utils': 'pdf.js/src/display/dom_utils'
    }
  }
};
