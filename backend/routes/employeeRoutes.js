const express = require("express");
const router = express.Router();

const {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const auth = require("../middleware/auth");

// Create Employee
router.post("/", auth, createEmployee);

// Get All Employees
router.get("/", auth, getEmployees);

// Update Employee
router.put("/:id", auth, updateEmployee);

// Delete Employee
router.delete("/:id", auth, deleteEmployee);

module.exports = router;