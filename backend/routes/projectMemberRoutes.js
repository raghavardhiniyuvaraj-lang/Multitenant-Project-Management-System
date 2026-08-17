const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    assignMember,
    getMembers,
    updateMember,
    deleteMember
} = require("../controllers/projectMemberController");

// Assign Member
router.post("/", auth, assignMember);

// Get All Members
router.get("/", auth, getMembers);

// Update Member
router.put("/:id", auth, updateMember);

// Delete Member
router.delete("/:id", auth, deleteMember);

module.exports = router;