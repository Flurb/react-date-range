var webpack             = require('webpack');
var HtmlWebpackPlugin   = require('html-webpack-plugin');
var UglifyJsPlugin      = webpack.optimize.UglifyJsPlugin;
var path                = require('path');
var DefinePlugin        = webpack.DefinePlugin;
var WebpackDevServer    = require("webpack-dev-server");
var NODE_ENV            = process.env.NODE_ENV.trim() || 'production';

var config = {
  entry                 : {
    main                : [path.join(__dirname, '/src/main.js')]
  },

  output                : {
    path                : path.join(__dirname, '/dist'),
    filename            : '[name].js'
  },

  devtool               : ((NODE_ENV==='development') ? 'source-map' : false),

  plugins               : [
    new webpack.DefinePlugin({
       'process.env'     : {
        NODE_ENV        : JSON.stringify(NODE_ENV)
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.html'),
      filename: 'index.html',
      inject: true
    })
  ],

  resolve               : {
    extensions          : ['', '.js', '.css', '.scss'],
    alias               : {
      'root'            : path.join(__dirname, '/src'),
      'components'      : path.join(__dirname, '/src/components'),
      'styles'          : path.join(__dirname, '/src/styles')
    }
  },

  module                : {
    loaders             : [
      { test            : /\.js$/,
        loader          : 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-0'],
        },
        exclude         : /node_modules/
      }, {
        test            : /\.s?css$/,
        loaders         : ['style', 'css', 'sass']
      }
    ]
  }
}

if (NODE_ENV === 'production') {
  config.plugins.push(new UglifyJsPlugin({
    compress  : { warnings : false },
    sourcemap : false,
    mangle    : true
  }));
}

const compiler = webpack(config);

if (NODE_ENV === 'development') {
  const server = new WebpackDevServer(compiler, {
    contentBase : path.join(__dirname, 'dist'),
    noInfo: false,
    quiet: false,
    lazy: false,
    publicPath: '/',
    stats: {
      colors: true,
      chunks: false
    }
  });

  server.listen(6969, 'localhost', function(){
    console.log('Webpack Dev Server is listening on port 6969');
  });
} else if (NODE_ENV === 'production') {
  compiler.run(function (err, stats) {
    if (err) throw err;

    console.log(stats.toString({
      colors : true,
      chunks : false
    }));
  });
}
