import { Dialog } from '@headlessui/react';
import { useFormik } from 'formik';
import { X } from 'lucide-react';
import * as Yup from 'yup';
import { useProjectStore } from '../../stores/projectStore';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const { createProject, loading } = useProjectStore();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Required')
        .max(100, 'Must be 100 characters or less'),
      description: Yup.string()
        .required('Required')
        .max(500, 'Must be 500 characters or less'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await createProject({
          title: values.title,
          description: values.description,
          status: 'active',
        });
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
              Create New Project
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
                    Project Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className={`input ${formik.touched.title && formik.errors.title ? 'border-error-500' : ''}`}
                    placeholder="Enter project title"
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
                    placeholder="Enter project description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="form-error">{formik.errors.description}</div>
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
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateProjectModal;