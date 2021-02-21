const path = require('path');

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
			test: /\.(js|mjs|jsx|ts|tsx)$/,
			exclude: /node_modules\/(?!(vue-mapbox)\/).*/, 
            loader: require.resolve('babel-loader')
		}]
	},
};