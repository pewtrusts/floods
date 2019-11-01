const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const pretty = require('pretty');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const path = require('path');
const outputFolder = process.env.NODE_ENV === 'preview' ? 'docs/' : process.env.NODE_ENV === 'localpreview' ? 'preview/' : 'dist/';
const isDev = mode === 'development';
const isProd = process.env.NODE_ENV === 'production';

const repoName = 'floods';
const publicPath = isProd ? '/-/media/data-visualizations/interactives/2019/mitigation/' : '';


const copyWebpack =
    new CopyWebpackPlugin([
    {
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

const prodCopyWebpack = new CopyWebpackPlugin([
    {
        from: 'overview.html',
        context: 'src',
    }
]);

const prerender = new PrerenderSPAPlugin({
     // Required - The path to the webpack-outputted app to prerender.
     staticDir: path.join(__dirname, outputFolder),
     // Required - Routes to render.
     routes: ['/'],
     renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
         injectProperty: 'IS_PRERENDERING',
         inject: true,
         headless: false,
         //sloMo: 10000,
         renderAfterTime: 600
     }),
     postProcess: function(renderedRoute){
        var regex = new RegExp(`<script .*? src="${publicPath}render.js"></script>`);
        if ( isProd ){
             renderedRoute.html = renderedRoute.html.replace(/class="emitted-css" href="(.*?)"/g,'class="emitted-css" href="' + publicPath + '$1' + '"');
             renderedRoute.html = renderedRoute.html.replace(/class="emitted-bundle" src="(.*?)"/g,'class="emitted-bundle" src="' + publicPath + '$1' + '"');
             renderedRoute.html = renderedRoute.html.replace(/<\/?head>/g,'').replace(/<\/?html.*?>|<\/?body.*?>/g,'');
             renderedRoute.html = renderedRoute.html.replace(/<section class="mm-category mm-category-overview">[\s\S]*?<\/section>/,'');
         } 
         renderedRoute.html = renderedRoute.html.replace(regex,'');
         renderedRoute.html = pretty(renderedRoute.html);
         return renderedRoute;
     }
 });

const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: 'title title title',
        template: isProd ? './src/index.html' : './src/index-dev.html',
        inject: !isProd,
    }),
    new MiniCssExtractPlugin({
        filename: 'styles.css'
    }),
    new webpack.DefinePlugin({
        'PUBLICPATH': '"' + publicPath + '"', // from https://webpack.js.org/plugins/define-plugin/: Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself. Typically, this is done either with alternate quotes, such as '"production"', or by using JSON.stringify('production').
    }),
];

if (!isProd) {
    plugins.push(copyWebpack);
} else {
    plugins.push(prodCopyWebpack);
}
if (!isDev) {
    plugins.push(prerender);
}

const scssUse = isDev ? [
    /**
     * MiniCssExtractPlugin doesn't support HMR.
     * For developing, use 'style-loader' instead.
     * */
    'style-loader',
    'css-loader',
    'sass-loader'
] : [{
        loader: MiniCssExtractPlugin.loader,
    },
    {
        loader: 'css-loader',
        options: {
           
            sourceMap: true,
            importLoaders: 1
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            sourceMap: true,
            ident: 'postcss',
            plugins: (loader) => [
                require('postcss-preset-env')({
                    autoprefixer: {
                        grid: true
                    }
                }),
            ]
        }
    },
    {
        loader: 'sass-loader',
        options: {
            sourceMap: true
        }
    },
];


module.exports = env => {
    return {
        entry: {
            render: './src/main.js',
            hydrate: './src/scripts.js'
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
                    use: scssUse
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
                    test: /overview\.html$/,
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