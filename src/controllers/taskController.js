import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({
      status: "error",
      message: "Title is required",
    });
  }

  try {
    const task = await Task.create({
      title,
      description: description || "",
      user: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      status: "success",
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this task",
      });
    }

    await task.deleteOne();

    res.json({
      status: "success",
      data: { message: "Task deleted successfully" },
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
