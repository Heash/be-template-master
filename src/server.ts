import { app } from './app'

init()

async function init() {
  try {
    app.listen(process.env.PORT, () => {
      console.log('Express App Listening on Port 3001')
    })
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`)
    process.exit(1)
  }
}
