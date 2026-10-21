'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { checkGuestData, migrateGuestDataToSupabase, GuestDataSummary } from '@/lib/migrationManager';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { dispatchStorageEvent, STORAGE_EVENTS } from '@/lib/storageManager';

export function GuestMigrationPrompt() {
  const { user } = useAuth();
  const [guestSummary, setGuestSummary] = useState<GuestDataSummary | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (user && !dismissed) {
      const summary = checkGuestData();
      if (summary.hasGuestData) {
        queueMicrotask(() => {
          setGuestSummary(summary);
        });
      }
    }
  }, [user, dismissed]);

  if (!user || !guestSummary?.hasGuestData || dismissed) {
    return null;
  }

  const handleMigrate = async () => {
    setIsMigrating(true);
    setStatusMessage(null);

    const result = await migrateGuestDataToSupabase(user.id);
    setIsMigrating(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: `Successfully synced ${result.importedMoods} mood entries and ${result.importedReflections} reflections to your cloud sanctuary!`,
      });
      // Refresh storage listeners
      dispatchStorageEvent(STORAGE_EVENTS.MOOD_CHANGE);
      dispatchStorageEvent(STORAGE_EVENTS.REFLECTION_CHANGE);

      setTimeout(() => {
        setDismissed(true);
      }, 4000);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to sync guest data. Your local data remains safe.',
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-6">
      <Card
        variant="white"
        className="p-4 sm:p-5 border border-brand-purple/20 bg-gradient-to-r from-brand-purple-light/50 via-white to-brand-mint-light/40 relative shadow-sanctuary-sm"
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-sanctuary-text-muted hover:text-sanctuary-text-primary p-1 rounded-lg"
          aria-label="Dismiss guest data migration prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-brand-purple/10 text-brand-purple shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-sanctuary-text-primary">
                Import Guest Reflections
              </h3>
              <p className="text-xs sm:text-sm text-sanctuary-text-secondary mt-0.5">
                We found{' '}
                <span className="font-semibold text-brand-purple">
                  {guestSummary.moodCount} mood check-in{guestSummary.moodCount !== 1 ? 's' : ''}
                </span>{' '}
                and{' '}
                <span className="font-semibold text-brand-purple">
                  {guestSummary.reflectionCount} reflection{guestSummary.reflectionCount !== 1 ? 's' : ''}
                </span>{' '}
                from your guest session. Would you like to save them to your account?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={handleMigrate}
              loading={isMigrating}
              className="w-full sm:w-auto"
            >
              Sync to Account
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="w-full sm:w-auto"
            >
              Skip
            </Button>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-brand-mint-light text-brand-mint font-medium'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </Card>
    </div>
  );
}
