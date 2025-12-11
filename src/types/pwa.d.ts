declare interface Window {
  __deferredPWAInstall?: any;
}

declare module 'virtual:pwa-register' {
  export function registerSW(opts?: any): { update(): Promise<void> };
}
