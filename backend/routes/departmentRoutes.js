const express = require("express");
const router = express.Router();

const {
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentController");

const auth = require("../middleware/auth");

router.post("/", auth, createDepartment);

router.get("/", auth, getDepartments);

router.put("/:id", auth, updateDepartment);

router.delete("/:id", auth, deleteDepartment);

module.exports = router;