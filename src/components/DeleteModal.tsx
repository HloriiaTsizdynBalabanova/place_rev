import React from 'react';
import { PlaceReviewItem } from '../types';

interface DeleteModalProps {
  place: PlaceReviewItem | null;
  onClose: () => void;
  onConfirm: (placeId: string) => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  place,
  onClose,
  onConfirm,
}) => {
  if (!place) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center px-margin transition-opacity duration-200"
      id="deleteModalBackdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl flex flex-col gap-space-md animate-in fade-in zoom-in-95">
        {/* Icon & Title */}
        <div className="flex items-center gap-space-sm text-error">
          <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">delete_forever</span>
          </div>
          <h3 className="font-title-md text-title-md text-on-surface font-semibold leading-snug" id="deleteModalTitle">
            Видалити заклад із відвіданих?
          </h3>
        </div>

        {/* Warning Description */}
        <div className="bg-surface-container-low rounded-xl p-space-sm">
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed" id="deleteModalWarning">
            Ви збираєтеся видалити{' '}
            <strong className="text-on-surface font-semibold" id="deleteTargetName">
              &quot;{place.name}&quot;
            </strong>{' '}
            зі списку відвіданих. Ваша особиста оцінка (
            <span id="deleteTargetRating">{place.personalRating ?? place.rating}/5</span>), нотатка та{' '}
            <span id="deleteTargetPhotos">{place.photoCount} прикріплені фотографії</span> будуть вилучені. Цю дію
            неможливо скасувати.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            className="h-10 px-4 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-variant transition-colors"
            onClick={onClose}
          >
            Скасувати
          </button>
          <button
            className="h-10 px-5 rounded-lg bg-error text-on-error font-label-lg text-label-lg font-medium shadow-sm hover:opacity-90 flex items-center gap-1.5 transition-opacity"
            onClick={() => onConfirm(place.id)}
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Підтвердити видалення</span>
          </button>
        </div>
      </div>
    </div>
  );
};
