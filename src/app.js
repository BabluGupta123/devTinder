const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const { profileRouter } = require("./routes/profile");
const { authRouter } = require("./routes/auth");
const { requestRoute } = require("./routes/request");
const { userRoute } = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRoute);
app.use("/", userRoute);

connectDB()
  .then(() => {
    console.log("DB Connected successfully!");
  })
  .catch((err) => {
    console.error("Connection failed");
    console.log(err);
  });

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
