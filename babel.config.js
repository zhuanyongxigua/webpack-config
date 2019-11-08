module.exports = function(api) {
  api.cache(false)
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
        },
        useBuiltIns: 'usage',
        corejs: '3.0.0'
      }
    ]
  ]
  const plugins = [
    "@babel/plugin-transform-runtime",
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true
      }
    ],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-json-strings",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    "@babel/plugin-syntax-jsx"
  ]
  return {
    presets,
    plugins
  }
}