import mongoose, { Schema, model } from 'mongoose'

interface IPlan {
  date: string
  lecture?: string
  note?: string
  speaker?: string
  congregation?: string
}

const PlanSchema = new Schema<IPlan>({
  date: { type: String, required: true },
  lecture: String,
  note: String,
  speaker: String,
  congregation: String,
})

const planModel = mongoose.models.Plan || model<IPlan>('Plan', PlanSchema)

export default planModel
