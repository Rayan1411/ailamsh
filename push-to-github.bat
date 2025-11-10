@echo off
REM ============================================================
REM ملف تلقائي لرفع الملفات على GitHub
REM ============================================================

echo.
echo ========================================
echo  رفع الملفات على GitHub
echo ========================================
echo.

REM 1. سحب التحديثات
echo [1/4] سحب التحديثات من GitHub...
git pull origin main --allow-unrelated-histories
if errorlevel 1 (
    echo خطأ في git pull
    pause
    exit /b 1
)

REM 2. إضافة الملفات
echo.
echo [2/4] إضافة الملفات...
git add .
if errorlevel 1 (
    echo خطأ في git add
    pause
    exit /b 1
)

REM 3. حفظ التغييرات
echo.
echo [3/4] حفظ التغييرات...
git commit -m "Add all files and updates"
if errorlevel 1 (
    echo لا توجد تغييرات جديدة أو حدث خطأ
)

REM 4. رفع الملفات
echo.
echo [4/4] رفع الملفات إلى GitHub...
git push -u origin main
if errorlevel 1 (
    echo خطأ في git push
    pause
    exit /b 1
)

echo.
echo ========================================
echo  ✅ تم بنجاح!
echo  اذهب إلى:
echo  https://github.com/Rayan1411/ailamsh
echo ========================================
echo.
pause