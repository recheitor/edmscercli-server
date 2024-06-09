const router = require("express").Router();

const {
  getAllTimeOffRequests,
  getEmployeeTimeOffRequests,
  newTimeOffRequest,
  deleteTimeOffRequest,
} = require("../controllers/timeOffRequests.controllers");

router.get("/", getAllTimeOffRequests);
router.get("/:employee_id", getEmployeeTimeOffRequests);
router.post("/new", newTimeOffRequest);
router.delete("/:request_id", deleteTimeOffRequest);

module.exports = router;
