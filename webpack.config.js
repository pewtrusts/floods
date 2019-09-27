const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const path = require('path');
const outputFolder = process.env.NODE_ENV === 'preview' ? 'docs/' : process.env.NODE_ENV === 'localpreview' ? 'preview/' : 'dist/';
const isDev = mode === 'development';
const isProd = process.env.NODE_ENV === 'production';

const repoName = 'floods';
const publicPath = isProd ? 'TOCOME' : '';


const copyWebpack =
    new CopyWebpackPlugin([{
        from: '-/',
        context: 'src',
        to: '-/'
    }, {
        from: 'assets/',
        context: 'src',
        to: 'assets/',
        ignore: ['Pew/css/**/*.*']
    }, {
        from: 'assets/Pew/css/',
        context: 'src',
        to: 'assets/Pew/css/',
        transform(content, path) {
            if (process.env.NODE_ENV === 'preview') {
                // this modifies the content of the files being copied; here making sure url('/...') is changed so that it will
                // work on gitHub pages where oublic path is /{repoName}/
                // also changes references to 'pew' to refer to 'Pew'
                return content.toString().replace(/url\("\/([^/])/g, 'url("/' + repoName + '/$1').replace(/\/pew\//g, '/Pew/');
            } else {
                return content.toString();
            }
        }
    }]);

const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: 'title title title',
        template: isProd ? './src/index.html' : './src/index-dev.html',
        inject: !isProd,
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css'
    }),
    new webpack.DefinePlugin({
        'PUBLICPATH': '"' + publicPath + '"', // from https://webpack.js.org/plugins/define-plugin/: Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself. Typically, this is done either with alternate quotes, such as '"production"', or by using JSON.stringify('production').
    }),
];

if (!isProd) {
    plugins.push(copyWebpack);
}

module.exports = env => {
    return {
        entry: {
            bundle: ['./src/main.js']
        },
        resolve: {
            alias: {
                "@Submodule": path.resolve('submodules')
            },
        },
        output: {
            path: __dirname + '/' + outputFolder,
            filename: '[name].js',
            chunkFilename: '[name].[id].js'
        },
        module: {
            rules: [{
                        test: /\.js$/,
                        exclude: [/node_modules/, /\.min\./, /vendor/],
                        use: [
                            {
                                loader: 'eslint-loader'
                            }
                        ]},
                {
                    test: /\.css$/,
                    use: [
                        /**
                         * MiniCssExtractPlugin doesn't support HMR.
                         * For developing, use 'style-loader' instead.
                         * */
                        !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        /**
                         * MiniCssExtractPlugin doesn't support HMR.
                         * For developing, use 'style-loader' instead.
                         * */
                        !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.csv$/,
                    loader: 'csv-loader',
                    options: {
                        header: true,
                        skipEmptyLines: true 
                    }
                },
                {
                    test: /html\.html$/,
                    use: [
                        {
                            loader: 'html-loader'
                        },
                    ]
                }
            ]
        },
        mode,
        plugins,
        devtool: isDev ? 'source-map' : false // TO DO: WILL WANT SOURCE MAPS
    }
};