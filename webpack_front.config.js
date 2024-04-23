var webpack = require('webpack');
module.exports = {
	mode: 'development',
	context: __dirname + '/scripts',
	
	entry: {
		frontend: './frontend.js',
		
	},
		output: {
		path: __dirname + '/public/assets/js',
		filename: "[name].js"
	},
	plugins: [
	],
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
			//use: [ "ngtemplate-loader" ]
		},
		{
			test: /\.tmpl$/,
			use: ["raw-loader"]
		},
		]
    }
}; 