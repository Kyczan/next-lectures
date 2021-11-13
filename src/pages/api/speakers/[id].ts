import type { NextApiHandler } from 'next'

import dbConnect from '../../../utils/db/dbConnect'
import Speaker from '../../../models/Speaker'
import authMiddleware from '../../../utils/middleware/auth'

const speakerHandler: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    method,
  } = req
  await authMiddleware(req, res)
  await dbConnect()

  switch (method) {
    case 'PUT':
      try {
        const speaker = await Speaker.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!speaker) {
          res.status(400)
          return
        }
        res.status(200).json(speaker)
      } catch (error) {
        res.status(400)
      }
      break
    case 'DELETE':
      try {
        const deletedSpeaker = await Speaker.deleteOne({ _id: id })
        if (!deletedSpeaker) {
          res.status(400)
          return
        }
        res.status(200).json(deletedSpeaker)
      } catch (error) {
        res.status(400)
      }
      break
    default:
      res.status(400)
      break
  }
}

export default speakerHandler
