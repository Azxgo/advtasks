import mongoose from "mongoose";

const guest_sessionsSchema = new mongoose.Schema(
    {

        device_id: {
            type: String,
            ref: "Adv_Device",
            required: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true
        },
        "expires_at": {
            type: Date,
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

    }, { _id: true }
)

export default mongoose.model("Adv_Guest_Session", guest_sessionsSchema);