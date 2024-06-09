const router = require("express").Router();
const RequestCategory = require("../models/RequestCategory.model");

const getAllCategories = (req, res, next) => {
  RequestCategory.find()
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

const createCategory = (req, res, next) => {
  const categoryData = req.body;
  RequestCategory.create(categoryData)
    .then((result) => res.json(result))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ error: err.message });
      }
      next(err);
    });
};

module.exports = {
  getAllCategories,
  createCategory,
};
