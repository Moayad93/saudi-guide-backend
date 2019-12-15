const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "Tourist",
      required: true
    },
    token: String
  },
  {
    timestamps: true,
    toObject: {
      // remove `hashedPassword` field when we call `.toObject`
      transform: (_doc, user) => {
        delete user.hashedPassword;
        return user;
      }
    }
  }
);

userSchema.virtual("trips", {
  ref: "Trip",
  localField: "_id",
  foreignField: "guide"
});

module.exports = mongoose.model("User", userSchema);
