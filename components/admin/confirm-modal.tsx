"use client";

import React, { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[#121214] border border-zinc-800 p-6 shadow-2xl relative">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white font-archivo mb-2">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Suppression..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

