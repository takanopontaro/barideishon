module.exports = {
  watch: true,
  devtool: 'inline-source-map',
  entry: {
    'test/test.spec.bundle': './test/test.spec.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
  },
};
