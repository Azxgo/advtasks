import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB conectado")
    } catch {
        console.error("Error MongoDB:", error.message)
        process.exit(1)
    }
}