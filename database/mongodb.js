import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('database connected successfully....')

    } catch (error) {
        console.log('failed to connect to database....')
        console.log(error)
        process.exit(1)
    }
}

export default connectDB
