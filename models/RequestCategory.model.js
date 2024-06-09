const { Schema, model } = require("mongoose");

const requestCategorySchema = new Schema(
  {
    name: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const RequestCategory = model("RequestCategory", requestCategorySchema);

module.exports = RequestCategory;
