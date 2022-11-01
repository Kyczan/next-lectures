import type { NextApiHandler } from 'next'

import dbConnect from '../../../utils/db/dbConnect'
import Lecture from '../../../models/Lecture'
import Plan from '../../../models/Plan'
import authMiddleware from '../../../utils/middleware/auth'

const lecturesHandler: NextApiHandler = async (req, res) => {
  const { method } = req
  await authMiddleware(req, res)
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const [lectures, plan] = await Promise.all([
          // @ts-ignore
          Lecture.find({}).sort({ number: 1 }).lean(),
          // @ts-ignore
          Plan.find({}).sort({ date: -1 }).lean(),
        ])
        const lecturesWithPlan = lectures.map((lecture) => {
          const lastEvent = plan.find(
            (event) => String(event.lecture?._id) === String(lecture._id)
          )
          lecture.lastEvent = lastEvent

          return lecture
        })

        res.status(200).json(lecturesWithPlan)
      } catch (error) {
        res.status(400)
      }
      break
    case 'POST':
      try {
        // @ts-ignore
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
