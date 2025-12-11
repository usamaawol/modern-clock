This folder is a placeholder for Capacitor Android platform files.

To generate platform projects run from the project root after installing dependencies:

```powershell
npm run build:web
npx cap add android
npx cap sync android
npx cap open android
```

If you want to build an APK without Android Studio you can use `npx cap build android` with proper native toolchain, or use CI tools that support building Android packages.
