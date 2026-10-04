import React, { useState } from 'react';
import { PlaceReviewItem, ScreenName, TransitionType } from '../types';

interface PlaceDetailsScreenProps {
  place: PlaceReviewItem;
  onNavigate: (screen: ScreenName, transition: TransitionType) => void;
  onUpdatePlace: (updated: Partial<PlaceReviewItem>) => void;
  onDeletePlace: (placeId: string) => void;
}

export const PlaceDetailsScreen: React.FC<PlaceDetailsScreenProps> = ({
  place,
  onNavigate,
  onUpdatePlace,
  onDeletePlace,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [personalRating, setPersonalRatingState] = useState(place.personalRating || 5);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteContent, setNoteContent] = useState(
    place.privateNote ||
      "Обов'язково замовляти фільтр на митій Ефіопії та чізкейк з карамеллю. Найкраще місце для навчання біля вікна на 2 поверсі."
  );
  const [noteDraft, setNoteDraft] = useState(noteContent);
  const [photos, setPhotos] = useState(
    place.personalPhotos || [
      {
        id: 'p1',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALcHjuBUWUrz9Z52h6km41W5CpbnxKMA23rBopqNPllHR3SCfEItPScZBs1PkrBK1GEvTpWz9tEzcuA7fulJkMOmPkL1O2dyD3MrlHvqDztCR47U2PXcqXkflHcJar85A2Usyb6ibyVy-YOr75xwHftb5Z8l7FzF8BEuDqPD50STTIETBt3CA2Y3gyQp1e7JOfBjOWy8J3gc4XcyTv6uIeYOtDUpVQOGnjbn5_VMUO4jk24X0TBGBx',
        title: 'V60 Ефіопія',
        time: '14 травня, 15:12',
      },
      {
        id: 'p2',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqZGi5tCWeaQRmsdEPXwYFLJys7Zn1cKBb70IVmYp_KIeh_ejiIKOYe4ZuVx8mTxvEMxw5ijeAyTbiRcHwnVKWGlAsosbqsdIxrMa1enKDueR6Y02MG_vJZ5MKgcZptvMnSdnwyHvUljIlkt6j-qaOQPmlnZFG7-CH9evu0M0RuUSxva2N273cprD-MZU2jCTH1cXBqL4-nwcoYbPdPmERiAapw6J_RPyfz7irnNpmvKAnVL4q2ekL',
        title: 'Вид з 2 поверху',
        time: '14 травня, 15:45',
      },
      {
        id: 'p3',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe91z0GApMY1gEsNJTsoFi3aVgnLmU0mCRpYO2pWGv6I5V9hxHVny9N90E-ahygbsoAS85IYWk53KBPweYg4oXmVBjS_PL3X1SVbpYuYfGQWu1cqj8RGv0rqYFOMnaLY6inoDsN0rurJKFCq02kwKXhg8Yb863ZUkqSA8EDrjimOJHJKOgD33H2z5a5f6KXr75BHouO6NbeLtUGEEsFwPZjKsFiU9l0OtwkTc2rO6SrLj7OGuZn4oK',
        title: 'Флет вайт',
        time: '14 травня, 16:20',
      },
    ]
  );
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [toast, setToast] = useState<{ text: string; icon: string } | null>(null);

  const showToast = (text: string, icon = 'check_circle') => {
    setToast({ text, icon });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 2800);
  };

  const handleSetRating = (score: number) => {
    setPersonalRatingState(score);
    onUpdatePlace({ personalRating: score });
    showToast(`Оцінку змінено на ${score} з 5`);
  };

  const handleToggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    if (nextState) {
      showToast('Заклад збережено в обрані', 'bookmark');
    } else {
      showToast('Заклад видалено з обраних', 'bookmark_remove');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${place.name} (Львів)`,
          text: `Перегляньте мої враження та оцінку закладу "${place.name}"`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      showToast('Посилання на заклад скопійовано', 'link');
    }
  };

  const handleSaveNote = () => {
    setNoteContent(noteDraft);
    setIsEditingNote(false);
    onUpdatePlace({ privateNote: noteDraft });
    showToast('Нотатку успішно збережено');
  };

  const handleCancelNote = () => {
    setNoteDraft(noteContent);
    setIsEditingNote(false);
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = photos.filter((p) => p.id !== photoId);
    setPhotos(updated);
    onUpdatePlace({ personalPhotos: updated });
    showToast('Фото видалено з журналу', 'delete');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Файл перевищує ліміт 10 МБ', 'error');
      return;
    }

    setUploadProgress(20);
    setTimeout(() => setUploadProgress(65), 300);
    setTimeout(() => setUploadProgress(100), 700);
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const newPhoto = {
          id: `p-${Date.now()}`,
          url: (loadEvent.target?.result as string) || place.photos[0],
          title: file.name.replace(/\.[^/.]+$/, '').slice(0, 16),
          time: 'Сьогодні, 16:30',
        };
        const updated = [...photos, newPhoto];
        setPhotos(updated);
        onUpdatePlace({ personalPhotos: updated });
        setUploadProgress(null);
        showToast('Фото завантажено та збережено');
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  return (
    <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
      <div className="flex flex-col w-full max-w-3xl mx-auto pb-12">
        {/* Interactive Top Action / Quick Nav Bar (FR-08) */}
        <div className="px-space-md py-space-sm flex items-center justify-between bg-surface-container-low border-b border-outline-variant/15">
          {/* Back button: xpath: //button[@aria-label='Повернутися до списку'] -> goes to visited with push_back */}
          <button
            aria-label="Повернутися до списку"
            className="flex items-center gap-space-xs text-primary font-label-lg text-label-lg active:scale-95 transition-transform cursor-pointer"
            onClick={() => onNavigate('visited', 'push_back')}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Назад до списку</span>
          </button>

          <div className="flex items-center gap-space-xs">
            <button
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-secondary-container transition-colors cursor-pointer"
              id="bookmarkBtn"
              onClick={handleToggleBookmark}
              title={isBookmarked ? 'Видалити з обраного' : 'Зберегти в обране'}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                id="bookmarkIcon"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
            <button
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-secondary-container transition-colors cursor-pointer"
              onClick={handleShare}
              title="Поділитися"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>
        </div>

        {/* Hero Visual with Badges & Tags */}
        <div className="relative w-full aspect-[16/10] bg-surface-container-high overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEIhpFN_c06q9kZWUqxfRDX7owsgla4rHod2eT3od0SJeo_Zqqgqu7LQV1CCHqvuxcd3vXKFvCRNZccS7WBJeqFwhbTOCqSBhBkf4THKOGSyP4IBI__-7azATHW0RfUEWTGcD9IaBRPDwQlv_i9k05n9972BjuoqTj7dbf2ua98Vk_XuWtVnGZyhId9UBo_nDNL90wy1HAEs7a1d7es_yDADGrUiO0TzW4KP-pZ6IpLmavi2kpxtcL"
            alt="Світ Кави інтер'єр"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent"></div>

          {/* Top-Right Status Chip */}
          <div className="absolute top-space-md right-space-md flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
              {place.openingHours || 'Відкрито до 22:00'}
            </span>
          </div>

          {/* Bottom Scrim Content */}
          <div className="absolute bottom-0 inset-x-0 p-space-md flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {(place.tags || ["Кав'ярня", 'Історичний центр', 'Wi-Fi', 'Літній майданчик']).map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-md text-label-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* General Info Section */}
        <div className="p-space-md flex flex-col gap-space-md bg-surface">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-space-sm">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
                {place.name}
              </h1>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-title-sm text-title-sm font-semibold flex-shrink-0">
                <span
                  className="material-symbols-outlined text-[18px] text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span>{place.rating.toFixed(1)}</span>
                <span className="text-on-tertiary-fixed-variant font-body-sm text-body-sm">
                  ({place.reviewCount || 240})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
              <span>{place.address || 'м. Львів, пл. Катедральна, 6'}</span>
            </div>
          </div>

          {/* Description */}
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {place.description ||
              "Культова львівська кав'ярня третьої хвилі з власною обсмажкою спешелті зерна, свіжою випічкою та автентичною атмосферою старого міста."}
          </p>

          {/* Map Snapshot Card */}
          <div className="relative rounded-xl overflow-hidden shadow-sm border border-outline-variant/15">
            <div
              className="w-full h-32 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDImvcdL77groedfsB5-hTPz_xo_PaK-xCUSwU4CU-STC2qi3YP6juwm9T0QcwFexDlkrmicyJAnXUlRzBqS4jFh8x3FRs3-9zXFlxRMZnjp2xRVLGU1bcuZcljH5CnPzfAxdgIwwXYGKvI0weVl1HfXWSSJ6NcVviv9ao9K2PGGqwQAFw2Fz6oXT0q-P9a8KLrjAGmCx7-dvY6bOzTCTq3oXY9VuTMb-64FfPGE190oj_0c3xt1dqv')",
              }}
            ></div>
            <div className="absolute inset-0 bg-primary-container/10 pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 right-2 px-3 py-2 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">near_me</span>
                <span className="font-label-md text-label-md text-on-surface">
                  {place.distance || '50 м від ратуші'}
                </span>
              </div>
              <a
                className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
              >
                <span>Маршрут</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        {/* Visited Status & Entry Operations (FR-07, CRUD) */}
        <div className="mx-space-md mb-space-md p-space-md rounded-xl bg-secondary-container text-on-secondary-container shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-title-sm text-title-sm font-semibold text-on-secondary-fixed">
                Заклад у ваших відвіданих місцях
              </span>
              <span className="font-label-sm text-label-sm text-on-secondary-container opacity-85">
                Додано до журналу: {place.date}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              className="flex-1 h-10 px-space-md rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-medium flex items-center justify-center gap-1.5 shadow-sm active:opacity-90 transition-opacity cursor-pointer"
              onClick={() => showToast('Форма редагування відвідування відкрита', 'edit')}
            >
              <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
              <span>Редагувати запис</span>
            </button>
            <button
              className="h-10 px-3 rounded-lg bg-surface-container-lowest text-error font-label-lg text-label-lg flex items-center justify-center hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
              onClick={() => {
                if (window.confirm('Видалити цей заклад із списку ваших відвіданих місць?')) {
                  onDeletePlace(place.id);
                  onNavigate('visited', 'push_back');
                }
              }}
              title="Видалити з відвіданих"
            >
              <span className="material-symbols-outlined text-[20px]">delete_outline</span>
            </button>
          </div>
        </div>

        {/* Personal Data Block (CRUD: Read/Edit) */}
        <div className="px-space-md flex flex-col gap-space-lg mb-space-xl">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b-0 pb-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">book_2</span>
              <h2 className="font-title-lg text-title-lg font-bold text-on-surface">Особистий щоденник</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
              Лабораторія #4
            </span>
          </div>

          {/* FR-11: Personal Rating */}
          <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-2 border border-outline-variant/15">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm font-semibold text-on-surface">
                  Ваша особиста оцінка
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Окремо від загального рейтингу
                </span>
              </div>
              <span
                className="px-2.5 py-1 rounded-md bg-tertiary-container text-on-tertiary-container font-label-md text-label-md font-bold"
                id="ratingNumericLabel"
              >
                {personalRating} з 5 зірок
              </span>
            </div>

            {/* Interactive 5-Star Cluster */}
            <div className="flex items-center gap-2 py-1" id="starContainer">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const filled = starVal <= personalRating;
                return (
                  <button
                    key={starVal}
                    aria-label={`${starVal} зір${starVal === 1 ? 'ка' : starVal < 5 ? 'ки' : 'ок'}`}
                    className={`p-1 active:scale-110 transition-transform focus:outline-none cursor-pointer ${
                      filled ? 'text-tertiary-container' : 'text-outline-variant'
                    }`}
                    onClick={() => handleSetRating(starVal)}
                  >
                    <span
                      className="material-symbols-outlined text-[32px]"
                      style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Criteria breakdown micro-badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Кава</span>
                <span className="font-title-sm text-title-sm font-semibold text-primary">
                  {place.criteria?.coffee || '10 / 10'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Атмосфера</span>
                <span className="font-title-sm text-title-sm font-semibold text-primary">
                  {place.criteria?.atmosphere || '9.5 / 10'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container flex flex-col items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Wi-Fi для роб.</span>
                <span className="font-title-sm text-title-sm font-semibold text-primary">
                  {place.criteria?.wifi || '8.5 / 10'}
                </span>
              </div>
            </div>
          </div>

          {/* FR-12: Personal Note Card */}
          <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-3 border border-outline-variant/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                <span className="font-title-sm text-title-sm font-semibold text-on-surface">Приватна нотатка</span>
              </div>
              {!isEditingNote && (
                <button
                  className="h-8 px-3 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-secondary-container transition-colors flex items-center gap-1 cursor-pointer"
                  id="noteActionBtn"
                  onClick={() => setIsEditingNote(true)}
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Редагувати нотатку</span>
                </button>
              )}
            </div>

            {/* Read Mode Note */}
            {!isEditingNote ? (
              <div className="relative p-space-md rounded-lg bg-surface-container-lowest" id="noteDisplayBox">
                <span className="material-symbols-outlined absolute top-2 right-2 text-surface-container-highest text-[36px] -scale-x-100 select-none pointer-events-none">
                  format_quote
                </span>
                <blockquote className="font-body-md text-body-md text-on-surface italic leading-relaxed pr-6">
                  &quot;{noteContent}&quot;
                </blockquote>
                <div className="mt-3 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                  <span>Оновлено: 14 травня 2024, 16:40</span>
                  <span className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-[14px]">lock</span> Тільки для вас
                  </span>
                </div>
              </div>
            ) : (
              /* Edit Mode Note */
              <div className="flex flex-col gap-2" id="noteEditBox">
                <textarea
                  className="w-full p-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20 resize-none"
                  id="noteInput"
                  placeholder="Запишіть ваші враження, смаки чи рекомендації..."
                  rows={3}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md cursor-pointer hover:bg-surface-container-high"
                    onClick={handleCancelNote}
                  >
                    Скасувати
                  </button>
                  <button
                    className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-medium shadow-sm cursor-pointer hover:bg-primary-container"
                    onClick={handleSaveNote}
                  >
                    Зберегти
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FR-13: Personal Photos Gallery */}
          <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-3 border border-outline-variant/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">photo_library</span>
                <span className="font-title-sm text-title-sm font-semibold text-on-surface">
                  Особисті фотозвіти ({photos.length})
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Синхронізовано</span>
            </div>

            {/* Grid of Personal Photos & Upload Card */}
            <div className="grid grid-cols-2 gap-2.5">
              {photos.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-lg overflow-hidden aspect-square bg-surface-container-high shadow-sm"
                >
                  <img className="w-full h-full object-cover" src={item.url} alt={item.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-2 pointer-events-none">
                    <span className="text-inverse-on-surface font-label-sm text-label-sm font-medium">
                      {item.time}
                    </span>
                    <span className="text-surface-variant font-label-sm text-label-sm opacity-90 truncate">
                      {item.title}
                    </span>
                  </div>
                  <button
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-inverse-surface/70 text-inverse-on-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-error"
                    onClick={() => handleDeletePhoto(item.id)}
                    title="Видалити фото"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}

              {/* Upload Action Card */}
              <label
                htmlFor="photoFileInput"
                className="relative rounded-lg aspect-square bg-surface-container hover:bg-secondary-container cursor-pointer transition-colors p-3 flex flex-col items-center justify-center text-center gap-1.5 shadow-sm border border-dashed border-outline-variant/50"
              >
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">add_a_photo</span>
                </div>
                <span className="font-label-lg text-label-lg font-semibold text-on-surface">+ Додати фото</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                  JPEG, PNG, WebP
                  <br />
                  до 10 МБ
                </span>

                {/* Simulated Upload Progress Bar */}
                {uploadProgress !== null && (
                  <div
                    className="absolute inset-x-2 bottom-2 bg-surface-container-highest rounded-full h-1.5 overflow-hidden"
                    id="uploadProgressContainer"
                  >
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      id="uploadProgressBar"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </label>
            </div>

            <input
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id="photoFileInput"
              type="file"
              onChange={handleFileSelect}
            />
          </div>

          {/* System Auto-Save / Offline Sync Status Indicator */}
          <div className="p-3 rounded-lg bg-surface-container-high flex items-center gap-2.5 text-on-surface-variant shadow-sm border border-outline-variant/15">
            <span
              className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 animate-spin"
              style={{ animationDuration: '4s' }}
            >
              sync
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                Всі зміни автоматично синхронізовано локально
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Режим лабораторного збереження SQLite / LocalDB
              </span>
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        {toast && (
          <div
            className="fixed bottom-6 inset-x-4 max-w-sm mx-auto px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-label-md shadow-xl flex items-center gap-2 transition-transform duration-300 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-3"
            id="statusToast"
          >
            <span className="material-symbols-outlined text-primary-fixed text-[20px]" id="toastIcon">
              {toast.icon}
            </span>
            <span id="toastMessage">{toast.text}</span>
          </div>
        )}
      </div>
    </main>
  );
};
