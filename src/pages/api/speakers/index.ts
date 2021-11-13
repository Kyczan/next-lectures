import type { NextApiHandler } from 'next'

import dbConnect from '../../../utils/db/dbConnect'
import Speaker from '../../../models/Speaker'
import authMiddleware from '../../../utils/middleware/auth'

const speakersHandler: NextApiHandler = async (req, res) => {
  const { method } = req
  await authMiddleware(req, res)
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const speakers = await Speaker.find({})
        res.status(200).json(speakers)
      } catch (error) {
        res.status(400)
      }
      break
    case 'POST':
      try {
        const speaker = await Speaker.create(req.body)
        res.status(201).json(speaker)
      } catch (error) {
        res.status(400)
      }
      break
    default:
      res.status(400)
      break
  }
}

export default speakersHandler
