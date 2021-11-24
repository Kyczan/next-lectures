import mongoose, { Schema, model, Document } from 'mongoose'

import { LectureSchema } from './Lecture'
import { SpeakerSchema } from './Speaker'
import { ILecturesDataItem } from '../features/lectures/lecturesSlice'
import { ISpeakersDataItem } from '../features/speakers/speakersSlice'

interface IPlan {
  date: string
  lecture?: ILecturesDataItem
  speaker?: ISpeakersDataItem
  note?: string
  congregation?: string
}

const PlanSchema = new Schema<IPlan>(
  {
    date: { type: String, required: true },
    lecture: LectureSchema,
    speaker: SpeakerSchema,
    note: String,
    congregation: String,
  },
  {
    timestamps: true,
  }
)

const planModel = mongoose.models.Plan || model<IPlan>('Plan', PlanSchema)

export default planModel
