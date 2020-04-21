import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as TerserWebpackPlugin from "terser-webpack-plugin";
import { BUILD_DIR, CLIENT_DIR, clientVars, config } from "./server/config"
const os = require('os');

export default () => {
  const { IS_PRODUCTION } = config;
  const srcDir = path.resolve(process.cwd(), CLIENT_DIR);
  const buildDir = path.resolve(process.cwd(), BUILD_DIR, CLIENT_DIR);
  const tsConfigClientFile = path.resolve(srcDir, "tsconfig.json");
  const sassCommonVarsFile = "./components/vars.scss"; // needs to be relative for Windows
  return {
    entry: {
      app: path.resolve(srcDir, "components/app.tsx"),
    },
    output: {
      //path: buildDir,
      path:path.resolve(__dirname,'./dist'),
      publicPath: '',
      filename: '[name].js',
      chunkFilename: 'chunks/[name].js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    devServer:{
      //项目根目录
      host:getNetworkIp(),
      port:'8087',
      contentBase:path.join(__dirname,"./dist"),
      historyApiFallback:true,
      overlay:true,
      publicPath: '',
      proxy:{
        '/api-kube': {
            target:'http://127.0.0.1:8001/',
            //target: 'http://10.1.150.252:8080', // 接口的域名
            //target: 'http://10.1.140.175:8001', // 接口的域名
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {'^/api-kube': ''}
        },
        '/api/config': {
            target:'http://localhost:3000/',
            secure: false,
            changeOrigin: true, 
        },
        '/tenant': {
          //target: 'http://10.1.150.252:8080',
            target: 'http://localhost:3000/',
            secure: false,
            changeOrigin: true,
        },
      }
      // openPage:'index.html',
    },
    mode: IS_PRODUCTION ? "production" : "development",
    devtool: IS_PRODUCTION ? "" : "cheap-module-eval-source-map",

    optimization: {
      minimize: IS_PRODUCTION,
      minimizer: [
        ...(!IS_PRODUCTION ? [] : [
          new TerserWebpackPlugin({
            cache: true,
            parallel: true,
            terserOptions: {
              mangle: true,
              compress: true,
              keep_classnames: true,
              keep_fnames: true,
            },
            extractComments: {
              condition: "some",
              banner: [
                `Lens. Copyright ${new Date().getFullYear()} by Lakend Labs, Inc. All rights reserved.`
              ].join("\n")
            }
          })
        ]),
      ],
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            "babel-loader",
            {
              loader: 'ts-loader',
              options: {
                configFile: tsConfigClientFile
              }
            }
          ]
        },
        {
          test: /\.(jpg|png|svg|map|ico)$/,
          use: 'file-loader?name=assets/[name]-[hash:6].[ext]'
        },
        {
          test: /\.(ttf|eot|woff2?)$/,
          use: 'file-loader?name=fonts/[name].[ext]'
        },
        {
          test: /\.ya?ml$/,
          use: "yml-loader"
        },
        {
          test: /\.s?css$/,
          use: [
            IS_PRODUCTION ? MiniCssExtractPlugin.loader : {
              loader: "style-loader",
              options: {}
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: !IS_PRODUCTION
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: !IS_PRODUCTION,
                prependData: '@import "' + sassCommonVarsFile + '";',
                sassOptions: {
                  includePaths: [srcDir]
                },
              }
            },
          ]
        }
      ]
    },
    
    plugins: [
      // ...(IS_PRODUCTION ? [] : [
      // new webpack.HotModuleReplacementPlugin(),
      // ]),

      new webpack.HotModuleReplacementPlugin(),

      new webpack.DefinePlugin({
        process: {
          env: JSON.stringify(clientVars)
        },
      }),

      // don't include all moment.js locales by default
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new HtmlWebpackPlugin({
        template: 'index.html',
        inject: true,
        hash: true,
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
  }
};

function getNetworkIp() {
	let needHost = ''; // 打开的host
	try {
		// 获得网络接口列表
		let network = os.networkInterfaces();
		for (let dev in network) {
			let iface = network[dev];
			for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
				if (alias.family === 'IPv4' && !alias.internal && alias.address.includes('10')) {
          needHost = alias.address;
          return needHost
        }
        else{
          needHost = 'localhost'
        }
			}
		}
	} catch (e) {
    needHost = 'localhost';
	}
	return needHost;
}