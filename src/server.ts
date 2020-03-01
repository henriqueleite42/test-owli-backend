// Dependencies
import App from './app'
import Socket from './socket'

// Start Socket
new Socket(App)

// Start Server
App.listen(process.env.PORT);