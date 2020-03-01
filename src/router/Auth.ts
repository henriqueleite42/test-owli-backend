// Dependencies
import { IRouter, Router, Express } from 'express'

// Controllers
import { auth } from '../controllers/Auth'

class Auth {
  public router: IRouter

  public constructor (server: Express) {
    this.router = Router()

    this.config()

    server.use('/auth', this.router)
  }

  private config () {
    // Auth
    this.router.post('', async (req, res) => res.json(await auth(req)))
  }
}

export default Auth