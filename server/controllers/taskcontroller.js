const Task = require('../models/Task');

//Post /api/tasks
exports.createTask = async (req, res) => {
    const task = await Task.create({ ...req.body, owner: req.user._id });
    res.status(201).json(task);
};

//Get /api/tasks
exports.getMyTasks = async (req, res) => {
    const tasks = await Task.find({ owner: req.user._id });
    res.status(200).json(tasks);
};

//Get /api/tasks/all
exports.getAllTasks = async (req, res) => {
    const tasks = await Task.find().populate('owner', 'email');
    res.status(200).json(tasks);
};