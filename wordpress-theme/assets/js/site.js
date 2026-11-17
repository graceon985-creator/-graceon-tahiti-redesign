(() => {
  'use strict';
  const toggle = document.querySelector('.iot-menu-toggle');
  const nav = document.querySelector('#iot-primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }


  let deferredInstallPrompt = null;
  const installButton = document.querySelector('[data-iot-install]');
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (installButton) installButton.hidden = false;
  });
  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      installButton.hidden = true;
    });
  }
  window.addEventListener('appinstalled', () => {
    if (installButton) installButton.hidden = true;
    deferredInstallPrompt = null;
  });

  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-gtc-save]');
    if (!button || !window.IOT_SITE || !IOT_SITE.ajaxUrl) return;
    event.preventDefault();
    if (button.disabled) return;
    button.disabled = true;
    const previous = button.textContent;
    const body = new FormData();
    body.append('action', 'gtc_toggle_journey_item');
    body.append('nonce', IOT_SITE.journeyNonce || '');
    body.append('post_id', button.dataset.postId || '');
    try {
      const response = await fetch(IOT_SITE.ajaxUrl, { method: 'POST', credentials: 'same-origin', body });
      const result = await response.json();
      if (!result.success) throw new Error((result.data && result.data.message) || 'Unable to save this place.');
      const saved = Boolean(result.data.saved);
      button.dataset.saved = saved ? '1' : '0';
      button.setAttribute('aria-pressed', saved ? 'true' : 'false');
      button.textContent = saved ? 'SAVED TO MY JOURNEY ✓' : 'SAVE TO MY JOURNEY ↗';
    } catch (error) {
      button.textContent = 'COULD NOT SAVE — TRY AGAIN';
      window.setTimeout(() => { button.textContent = previous; }, 2200);
    } finally {
      button.disabled = false;
    }
  });
})();
