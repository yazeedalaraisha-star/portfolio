@echo off
chcp 65001 >nul
title رفع مشروع البورتفوليو إلى GitHub
echo ========================================================
echo   جاري رفع مستودع البورتفوليو إلى حسابك على GitHub...
echo   Target: https://github.com/yazeedalaraisha-star/portfolio
echo ========================================================
echo.

set PATH=C:\Users\tamee\AppData\Local\Programs\Git\cmd;C:\Users\tamee\AppData\Local\Programs\Git\mingw64\bin;%PATH%

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   [نجاح] تم رفع البورتفوليو إلى GitHub بنجاح وبشكل كامل!
    echo ========================================================
) else (
    echo ========================================================
    echo   [ملاحظة] إذا ظهر خطأ Repository not found:
    echo   يرجى التأكد من إنشاء مستودع باسم portfolio على github.com
    echo   ثم إعادة تشغيل هذا الملف مرة أخرى.
    echo ========================================================
)

echo.
pause
