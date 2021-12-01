import type { NextApiHandler } from 'next'

import dbConnect from '../../../utils/db/dbConnect'
import Lecture from '../../../models/Lecture'

const lecturesHandler: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    method,
  } = req
  await dbConnect()

  switch (method) {
    case 'PUT':
      try {
        const lecture = await Lecture.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!lecture) {
          res.status(400)
          return
        }
        res.status(200).json(lecture)
      } catch (error) {
        res.status(400)
      }
      break
    case 'DELETE':
      try {
        const deletedLecture = await Lecture.deleteOne({ _id: id })
        if (!deletedLecture) {
          res.status(400)
          return
        }
        res.status(200).json(deletedLecture)
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
