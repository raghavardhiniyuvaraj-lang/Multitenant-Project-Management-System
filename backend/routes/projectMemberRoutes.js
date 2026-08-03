const express = require("express");
const router = express.Router();

const {
    assignMember,
    getMembers,
    updateMember,
    deleteMember
} = require("../controllers/projectMemberController");
const auth = require("../middleware/auth");

// Assign Employee to Project
router.post("/", auth, assignMember);

// Get All Project Members
router.get("/", auth, getMembers);

router.put("/:id", auth, updateMember);

// Remove Member
router.delete("/:id", auth, deleteMember);

module.exports = router;