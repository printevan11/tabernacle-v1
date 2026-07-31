import React from 'react';

export function ConfirmModal({ confirmState, onResolve }) {
  if (!confirmState.isOpen) return null;

  return (
    <div className="confirm-overlay open">
      <div className="confirm-box">
        <div className="confirm-title">{confirmState.title || 'Are you sure?'}</div>
        <div className="confirm-msg">{confirmState.msg}</div>
        <div className="confirm-btns">
          <button className="btn btn-outline" onClick={() => onResolve(false)}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={() => onResolve(true)}>
            {confirmState.okLabel || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'success' ? '✓' : t.type === 'info' ? 'ℹ' : '✕'} {t.msg}
        </div>
      ))}
    </div>
  );
}
