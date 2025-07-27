import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import TaskList from '../components/tasks/TaskList';
import { Shield } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container-custom py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-base-content/70">
            Manage all tasks across the platform
          </p>
        </div>
        
        <TaskList isAdmin={true} />
      </div>
    </div>
  );
};

export default AdminPanel;