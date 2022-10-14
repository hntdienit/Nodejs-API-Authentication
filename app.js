import express from "express";
import logger from "morgan";
import mongoose, { mongo } from "mongoose";

// connection mongodb
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("✅ connection ✅");
  })
  .catch((error) => {
    console.log(`📢 not connection ${error}`);
  });

import user from "./routes/user.js";

const app = express();

// middlewares
app.use(logger("dev"));

// routes
app.use("/user", user);

// routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "server chay ok",
  });
});

// 404
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handle function
app.use(() => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// start server
app.listen(3009, () => {
  console.log(`Server chay cong ${3009}`);
});
