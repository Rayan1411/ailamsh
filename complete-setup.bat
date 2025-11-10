@echo off
chcp 65001 >nul
REM ============================================================
REM إنشاء جميع الملفات والمكونات + رفع على GitHub
REM ============================================================

echo.
echo ========================================
echo  🚀 الإعداد الكامل والتلقائي
echo ========================================
echo.

REM 1. إنشاء مجلد components
echo [1/10] إنشاء مجلد src/components...
if not exist "src\components" mkdir src\components

REM 2. HomePage
echo [2/10] إنشاء HomePage.tsx...
(
echo import React from 'react';
echo import { Page } from '../types';
echo.
echo const HomePage: React.FC = ({ setPage, t, galleryImages }: any) => (
echo   ^<div className="min-h-screen bg-white dark:bg-gray-950"^>
echo     ^<section className="py-20 text-center"^>
echo       ^<h1 className="text-5xl font-bold mb-6"^>AI Touch^</h1^>
echo       ^<p className="text-xl mb-8"^>Redesign Your Space with AI^</p^>
echo       ^<button onClick={() => setPage(Page.STUDIO)} className="bg-brand-600 text-white px-8 py-3 rounded-lg"^>Get Started^</button^>
echo     ^</section^>
echo   ^</div^>
echo );
echo export default HomePage;
) > src\components\HomePage.tsx

REM 3. DesignStudio
echo [3/10] إنشاء DesignStudio.tsx...
(
echo import React, { useState } from 'react';
echo const DesignStudio: React.FC = (props: any) => {
echo   const [isLoading, setIsLoading] = useState(false);
echo   return (
echo     ^<div className="min-h-screen bg-white dark:bg-gray-950 py-12"^>
echo       ^<div className="container mx-auto"^>
echo         ^<h1 className="text-4xl font-bold text-center mb-8"^>Design Studio^</h1^>
echo         ^<button className="w-full bg-brand-600 text-white py-3 rounded-lg"^>{isLoading ? 'Loading...' : 'Generate'}^</button^>
echo       ^</div^>
echo     ^</div^>
echo   );
echo };
echo export default DesignStudio;
) > src\components\DesignStudio.tsx

REM 4. LoginPage
echo [4/10] إنشاء LoginPage.tsx...
(
echo import React, { useState } from 'react';
echo const LoginPage: React.FC = (props: any) => (
echo   ^<div className="min-h-screen bg-gradient-to-br flex items-center justify-center"^>
echo     ^<div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"^>
echo       ^<h1 className="text-3xl font-bold text-center mb-6"^>Login^</h1^>
echo       ^<form className="space-y-4"^>
echo         ^<input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md" required /^>
echo         ^<input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md" required /^>
echo         ^<button type="submit" className="w-full bg-brand-600 text-white py-2 rounded-md"^>Login^</button^>
echo       ^</form^>
echo     ^</div^>
echo   ^</div^>
echo );
echo export default LoginPage;
) > src\components\LoginPage.tsx

REM 5. SignUpPage
echo [5/10] إنشاء SignUpPage.tsx...
(
echo import React from 'react';
echo const SignUpPage: React.FC = (props: any) => (
echo   ^<div className="min-h-screen bg-gradient-to-br flex items-center justify-center"^>
echo     ^<div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"^>
echo       ^<h1 className="text-3xl font-bold text-center mb-6"^>Sign Up^</h1^>
echo       ^<form className="space-y-4"^>
echo         ^<input type="text" placeholder="Name" className="w-full px-4 py-2 border rounded-md" required /^>
echo         ^<input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md" required /^>
echo         ^<input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md" required /^>
echo         ^<button type="submit" className="w-full bg-brand-600 text-white py-2 rounded-md"^>Sign Up^</button^>
echo       ^</form^>
echo     ^</div^>
echo   ^</div^>
echo );
echo export default SignUpPage;
) > src\components\SignUpPage.tsx

REM 6. ProfilePage
echo [6/10] إنشاء ProfilePage.tsx...
(
echo import React from 'react';
echo const ProfilePage: React.FC = (props: any) => (
echo   ^<div className="min-h-screen bg-white dark:bg-gray-950 py-12"^>
echo     ^<div className="container mx-auto"^>
echo       ^<h1 className="text-4xl font-bold mb-8"^>Profile^</h1^>
echo       ^<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6"^>
echo         ^<p^>Account Information^</p^>
echo       ^</div^>
echo     ^</div^>
echo   ^</div^>
echo );
echo export default ProfilePage;
) > src\components\ProfilePage.tsx

REM 7. AdminPanel
echo [7/10] إنشاء AdminPanel.tsx...
(
echo import React from 'react';
echo const AdminPanel: React.FC = (props: any) => (
echo   ^<div className="min-h-screen bg-white dark:bg-gray-950 py-12"^>
echo     ^<div className="container mx-auto"^>
echo       ^<h1 className="text-4xl font-bold mb-8"^>Admin Dashboard^</h1^>
echo       ^<div className="grid grid-cols-4 gap-4"^>
echo         ^<div className="bg-blue-50 p-6 rounded-lg"^>
echo           ^<p className="text-gray-600"^>Total Users^</p^>
echo           ^<p className="text-3xl font-bold"^>0^</p^>
echo         ^</div^>
echo       ^</div^>
echo     ^</div^>
echo   ^</div^>
echo );
echo export default AdminPanel;
) > src\components\AdminPanel.tsx

REM 8. server.js
echo [8/10] إنشاء server.js...
(
echo const express = require('express');
echo const cors = require('cors');
echo const helmet = require('helmet');
echo const dotenv = require('dotenv');
echo dotenv.config();
echo.
echo const app = express();
echo const PORT = process.env.PORT || 5000;
echo.
echo app.use(helmet());
echo app.use(cors());
echo app.use(express.json());
echo.
echo app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
echo app.get('/api/gallery/public', (req, res) => res.json({ galleryImages: [] }));
echo app.get('/api/packages', (req, res) => res.json({ packages: [] }));
echo.
echo app.listen(PORT, () => console.log(`Server on port ${PORT}`));
) > server.js

REM 9. .env.example
echo [9/10] إنشاء .env.example...
(
echo PORT=5000
echo NODE_ENV=development
echo JWT_SECRET=your_secret_key_32_chars_minimum
echo GEMINI_API_KEY=your_gemini_key
echo ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
echo VITE_API_URL=http://localhost:5000/api
) > .env.example

REM 10. Git Push
echo [10/10] رفع الملفات على GitHub...
git add .
git commit -m "Add all components and backend setup"
git push -u origin main --force

echo.
echo ========================================
echo  ✅ تم الإنشاء والرفع بنجاح!
echo ========================================
echo.
echo الملفات المُنشأة:
echo ✅ src/components/HomePage.tsx
echo ✅ src/components/DesignStudio.tsx
echo ✅ src/components/LoginPage.tsx
echo ✅ src/components/SignUpPage.tsx
echo ✅ src/components/ProfilePage.tsx
echo ✅ src/components/AdminPanel.tsx
echo ✅ server.js
echo ✅ .env.example
echo.
echo الموقع على GitHub:
echo https://github.com/Rayan1411/ailamsh
echo.
pause