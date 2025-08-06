const express = require('express');
const { 
  createTask, 
  getMyTasks, 
  getAllTasks, 
  updateTask, 
  deleteTask, 
  toggleComplete 
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(protect);

// Task CRUD operations
router.post('/', createTask);
router.get('/me', getMyTasks);
router.put('/:id', updateTask);
router.put('/:id/toggle', toggleComplete);
router.delete('/:id', deleteTask);

// Admin only routes
router.get('/all', authorize('admin'), getAllTasks);

module.exports = router;