export enum Language {
  EN = 'en',
  AR = 'ar',
}

export enum Page {
  HOME = 'home',
  STUDIO = 'studio',
  LOGIN = 'login',
  SIGNUP = 'signup',
  DASHBOARD = 'dashboard',
  PROFILE = 'profile',
}

export type Package = {
  id: number;
  name: string;
  imageCount: number;
  price: number;
  visible: boolean;
};

export type Transaction = {
  id: string;
  userEmail: string;
  packageName: string;
  packageId: number;
  amount: number;
  date: string; // ISO string
  status: 'completed' | 'chargeback';
};

export type User = {
  id: number;
  name: string;
  email: string;
  country: string;
  isAdmin: boolean;
  registrationDate: string;
  password?: string; // Should not be sent to client
  subscriptionPackageId?: number;
  imageCredits?: number;
  purchaseHistory?: Transaction[];
  profilePictureUrl?: string;
};

export type GalleryImage = {
  id: number;
  beforeSrc: string;
  afterSrc: string;
};

export type Translations = {
  [key: string]: {
    [lang in Language]: string;
  };
};