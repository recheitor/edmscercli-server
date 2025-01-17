const router = require("express").Router();
const Employee = require("../models/Employee.model");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { addHoursToDates } = require("../utils/dateUtils");

const getAllEmployees = (req, res, next) => {
  Employee.find()
    .then((result) => {
      const adjustedResultTimezone = result.map((employee) => {
        const employeeObject = employee.toObject();
        return addHoursToDates(employeeObject, 2);
      });
      res.json(adjustedResultTimezone);
    })
    .catch((err) => next(err));
};

const getOneEmployee = (req, res, next) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ObjectId format" });
  }

  Employee.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ error: "Employee not found" });
      }
      const employeeObject = result.toObject();
      const adjustedResultTimezone = addHoursToDates(employeeObject, 2);
      res.json(adjustedResultTimezone);
    })
    .catch((err) => next(err));
};

const createEmployees = (req, res, next) => {
  const employeeData = req.body;
  Employee.create(employeeData)
    .then((result) => res.json(result))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ error: err.message });
      }
      next(err);
    });
};

const clockInEmployee = (req, res, next) => {
  const { WaId, Body } = req.body;
  const client = require("twilio")(
    process.env.TWILIO_ACC_SSID,
    process.env.TWILIO_AUTH_TOKEN
  );
  let isEmployeeAtWork;
  const whatsappBody = Body.toUpperCase();
  if (whatsappBody === "CLOCK-IN") isEmployeeAtWork = true;
  else if (whatsappBody === "CLOCK-OUT") isEmployeeAtWork = false;

  if (whatsappBody === "CLOCK-IN" || whatsappBody === "CLOCK-OUT") {
    return Employee.findOneAndUpdate(
      { phone: WaId },
      { status: isEmployeeAtWork }
    )
      .then((employee) => {
        if (employee) {
          client.messages.create({
            body: `${whatsappBody} successful`,
            from: "whatsapp:+14155238886",
            to: `whatsapp:+${WaId}`,
          });
          res.json(`${whatsappBody} successful`);
        } else {
          res.status(404).send("Empleado no encontrado");
        }
      })
      .catch((error) => {
        res.status(500).send(error.message);
      });
  } else {
    return client.messages.create({
      body: `Type "Clock-in" or "Clock-out`,
      from: "whatsapp:+14155238886",
      to: `whatsapp:+${WaId}`,
    });
  }
};

const updateEmployee = (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ObjectId format" });
  }

  const objectId = new ObjectId(id);

  Employee.findByIdAndUpdate(objectId, updateData, {
    new: true,
    runValidators: true,
  })
    .then((result) => {
      if (!result) {
        return res.status(404).send({ error: "Employee not found" });
      }
      res.json(result);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ error: err.message });
      }
      next(err);
    });
};

const deleteEmployee = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ObjectId format" });
  }
  const objectId = new ObjectId(id);
  Employee.findByIdAndDelete(objectId)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ error: "Request not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    })
    .catch((err) => next(err));
};
module.exports = {
  getAllEmployees,
  getOneEmployee,
  createEmployees,
  clockInEmployee,
  updateEmployee,
  deleteEmployee,
};
