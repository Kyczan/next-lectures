import type { NextApiHandler } from 'next'

import dbConnect from '../../../utils/db/dbConnect'
import Plan from '../../../models/Plan'

const planHandler: NextApiHandler = async (req, res) => {
  const { method } = req
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const plan = await Plan.find({}).sort({ date: -1 }).lean()
        res.status(200).json(plan)
      } catch (error) {
        res.status(400)
      }
      break
    case 'POST':
      try {
        const plan = await Plan.create(req.body)
        res.status(201).json(plan)
      } catch (error) {
        res.status(400)
      }
      break
    default:
      res.status(400)
      break
  }
}

export default planHandler
