import React, { useState, useMemo } from 'react';
import { PlaceReviewItem, ScreenName, TransitionType } from '../types';

interface VisitedPlacesScreenProps {
  places: PlaceReviewItem[];
  onOpenDetails: (place: PlaceReviewItem) => void;
  onOpenDeleteModal: (place: PlaceReviewItem) => void;
  onNavigate: (screen: ScreenName, transition: TransitionType) => void;
}

export const VisitedPlacesScreen: React.FC<VisitedPlacesScreenProps> = ({
  places,
  onOpenDetails,
  onOpenDeleteModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'cafe' | 'restaurant' | 'bookstore'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>('Заклад успішно збережено у відвіданих');

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'all' || p.categoryType === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [places, searchQuery, activeCategory]);

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="flex flex-col w-full relative max-w-4xl mx-auto">
        {/* Status Feedback Toast (Heuristic 1: Visibility of System Status) */}
        {toastMessage && (
          <div className="px-margin pt-space-sm pb-space-xs transition-all duration-300" id="toastNotification">
            <div className="bg-secondary-container text-on-secondary-fixed px-space-md py-space-sm rounded-xl shadow-md flex items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm min-w-0">
                <span
                  className="material-symbols-outlined text-[20px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span className="font-body-md text-body-md truncate">{toastMessage}</span>
              </div>
              <button
                aria-label="Закрити сповіщення"
                className="text-on-secondary-container hover:text-on-secondary-fixed transition-colors flex-shrink-0 cursor-pointer p-1"
                onClick={() => setToastMessage(null)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Header Section with Title & Quantitative Pill */}
        <div className="px-margin pt-space-md pb-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Відвідані заклади</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-container font-label-md text-label-md text-on-secondary-fixed font-semibold">
              {places.length} збережених
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
        </div>

        {/* Search & Categorical Filter Bar */}
        <div className="px-margin pb-space-sm flex flex-col gap-space-sm">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              className="w-full h-11 pl-10 pr-10 bg-surface-container rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-highest transition-colors"
              placeholder="Пошук серед відвіданих..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button
                aria-label="Очистити"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                onClick={() => setSearchQuery('')}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            ) : (
              <button
                aria-label="Очистити"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            )}
          </div>

          {/* Filter Chips (Horizontal Scroll) */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 -mx-margin px-margin no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-full font-label-md text-label-md flex-shrink-0 transition-colors shadow-sm cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-secondary-container text-on-secondary-fixed'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {activeCategory === 'all' && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
              <span>Всі ({places.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('cafe')}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-full font-label-md text-label-md flex-shrink-0 transition-colors cursor-pointer ${
                activeCategory === 'cafe'
                  ? 'bg-secondary-container text-on-secondary-fixed shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">local_cafe</span>
              <span>Кав&apos;ярні ({places.filter((p) => p.categoryType === 'cafe').length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('restaurant')}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-full font-label-md text-label-md flex-shrink-0 transition-colors cursor-pointer ${
                activeCategory === 'restaurant'
                  ? 'bg-secondary-container text-on-secondary-fixed shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">restaurant</span>
              <span>Ресторани ({places.filter((p) => p.categoryType === 'restaurant').length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('bookstore')}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-full font-label-md text-label-md flex-shrink-0 transition-colors cursor-pointer ${
                activeCategory === 'bookstore'
                  ? 'bg-secondary-container text-on-secondary-fixed shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>Книгарні ({places.filter((p) => p.categoryType === 'bookstore').length})</span>
            </button>
          </div>
        </div>

        {/* Visited Establishments List */}
        <div className="px-margin flex flex-col gap-space-md py-space-xs pb-space-lg">
          {filteredPlaces.length === 0 ? (
            <div className="p-space-xl text-center text-on-surface-variant bg-surface-container-low rounded-2xl flex flex-col items-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-2">search_off</span>
              <p className="font-title-md">Закладів не знайдено</p>
              <p className="font-body-sm mt-1">Спробуйте змінити фільтр або пошуковий запит</p>
            </div>
          ) : (
            filteredPlaces.map((place) => {
              const isSvitKavy = place.name.includes('Світ Кави');

              return (
                <div
                  key={place.id}
                  className="bg-surface-container-low rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm relative border border-outline-variant/15 hover:border-outline-variant/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-space-sm">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-label-sm text-secondary font-medium">
                          {place.category}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span> {place.date}
                        </span>
                      </div>

                      {/* Title: xpath: //div[contains(@class, 'bg-surface-container-low')][.//h2[contains(text(), 'Світ Кави')]]//h2 */}
                      <h2
                        onClick={() => {
                          if (isSvitKavy) onOpenDetails(place);
                        }}
                        className={`font-title-md text-title-md text-on-surface font-semibold truncate ${
                          isSvitKavy ? 'cursor-pointer hover:text-primary transition-colors' : ''
                        }`}
                      >
                        {place.name}
                      </h2>
                    </div>

                    <div className="flex items-center bg-tertiary-fixed text-on-tertiary-fixed px-2 py-1 rounded-lg flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-[16px] text-tertiary mr-1"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-label-lg text-label-lg font-bold">{place.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Rating Detail Bar */}
                  <div className="flex items-center gap-1 text-tertiary-fixed-dim">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <span
                        key={starIndex}
                        className={`material-symbols-outlined text-[18px] ${
                          starIndex <= Math.floor(place.rating) ? 'text-tertiary' : 'text-outline-variant'
                        }`}
                        style={{
                          fontVariationSettings: starIndex <= Math.floor(place.rating) ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    ))}
                    <span className="font-label-sm text-label-sm text-on-surface-variant ml-2">Ваша оцінка</span>
                  </div>

                  {/* User Note Box */}
                  <div className="bg-surface-container rounded-xl p-space-sm">
                    <div className="flex items-center gap-1.5 text-on-surface-variant mb-1">
                      <span className="material-symbols-outlined text-[16px]">edit_note</span>
                      <span className="font-label-sm text-label-sm font-medium">Особиста нотатка</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface">{place.note}</p>
                  </div>

                  {/* Photo Gallery */}
                  {place.photos.length > 0 && (
                    <div
                      className={`grid gap-space-xs ${
                        place.photos.length === 1
                          ? 'grid-cols-1'
                          : place.photos.length === 2
                          ? 'grid-cols-2'
                          : 'grid-cols-3'
                      }`}
                    >
                      {place.photos.map((photoUrl, pIdx) => {
                        const isLast = pIdx === place.photos.length - 1;
                        return (
                          <div
                            key={pIdx}
                            className={`aspect-video rounded-lg overflow-hidden bg-surface-container-high relative ${
                              place.photos.length === 1 ? 'aspect-[21/9]' : ''
                            }`}
                          >
                            <img
                              className="w-full h-full object-cover"
                              src={photoUrl}
                              alt={`${place.name} фото ${pIdx + 1}`}
                              loading="lazy"
                            />
                            {isLast && (
                              <div className="absolute inset-0 bg-inverse-surface/30 flex items-center justify-center text-surface-container-lowest font-label-sm text-label-sm font-semibold">
                                {place.photoCount} фото
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action Buttons Toolbar */}
                  <div className="flex items-center justify-between pt-space-xs">
                    {/* Details Button: xpath: //div[contains(@class, 'bg-surface-container-low')][.//h2[contains(text(), 'Світ Кави')]]//button[contains(., 'Деталі')] */}
                    <button
                      onClick={() => onOpenDetails(place)}
                      className="h-9 px-3 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-1.5 hover:bg-secondary-container transition-colors cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Деталі</span>
                    </button>

                    <div className="flex items-center gap-space-xs">
                      <button
                        onClick={() => onOpenDetails(place)}
                        className="h-9 px-3 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        <span>Редагувати</span>
                      </button>
                      <button
                        aria-label={`Видалити ${place.name}`}
                        className="w-9 h-9 rounded-lg bg-error-container text-on-error-container flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer active:scale-95"
                        onClick={() => onOpenDeleteModal(place)}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};
