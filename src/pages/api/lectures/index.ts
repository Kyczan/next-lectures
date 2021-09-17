import type { NextApiHandler } from 'next'

import dbConnect from '../../../utils/db/dbConnect'
import Lecture from '../../../models/Lecture'
import authMiddleware from '../../../utils/middleware/auth'

const lecturesHandler: NextApiHandler = async (req, res) => {
  const { method } = req
  // await authMiddleware(req, res)
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const lectures = await Lecture.find({})
        res.status(200).json(lectures)
      } catch (error) {
        res.status(400)
      }
      break
    case 'POST':
      try {
        const lecture = await Lecture.create(req.body)
        res.status(201).json(lecture)
      } catch (error) {
        res.status(400)
      }
      break
    default:
      res.status(400)
      break
  }
}

export default lecturesHandler
