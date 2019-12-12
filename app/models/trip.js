const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Adventure", "Restaurant", "Culture", "Shopping", "Sports"],
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [activitySchema],
    includedInTrip: {
      enum: ["Transportation", "Yoga", "Guide", "Food"],
      required: false
    },
    whatToBring: {
      enum: ["Yoga mat", "Snacks"],
      required: false
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    recommendation: {
      type: [String],
      required: false
    },
    location: {
      type: {
        String,
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Trip = mongoose.model("Trip", tripSchema);
const Activity = mongoose.model("Activity", activitySchema);

module.exports = { Trip, Activity };
