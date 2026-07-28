import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    progress: { type: Number, default: 0 },
    total: { type: Number },
    type: {
      type: String,
      enum: ["book", "series", "anime", "movie", "other"],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      required: true
    },
    image: { type: String },
    position: {
      type: Number,
      required: true
    },
    score: {
      type: Number
    },
    icon: {
      type: String,
      required: true,
      default: "question"
    },
    color: {
      type: String,
      default: "text-gray-500"
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      }
    }
  }
)

export default mongoose.model("Item", itemSchema)