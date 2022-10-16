import express from "express";
import "dotenv/config";
import logger from "morgan";
import mongoose from "mongoose";
import router from "./routes/index.js";
import helmet from "helmet";

// connection mongodb
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("✅ connection ✅");
  })
  .catch((err) => {
    console.log(`📢 not connection ${err}`);
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
app.listen(process.env.PORT, () => {
  console.log(`Server run port ${process.env.PORT}`);
});
