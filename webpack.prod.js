const webpack = require('webpack');
const conf = require('./webpack.base');
const { merge } = require('webpack-merge');


webpack(merge(conf, {
  mode: 'production',
}), (err, stats) => {
  if (err) throw err;
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    chunks: false,
    chunkModules: false
  }) + '\n\n');
})
