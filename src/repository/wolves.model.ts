import { Schema, model } from 'mongoose';
import { Wolf } from '../entities/wolf.js';

const wolfSchema = new Schema<Wolf>({
  codeName: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    unique: true,
  },
  age: {
    type: Number,
  },
  pack: {
    type: String,
    enum: ['As01', 'CL01', 'CL02', 'Ga01'],
    required: true,
  },
  territory: {
    type: String,
    enum: ['Asturias', 'Castilla-León', 'Galicia'],
    required: true,
  },
  isAlpha: {
    type: Boolean,
    default: false,
  },
  isFemale: {
    type: Boolean,
    default: false,
  },
  comments: {
    type: String,
  },
  tracks: {
    type: [String],
  },
  specialist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: {
    type: [
      {
        publicId: { type: String },
        width: { type: Number },
        height: { type: Number },
        format: { type: String },
        url: { type: String },
      },
    ],
  },
});

wolfSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const WolfModel = model('Wolf', wolfSchema, 'wolves');
