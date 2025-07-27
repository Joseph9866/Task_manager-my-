import { useState, useEffect } from 'react';
import { Task, CreateTaskData } from '../../types/task';
import { tasksAPI } from '../../services/api';
import { X, Calendar, Flag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  onTaskUpdated: () => void;
  editingTask?: Task | null;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  onTaskUpdated,
  editingTask
}) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
        priority: editingTask.priority || 'medium'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
      });
    }
  }, [editingTask, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
      };

      if (editingTask) {
        await tasksAPI.updateTask(editingTask._id, taskData);
        toast.success('Task updated successfully! ✨');
        onTaskUpdated();
      } else {
        await tasksAPI.createTask(taskData);
        toast.success('Task created successfully! 🎉');
        onTaskCreated();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                <FileText className="inline h-4 w-4 mr-1" />
                Title *
              </span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title..."
              className="input input-bordered w-full"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              name="description"
              placeholder="Add task description (optional)..."
              className="textarea textarea-bordered h-24 resize-none"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Due Date and Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Due Date
                </span>
              </label>
              <input
                type="date"
                name="dueDate"
                className="input input-bordered w-full"
                value={formData.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                disabled={isSubmitting}
              />
            </div>

            {/* Priority */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <Flag className="inline h-4 w-4 mr-1" />
                  Priority
                </span>
              </label>
              <select
                name="priority"
                className="select select-bordered w-full"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gradient"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {editingTask ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingTask ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default CreateTaskModal;