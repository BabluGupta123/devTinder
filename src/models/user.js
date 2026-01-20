const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 20,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,

      validate(val) {
        if (!validator.isEmail(val)) throw new Error("Invalid Email ! ");
      },
    },
    password: {
      type: String,
      required: true,
      validate(pass) {
        if (!validator.isStrongPassword(pass))
          throw new Error("Enter Strong Password ");
      },
    },

    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      lowercase: true,
      validate: {
        validator: function (val) {
          return val === "male" || val === "female" || val === "other";
        },
        message: "Gender must be male, female, or other",
      },
    },

    skills: {
      type: [String],
    },

    about: {
      type: String,
      minLength: 20,
      default: "This is Default About",
    },

    photoUrl: {
      type: String,
      default:
        "https://kidneystoneindia.com/wp-content/uploads/2018/05/dummy-profile-pic-male1-270x270.jpg",

      validate(val) {
        if (!validator.isURL(val)) throw new Error("Invalid Image Url ");
      },
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
