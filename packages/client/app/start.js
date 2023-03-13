import { startClient } from '@coko/client'

import routes from './routes'
import theme from './theme'

const options = {
  // Custom Apollo Config,
}

startClient(routes, theme, options)
