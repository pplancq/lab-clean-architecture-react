(async () => {
  if (import.meta.env.FRONT_MOCK_ENABLE === 'true') {
    const { worker } = await import('@Mocks/browser');
    await worker.start({
      onUnhandledRequest: 'warn',
    });
  }

  const { default: AppHTMLElement } = await import('@App/AppHTMLElement');
  customElements.define('app-react', AppHTMLElement);

  if (import.meta.env.FRONT_PWA_ENABLED === 'true') {
    const { RegisterServiceWorker } = await import('@Pwa/registration/RegisterServiceWorker');

    window.addEventListener('load', async () => {
      await RegisterServiceWorker.register();
    });
  }
})();
