const modPath = require('path');

const pathSrc = modPath.resolve(__dirname, 'src');
const pathAssets = modPath.resolve(__dirname, 'assets/js/module');


module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: {
    'assets/js/main': './src/assets/js/main',
    'assets/js/main_port': './src/assets/js/main_port',
    'elementary/jyuken/roadmap/assets/js/main': './src/elementary/jyuken/roadmap/assets/js/main',
    'elementary/reasontochoose/assets/js/main': './src/elementary/reasontochoose/assets/js/main',
    'juniorhigh/reasontochoose/assets/js/main': './src/juniorhigh/reasontochoose/assets/js/main',
    'high/reasontochoose/assets/js/main': './src/high/reasontochoose/assets/js/main',
    'school/course/assets/js/index': './src/school/course/assets/js/index',
    'school/map/assets/js/index': './src/school/map/assets/js/index',
  },
  output: {
    // path: modPath.resolve(__dirname, 'dist/assets/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.es$/,
        include: [pathSrc, pathAssets],
        use: [{
          loader: 'babel-loader',
          options: { presets: [['es2015', { modules: false }]] },
        }],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', pathAssets],
    extensions: ['.js', '.json', '.es'],
  },
};
