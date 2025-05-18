import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';
import { getProgressPercentage } from '../utils/format';
import { Project } from '../types';
import CreateProjectModal from '../components/projects/CreateProjectModal';

const Dashboard = () => {
  const { projects, loading, error, fetchProjects } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={18} className="mr-1" />
          New Project
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <AlertCircle size={48} />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus size={18} className="mr-1" />
              New Project
            </button>
          </div>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const progress = getProgressPercentage(project.completedTaskCount, project.taskCount);
  
  return (
    <Link
      to={`/projects/${project.id}`}
      className="card hover:shadow-md transition-shadow duration-200 flex flex-col animate-scale-in"
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
          <div className={`status-badge ${project.status === 'active' ? 'bg-green-100 text-green-800' : project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="mt-2">
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-5 py-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex space-x-2">
            <div className="flex items-center text-gray-500">
              <CheckCircle size={16} className="mr-1 text-success-500" />
              <span>{project.completedTaskCount}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock size={16} className="mr-1 text-warning-500" />
              <span>{project.taskCount - project.completedTaskCount}</span>
            </div>
          </div>
          <span className="text-gray-500">View Details →</span>
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;