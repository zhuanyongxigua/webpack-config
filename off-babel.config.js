module.exports = function(api) {
  api.cache(false)
  console.log('what the fuck!!')
  const presets = [
    [
      '@babel/preset-env',
      {
        // modules: false,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not id <= 8']
        }
      },
      '@babel/preset-stage-2'
    ]
  ]
  const plugins = [
    'transform-vue-jsx',
    'transform-runtime',
    '@babel/plugin-syntax-dynamic-import'
  ]
  return {
    presets,
    plugins
  }
}