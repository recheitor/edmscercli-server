const router = require("express").Router();
const TimeOffRequest = require("../models/TimeOffRequest.model");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { addHoursToDates } = require("../utils/dateUtils");

const getAllTimeOffRequests = (req, res, next) => {
  TimeOffRequest.find()
    .sort({ start_date: 1 }) // Sort by start_date in ascending order
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

const getEmployeeTimeOffRequests = (req, res, next) => {
  const { employee_id } = req.params;
  if (!ObjectId.isValid(employee_id)) {
    return res.status(400).send({ error: "Invalid ObjectId format" });
  }
  const objectId = new ObjectId(employee_id);
  TimeOffRequest.find({ employee_id: objectId })
    .populate("request_category_id")
    .sort({ start_date: 1 }) // Sort by start_date in ascending order
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

const newTimeOffRequest = (req, res, next) => {
  const timeOffData = req.body;
  const currentDate = new Date();
  const startDate = new Date(timeOffData.start_date);
  const endDate = new Date(timeOffData.end_date);

  // Check if start date and end date are not in the past
  if (startDate < currentDate || endDate < currentDate) {
    return res.status(400).send({
      error: "You can't select previous dates than today.",
    });
  }

  // Check if end date is earlier than start date
  if (endDate < startDate) {
    return res.status(400).send({
      error: "End date cannot be earlier than start date.",
    });
  }

  TimeOffRequest.find({
    employee_id: timeOffData.employee_id,
    $or: [
      {
        start_date: {
          $gte: timeOffData.start_date,
          $lte: timeOffData.end_date,
        },
      },
      {
        end_date: {
          $gte: timeOffData.start_date,
          $lte: timeOffData.end_date,
        },
      },
      {
        $and: [
          { start_date: { $lte: timeOffData.start_date } },
          { end_date: { $gte: timeOffData.end_date } },
        ],
      },
    ],
  })
    .then((existingRequests) => {
      if (existingRequests.length === 0) {
        // No existing requests, create the new one
        return TimeOffRequest.create(timeOffData);
      } else {
        // Verify if previous time off is "Remote Work" and new is "Annual Leave"
        const previousRequest = existingRequests.find(
          (request) =>
            request.request_category_id.toString() ===
            "66645d7a5607d1873902aa75" // ID "Remote Work"
        );

        if (
          previousRequest &&
          timeOffData.request_category_id.toString() ===
            "6664b3182430453fde4b4a73" // ID "Annual Leave"
        ) {
          // If the start dates are the same, remove the previous "Remote Work" request
          if (previousRequest.start_date.getTime() === startDate.getTime()) {
            return TimeOffRequest.findByIdAndDelete(previousRequest._id).then(
              () => TimeOffRequest.create(timeOffData)
            );
          } else if (endDate >= previousRequest.end_date) {
            // If the end date of Annual Leave is greater than or equal to the end date of Remote Work
            previousRequest.end_date =
              timeOffData.start_date > previousRequest.end_date
                ? previousRequest.end_date
                : new Date(
                    new Date(timeOffData.start_date).setDate(
                      new Date(timeOffData.start_date).getDate() - 1
                    )
                  );

            // Create new for "Annual Leave"
            const newRequestData = {
              request_category_id: timeOffData.request_category_id,
              employee_id: timeOffData.employee_id,
              start_date: timeOffData.start_date,
              end_date: timeOffData.end_date,
            };

            return Promise.all([
              previousRequest.save(),
              TimeOffRequest.create(newRequestData),
            ]);
          } else {
            // Adjust the dates of the previous "Remote Work" request and create new requests
            const updatedRemoteWork1 = {
              ...previousRequest._doc,
              end_date: new Date(
                new Date(timeOffData.start_date).setDate(
                  new Date(timeOffData.start_date).getDate() - 1
                )
              ),
            };

            const newAnnualLeave = {
              request_category_id: timeOffData.request_category_id,
              employee_id: timeOffData.employee_id,
              start_date: timeOffData.start_date,
              end_date: timeOffData.end_date,
            };

            const updatedRemoteWork2 = {
              request_category_id: previousRequest.request_category_id,
              employee_id: previousRequest.employee_id,
              start_date: new Date(
                new Date(timeOffData.end_date).setDate(
                  new Date(timeOffData.end_date).getDate() + 1
                )
              ),
              end_date: previousRequest.end_date,
            };

            // Remove the original "Remote Work" request and create new requests
            return TimeOffRequest.findByIdAndDelete(previousRequest._id).then(
              () =>
                Promise.all([
                  TimeOffRequest.create(updatedRemoteWork1),
                  TimeOffRequest.create(newAnnualLeave),
                  TimeOffRequest.create(updatedRemoteWork2),
                ])
            );
          }
        } else {
          return res.status(400).send({
            error: "You already have time off for these dates.",
          });
        }
      }
    })
    .then((results) => res.json(results))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ error: err.message });
      }
      next(err);
    });
};

const deleteTimeOffRequest = (req, res, next) => {
  const { request_id } = req.params;
  if (!ObjectId.isValid(request_id)) {
    return res.status(400).send({ error: "Invalid ObjectId format" });
  }
  const objectId = new ObjectId(request_id);
  TimeOffRequest.findByIdAndDelete(objectId)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ error: "Request not found" });
      }
      res.json({ message: "Time off request deleted successfully" });
    })
    .catch((err) => next(err));
};

module.exports = {
  getAllTimeOffRequests,
  getEmployeeTimeOffRequests,
  newTimeOffRequest,
  deleteTimeOffRequest,
};
