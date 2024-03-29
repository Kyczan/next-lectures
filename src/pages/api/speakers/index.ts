import type { NextApiHandler } from 'next'

import dbConnect from '../../../utils/db/dbConnect'
import Speaker from '../../../models/Speaker'
import Plan from '../../../models/Plan'
import authMiddleware from '../../../utils/middleware/auth'

const speakersHandler: NextApiHandler = async (req, res) => {
  const { method } = req
  await authMiddleware(req, res)
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const [speakers, plan] = await Promise.all([
          // @ts-ignore
          Speaker.find({}).sort({ name: 1 }).lean(),
          // @ts-ignore
          Plan.find({}).sort({ date: -1 }).lean(),
        ])
        const speakersWithPlan = speakers.map((speaker) => {
          const lastEvent = plan.find(
            (event) => String(event.speaker?._id) === String(speaker._id)
          )
          speaker.lastEvent = lastEvent

          return speaker
        })
        res.status(200).json(speakersWithPlan)
      } catch (error) {
        res.status(400)
      }
      break
    case 'POST':
      try {
        // @ts-ignore
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
