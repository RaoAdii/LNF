import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDangerous = false }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="modal-backdrop">
        <motion.div
          className="modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-2 text-ink-primary">{title}</h2>
          <p className="text-ink-secondary mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 btn ${isDangerous ? 'btn-danger' : 'btn-accent'}`}
            >
              {isDangerous ? 'Delete' : 'Confirm'}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default ConfirmModal;
