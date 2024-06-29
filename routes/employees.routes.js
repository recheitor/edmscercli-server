const router = require("express").Router();

const {
  getAllEmployees,
  getOneEmployee,
  createEmployees,
  clockInEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees.controllers");

router.get("/", getAllEmployees);
router.get("/:id", getOneEmployee);
router.post("/create", createEmployees);
router.post("/clockIn", clockInEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
