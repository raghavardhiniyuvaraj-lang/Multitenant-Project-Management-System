const express = require("express");
const router = express.Router();

const {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

const auth = require("../middleware/auth");

// Create Project
router.post("/", auth, createProject);

// Get All Projects
router.get("/", auth, getProjects);

// Update Project
router.put("/:id", auth, updateProject);

// Delete Project
router.delete("/:id", auth, deleteProject);

module.exports = router;