# LinkedIn Feed Toggle

A minimal Chrome Manifest V3 extension that hides LinkedIn's main feed by default.

## Behavior

- LinkedIn's main feed is hidden by default on every full page load.
- A prominent toggle stays fixed below LinkedIn's top navigation.
- The toggle horizontally tracks LinkedIn's center/feed column.
- Clicking **Show LinkedIn Feed** reveals the normal feed.
- Clicking **Hide LinkedIn Feed** hides it again.
- The control survives LinkedIn SPA navigation and feed re-renders.
- No account, backend, storage, analytics, or extra permissions.

## Install locally in Chrome

1. Unzip this folder.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `linkedin-feed-toggle` folder.
6. Open or refresh `https://www.linkedin.com/feed/`.

When you edit the extension:
1. Save your changes.
2. Click **Reload** on the extension card in `chrome://extensions`.
3. Refresh LinkedIn.

## Files

- `manifest.json` — Manifest V3 config and LinkedIn match rule.
- `content.css` — feed hiding and toggle styling.
- `content.js` — positioning, toggle behavior, and SPA resilience.

## Current LinkedIn hook

The extension intentionally relies on:

```css
[data-testid="mainFeed"]
```

If LinkedIn changes that attribute, update `FEED_SELECTOR` in `content.js` and the two matching selectors in `content.css`.
