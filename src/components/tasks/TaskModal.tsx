import { Dialog } from '@headlessui/react';
import { useFormik } from 'formik';
import { X } from 'lucide-react';
import * as Yup from 'yup';
import { useTaskStore } from '../../stores/taskStore';
import { TaskStatus } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const TaskModal = ({ isOpen, onClose, projectId }: TaskModalProps) => {
  const { createTask, updateTask, selectedTask, loading } = useTaskStore();

  const isEditing = !!selectedTask;

  const formik = useFormik({
    initialValues: {
      title: selectedTask?.title || '',
      description: selectedTask?.description || '',
      status: selectedTask?.status || 'not_started' as TaskStatus,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Required')
        .max(100, 'Must be 100 characters or less'),
      description: Yup.string()
        .required('Required')
        .max(500, 'Must be 500 characters or less'),
      status: Yup.string()
        .required('Required')
        .oneOf(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled']),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEditing && selectedTask) {
          await updateTask(selectedTask.id, {
            title: values.title,
            description: values.description,
            status: values.status,
          });
        } else {
          await createTask({
            title: values.title,
            description: values.description,
            status: values.status,
            projectId,
          });
        }
        resetForm();
        onClose();
      } catch (error) {
        // Error is handled in the store
      }
    },
  });

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        if (!loading) {
          formik.resetForm();
          onClose();
        }
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-lg bg-white shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </Dialog.Title>
            <button
              onClick={() => {
                if (!loading) {
                  formik.resetForm();
                  onClose();
                }
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="label">
                    Task Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className={`input ${formik.touched.title && formik.errors.title ? 'border-error-500' : ''}`}
                    placeholder="Enter task title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="form-error">{formik.errors.title}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="description" className="label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className={`input ${formik.touched.description && formik.errors.description ? 'border-error-500' : ''}`}
                    placeholder="Enter task description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="form-error">{formik.errors.description}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="status" className="label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className={`input ${formik.touched.status && formik.errors.status ? 'border-error-500' : ''}`}
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {formik.touched.status && formik.errors.status ? (
                    <div className="form-error">{formik.errors.status}</div>
                  ) : null}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (!loading) {
                    formik.resetForm();
                    onClose();
                  }
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskModal;