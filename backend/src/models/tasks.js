import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema({
    completed: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
    },
    hour: {
        type: Number
    },
    minute: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "done", "missed"],
        default: "pending"
    },

    order: {
        type: Number,
        default: 0
    }
}, { _id: true })

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        completed: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
        },
        hour: {
            type: Number
        },
        minute: {
            type: Number
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "done"],
            default: "pending"
        },
        attributes: {
            type: [String],
            enum: ["work", "learning", "creative", "social", "recreation"]
        },
        level: {
            type: Number,
            min: 1,
            max: 5
        },
        date: {
            type: Date,
            required: true,
        },
        order: {
            type: Number,
            default: 0
        },
        hasAutomation: {
            type: Boolean,
            default: false
        },
        subTasks: {
            type: [subTaskSchema],
            default: []
        },
        originalTaskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null
        }
    }
)



export default mongoose.model("Task", taskSchema);