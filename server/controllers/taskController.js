const Task = require("../models/Task");

// GET /api/tasks — with filter, sort, search
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, search } = req.query;
    const query = {};

    if (status && status !== "all") query.status = status;
    if (priority && priority !== "all") query.priority = priority;
    if (search) query.title = { $regex: search, $options: "i" };

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      dueDate: { dueDate: 1 },
      priority: { priority: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const tasks = await Task.find(query).sort(sortBy);
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/stats
exports.getStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const total = await Task.countDocuments();
    res.json({ success: true, data: { stats, total } });
  } catch (err) {
    next(err);
  }
};
