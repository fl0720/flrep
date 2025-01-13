// vue.config.js

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({transpileDependencies: true});

module.exports = {
	publicPath: "/flrep/",
	lintOnSave: false,
	// publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

	//代理服务器
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				pathRewrite: { '^/api': '' },  // 这个可以根据需要调整
			},
		}
	},

};
