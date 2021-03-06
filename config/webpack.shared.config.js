const extensions = require('./extensions')
const babelConfig = require('./babel')
const babelTypescriptConfig = require('./babelTypescript')

const extensionsFlat = [].concat(
  extensions.audio,
  extensions.fonts,
  extensions.images,
  extensions.video
)
const fileLoaders = extensionsFlat.map((ext) => ({
  test: new RegExp(`\\.${ext}$`),
  use: 'file-loader'
}))

const javascriptRules = [
  {
    test: /\.(js|jsx)?$/,
    use: [
      {
        loader: 'babel-loader',
        options: babelConfig
      },
      {
        loader: 'standard-loader',
        options: {
          parser: 'babel-eslint'
        }
      }
    ],
    exclude: /node_modules|dist/
  }
].concat(fileLoaders)

const typescriptRules = [
  {
    test: /\.(js|jsx|ts|tsx)?$/,
    use: [
      {
        loader: 'babel-loader',
        options: babelTypescriptConfig
      },
      {
        loader: 'eslint-loader'
      }
    ],
    exclude: /node_modules|dist/
  }
].concat(fileLoaders)

const plugins = []

module.exports = (supportTypescript = false) => {
  return {
    stats: { children: false },
    plugins,
    module: { rules: supportTypescript ? typescriptRules : javascriptRules }
  }
}
