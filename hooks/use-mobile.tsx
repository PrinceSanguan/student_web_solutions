'use client';

import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

/**
 * Tracks whether the viewport is below the mobile breakpoint.
 *
 * Uses `useSyncExternalStore` rather than the shadcn original's
 * `useEffect` + `setState`. A media query is exactly the external store this hook
 * is designed for: React subscribes directly, gets the value on the first render
 * instead of after a second one, and the React Compiler's
 * `react-hooks/set-state-in-effect` rule has nothing to complain about.
 *
 * `getServerSnapshot` returns false because the server has no viewport — the
 * desktop layout renders first and corrects itself on hydration.
 */
function subscribe(onChange: () => void): () => void {
    const mql = window.matchMedia(QUERY);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
    return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
    return false;
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
