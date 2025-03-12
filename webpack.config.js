const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css'],
        alias: {
          lib: path.resolve(__dirname, 'src/app/lib'),
          ui: path.resolve(__dirname, 'src/app/ui')
        }
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
      },
      devServer: {
        static: {
          directory: path.join(__dirname, 'public'),
        },
        port: 3000,
        hot: true,
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './public/index.html',
        }),
        new CopyPlugin({
            patterns: [
              { 
                from: 'public', 
                to: '', 
                globOptions: {
                  ignore: ['**/index.html'] // Don't copy index.html as HtmlWebpackPlugin handles it
                }
              },
            ],
          }),
      ],
}