/**
 * Vintex CRM - Script injecté dans la page pour intercepter window.open
 * Ce script s'exécute dans le contexte de la page (pas dans le contexte de l'extension)
 * Il intercepte window.open pour capturer l'URL du bordereau PDF
 * Inspiré du script console Vintex
 */

(function() {
  'use strict';

  console.log('[Vintex Injected] Initialisation de l\'interception window.open...');

  // Sauvegarder la vraie fonction window.open
  const realWindowOpen = window.open;

  /**
   * Vérifie si une URL correspond au bordereau d'envoi
   */
  function isShippingLabelUrl(url) {
    return url && (
      url.includes('svc-shipping-labels.s3.eu-central-1.amazonaws.com') ||
      url.includes('svc-shipping-labels.s3')
    );
  }

  /**
   * Surcharge de window.open pour intercepter l'URL du bordereau
   */
  window.open = function(url, name, specs) {
    console.log('[Vintex Injected] window.open appelé avec URL:', url);

    // Si c'est l'URL du bordereau, on la capture
    if (isShippingLabelUrl(url)) {
      console.log('%c[Vintex] URL du bordereau détectée !', 'color: green; font-weight: bold;');
      console.log(url);

      // Envoyer l'URL au content script
      window.postMessage({
        type: 'SHIPPING_LABEL_URL_INTERCEPTED',
        url: url
      }, '*');

      // Empêcher l'ouverture du nouvel onglet pour éviter de polluer la navigation
      // On retourne un objet window factice
      console.log('[Vintex Injected] Ouverture du PDF bloquée (URL capturée)');
      return {
        closed: false,
        close: () => {},
        focus: () => {}
      };
    }

    // Pour les autres URLs, comportement normal
    return realWindowOpen.call(window, url, name, specs);
  };

  console.log('[Vintex Injected] Hook window.open installé avec succès');
})();
