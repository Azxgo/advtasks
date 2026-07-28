import mongoose from "mongoose";

const dailyStatsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: {
            type: Date
        },
        score: {
            type: Number
        },
        completedTasks: {
            type: Number
        },
        totalTasks: {
            type: Number
        }
    }
)

export default mongoose.model("DailyStat", dailyStatsSchema)