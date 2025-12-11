This folder is a placeholder for Capacitor iOS platform files.

To generate platform projects run from the project root after installing dependencies:

```powershell
npm run build:web
npx cap add ios
npx cap sync ios
npx cap open ios
```

Building for iOS requires macOS and Xcode to produce signed .ipa files; you can export web assets or use cloud build services.
