import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import errorHandler from "./middleware/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import { connectDb } from "./config/db.js";
import session from "express-session";
import flash from "express-flash";
import noCacheMiddleware from "./middleware/noCacheMiddleware.js";
const port = process.env.PORT || 3000;
const app = express();

connectDb();

app.use(express.static(path.join(process.cwd(), "public")));

app.use(noCacheMiddleware);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use("/", userRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running ${port}`));
