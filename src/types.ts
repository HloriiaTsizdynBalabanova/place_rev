export type ScreenName = 'visited' | 'profile' | 'details' | 'home' | 'catalog';

export type TransitionType = 'push' | 'push_back' | 'none';

export type DeviceMode = 'responsive' | 'mobile' | 'tablet' | 'desktop';

export interface PlaceReviewItem {
  id: string;
  name: string;
  category: string;
  categoryType: 'cafe' | 'restaurant' | 'bookstore' | 'other';
  date: string;
  rating: number;
  personalRating: number;
  note: string;
  photos: string[];
  photoCount: number;
  address?: string;
  reviewCount?: number;
  openingHours?: string;
  tags?: string[];
  description?: string;
  distance?: string;
  criteria?: {
    coffee?: string;
    atmosphere?: string;
    wifi?: string;
  };
  privateNote?: string;
  personalPhotos?: {
    id: string;
    url: string;
    title: string;
    time: string;
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  visitedCount: number;
  photosCount: number;
  averageRating: number;
}
