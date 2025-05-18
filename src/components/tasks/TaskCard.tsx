import { Check, Clock, AlertTriangle, Pause, XCircle } from 'lucide-react';
import { Task } from '../../types';
import { formatRelativeTime } from '../../utils/format';
import { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import ConfirmDialog from '../common/ConfirmDialog';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { updateTask, deleteTask } = useTaskStore();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  const getStatusIcon = () => {
    switch(task.status) {
      case 'completed':
        return <Check size={16} className="text-success-500" />;
      case 'in_progress':
        return <Clock size={16} className="text-warning-500" />;
      case 'not_started':
        return <AlertTriangle size={16} className="text-gray-400" />;
      case 'on_hold':
        return <Pause size={16} className="text-blue-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-error-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-400" />;
    }
  };
  
  const getStatusClass = () => {
    switch(task.status) {
      case 'completed':
        return 'status-completed';
      case 'in_progress':
        return 'status-in-progress';
      case 'not_started':
        return 'status-not-started';
      case 'on_hold':
        return 'status-on-hold';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-not-started';
    }
  };
  
  const getStatusText = () => {
    switch(task.status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'on_hold':
        return 'On Hold';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };
  
  const handleStatusChange = async (status: Task['status']) => {
    if (task.status !== status) {
      await updateTask(task.id, { status });
    }
  };
  
  const handleDeleteTask = async () => {
    await deleteTask(task.id);
    setIsConfirmDialogOpen(false);
  };
  
  return (
    <div className="card animate-scale-in">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          <div className="flex items-center">
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button
              onClick={() => setIsConfirmDialogOpen(true)}
              className="text-gray-400 hover:text-error-500 p-1 rounded-full hover:bg-gray-100 ml-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex justify-between items-center">
          <div className={`status-badge ${getStatusClass()} flex items-center`}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            {formatRelativeTime(task.createdAt)}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-2 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between text-xs">
          <button
            onClick={() => handleStatusChange('not_started')}
            className={`p-1 rounded ${task.status === 'not_started' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            Not Started
          </button>
          <button
            onClick={() => handleStatusChange('in_progress')}
            className={`p-1 rounded ${task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusChange('completed')}
            className={`p-1 rounded ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-200'}`}
          >
            Complete
          </button>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmStyle="danger"
      />
    </div>
  );
};

export default TaskCard;