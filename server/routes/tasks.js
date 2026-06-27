const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getStats,
} = require("../controllers/taskController");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

const taskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 100 }),
  body("description").optional().isLength({ max: 500 }),
  body("status").optional().isIn(["pending", "in-progress", "completed"]),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("Invalid date format"),
];

router.get("/stats", getStats);
router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", taskValidation, validate, createTask);
router.put("/:id", taskValidation, validate, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
