import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        request_remaining: {
            type: Number,
            default: 100
        },

    }, { _id: false }
)

export default mongoose.model("Adv_Device", deviceSchema);