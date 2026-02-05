const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FrontendUrl, credentials: true }));

const { profileRouter } = require("./routes/profile");
const { authRouter } = require("./routes/auth");
const { requestRoute } = require("./routes/request");
const { userRoute } = require("./routes/user");
const initializeSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRoute);
app.use("/", userRoute);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("DB Connected successfully!");
  })
  .catch((err) => {
    console.error("Connection failed");
    console.log(err);
  });

server.listen(3000, () => {
  console.log("app is listening on port 3000");
});
