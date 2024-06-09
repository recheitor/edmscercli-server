const { Schema, model } = require("mongoose");

const employeeSchema = new Schema(
  {
    name: {
      type: String,
    },
    position: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      trim: true,
    },
    salary: {
      type: Number,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
