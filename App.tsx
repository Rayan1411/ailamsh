import React, { useState, useCallback, useEffect, createContext, useContext, useRef } from 'react';
import { Language, Page, User, GalleryImage, Package } from './types';
import { translations } from './constants';
import HomePage from './components/HomePage';
import DesignStudio from './components/DesignStudio';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';
import * as apiService from './services/apiService';

// Theme Context
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === Language.AR) return Language.AR;
    return Language.EN;
  };
  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  const t = useCallback((key: string, ...args: any[]) => {
    let translation = translations[key]?.[language] || key;
    if (args.length) {
      args.forEach((arg, index) => {
        translation = translation.replace(`{${index}}`, String(arg));
      });
    }
    return translation;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
    const fontClass = language === Language.AR ? 'font-cairo' : 'font-sans';
    document.body.classList.add(fontClass);
    return () => document.body.classList.remove(fontClass);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const UserMenu: React.FC<{
  user: User;
  onLogout: () => void;
  setPage: (page: Page) => void;
  t: (key: string, ...args: any[]) => string;
}> = ({ user, onLogout, setPage, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
        <span className="text-gray-600 dark:text-gray-300 text-sm hidden sm:block hover:text-gray-900 dark:hover:text-white transition-colors">{t('welcome')}, {user.name}</span>
        {user.profilePictureUrl ? (
          <img src={user.profilePictureUrl} alt={user.name} className="w-9 h-9 rounded-full border-2 border-gray-300 dark:border-gray-700 hover:border-brand-500 transition-colors" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white border-2 border-brand-500">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-800 z-50">
          <button
            onClick={() => { setPage(Page.PROFILE); setIsOpen(false); }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          >{t('profile')}</button>
          {user.isAdmin && (
            <button
              onClick={() => { setPage(Page.DASHBOARD); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            >{t('dashboard')}</button>
          )}
          <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
          <button
            onClick={() => { onLogout(); setIsOpen(false); }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-300"
          >{t('logout')}</button>
        </div>
      )}
    </div>
  );
};

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
            )}
        </button>
    );
};

const Header: React.FC<{
  setPage: (page: Page) => void;
  currentUser: User | null;
  onLogout: () => void;
}> = ({ setPage, currentUser, onLogout }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === Language.EN ? Language.AR : Language.EN);
  };

  return (
    <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage(Page.HOME)}>
          <svg className="w-8 h-8 text-brand-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.06,9.94l-1.06,1.06L15.88,14H7.93c-2.76,0-5-2.24-5-5s2.24-5,5-5h1.95v2H7.93c-1.66,0-3,1.34-3,3s1.34,3,3,3h7.95l-2.88-2.88,1.06-1.06,4.5,4.5Z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('aiTouch')}</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setPage(Page.HOME)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">{t('home')}</button>
            <button onClick={() => setPage(Page.STUDIO)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">{t('designStudio')}</button>
             {currentUser && !currentUser.isAdmin && (
               <button onClick={() => setPage(Page.PROFILE)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">{t('subscriptions')}</button>
            )}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={toggleLanguage} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-semibold">
            {language === Language.EN ? 'العربية' : 'English'}
          </button>
          {currentUser ? (
            <UserMenu user={currentUser} onLogout={onLogout} setPage={setPage} t={t} />
          ) : (
             <button onClick={() => setPage(Page.LOGIN)} className="bg-brand-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-brand-500 transition-colors text-sm">
                {t('login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const AppContent: React.FC<{
      page: Page;
      currentUser: User | null;
      setPage: (page: Page) => void;
      onLogout: () => void;
      handleLoginSuccess: (token: string) => void;
      galleryImages: GalleryImage[];
      packages: Package[];
      handleImageGenerated: () => void;
      setCurrentUser: (user: User) => void;
      isLoading: boolean;
  }> = ({ page, currentUser, setPage, onLogout, handleLoginSuccess, galleryImages, packages, handleImageGenerated, setCurrentUser, isLoading }) => {
    const { t } = useLanguage();

    const renderPage = () => {
      if (isLoading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-10 w-10 text-brand-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2">Loading...</p>
                </div>
            </div>
        );
      }

      const protectedPages: Page[] = [Page.STUDIO, Page.PROFILE, Page.DASHBOARD];
      if (!currentUser && protectedPages.includes(page)) {
        // Redirect to login if a protected page is accessed while logged out
        return <LoginPage setPage={setPage} handleLoginSuccess={handleLoginSuccess} t={t} />;
      }
      
      if (currentUser && (page === Page.LOGIN || page === Page.SIGNUP)) {
          // If a logged-in user somehow lands on login/signup, show them the homepage
          return <HomePage setPage={setPage} t={t} galleryImages={galleryImages} />;
      }

      switch (page) {
        case Page.HOME:
          return <HomePage setPage={setPage} t={t} galleryImages={galleryImages} />;
        case Page.LOGIN:
          return <LoginPage setPage={setPage} handleLoginSuccess={handleLoginSuccess} t={t} />;
        case Page.SIGNUP:
           return <SignUpPage setPage={setPage} handleLoginSuccess={handleLoginSuccess} t={t} />;
        case Page.STUDIO:
          return <DesignStudio t={t} currentUser={currentUser!} setCurrentUser={setCurrentUser} setPage={setPage} onImageGenerated={handleImageGenerated} />;
        case Page.DASHBOARD:
          if (currentUser?.isAdmin) {
            return <AdminPanel t={t} />;
          }
          return <HomePage setPage={setPage} t={t} galleryImages={galleryImages} />;
        case Page.PROFILE:
          return <ProfilePage currentUser={currentUser!} setCurrentUser={setCurrentUser} t={t} packages={packages} />;
        default:
          return <HomePage setPage={setPage} t={t} galleryImages={galleryImages} />;
      }
    };
    
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200">
        <Header currentUser={currentUser} setPage={setPage} onLogout={onLogout} />
        <main className="flex-grow">
          {renderPage()}
        </main>
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="container mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-600">
            &copy; {new Date().getFullYear()} AI Touch. {t('heroTitle')}
          </div>
        </footer>
      </div>
    );
}

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ai_touch_token'));
  const [isLoading, setIsLoading] = useState(true);
  
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('ai_touch_theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('ai_touch_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Effect to load initial data based on token
  useEffect(() => {
    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            // Fetch public gallery images for everyone
            const { galleryImages } = await apiService.getPublicGallery();
            setGalleryImages(galleryImages);

            // If a token exists, try to fetch user data
            if (token) {
                const data = await apiService.getInitialData();
                setCurrentUser(data.user);
                setPackages(data.packages);
                if(data.user.isAdmin) {
                    setPage(Page.DASHBOARD);
                } else {
                    setPage(Page.HOME);
                }
            } else {
                setPage(Page.HOME);
            }
        } catch (error) {
            console.error("Failed to load initial data:", error);
            // If token is invalid, log out
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    };
    loadInitialData();
  }, [token]);

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('ai_touch_token', newToken);
    setToken(newToken); // This will trigger the useEffect to load user data
  };

  const handleLogout = () => {
    localStorage.removeItem('ai_touch_token');
    setToken(null);
    setCurrentUser(null);
    setPage(Page.LOGIN);
  };
  
  // This is now just a counter on the backend, but we can pass a function to update UI if needed
  const handleImageGenerated = () => {
    console.log("Image generation was successful. Stats updated on the backend.");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <LanguageProvider>
            <AppContent
                page={page}
                currentUser={currentUser}
                setPage={setPage}
                onLogout={handleLogout}
                handleLoginSuccess={handleLoginSuccess}
                galleryImages={galleryImages}
                packages={packages}
                handleImageGenerated={handleImageGenerated}
                setCurrentUser={setCurrentUser}
                isLoading={isLoading}
            />
        </LanguageProvider>
    </ThemeContext.Provider>
  );
};

export default App;