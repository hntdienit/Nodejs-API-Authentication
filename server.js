import express from "express";
import logger from "morgan";
import mongoose from "mongoose";
import router from "./routes/index.js";
import helmet from "helmet";

// connection mongodb
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("✅ connection ✅");
  })
  .catch((error) => {
    console.log(`📢 not connection ${error}`);
  });

const app = express();

/* security */
app.use(helmet());

// take data req.body
app.use(express.urlencoded({ extended: true }));

// middlewares
app.use(logger("dev")); /* when debug console.log */

// routes
router(app);

// start server
app.listen(3009, () => {
  console.log(`Server run port ${3009}`);
});
