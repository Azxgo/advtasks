import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            default: 1
        },
        totalExp: {
            type: Number,
            default: 0
        },
        stats: {
            "work": {
                type: Number,
                default: 0
            },
            "learning": {
                type: Number,
                default: 0
            },
            "creative": {
                type: Number,
                default: 0
            },
            "social": {
                type: Number,
                default: 0
            },
            "recreation": {
                type: Number,
                default: 0
            }
        },
        refreshToken: {
            type: String
        },
        lastUpdateDate: {
            type: Date,
            default: null
        }
    }
)

export default mongoose.model("User", userSchema)