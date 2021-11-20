import mongoose, { Schema, model } from 'mongoose'

interface ILecture {
  number: string
  title: string
  note?: string
  lastDate?: string
  lastSpeaker?: string
}

export const LectureSchema = new Schema<ILecture>({
  number: { type: String, required: true },
  title: { type: String, required: true },
  lastDate: String,
  note: String,
  lastSpeaker: String,
})

const lectureModel =
  mongoose.models.Lecture || model<ILecture>('Lecture', LectureSchema)

export default lectureModel
