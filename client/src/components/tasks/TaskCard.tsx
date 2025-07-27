import { useState } from 'react';
import { Task } from '../../types/task';
import { Calendar, Clock, AlertCircle, Trash2, Edit2 } from 'lucide-react';
import { tasksAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
  onTaskUpdate: () => void;
  onTaskDelete: () => void;
  onEditTask: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdate, onTaskDelete, onEditTask }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !task.completed;
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const timeDiff = due.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 1 && daysDiff >= 0 && !task.completed;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'badge-error';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  const handleToggleComplete = async () => {
    setIsToggling(true);
    try {
      await tasksAPI.toggleComplete(task._id);
      onTaskUpdate();
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed! 🎉');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    try {
      await tasksAPI.deleteTask(task._id);
      onTaskDelete();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`task-card fade-in ${task.completed ? 'opacity-75' : ''}`}>
      <div className="card-body">
        {/* Header with checkbox and priority */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={isToggling}
            />
            <div className="flex-1">
              <h3 className={`card-title text-lg ${task.completed ? 'line-through text-base-content/50' : ''}`}>
                {task.title}
              </h3>
            </div>
          </div>
          
          {task.priority && (
            <span className={`badge ${getPriorityColor(task.priority)} badge-sm`}>
              {task.priority}
            </span>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className={`text-base-content/70 mb-3 ${task.completed ? 'line-through' : ''}`}>
            {task.description}
          </p>
        )}

        {/* Due date warning */}
        {task.dueDate && (
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-base-content/50" />
            <span className={`text-sm ${
              isOverdue(task.dueDate) ? 'text-error font-semibold' :
              isDueSoon(task.dueDate) ? 'text-warning font-semibold' :
              'text-base-content/70'
            }`}>
              Due {formatDate(task.dueDate)}
            </span>
            {isOverdue(task.dueDate) && (
              <AlertCircle className="h-4 w-4 text-error" />
            )}
            {isDueSoon(task.dueDate) && (
              <Clock className="h-4 w-4 text-warning" />
            )}
          </div>
        )}

        {/* Footer with timestamps and actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-300">
          <div className="text-xs text-base-content/50">
            Created {formatDate(task.createdAt)}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onEditTask(task)}
              className="btn btn-ghost btn-xs"
              disabled={isDeleting}
            >
              <Edit2 className="h-3 w-3" />
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-ghost btn-xs text-error hover:bg-error/10"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;