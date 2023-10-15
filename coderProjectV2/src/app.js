import express from "express";
import cors from "cors";
import appLogger from "./middlewares/appLogger/index.js";
import indexRouter from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler/index.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(appLogger);

app.use("/api", indexRouter);

app.use(errorHandler);

export default app;
