import { create } from 'zustand';
import { Task, TaskState } from '../types';
import { api } from '../utils/api';

// Mock initial tasks for demo
const mockTasks: Task[] = [
  {
    id: 'task_1',
    title: 'Research competitors',
    description: 'Analyze top 5 competitor websites and document findings',
    status: 'completed',
    projectId: 'proj_1',
    createdAt: '2023-01-16T10:30:00Z',
    completedAt: '2023-01-20T16:45:00Z',
    updatedAt: '2023-01-20T16:45:00Z',
  },
  {
    id: 'task_2',
    title: 'Create wireframes',
    description: 'Design wireframes for homepage and product pages',
    status: 'completed',
    projectId: 'proj_1',
    createdAt: '2023-01-21T09:15:00Z',
    completedAt: '2023-01-25T14:30:00Z',
    updatedAt: '2023-01-25T14:30:00Z',
  },
  {
    id: 'task_3',
    title: 'Develop homepage',
    description: 'Code the new homepage based on approved designs',
    status: 'in_progress',
    projectId: 'proj_1',
    createdAt: '2023-01-26T11:00:00Z',
    completedAt: null,
    updatedAt: '2023-01-26T11:00:00Z',
  },
  {
    id: 'task_4',
    title: 'Write content for About page',
    description: 'Create compelling copy for the About page',
    status: 'not_started',
    projectId: 'proj_1',
    createdAt: '2023-01-28T13:20:00Z',
    completedAt: null,
    updatedAt: '2023-01-28T13:20:00Z',
  },
  {
    id: 'task_5',
    title: 'Perform SEO audit',
    description: 'Analyze current SEO performance and identify improvement areas',
    status: 'not_started',
    projectId: 'proj_1',
    createdAt: '2023-01-30T15:45:00Z',
    completedAt: null,
    updatedAt: '2023-01-30T15:45:00Z',
  }
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,

  fetchTasks: async (projectId) => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      const { data } = await api.get(`/projects/${projectId}/tasks`);
      set({ tasks: data, loading: false });
      */
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return the tasks for the selected project
      const projectTasks = mockTasks.filter(task => task.projectId === projectId);
      set({ tasks: projectTasks, loading: false });
    } catch (error) {
      set({
        error: 'Failed to fetch tasks',
        loading: false,
      });
    }
  },

  createTask: async (task) => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      const { data } = await api.post(`/projects/${task.projectId}/tasks`, task);
      set({ tasks: [...get().tasks, data], loading: false });
      return data;
      */
      
      // Mock creation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTask: Task = {
        ...task,
        id: 'task_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        completedAt: null,
        updatedAt: new Date().toISOString(),
      };
      
      set({ 
        tasks: [...get().tasks, newTask], 
        loading: false 
      });
      
      return newTask;
    } catch (error) {
      set({
        error: 'Failed to create task',
        loading: false,
      });
      throw error;
    }
  },

  updateTask: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      const { data } = await api.put(`/tasks/${id}`, updatedData);
      */
      
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update completedAt if status is being changed to completed
      let completedAt = undefined;
      if (updatedData.status === 'completed') {
        const existingTask = get().tasks.find(task => task.id === id);
        if (existingTask && existingTask.status !== 'completed') {
          completedAt = new Date().toISOString();
        }
      }
      
      const updatedTasks = get().tasks.map(task => 
        task.id === id 
          ? { 
              ...task, 
              ...updatedData,
              completedAt: completedAt !== undefined ? completedAt : task.completedAt,
              updatedAt: new Date().toISOString() 
            } 
          : task
      );
      
      const updatedTask = updatedTasks.find(t => t.id === id);
      if (!updatedTask) throw new Error('Task not found');
      
      set({ 
        tasks: updatedTasks,
        // Also update the selected task if it's the one being updated
        selectedTask: get().selectedTask?.id === id ? updatedTask : get().selectedTask,
        loading: false 
      });
      
      return updatedTask;
    } catch (error) {
      set({
        error: 'Failed to update task',
        loading: false,
      });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      await api.delete(`/tasks/${id}`);
      */
      
      // Mock deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ 
        tasks: get().tasks.filter(task => task.id !== id),
        // Clear selected task if it's the one being deleted
        selectedTask: get().selectedTask?.id === id ? null : get().selectedTask,
        loading: false 
      });
    } catch (error) {
      set({
        error: 'Failed to delete task',
        loading: false,
      });
      throw error;
    }
  },

  setSelectedTask: (task) => {
    set({ selectedTask: task });
  }
}));