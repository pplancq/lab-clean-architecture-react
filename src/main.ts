(async () => {
  if (import.meta.env.FRONT_MOCK_ENABLE === 'true') {
    const { worker } = await import('@Mocks/browser');
    await worker.start({
      onUnhandledRequest: 'warn',
    });
  }

  const { default: AppHTMLElement } = await import('./app/AppHTMLElement');
  customElements.define('app-react', AppHTMLElement);
})();
