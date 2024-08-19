const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },

  chainWebpack: (config) => {
    config.module
      .rule('glb')
      .test(/\.glb$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'models/[name].[hash:8].[ext]'
      });
  }
})