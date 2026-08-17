(() => {
  if (window !== window.top) return;

  const FEED_SELECTOR = '[data-testid="mainFeed"]';
  const CONTROL_ID = 'linkedin-feed-toggle';

  let hidden = true;
  let lastFeedRect = null;
  let control = null;
  let button = null;
  let scheduled = false;

  const onFeedRoute = () => location.pathname.startsWith('/feed');

  function captureFeedPosition() {
    const feed = document.querySelector(FEED_SELECTOR);
    if (!feed) return false;

    const feedRect = feed.getBoundingClientRect();
    const parentRect = feed.parentElement?.getBoundingClientRect();

    // Prefer the feed itself when measurable. When it is display:none,
    // its parent still gives us the current center-column geometry.
    const rect =
      feedRect.width > 0 ? feedRect :
      parentRect?.width > 0 ? parentRect :
      null;

    if (!rect) return false;

    lastFeedRect = {
      left: rect.left,
      width: rect.width
    };

    return true;
  }

  function applyState() {
    document.documentElement.dataset.lftFeedHidden =
      hidden ? 'true' : 'false';

    document.documentElement.dataset.lftReady = 'true';

    if (button) {
      button.textContent = hidden
        ? 'Show LinkedIn Feed'
        : 'Hide LinkedIn Feed';

      button.setAttribute('aria-pressed', hidden ? 'false' : 'true');
    }
  }

  function createControl() {
    if (control?.isConnected || !document.body) return;

    control = document.createElement('div');
    control.id = CONTROL_ID;

    button = document.createElement('button');
    button.type = 'button';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Save the current column geometry before potentially hiding the feed.
      captureFeedPosition();

      hidden = !hidden;
      applyState();

      requestAnimationFrame(() => {
        captureFeedPosition();
        positionControl();
      });
    }, true);

    control.appendChild(button);
    document.body.appendChild(control);
  }

  function positionControl() {
    if (!control) return;

    if (!onFeedRoute()) {
      control.style.display = 'none';
      return;
    }

    captureFeedPosition();

    if (!lastFeedRect) {
      control.style.display = 'none';
      return;
    }

    control.style.display = 'flex';
    control.style.left = `${lastFeedRect.left}px`;
    control.style.width = `${lastFeedRect.width}px`;
  }

  function ensureControl() {
    if (!document.body) return;

    createControl();

    const feed = document.querySelector(FEED_SELECTOR);

    if (!feed) {
      if (control) control.style.display = 'none';
      return;
    }

    /*
     * On first load the CSS keeps the feed visibility:hidden (not display:none),
     * so we can measure its position before applying the default hidden state.
     */
    if (document.documentElement.dataset.lftReady !== 'true') {
      if (!captureFeedPosition()) {
        requestAnimationFrame(scheduleEnsure);
        return;
      }

      applyState();
    }

    positionControl();
  }

  function scheduleEnsure() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      ensureControl();
    });
  }

  const observer = new MutationObserver(scheduleEnsure);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener('resize', scheduleEnsure);

  scheduleEnsure();
})();
