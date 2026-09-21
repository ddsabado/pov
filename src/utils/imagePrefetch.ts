const MAX_IN_FLIGHT_PREFETCHES = 2;

const warmedUrls = new Set<string>();
const inFlight = new Map<string, HTMLImageElement>();

const canPrefetch = () => typeof window !== 'undefined' && typeof Image !== 'undefined';

/**
 * Starts a small, best-effort image warmup for an explicit user or UI intent.
 * The returned function cancels an in-flight request when the intent goes stale.
 */
export const prefetchImage = (url: string, onSettled?: () => void) => {
  if (
    !canPrefetch() ||
    warmedUrls.has(url) ||
    inFlight.has(url) ||
    inFlight.size >= MAX_IN_FLIGHT_PREFETCHES
  ) {
    return null;
  }

  const image = new Image();
  let cancelled = false;

  const finish = (loaded: boolean) => {
    inFlight.delete(url);
    image.onload = null;
    image.onerror = null;
    if (loaded && !cancelled) warmedUrls.add(url);
    onSettled?.();
  };

  image.decoding = 'async';
  image.onload = () => finish(true);
  image.onerror = () => finish(false);
  inFlight.set(url, image);
  image.src = url;

  return () => {
    if (!inFlight.has(url)) return;
    cancelled = true;
    inFlight.delete(url);
    image.onload = null;
    image.onerror = null;
    image.src = '';
    onSettled?.();
  };
};

/**
 * Warms a stable gallery in display order without overwhelming the network.
 * Images are queued one at a time, so the topmost full-size image always wins.
 */
export const prefetchImagesInOrder = (urls: string[]) => {
  let cancelled = false;
  let nextIndex = 0;
  let activeCancel: (() => void) | null = null;
  let retryTimer: number | null = null;
  const uniqueUrls = [...new Set(urls)];

  const warmNext = () => {
    if (cancelled || activeCancel || nextIndex >= uniqueUrls.length) return;

    const url = uniqueUrls[nextIndex++];
    const cancel = prefetchImage(url, () => {
      activeCancel = null;
      warmNext();
    });

    if (cancel) {
      activeCancel = cancel;
      return;
    }

    // Another prefetch owns the network slots; preserve this gallery's order and retry.
    retryTimer = window.setTimeout(warmNext, 100);
  };

  warmNext();

  return () => {
    cancelled = true;
    if (retryTimer !== null) window.clearTimeout(retryTimer);
    activeCancel?.();
  };
};
