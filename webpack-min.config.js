﻿var webpack = require('webpack');
var clone = require('clone');

var main = require('./webpack.config-main');
var main_min = clone(main);
//main_min.plugins[0] = new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.min.js' });
main_min.mode = 'production';

main_min.optimization.minimize = true;
main_min.output.filename = '[name].app.min.js';
main_min.optimization.splitChunks.cacheGroups.defaultVendors.filename ='[name]/bundle.min.js';
main_min.optimization.splitChunks.cacheGroups.default.filename ='[name].app.min.js';

var front = require('./webpack_front.config');
var front_min = clone(front);
front_min.output.filename = '[name].min.js';
front_min.mode = 'production';

module.exports = [
	main_min, front_min
]; 