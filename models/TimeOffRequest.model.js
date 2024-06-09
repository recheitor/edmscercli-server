const { Schema, model } = require("mongoose");

const timeOffSchema = new Schema(
  {
    request_category_id: {
      type: Schema.Types.ObjectId,
      ref: "RequestCategory",
      required: true,
    },
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const timeOffRequest = model("timeOffRequest", timeOffSchema);

module.exports = timeOffRequest;
