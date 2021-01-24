const webpack = require('webpack');
const conf = require('./webpack.base');
const { merge } = require('webpack-merge');
const express = require('express');
const middleware = require('webpack-dev-middleware');

const compiler = webpack(merge(conf, {
  mode: 'development',
}));

const app = express();

app.use(
  middleware(compiler, {
    // webpack-dev-middleware options
  })
);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
