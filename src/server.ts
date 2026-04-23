import app from './app'
import { env } from './config/env'

app.listen(env.PORT, () => {
  console.log(
    `Server running in ${env.isProduction ? 'production' : 'development'} mode on http://localhost:${env.PORT}`
  )
})
