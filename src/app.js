const express = require("express");

const { connectDB } = require("./config/database");

const User = require("./models/user");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = req.body;

  try {
    //validate
    const allowedValues = [
      "firstName",
      "lastName",
      "emailId",
      "password",
      "age",
      "gender",
      "skills",
      "about",
      "photoUrl",
    ];
    const isAllowed = Object.keys(data).every((k) => allowedValues.includes(k));
    if (!isAllowed || data?.skills?.length > 20) {
      throw new Error("Some fileds are not defined! ");
    }

    //Password Encryption

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 5);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(201).send("user created successfully");
  } catch (err) {
    res.status(400).send("Something went wrong. " + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
    if (user.length == 0) {
      res.status(404).send("User not Found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    console.log("Server Error");
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
  } catch (err) {
    res.status(400).send("Invalid MongoDB ID");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length == 0) {
      res.status(404).send("User not Found");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(500).send("Server Error");
    console.log(err);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).send("User not found");

    res.send("User Deleted Successfully");
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  console.log(userId);

  try {
    const allowedUpdates = ["password", "skills", "about", "age", "photoUrl"];
    const isAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k),
    );

    if (!isAllowed || data?.skills.length > 20) {
      throw new Error("Updates not Allowed! ");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404).send("User Not Found");
    } else {
      res.status(200).send("user Updated Successfully");
    }
  } catch (err) {
    res.status(500).send("Something went wrong! " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB Connection succesful");
  })
  .catch((err) => {
    console.error("Connection failed");
    console.log(err);
  });

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
