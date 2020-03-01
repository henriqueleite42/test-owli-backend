// Dependencies
import { IRouter, Express, Router } from 'express'

// Controllers
import { search, create } from '../controllers/Message'

// Middlewares
import authMiddleware from '../middleware/auth'

class Message {
  public router: IRouter

  public constructor (server: Express) {
    this.router = Router()

    this.router.use(authMiddleware)

    this.config()

    server.use('/message', this.router)
  }

  private config () {
    // Search
    this.router.get('/search',  async (req, res) => res.json(await search(req)));

    // Create
    this.router.post('/create', async (req, res) => res.json(await create(req)));
  }
}

export default Message