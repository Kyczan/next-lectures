import mongoose, { Schema, model } from 'mongoose'

interface ISpeaker {
  name: string
  congregation?: string
  note?: string
  lastDate?: string
}

const SpeakerSchema = new Schema<ISpeaker>({
  name: { type: String, required: true },
  congregation: String,
  note: String,
  lastDate: String,
})

const speakerModel =
  mongoose.models.Speaker || model<ISpeaker>('Speaker', SpeakerSchema)

export default speakerModel
