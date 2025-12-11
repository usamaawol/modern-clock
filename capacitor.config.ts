import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wakewise.app',
  appName: 'WakeWise',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    cleartext: true
  }
};

export default config;
