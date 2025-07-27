const express = require('express');
const { createTask, getMyTasks, getAllTasks } = require('../controllers/taskcontroller');
const {protect, authorize} = require('../middleware/auth');
const router = express.Router();

// Route to create a new task
router.post('/', protect, createTask); 
router.get('/me', protect, getMyTasks);
router.get('/all', protect, authorize('admin'), getAllTasks); // Only admin can access all tasks

module.exports = router;