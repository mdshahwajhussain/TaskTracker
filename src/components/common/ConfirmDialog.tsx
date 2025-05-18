import { Dialog } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmStyle?: 'primary' | 'danger';
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmStyle = 'primary',
}: ConfirmDialogProps) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full rounded-lg bg-white shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="mr-4 flex-shrink-0 bg-error-100 rounded-full p-2">
                <AlertTriangle className="h-6 w-6 text-error-600" />
              </div>
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {title}
              </Dialog.Title>
            </div>
            
            <Dialog.Description className="text-sm text-gray-500 mb-6">
              {message}
            </Dialog.Description>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className={`btn ${confirmStyle === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;