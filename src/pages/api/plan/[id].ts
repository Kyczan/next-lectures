import type { NextApiHandler } from 'next'

import dbConnect from '../../../utils/db/dbConnect'
import Plan from '../../../models/Plan'
import authMiddleware from '../../../utils/middleware/auth'

const planHandler: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    method,
  } = req
  await authMiddleware(req, res)
  await dbConnect()

  switch (method) {
    case 'PUT':
      try {
        const plan = await Plan.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!plan) {
          res.status(400)
          return
        }
        res.status(200).json(plan)
      } catch (error) {
        res.status(400)
      }
      break
    case 'DELETE':
      try {
        const deletedPlan = await Plan.deleteOne({ _id: id })
        if (!deletedPlan) {
          res.status(400)
          return
        }
        res.status(200).json(deletedPlan)
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
