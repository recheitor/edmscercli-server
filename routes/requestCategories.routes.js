const router = require("express").Router();

const {
  getAllCategories,
  createCategory,
} = require("../controllers/requestCategories.controllers");

router.get("/", getAllCategories);
router.post("/create", createCategory);

module.exports = router;
