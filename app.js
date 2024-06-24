import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./config/database.js";
import auth from "./routes/auth.js";
import cookie from "cookie-parser";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookie());

//Routes middlewares
app.use("/api/auth", auth);
app.use("/api",userRoute);


app.get("/api", (req, res) => {
    res.send("server running...");
});

const PORT = 8000 || process.env.PORT;

//MongoDb connection
dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}..🚀`);
    });
});

