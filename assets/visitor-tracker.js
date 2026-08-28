(() => {
  const productionHosts = new Set(['torotensor.com', 'www.torotensor.com']);
  if (!productionHosts.has(window.location.hostname.toLowerCase())) return;
  if (document.getElementById('mapmyvisitors')) return;

  const container = document.createElement('div');
  container.setAttribute('id', 'visitor-tracker');
  container.setAttribute('aria-hidden', 'true');
  Object.assign(container.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    opacity: '0.01',
    pointerEvents: 'none',
    zIndex: '-1'
  });

  const tracker = document.createElement('script');
  tracker.type = 'text/javascript';
  tracker.id = 'mapmyvisitors';
  tracker.src = 'https://mapmyvisitors.com/map.js?d=j4bX_U1ChVDtaTwglQ__PJvYC2tY2tlrw3RCrtNvJhY&cl=ffffff&w=a';
  tracker.async = true;

  container.appendChild(tracker);
  document.body.appendChild(container);
})();
