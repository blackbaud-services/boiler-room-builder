const defaultShared = require('../../config/webpack.shared.config')
const defaultClient = require('../../config/webpack.client.config')
const defaultServer = require('../../config/webpack.server.config')
const defaultDev = require('../../config/webpack.dev.config')

const { join } = require('path')
const merge = require('webpack-merge')

const PROD = process.env.NODE_ENV === 'production'

const { assign } = Object

const trimPath = (path = '') => (
  path.replace().replace(/^\/|\/$/g, '')
)

const ensureAbsolute = (path = '') => {
  if (!path) return '/'
  return `/${path}/`
}

const applyConfig = (webpackConfig, {
  inputDir = join(process.cwd(), 'source'),
  outputDir = join(process.cwd(), 'dist'),
  basePath = ''
}) => {
  const publicPath = ensureAbsolute(
    trimPath(basePath)
  )

  const outputPath = PROD
    ? outputDir
    : join(outputDir, basePath)

  const { output } = webpackConfig

  return assign({}, webpackConfig, {
    context: inputDir,
    output: assign({}, output, {
      path: outputPath,
      publicPath
    })
  })
}

const smarterMerge = (configA, configB) => {
  const merged = merge.smart(configA, configB)
  return assign(merged, {
    plugins: (configA.plugins || []).concat(configB.plugins || [])
  })
}

module.exports = ({
  inputDir,
  outputDir,
  basePath,
  shared = {},
  server = {},
  client = {},
  dev = {}
} = {}) => {
  const config = {
    inputDir,
    outputDir,
    basePath
  }

  const sharedConfig = smarterMerge(
    defaultShared,
    shared
  )
  const serverConfig = applyConfig(
    smarterMerge(
      sharedConfig,
      smarterMerge(
        defaultServer,
        server
      )
    ),
    config
  )
  const clientConfig = applyConfig(
    smarterMerge(
      sharedConfig,
      smarterMerge(
        defaultClient,
        client
      )
    ),
    config
  )
  const devConfig = smarterMerge(
    defaultDev,
    dev
  )

  return {
    clientConfig,
    serverConfig,
    devConfig
  }
}