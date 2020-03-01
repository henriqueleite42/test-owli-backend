// Dependencies
import { IRouter, Express, Router } from 'express'

// Controllers
import { search, create, update, del } from '../controllers/User'

// Middlewares
import authMiddleware from '../middleware/auth'

class User {
  public router: IRouter

  public constructor (server: Express) {
    this.router = Router()

    this.config()

    server.use('/user', this.router)
  }

  private config () {
    // Search
    this.router.get('/search', authMiddleware, async (req, res) => {
      res.json(await search())
    });

    // Create
    this.router.post('/create', async (req, res) => {
      res.json(await create(req))
    });

    // Update
    this.router.put('/update', async (req, res) => {
      res.json(await update(req))
    });

    // Delete
    this.router.delete('/delete', authMiddleware, async (req, res) => {
      res.json(await del(req))
    });

    // Check Token
    this.router.get('/checkToken', authMiddleware, async (req, res) => {
      res.json({ status: 200 })
    });
  }
}

export default User