import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../types/task';
import { tasksAPI } from '../services/api';
import { CheckSquare, Clock, AlertTriangle, TrendingUp, Calendar, Plus } from 'lucide-react';
import TaskCard from '../components/tasks/TaskCard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getMyTasks();
      if (response.success) {
        setTasks(response.tasks || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    
    // Check for reminders every minute
    const reminderInterval = setInterval(checkReminders, 60000);
    
    return () => clearInterval(reminderInterval);
  }, []);

  const checkReminders = () => {
    const now = new Date();
    tasks.forEach(task => {
      if (task.dueDate && !task.completed) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        
        // Show reminder if due within 30 minutes
        if (minutesDiff <= 30 && minutesDiff > 0) {
          toast(`⏰ Task "${task.title}" is due in ${minutesDiff} minutes!`, {
            icon: '⏰',
            duration: 5000
          });
        }
        // Show overdue notification
        else if (minutesDiff < 0 && minutesDiff > -60) {
          toast.error(`🚨 Task "${task.title}" is overdue!`);
        }
      }
    });
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    overdue: tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < new Date();
    }).length,
    dueSoon: tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const due = new Date(task.dueDate);
      const now = new Date();
      const timeDiff = due.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff <= 1 && daysDiff >= 0;
    }).length
  };

  const recentTasks = tasks.slice(0, 6);
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const handleTaskCreated = () => {
    fetchTasks();
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container-custom section-spacing">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-base-content/70 text-lg">
            Here's what's happening with your tasks today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content scale-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{stats.total}</h3>
                  <p className="opacity-90">Total Tasks</p>
                </div>
                <CheckSquare className="h-8 w-8 opacity-80" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success to-success-focus text-success-content scale-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{stats.completed}</h3>
                  <p className="opacity-90">Completed</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
              <div className="text-xs opacity-75 mt-1">
                {completionRate}% completion rate
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-warning to-warning-focus text-warning-content scale-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{stats.dueSoon}</h3>
                  <p className="opacity-90">Due Soon</p>
                </div>
                <Clock className="h-8 w-8 opacity-80" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-error to-error-focus text-error-content scale-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{stats.overdue}</h3>
                  <p className="opacity-90">Overdue</p>
                </div>
                <AlertTriangle className="h-8 w-8 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <h2 className="card-title mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-gradient"
              >
                <Plus className="h-4 w-4" />
                New Task
              </button>
              <Link to="/tasks" className="btn btn-outline">
                <CheckSquare className="h-4 w-4" />
                View All Tasks
              </Link>
              <Link to="/calendar" className="btn btn-outline">
                <Calendar className="h-4 w-4" />
                Calendar View
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title">Recent Tasks</h2>
              <Link to="/tasks" className="btn btn-ghost btn-sm">
                View All
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                <p className="text-base-content/70 mb-4">
                  Create your first task to get started!
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-gradient"
                >
                  <Plus className="h-4 w-4" />
                  Create First Task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onTaskUpdate={fetchTasks}
                    onTaskDelete={fetchTasks}
                    onEditTask={(task) => {
                      // Handle edit task - you might want to implement this
                      console.log('Edit task:', task);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={handleTaskCreated}
          onTaskUpdated={fetchTasks}
        />
      </div>
    </div>
  );
};

export default Dashboard;