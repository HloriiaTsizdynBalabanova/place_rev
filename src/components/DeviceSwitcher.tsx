import React from 'react';
import { DeviceMode } from '../types';

interface DeviceSwitcherProps {
  currentMode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const DeviceSwitcher: React.FC<DeviceSwitcherProps> = ({
  currentMode,
  onModeChange,
  isDark,
  onToggleTheme,
}) => {
  return (
    <div className="bg-inverse-surface text-inverse-on-surface text-xs py-1.5 px-3 flex items-center justify-between z-[100] sticky top-0 border-b border-outline-variant/30 select-none">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-primary-fixed flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">devices</span>
          <span>Пристрій:</span>
        </span>
        <div className="flex items-center gap-1 bg-surface-container-high/20 p-0.5 rounded-lg">
          <button
            onClick={() => onModeChange('mobile')}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              currentMode === 'mobile'
                ? 'bg-primary text-on-primary font-medium shadow-xs'
                : 'hover:bg-white/10 text-inverse-on-surface'
            }`}
            title="Мобільний телефон (390px)"
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            <span className="hidden sm:inline">Мобільний</span>
          </button>
          <button
            onClick={() => onModeChange('tablet')}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              currentMode === 'tablet'
                ? 'bg-primary text-on-primary font-medium shadow-xs'
                : 'hover:bg-white/10 text-inverse-on-surface'
            }`}
            title="Планшет (768px)"
          >
            <span className="material-symbols-outlined text-[14px]">tablet</span>
            <span className="hidden sm:inline">Планшет</span>
          </button>
          <button
            onClick={() => onModeChange('desktop')}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              currentMode === 'desktop'
                ? 'bg-primary text-on-primary font-medium shadow-xs'
                : 'hover:bg-white/10 text-inverse-on-surface'
            }`}
            title="Десктоп (1200px)"
          >
            <span className="material-symbols-outlined text-[14px]">laptop</span>
            <span className="hidden sm:inline">Десктоп</span>
          </button>
          <button
            onClick={() => onModeChange('responsive')}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              currentMode === 'responsive'
                ? 'bg-primary text-on-primary font-medium shadow-xs'
                : 'hover:bg-white/10 text-inverse-on-surface'
            }`}
            title="Адаптивний екран (100%)"
          >
            <span className="material-symbols-outlined text-[14px]">aspect_ratio</span>
            <span className="hidden sm:inline">Адаптивний</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 text-inverse-on-surface transition-colors"
          title="Перемкнути тему"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="hidden md:inline">{isDark ? 'Світла' : 'Темна'}</span>
        </button>
      </div>
    </div>
  );
};
