import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-6"
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    variant === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                  }`}
                >
                  <AlertTriangle
                    className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-blue-600'}`}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600">{message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={onClose}>
                  {cancelText}
                </Button>

                <Button
                  variant={variant === 'danger' ? 'primary' : 'primary'}
                  onClick={handleConfirm}
                  className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;
