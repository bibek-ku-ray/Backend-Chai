import connectDB from "./db/index.js";
import dotenv from "dotenv"

import { app } from "./app.js"

dotenv.config({
    path: "./.env"
})


connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on PORT: ${process.env.PORT}`);
    })
    app.on("error", (error) => {
        console.log("ERR: ", error);
    })
})
.catch((error) => {
    console.log("MONGODB CONNECTION FAILED !!! ", error);
})