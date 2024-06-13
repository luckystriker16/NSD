echo Installiere NSD Lokal
@echo off
setlocal

set "PACKAGE_NAME=http-server"

:: Überprüfen, ob das Paket installiert ist
echo Überprüfe, ob %PACKAGE_NAME% installiert ist...
npm list -g --depth=0 | findstr /i /c:"%PACKAGE_NAME%@"
if %ERRORLEVEL% neq 0 (
    echo %PACKAGE_NAME% ist nicht installiert. Installation wird gestartet...
    npm install -g %PACKAGE_NAME%
) else (
    echo %PACKAGE_NAME% ist bereits installiert.
)

cd "C:\Users\ole\Documents\GitHub\NSD\"

:: Starte http-server und leite die Ausgabe in eine Datei um
start "" cmd /c "http-server > server_output.txt 2>&1"

:: Warte kurz, damit der Server Zeit hat, zu starten
timeout /t 3 /nobreak >nul

:: Öffne die Website im Standardbrowser
start http://localhost:8080/nicknsd/nicknsd.html

endlocal
pause