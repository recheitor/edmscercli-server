const router = require("express").Router();

const {
  getAllEmployees,
  getOneEmployee,
  createEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees.controllers");

router.get("/", getAllEmployees);
router.get("/:id", getOneEmployee);
router.post("/create", createEmployees);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
