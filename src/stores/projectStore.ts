import { create } from 'zustand';
import { Project, ProjectState } from '../types';
import { api } from '../utils/api';

// Mock initial projects for demo
const mockProjects: Project[] = [
  {
    id: 'proj_1',
    title: 'Website Redesign',
    description: 'Redesign the company website with new branding',
    status: 'active',
    userId: 'user_1',
    createdAt: '2023-01-15T09:30:00Z',
    updatedAt: '2023-01-15T09:30:00Z',
    taskCount: 8,
    completedTaskCount: 3,
  },
  {
    id: 'proj_2',
    title: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement',
    status: 'active',
    userId: 'user_1',
    createdAt: '2023-02-20T14:45:00Z',
    updatedAt: '2023-02-20T14:45:00Z',
    taskCount: 12,
    completedTaskCount: 5,
  },
  {
    id: 'proj_3',
    title: 'Content Marketing Campaign',
    description: 'Plan and execute Q2 content marketing strategy',
    status: 'active',
    userId: 'user_1',
    createdAt: '2023-03-10T11:15:00Z',
    updatedAt: '2023-03-10T11:15:00Z',
    taskCount: 6,
    completedTaskCount: 1,
  },
];

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      const { data } = await api.get('/projects');
      set({ projects: data, loading: false });
      */
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ projects: mockProjects, loading: false });
    } catch (error) {
      set({
        error: 'Failed to fetch projects',
        loading: false,
      });
    }
  },

  createProject: async (project) => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      const { data } = await api.post('/projects', project);
      set({ projects: [...get().projects, data], loading: false });
      return data;
      */
      
      // Mock creation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProject: Project = {
        ...project,
        id: 'proj_' + Math.random().toString(36).substr(2, 9),
        userId: 'user_1', // In real app, get from auth state
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        taskCount: 0,
        completedTaskCount: 0,
      };
      
      set({ 
        projects: [...get().projects, newProject], 
        loading: false 
      });
      
      return newProject;
    } catch (error) {
      set({
        error: 'Failed to create project',
        loading: false,
      });
      throw error;
    }
  },

  updateProject: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      const { data } = await api.put(`/projects/${id}`, updatedData);
      */
      
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProjects = get().projects.map(project => 
        project.id === id 
          ? { 
              ...project, 
              ...updatedData, 
              updatedAt: new Date().toISOString() 
            } 
          : project
      );
      
      const updatedProject = updatedProjects.find(p => p.id === id);
      if (!updatedProject) throw new Error('Project not found');
      
      set({ projects: updatedProjects, loading: false });
      return updatedProject;
    } catch (error) {
      set({
        error: 'Failed to update project',
        loading: false,
      });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      await api.delete(`/projects/${id}`);
      */
      
      // Mock deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ 
        projects: get().projects.filter(project => project.id !== id), 
        loading: false 
      });
    } catch (error) {
      set({
        error: 'Failed to delete project',
        loading: false,
      });
      throw error;
    }
  }
}));