import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>

              {/* Icon & Title */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl border ${variant === 'danger'
                      ? 'bg-red-600/20 border-red-500/30'
                      : 'bg-blue-600/20 border-blue-500/30'
                    }`}
                >
                  <AlertTriangle
                    className={`w-6 h-6 ${variant === 'danger' ? 'text-red-500' : 'text-blue-500'}`}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-black text-white mb-2">{title}</h3>
                  <p className="text-gray-400">{message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="!bg-zinc-800 !border-white/10 !text-white hover:!bg-zinc-700"
                >
                  {cancelText}
                </Button>

                <Button
                  variant="primary"
                  onClick={handleConfirm}
                  className={variant === 'danger' ? '!bg-red-600 hover:!bg-red-700' : ''}
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
