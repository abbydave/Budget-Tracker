import dotenv from "dotenv"
dotenv.config();

import app from "./app"
import connectDB from "./config/mongo.config";



const PORT = process.env.PORT || 3000
app.listen(PORT, async()=> {
    console.log("Connecting to mongodb...");
    await connectDB()

    console.log(`App running on port ${PORT}`);
    
})