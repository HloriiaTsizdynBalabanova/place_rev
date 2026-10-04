import React from 'react';
import { ScreenName, TransitionType } from '../types';

interface HeaderProps {
  screen: ScreenName;
  onNavigate: (screen: ScreenName, transition: TransitionType) => void;
  avatarUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ screen, onNavigate, avatarUrl }) => {
  const isDetails = screen === 'details';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe border-b border-outline-variant/20">
      <div className={`h-16 flex items-center justify-between ${isDetails ? 'px-space-sm' : 'px-margin'} max-w-7xl mx-auto`}>
        {isDetails ? (
          <div className="flex items-center gap-space-xs min-w-0">
            <button
              aria-label="Назад"
              onClick={() => onNavigate('visited', 'push_back')}
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <img
              alt="Place_rev Logo"
              className="h-7 w-auto object-contain flex-shrink-0 ml-1"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VSn1aDqNOmujlYuNKJJusckEboXBo4bpuDDviBDQuUjblqlt3__Z5MixcHro4_E7W9Do0Dt1BHC5gnuMyRbz8y6HDaajrkSqzMDrTCX4pa0G5NkfBmxOpGlxYG3mJLhwbT7v7nHKcMRkEqrbn7q92PrMxrR7FOR7CAMjSr56vnuetz9bQoEhrqeRNChZxGWPqVdBCM07qcybE4thnHNO9qS-VuyHEeMGidJQDsE__vhjqIeK95SlQ9Sok"
            />
            <div className="flex flex-col min-w-0 ml-1">
              <h1 className="font-title-md text-title-md text-on-surface font-semibold truncate">Place Details</h1>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                Place_rev • Лабораторний проект
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-space-sm min-w-0">
            <img
              alt="Place_rev Logo"
              className="h-8 w-auto object-contain flex-shrink-0 cursor-pointer"
              onClick={() => onNavigate('visited', 'none')}
              src="https://lh3.googleusercontent.com/aida/AEtjO1VSn1aDqNOmujlYuNKJJusckEboXBo4bpuDDviBDQuUjblqlt3__Z5MixcHro4_E7W9Do0Dt1BHC5gnuMyRbz8y6HDaajrkSqzMDrTCX4pa0G5NkfBmxOpGlxYG3mJLhwbT7v7nHKcMRkEqrbn7q92PrMxrR7FOR7CAMjSr56vnuetz9bQoEhrqeRNChZxGWPqVdBCM07qcybE4thnHNO9qS-VuyHEeMGidJQDsE__vhjqIeK95SlQ9Sok"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span
                  className="font-title-md text-title-md text-on-surface font-semibold tracking-tight truncate cursor-pointer"
                  onClick={() => onNavigate('visited', 'none')}
                >
                  Place_rev
                </span>
                <span className="hidden sm:inline-block font-label-sm text-label-sm text-outline-variant">•</span>
                <span className="hidden sm:inline-block font-title-sm text-title-sm text-primary font-medium truncate">
                  {screen === 'profile' ? 'User Profile' : 'Visited Places'}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                Лабораторний проект
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-space-sm flex-shrink-0">
          {isDetails ? (
            <button
              aria-label="Більше дій"
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">more_vert</span>
            </button>
          ) : (
            <button
              aria-label="Search"
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
          )}

          {/* Profile Click Trigger: xpath: //header//img[@alt='Profile']/parent::div -> transitions to Profile with push transition */}
          <div
            className="w-11 h-11 flex items-center justify-center cursor-pointer rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
            role="button"
            tabIndex={0}
            aria-label="Перейти до профілю користувача"
            onClick={() => onNavigate('profile', 'push')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onNavigate('profile', 'push');
              }
            }}
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
              src={avatarUrl}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
