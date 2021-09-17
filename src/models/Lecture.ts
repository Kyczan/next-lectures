import mongoose, { Schema, model } from 'mongoose'

interface ILecture {
  number: number
  title: string
  note?: string
  lastDate?: string
  lastSpeaker?: string
}

const LectureSchema = new Schema<ILecture>({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  lastDate: String,
  note: String,
  lastSpeaker: String,
})

const lectureModel =
  mongoose.models.Lecture || model<ILecture>('Lecture', LectureSchema)

export default lectureModel
