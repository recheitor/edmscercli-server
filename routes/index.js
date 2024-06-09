module.exports = (app) => {
  const employeesRoutes = require("./employees.routes");
  const requestCategoriesRoutes = require("./requestCategories.routes");
  const timeOffRequestsRoutes = require("./timeOffRequests.routes");

  app.use("/api/employees", employeesRoutes);
  app.use("/api/requestCategories", requestCategoriesRoutes);
  app.use("/api/timeOffRequests", timeOffRequestsRoutes);
};
