import connectDB from "./db/index.js";
import dotenv from "dotenv"
import express from "express"

dotenv.config({
    path: "./env"
})

const app = express()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8001, () => {
        console.log(`Server running on PORT: ${process.env.PORT}`);
    })
    app.on("error", (error) => {
        console.log("ERR: ", error);
    })
})
.catch((error) => {
    console.log("MONGODB CONNECTION FAILED !!! ", error);
})