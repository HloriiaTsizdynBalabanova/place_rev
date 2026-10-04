import React from 'react';
import { ScreenName, TransitionType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName, transition: TransitionType) => void;
  visitedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  visitedCount = 5,
}) => {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
      data-active-classes="text-primary font-semibold [&>div]:bg-secondary-container [&>div]:text-on-secondary-fixed"
    >
      <div className="flex items-center justify-around h-20 px-space-xs max-w-lg mx-auto">
        {/* Home */}
        <a
          className={`group flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 transition-colors ${
            currentScreen === 'home'
              ? 'text-primary font-semibold [&>div]:bg-secondary-container [&>div]:text-on-secondary-fixed'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          data-path="home"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('visited', 'none');
          }}
        >
          <div className="w-14 h-8 flex items-center justify-center rounded-full mb-1 transition-colors">
            <span className="material-symbols-outlined text-[24px]">home</span>
          </div>
          <span className="font-label-md text-label-md transition-colors">Головна</span>
        </a>

        {/* Catalog */}
        <a
          className={`group flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 transition-colors ${
            currentScreen === 'catalog'
              ? 'text-primary font-semibold [&>div]:bg-secondary-container [&>div]:text-on-secondary-fixed'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          data-path="catalog"
          href="#catalog"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('visited', 'none');
          }}
        >
          <div className="w-14 h-8 flex items-center justify-center rounded-full mb-1 transition-colors">
            <span className="material-symbols-outlined text-[24px]">storefront</span>
          </div>
          <span className="font-label-md text-label-md transition-colors">Каталог</span>
        </a>

        {/* Visited Places: xpath: //nav//a[@data-path='visited-places'] -> goes to visited-places with none transition */}
        <a
          aria-current={currentScreen === 'visited' ? 'page' : undefined}
          className={`group flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 transition-colors ${
            currentScreen === 'visited'
              ? 'text-primary font-semibold [&>div]:bg-secondary-container [&>div]:text-on-secondary-fixed'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          data-path="visited-places"
          href="#visited-places"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('visited', 'none');
          }}
        >
          <div className="relative w-14 h-8 flex items-center justify-center rounded-full mb-1 transition-colors">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
            <span className="absolute top-0.5 right-2 min-w-[16px] h-4 px-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[10px] leading-4 text-center font-bold">
              {visitedCount}
            </span>
          </div>
          <span className="font-label-md text-label-md transition-colors">Відвідані</span>
        </a>

        {/* User Profile: xpath: //nav//a[@data-path='user-profile'] -> goes to profile with none transition */}
        <a
          aria-current={currentScreen === 'profile' ? 'page' : undefined}
          className={`group flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 transition-colors ${
            currentScreen === 'profile'
              ? 'text-primary font-semibold [&>div]:bg-secondary-container [&>div]:text-on-secondary-fixed'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          data-path="user-profile"
          href="#user-profile"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('profile', 'none');
          }}
        >
          <div className="w-14 h-8 flex items-center justify-center rounded-full mb-1 transition-colors">
            <span className="material-symbols-outlined text-[24px]">person</span>
          </div>
          <span className="font-label-md text-label-md transition-colors">Профіль</span>
        </a>
      </div>
    </nav>
  );
};
