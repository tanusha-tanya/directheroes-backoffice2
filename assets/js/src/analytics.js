export const init = function (settings) {
  let checksStartedAt;

  var checkingLoadAnalytic = function (event) {
    let ga = window[window.GoogleAnalyticsObject || 'ga'];
    const loadGAHandler = function () {
      ga = window[window.GoogleAnalyticsObject || 'ga'];

      window.dh.gaReady = true;

      window.dh.dhGaEvents.forEach((GaEvent) => {
        sendEventToAll(GaEvent[0], GaEvent[1], GaEvent[2], GaEvent[3]);
      });

      window.dh.dhGaEvents = [];
    };

    if (typeof ga === 'function' && ga.loaded) {
      clearInterval(checkingGAInterval);
      window.removeEventListener('load', checkingLoadAnalytic);
      loadGAHandler();
    }
  };

  var sendEventToAll = function () {
    ga.getAll().forEach(tracker => {
      const trackerName = tracker.get("name");
      const sendTrackerName = trackerName ? `${trackerName}.send` : 'send';

      ga(sendTrackerName, arguments[0], arguments[1], arguments[2], arguments[3])
    });
  }

  var checkingGAInterval = null;

  window.dh = window.dh || {};

  window.dh.dhGaEvents = window.dh.dhGaEvents || [];
  window.dh.gaReady = window.dh.gaReady || false;

  window.dhGa = function () {
    const ga = window[window.GoogleAnalyticsObject || 'ga'];

    if (window.ga.gaReady) {
      sendEventToAll(arguments[0], arguments[1], arguments[2], arguments[3]);
    } else {
      window.dh.dhGaEvents.push(arguments);
    }
  };

  checksStartedAt = Date.now();
  checkingGAInterval = setInterval(checkingLoadAnalytic, 1000);

  window.addEventListener('load', checkingLoadAnalytic);
};
