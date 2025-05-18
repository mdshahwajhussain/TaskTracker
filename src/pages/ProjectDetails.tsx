import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Plus, Trash2, ArrowLeft, Edit2 } from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';
import { useTaskStore } from '../stores/taskStore';
import { formatDate, formatTimeAgo, getProgressPercentage } from '../utils/format';
import TaskModal from '../components/tasks/TaskModal';
import TaskCard from '../components/tasks/TaskCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ProjectStats from '../components/projects/ProjectStats';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, fetchProjects, deleteProject } = useProjectStore();
  const { tasks, fetchTasks, selectedTask, setSelectedTask } = useTaskStore();
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);
  
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Project not found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const progress = getProgressPercentage(project.completedTaskCount, project.taskCount);
  
  const tasksByStatus = {
    not_started: tasks.filter(t => t.status === 'not_started').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    on_hold: tasks.filter(t => t.status === 'on_hold').length,
    cancelled: tasks.filter(t => t.status === 'cancelled').length,
  };

  const tasksByDate = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [4, 6, 3, 7, 5, 2, 3], // Example data, replace with actual task creation dates
  };
  
  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId!);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the store
    }
  };
  
  const openEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsTaskModalOpen(true);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center transition-colors duration-200"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{project.title}</h1>
            <div className={`ml-4 status-badge ${project.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' : project.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Created on {formatDate(project.createdAt)}
          </div>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-3">
          <button
            onClick={() => setIsConfirmDialogOpen(true)}
            className="btn btn-danger"
          >
            <Trash2 size={16} className="mr-1" />
            Delete Project
          </button>
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={16} className="mr-1" />
            Add Task
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-wrap justify-between mb-4">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{project.taskCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-semibold text-success-600 dark:text-success-400">{project.completedTaskCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-semibold text-warning-500">{project.taskCount - project.completedTaskCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                <span>Overall Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectStats tasksByStatus={tasksByStatus} tasksByDate={tasksByDate} />
      
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-8">Tasks</h2>
      
      {tasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks found for this project.</p>
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={16} className="mr-1" />
            Add Your First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={() => openEditTask(task.id)} 
            />
          ))}
        </div>
      )}
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTimeout(() => setSelectedTask(null), 300);
        }}
        projectId={projectId!}
      />
      
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and will delete all associated tasks."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmStyle="danger"
      />
    </div>
  );
};

export default ProjectDetails;