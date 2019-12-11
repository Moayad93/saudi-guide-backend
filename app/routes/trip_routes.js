// Express docs: http://expressjs.com/en/api.html
const express = require("express");
// Passport docs: http://www.passportjs.org/docs/
const passport = require("passport");

// pull in Mongoose model for trips
const Trip = require("../models/trip").Trip;

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require("../../lib/custom_errors");

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404;
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership;

// this is middleware that will remove blank fields from `req.body`, e.g.
// { trip: { title: '', text: 'foo' } } -> { trip: { text: 'foo' } }
const removeBlanks = require("../../lib/remove_blank_fields");
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate("bearer", { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();

// INDEX
// GET /trips
router.get("/trips", requireToken, (req, res, next) => {
  // Option 1 get user's trips
  Trip.find({ guide: req.user.id })
    .then(trips => res.status(200).json({ trips: trips }))
    .catch(next);

  // // Option 2 get user's trips
  // // must import User model and User model must have virtual for trips
  // User.findById(req.user.id)
  // .populate('trips')
  // .then(user => res.status(200).json({ trips: user.trips }))
  // .catch(next)
});

// SHOW
// GET /trips/5a7db6c74d55bc51bdf39793
router.get("/trips/:id", requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Trip.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "trip" JSON
    .then(trip => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, trip);

      res.status(200).json({ trip: trip.toObject() });
    })
    // if an error occurs, pass it to the handler
    .catch(next);
});

// CREATE
// POST /trips
router.post("/trips", requireToken, (req, res, next) => {
  // set guide of new trip to be current user
  req.body.trip.guide = req.user.id;

  Trip.create(req.body.trip)
    // respond to succesful `create` with status 201 and JSON of new "trip"
    .then(trip => {
      res.status(201).json({ trip: trip.toObject() });
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next);
});

// UPDATE
// PATCH /trips/5a7db6c74d55bc51bdf39793
router.patch("/trips/:id", requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `guide` property by including a new
  // guide, prevent that by deleting that key/value pair
  delete req.body.trip.guide;

  Trip.findById(req.params.id)
    .then(handle404)
    .then(trip => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, trip);

      // pass the result of Mongoose's `.update` to the next `.then`
      return trip.update(req.body.trip);
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.status(204))
    // if an error occurs, pass it to the handler
    .catch(next);
});

// DESTROY
// DELETE /trips/5a7db6c74d55bc51bdf39793
router.delete("/trips/:id", requireToken, (req, res, next) => {
  Trip.findById(req.params.id)
    .then(handle404)
    .then(trip => {
      // throw an error if current user doesn't own `trip`
      requireOwnership(req, trip);
      // delete the trip ONLY IF the above didn't throw
      trip.remove();
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next);
});

module.exports = router;
