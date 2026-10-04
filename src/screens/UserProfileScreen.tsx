import React, { useState } from 'react';
import { UserProfile, ScreenName, TransitionType } from '../types';

interface UserProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onNavigate: (screen: ScreenName, transition: TransitionType) => void;
  isDark: boolean;
  onToggleTheme: (dark: boolean) => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; icon: string } | null>(null);

  // Form states
  const [firstName, setFirstName] = useState(profile.name.split(' ')[0] || 'Олена');
  const [lastName, setLastName] = useState(profile.name.split(' ')[1] || 'Ковальчук');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const triggerToast = (text: string, icon = 'check_circle') => {
    setToastMessage({ text, icon });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 2800);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: `${firstName} ${lastName}`.trim() });
    setIsEditModalOpen(false);
    triggerToast('Дані профілю збережено');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      triggerToast('Пароль має містити щонайменше 8 символів', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setIsPasswordModalOpen(false);
    triggerToast('Пароль успішно оновлено');
  };

  const handleAvatarChange = () => {
    triggerToast('Оберіть нове фото для завантаження', 'add_a_photo');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    triggerToast('Вихід з облікового запису...', 'logout');
  };

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="flex flex-col w-full px-margin pb-space-xl max-w-2xl mx-auto">
        {/* Breadcrumb & Top Bar */}
        <div className="flex items-center justify-between py-space-sm mb-space-xs">
          <nav aria-label="Хлібні крихти" className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
            <button
              onClick={() => onNavigate('visited', 'push_back')}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Головна</span>
            </button>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-on-surface font-semibold">Профіль користувача</span>
          </nav>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
            title="Довідка"
            type="button"
            onClick={() => triggerToast('Лабораторний проект Place_rev версії 1.0', 'info')}
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>
        </div>

        {/* Profile Identity Card */}
        <section className="flex flex-col items-center bg-surface-container-low rounded-xl p-space-lg shadow-sm relative overflow-hidden mb-space-md border border-outline-variant/15">
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-secondary-container/40 pointer-events-none blur-2xl"></div>
          <div className="absolute -bottom-14 -left-14 w-32 h-32 rounded-full bg-primary-fixed/20 pointer-events-none blur-2xl"></div>

          {/* Avatar with active camera badge */}
          <div className="relative mb-space-md group">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm bg-surface-container ring-4 ring-primary/10">
              <img
                alt={profile.name}
                className="w-full h-full object-cover"
                src={profile.avatarUrl}
              />
            </div>
            <button
              aria-label="Змінити фото профілю"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
              id="change-photo-btn"
              title="Змінити фото (FR-14)"
              type="button"
              onClick={handleAvatarChange}
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
          </div>

          {/* User Details */}
          <h1 className="font-headline-sm text-headline-sm text-on-surface text-center font-bold tracking-tight">
            {profile.name}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-outline">mail</span>
            <span>{profile.email}</span>
          </p>

          {/* Student Status Pill */}
          <div className="mt-space-sm inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-medium">
            <span className="material-symbols-outlined text-[16px] text-primary">school</span>
            <span>{profile.role}</span>
          </div>
        </section>

        {/* Statistics Mosaic Grid */}
        <section aria-label="Статистика активності" className="grid grid-cols-3 gap-space-xs mb-space-md">
          {/* Stat 1 */}
          <div className="bg-surface-container rounded-xl p-space-sm flex flex-col items-center justify-center text-center">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface leading-none">
              {profile.visitedCount}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Відвіданих</span>
          </div>

          {/* Stat 2 */}
          <div className="bg-surface-container rounded-xl p-space-sm flex flex-col items-center justify-center text-center">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">photo_library</span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface leading-none">
              {profile.photosCount}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Фотографій</span>
          </div>

          {/* Stat 3 */}
          <div className="bg-surface-container rounded-xl p-space-sm flex flex-col items-center justify-center text-center">
            <div className="w-7 h-7 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface leading-none">
              {profile.averageRating}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Сер. оцінка</span>
          </div>
        </section>

        {/* Profile Management Actions */}
        <section className="bg-surface-container-low rounded-xl p-space-md shadow-sm mb-space-md border border-outline-variant/15">
          <h2 className="font-title-sm text-title-sm font-bold text-on-surface mb-space-sm flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">manage_accounts</span>
            <span>Керування обліковим записом</span>
          </h2>
          <div className="flex flex-col gap-space-xs">
            {/* Edit Profile Trigger */}
            <button
              className="w-full flex items-center justify-between p-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-left group cursor-pointer"
              id="btn-open-edit-profile"
              type="button"
              onClick={() => setIsEditModalOpen(true)}
            >
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm font-semibold text-on-surface">Редагувати профіль</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Зміна імені та прізвища (FR-04)</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-outline group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            {/* Change Password Trigger */}
            <button
              className="w-full flex items-center justify-between p-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-left group cursor-pointer"
              id="btn-open-change-password"
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm font-semibold text-on-surface">Змінити пароль</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Поточний та новий пароль (FR-05)</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-outline group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>
          </div>
        </section>

        {/* Theme Settings Section */}
        <section className="bg-surface-container-low rounded-xl p-space-md shadow-sm mb-space-md border border-outline-variant/15">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px] text-primary">palette</span>
              <h2 className="font-title-sm text-title-sm font-bold text-on-surface">Налаштування теми</h2>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-medium px-2 py-0.5 rounded-full bg-secondary-container">
              {isDark ? 'Темна' : 'Світла'}
            </span>
          </div>

          {/* Theme Switch Pill Segment */}
          <div className="grid grid-cols-2 p-1 bg-surface-container rounded-lg gap-1">
            <button
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-title-sm text-title-sm transition-all cursor-pointer ${
                !isDark
                  ? 'bg-surface text-on-surface font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
              id="theme-light-btn"
              type="button"
              onClick={() => {
                onToggleTheme(false);
                triggerToast('Встановлено світлу тему', 'light_mode');
              }}
            >
              <span
                className="material-symbols-outlined text-[18px] text-tertiary"
                style={{ fontVariationSettings: !isDark ? "'FILL' 1" : "'FILL' 0" }}
              >
                light_mode
              </span>
              <span>Світла тема</span>
            </button>

            <button
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-title-sm text-title-sm transition-all cursor-pointer ${
                isDark
                  ? 'bg-surface text-on-surface font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
              id="theme-dark-btn"
              type="button"
              onClick={() => {
                onToggleTheme(true);
                triggerToast('Встановлено темну тему', 'dark_mode');
              }}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: isDark ? "'FILL' 1" : "'FILL' 0" }}
              >
                dark_mode
              </span>
              <span>Темна тема</span>
            </button>
          </div>
        </section>

        {/* Security & Session (FR-15) */}
        <section className="bg-surface-container-low rounded-xl p-space-md shadow-sm border border-outline-variant/15">
          <h2 className="font-title-sm text-title-sm font-bold text-on-surface mb-space-xs flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px] text-outline">security</span>
            <span>Безпека та сесія</span>
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Активна сесія з авторизацією через університетський домен LNU.
          </p>

          <div className="relative">
            <button
              className="w-full h-11 px-6 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-all font-title-sm text-title-sm font-semibold flex items-center justify-center gap-2 active:scale-98 shadow-sm cursor-pointer"
              id="logout-btn"
              type="button"
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Вийти з акаунта</span>
            </button>

            {showLogoutConfirm && (
              <div
                className="mt-2 p-space-sm rounded-lg bg-inverse-surface text-inverse-on-surface shadow-lg text-center animate-fade-in z-20"
                id="logout-tooltip"
              >
                <p className="font-body-sm text-body-sm mb-space-xs">Завершити поточну лабораторну сесію?</p>
                <div className="flex items-center justify-center gap-space-sm">
                  <button
                    className="px-3 py-1 rounded bg-surface-container-highest text-on-surface font-label-md text-label-md cursor-pointer"
                    id="cancel-logout"
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    Скасувати
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-error text-on-error font-label-md text-label-md font-bold cursor-pointer"
                    id="confirm-logout"
                    type="button"
                    onClick={handleLogout}
                  >
                    Так, вийти
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Edit Profile Modal Dialog (FR-04) */}
        {isEditModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-margin"
            id="edit-profile-modal"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditModalOpen(false);
            }}
          >
            <div className="bg-surface-container-lowest w-full max-w-md rounded-t-2xl sm:rounded-2xl p-space-lg shadow-xl flex flex-col animate-slide-up">
              <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">edit_note</span>
                  <h3 className="font-title-lg text-title-lg font-bold text-on-surface">Редагувати профіль</h3>
                </div>
                <button
                  className="close-modal-btn w-8 h-8 rounded-full flex items-center justify-center bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form className="flex flex-col gap-space-md" id="edit-profile-form" onSubmit={handleSaveProfile}>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="input-first-name">
                    Ім&apos;я
                  </label>
                  <input
                    className="h-12 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg outline-none focus:bg-surface-container-lowest border border-outline-variant/20 focus:border-primary transition-colors"
                    id="input-first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="input-last-name">
                    Прізвище
                  </label>
                  <input
                    className="h-12 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg outline-none focus:bg-surface-container-lowest border border-outline-variant/20 focus:border-primary transition-colors"
                    id="input-last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-space-sm mt-space-sm">
                  <button
                    className="close-modal-btn h-10 px-4 rounded-lg text-primary hover:bg-surface-container font-label-lg text-label-lg font-semibold cursor-pointer"
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Скасувати
                  </button>
                  <button
                    className="h-10 px-6 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-bold shadow-xs cursor-pointer"
                    id="save-profile-btn"
                    type="submit"
                  >
                    Зберегти зміни
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal Dialog (FR-05) */}
        {isPasswordModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-margin"
            id="change-password-modal"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsPasswordModalOpen(false);
            }}
          >
            <div className="bg-surface-container-lowest w-full max-w-md rounded-t-2xl sm:rounded-2xl p-space-lg shadow-xl flex flex-col animate-slide-up">
              <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
                  <h3 className="font-title-lg text-title-lg font-bold text-on-surface">Зміна пароля</h3>
                </div>
                <button
                  className="close-pw-modal-btn w-8 h-8 rounded-full flex items-center justify-center bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form className="flex flex-col gap-space-md" id="change-password-form" onSubmit={handleSavePassword}>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="input-current-password">
                    Поточний пароль
                  </label>
                  <input
                    className="h-12 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg outline-none focus:bg-surface-container-lowest border border-outline-variant/20 focus:border-primary transition-colors"
                    id="input-current-password"
                    placeholder="Введіть старий пароль"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant font-medium" htmlFor="input-new-password">
                    Новий пароль
                  </label>
                  <input
                    className="h-12 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg outline-none focus:bg-surface-container-lowest border border-outline-variant/20 focus:border-primary transition-colors"
                    id="input-new-password"
                    placeholder="Мінімум 8 символів"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-space-sm mt-space-sm">
                  <button
                    className="close-pw-modal-btn h-10 px-4 rounded-lg text-primary hover:bg-surface-container font-label-lg text-label-lg font-semibold cursor-pointer"
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                  >
                    Скасувати
                  </button>
                  <button
                    className="h-10 px-6 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-bold shadow-xs cursor-pointer"
                    id="save-password-btn"
                    type="submit"
                  >
                    Оновити пароль
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delight Toast Notification */}
        {toastMessage && (
          <div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md shadow-lg flex items-center gap-2 transition-all transform animate-in fade-in slide-in-from-bottom-2"
            id="status-toast"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-fixed" id="toast-icon">
              {toastMessage.icon}
            </span>
            <span id="toast-message">{toastMessage.text}</span>
          </div>
        )}
      </div>
    </main>
  );
};
