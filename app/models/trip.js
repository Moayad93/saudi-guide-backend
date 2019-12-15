const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true,
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
      type: [{}],
      default: [{
        name: "Transportation",
        image: "https://www.flaticon.com/authors/kirill-kazachek"
      }]
    },
    whatToBring: {
      type: [{}],
      default: [{
        name: "Snacks",
        image: "https://www.flaticon.com/authors/monkik"
      }]
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
      required: false
    }
  },
  {
    timestamps: true
  }
);

const Trip = mongoose.model("Trip", tripSchema);
const Activity = mongoose.model("Activity", activitySchema);

module.exports = { Trip, Activity };
