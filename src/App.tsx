/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScreenName, TransitionType, DeviceMode, PlaceReviewItem, UserProfile } from './types';
import { initialPlaces, initialProfile } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DeleteModal } from './components/DeleteModal';
import { DeviceSwitcher } from './components/DeviceSwitcher';
import { VisitedPlacesScreen } from './screens/VisitedPlacesScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { PlaceDetailsScreen } from './screens/PlaceDetailsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('visited');
  const [transition, setTransition] = useState<TransitionType>('none');
  const [places, setPlaces] = useState<PlaceReviewItem[]>(initialPlaces);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [selectedPlace, setSelectedPlace] = useState<PlaceReviewItem>(initialPlaces[0]);
  const [placeToDelete, setPlaceToDelete] = useState<PlaceReviewItem | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navigateTo = (targetScreen: ScreenName, transitionType: TransitionType = 'none') => {
    setTransition(transitionType);
    setCurrentScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenDetails = (place: PlaceReviewItem) => {
    setSelectedPlace(place);
    navigateTo('details', 'push');
  };

  const handleOpenDeleteModal = (place: PlaceReviewItem) => {
    setPlaceToDelete(place);
  };

  const handleConfirmDelete = (placeId: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
    setPlaceToDelete(null);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdatePlace = (updated: Partial<PlaceReviewItem>) => {
    setPlaces((prev) =>
      prev.map((p) => (p.id === selectedPlace.id ? { ...p, ...updated } : p))
    );
    setSelectedPlace((prev) => ({ ...prev, ...updated }));
  };

  const handleDeleteFromDetails = (placeId: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
    navigateTo('visited', 'push_back');
  };

  // Compute slide variants based on transition type
  const getVariants = () => {
    if (transition === 'push') {
      return {
        initial: { x: '100%', opacity: 0.95 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-25%', opacity: 0.8 },
      };
    }
    if (transition === 'push_back') {
      return {
        initial: { x: '-25%', opacity: 0.8 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0.95 },
      };
    }
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
    };
  };

  // Device container styling
  const getDeviceContainerClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-full max-w-[420px] mx-auto min-h-screen shadow-2xl rounded-3xl overflow-hidden border-8 border-surface-container-high my-4 relative';
      case 'tablet':
        return 'w-full max-w-[768px] mx-auto min-h-screen shadow-2xl rounded-2xl overflow-hidden border-4 border-surface-container-high my-4 relative';
      case 'desktop':
        return 'w-full max-w-[1200px] mx-auto min-h-screen shadow-xl rounded-xl overflow-hidden border border-outline-variant/30 my-4 relative';
      case 'responsive':
      default:
        return 'w-full min-h-screen relative';
    }
  };

  return (
    <div className={`min-h-screen bg-background text-on-surface flex flex-col ${deviceMode !== 'responsive' ? 'bg-surface-dim p-2 sm:p-6' : ''}`}>
      {/* Top Device Switcher for Preview on Different Devices */}
      <DeviceSwitcher
        currentMode={deviceMode}
        onModeChange={setDeviceMode}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      {/* Main Device Framing Container */}
      <div className={getDeviceContainerClass()}>
        {/* Top Header */}
        <Header
          screen={currentScreen}
          onNavigate={navigateTo}
          avatarUrl={profile.avatarUrl}
        />

        {/* Screen Transitions */}
        <div className="relative overflow-x-hidden min-h-screen flex flex-col">
          <AnimatePresence mode="wait" initial={false}>
            {currentScreen === 'visited' && (
              <motion.div
                key="visited"
                variants={getVariants()}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: transition === 'none' ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex-1 flex flex-col"
              >
                <VisitedPlacesScreen
                  places={places}
                  onOpenDetails={handleOpenDetails}
                  onOpenDeleteModal={handleOpenDeleteModal}
                  onNavigate={navigateTo}
                />
              </motion.div>
            )}

            {currentScreen === 'profile' && (
              <motion.div
                key="profile"
                variants={getVariants()}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: transition === 'none' ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex-1 flex flex-col"
              >
                <UserProfileScreen
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                  onNavigate={navigateTo}
                  isDark={isDark}
                  onToggleTheme={setIsDark}
                />
              </motion.div>
            )}

            {currentScreen === 'details' && (
              <motion.div
                key="details"
                variants={getVariants()}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: transition === 'none' ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex-1 flex flex-col"
              >
                <PlaceDetailsScreen
                  place={selectedPlace}
                  onNavigate={navigateTo}
                  onUpdatePlace={handleUpdatePlace}
                  onDeletePlace={handleDeleteFromDetails}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation (Hidden on details screen as per mobile design prototype) */}
        {currentScreen !== 'details' && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            visitedCount={places.length}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal
          place={placeToDelete}
          onClose={() => setPlaceToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
