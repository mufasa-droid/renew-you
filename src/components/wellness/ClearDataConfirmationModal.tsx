'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Trash2, Heart, Feather, ShieldAlert } from 'lucide-react';

export interface ClearDataConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  moodCount: number;
  reflectionCount: number;
  isClearing?: boolean;
}

export function ClearDataConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  moodCount,
  reflectionCount,
  isClearing = false,
}: ClearDataConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clear All Local Wellness Data"
      description="Require explicit confirmation before permanently deleting local browser records."
      maxWidth="md"
    >
      <div className="flex flex-col gap-5 text-sanctuary-text-primary">
        {/* Warning Callout */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-rose-900">
              This action cannot be undone
            </h4>
            <p className="text-xs text-rose-800/90 leading-relaxed">
              Renew You V1 stores your emotional check-ins and reflections directly inside this browser’s local storage. Deleting this data removes it permanently from this device.
            </p>
          </div>
        </div>

        {/* Breakdown of what will be removed */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-sanctuary-text-secondary uppercase tracking-wider">
            Items to be permanently removed
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-sanctuary-bg border border-sanctuary-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-purple-light text-brand-purple flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base font-extrabold text-sanctuary-text-primary leading-tight">
                  {moodCount}
                </span>
                <span className="text-[11px] text-sanctuary-text-secondary truncate">
                  Mood Check-Ins
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sanctuary-bg border border-sanctuary-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAE4F8] text-brand-purple flex items-center justify-center shrink-0">
                <Feather className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base font-extrabold text-sanctuary-text-primary leading-tight">
                  {reflectionCount}
                </span>
                <span className="text-[11px] text-sanctuary-text-secondary truncate">
                  Reflections
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Note on Unrelated Storage */}
        <div className="p-3 rounded-xl bg-sanctuary-muted/60 border border-sanctuary-border/60 flex items-center gap-2.5 text-[11px] text-sanctuary-text-secondary">
          <ShieldAlert className="w-4 h-4 text-brand-purple shrink-0" />
          <span>
            <strong>Safe Deletion:</strong> Only Renew You&apos;s own storage keys will be deleted. Any unrelated site data or keys from other applications are strictly preserved.
          </span>
        </div>

        {/* Action Controls: Cancel & Confirm */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-sanctuary-border">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isClearing}
            className="w-full sm:w-auto"
          >
            Cancel, Keep My Data
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            loading={isClearing}
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Yes, Permanently Clear All Data
          </Button>
        </div>
      </div>
    </Modal>
  );
}
