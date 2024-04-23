var webpack = require('webpack');
module.exports = {
	mode: 'development',
	context: __dirname + '/scripts',
	entry: {
		common: './app.common.js',
		admin: './app.admin.js',
		profile: './app.profile.js',
		builder: './app.builder.js',
		preview: './app.preview.js',
		template: './app.template.js',
		installer: './app.installer.js',
		vendor: ['angular'],
		
	},
	output: {
		path: __dirname + '/public/assets/js',
		filename: "[name].app.js"
	},
	optimization: {
		splitChunks: {
		  chunks: 'all',
		  minSize: 30000,
		//  minRemainingSize: 0,
		  maxSize: 0,
		  minChunks: 1,
		  maxAsyncRequests: 6,
		  maxInitialRequests: 4,
		  automaticNameDelimiter: '~',
		  automaticNameMaxLength: 30,
		  cacheGroups: {
			defaultVendors: {
				filename: '[name]/bundle.js',
			  test: /[\\/]node_modules[\\/]/,
			  priority: -10
			},
			default: {
			  minChunks: 2,
			  priority: -20,
			  reuseExistingChunk: true
			}
		  }
		}
	},
	plugins: [
		
			//new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js'}),
		
			/*new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				"window.jQuery": "jquery",
			})*/
	],
	node: {
  fs: "empty"
},
	module: {
		
        rules: [
		{
			test: /\.(eot|svg|ttf|woff|woff2)$/,
			loader: 'file?name=fonts/[name].[ext]'
		},
		{
			
            test: /\.less$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "less-loader" // compiles Less to CSS
            }]
        },
		{
			test: /\.css$/,
			use: [ 'style-loader', 'css-loader' ]
		},
		{
			test: /\.(jpe?g|png|gif|eot|svg|ttf|woff|woff2)$/,
			use: [ 'file-loader' ]
		},
		{
			test: /\.php$/,
			use: 'php-array-loader'
		},
		{
		  test: /\.js$/,
		 // exclude: /(node_modules|bower_components)/,
		  use: [
			{
				loader: 'ng-annotate-loader',
				 
			},
			{
				loader: 'babel-loader',
				options: {
					presets: ['es2015'],
				}
			}
		  ]
		},
		{
			test: /\.html$/,
			use: ["html-loader"]
		},
		{
			test: /\.tmpl$/,
			use: ["raw-loader"]
		},
		]
    }
}; 