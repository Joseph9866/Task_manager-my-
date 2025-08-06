const Task = require('../models/Task');
const User = require('../models/User');

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide title and description' 
      });
    }

    const task = await Task.create({ 
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || 'medium',
      user: req.user.id 
    });

    // Populate user info
    await task.populate('user', 'name email');

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create task', 
      error: error.message 
    });
  }
};

// GET /api/tasks/me
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get tasks', 
      error: error.message 
    });
  }
};

// GET /api/tasks/all (Admin only)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get all tasks', 
      error: error.message 
    });
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, dueDate, priority } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if user owns the task or is admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this task' 
      });
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(completed !== undefined && { completed }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(priority && { priority }),
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update task', 
      error: error.message 
    });
  }
};

// PUT /api/tasks/:id/toggle
exports.toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if user owns the task or is admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this task' 
      });
    }

    // Toggle completion
    task.completed = !task.completed;
    await task.save();
    await task.populate('user', 'name email');

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to toggle task', 
      error: error.message 
    });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if user owns the task or is admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this task' 
      });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete task', 
      error: error.message 
    });
  }
};