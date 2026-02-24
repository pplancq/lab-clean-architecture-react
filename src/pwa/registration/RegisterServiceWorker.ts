/**
 * Register Service Worker for PWA functionality
 * Manual implementation - no libraries, educational transparency
 */
export class RegisterServiceWorker {
  private static registration: ServiceWorkerRegistration;

  private static worker: ServiceWorker | null;

  public static async register(): Promise<void> {
    if (!navigator.serviceWorker) {
      console.warn('[GCM] Service Worker not supported in this browser');
      return;
    }

    if (globalThis.location?.protocol !== 'https:' && globalThis.location?.hostname !== 'localhost') {
      console.warn('[GCM] Service Worker requires HTTPS');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register(
        `/${import.meta.env.FRONT_SERVICE_WORKER_FILE_NAME ?? 'serviceWorker'}.js`,
      );

      console.info('[GCM] Service Worker registered successfully');
      console.info('[GCM] Scope:', this.registration.scope);

      this.registration.addEventListener('updatefound', this.updatefound.bind(this));
    } catch (error) {
      console.error('[GCM] Service Worker registration failed:', error);
    }
  }

  private static updatefound() {
    this.worker = this.registration.installing;
    console.info('[GCM] Service Worker update found');

    if (!this.worker) {
      return;
    }

    this.worker.addEventListener('statechange', this.statechange.bind(this));
  }

  private static statechange() {
    if (this.worker?.state === 'installed' && navigator.serviceWorker.controller) {
      console.info('[GCM] New Service Worker installed, ready to activate');
    }
  }
}
