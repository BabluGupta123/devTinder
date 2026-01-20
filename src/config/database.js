const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://bablu8795379783:Gupta123@cluster0.t5usjq2.mongodb.net/devTinder?appName=Cluster0"
  );
};

module.exports = { connectDB };
