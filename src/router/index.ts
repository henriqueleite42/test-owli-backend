import fs from 'fs'
import path from 'path'
import { Express } from 'express'

class Index {
  public constructor (server: Express) {
    fs
      .readdirSync(__dirname)
      .filter(file => (file.indexOf('.') !== 0 && (file !== "index.js")))
      .forEach(file => require(path.resolve(__dirname, file))(server))
  }
}

export default Index
