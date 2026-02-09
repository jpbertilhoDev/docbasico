"use client";

import { useState, useCallback } from "react";
import Dialog from "@/components/ui/Dialog";

interface DialogOptions {
  title: string;
  description?: string;
  variant?: "default" | "danger" | "success" | "info";
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
}

export function useDialog() {
  const [dialog, setDialog] = useState<{
    open: boolean;
    options: DialogOptions | null;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
  }>({
    open: false,
    options: null,
    onConfirm: null,
    onCancel: null,
  });

  const showDialog = useCallback(
    (
      options: DialogOptions,
      onConfirm?: () => void,
      onCancel?: () => void
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setDialog({
          open: true,
          options,
          onConfirm: onConfirm
            ? () => {
                onConfirm();
                resolve(true);
                setDialog((prev) => ({ ...prev, open: false }));
              }
            : () => {
                resolve(true);
                setDialog((prev) => ({ ...prev, open: false }));
              },
          onCancel: onCancel
            ? () => {
                onCancel();
                resolve(false);
                setDialog((prev) => ({ ...prev, open: false }));
              }
            : () => {
                resolve(false);
                setDialog((prev) => ({ ...prev, open: false }));
              },
        });
      });
    },
    []
  );

  const confirm = useCallback(
    (
      title: string,
      description?: string,
      variant: "default" | "danger" | "success" | "info" = "default"
    ): Promise<boolean> => {
      return showDialog(
        {
          title,
          description,
          variant,
          confirmText: "Confirmar",
          cancelText: "Cancelar",
        },
        undefined,
        undefined
      );
    },
    [showDialog]
  );

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  const DialogRenderer = () => {
    if (!dialog.options) return null;

    return (
      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        title={dialog.options.title}
        description={dialog.options.description}
        variant={dialog.options.variant}
        confirmText={dialog.options.confirmText}
        cancelText={dialog.options.cancelText}
        showCloseButton={dialog.options.showCloseButton}
        onConfirm={dialog.onConfirm || undefined}
        onCancel={dialog.onCancel || undefined}
      />
    );
  };

  return {
    showDialog,
    confirm,
    closeDialog,
    DialogRenderer,
  };
}

