import type { NextApiHandler } from 'next'

import dbConnect from '../../../utils/db/dbConnect'
import Lecture from '../../../models/Lecture'
import Plan from '../../../models/Plan'

const lecturesHandler: NextApiHandler = async (req, res) => {
  const { method } = req
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const [lectures, plan] = await Promise.all([
          Lecture.find({}).sort({ number: 1 }).lean(),
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
