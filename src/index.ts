import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import busRoutes from "./routes/busRoutes";
import userRoutes from "./routes/userRoutes";
import "./schedulers/busScheduler";

const app: Express = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/bus", busRoutes);
app.use("/user", userRoutes);

mongoose
  .connect(
    "mongodb+srv://pranavg21:W083lMyBkVjrV6Iw@cluster0.qjoxsuo.mongodb.net/"
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("App Running on Port 5000");
    });
  })
  .catch((error) => {
    console.log("Error in Connecting Database");
    console.log(error);
  });
