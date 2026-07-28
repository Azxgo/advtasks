import mongoose from "mongoose"

const automationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    originalTaskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
        unique: true
    },

    taskTemplate: {
        name: { type: String, default: "" },
        hour: { type: Number, required: true },
        minute: { type: Number, required: true },
        level: { type: Number, default: 1 },
        attributes: { type: Array, default: [] }
    },

    daysOfWeek: {
        type: [Number],
        required: true,
        validate: v => v.length > 0
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    active: {
        type: Boolean,
        default: true
    },
    generationHour: {
        type: Number,
        required: true
    },

    generationMinute: {
        type: Number,
        required: true
    },

}, {
    timestamps: true
})

export default mongoose.model("Automation", automationSchema)