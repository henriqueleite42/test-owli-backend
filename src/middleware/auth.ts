// Dependencies
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Enable Environment Variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Interfaces
interface DecodedInterface {
  id: string
}

// Auth System
export default function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) res.json({ status: 401, msg: 'No Token Provided' });

  const parts = authHeader.split(' ');

  if (parts.length !== 2) res.json({ status: 401, msg: 'Token Malformated' });

  const [ scheme, token ] = parts;

  if (!token) res.json({ status: 401, msg: 'Token Malformated' });

  if (!/Bearer/i.test(scheme)) res.json({ status: 401, msg: 'Token Malformated' });

  jwt.verify(token, process.env.SECRET, (err, decoded: DecodedInterface) => {
    if (err) res.json({ status: 401, msg: 'Invalid Token' });

    req.body.USER = decoded.id;

    return next();
  })
}