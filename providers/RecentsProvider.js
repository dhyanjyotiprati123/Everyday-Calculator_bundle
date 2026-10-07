import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getCalculator } from '@/data/calculators';

// Recently used calculators, persisted on-device only (works fully offline).
// Entry shape: { calculatorId, detail?, values?, usedAt }. `detail` is a short
// summary such as '₹25,000 loan'; `values` are the last inputs, restored when
// the calculator is opened again.

const STORAGE_KEY = 'everyday-tools:recents:v1';
const MAX_ENTRIES = 20;

const RecentsContext = createContext(null);

function mergeEntries(primary, secondary) {
  const seen = new Set();
  return [...primary, ...secondary]
    .filter((entry) => {
      if (!getCalculator(entry?.calculatorId) || seen.has(entry.calculatorId)) return false;
      seen.add(entry.calculatorId);
      return true;
    })
    .slice(0, MAX_ENTRIES);
}

export function RecentsProvider({ children }) {
  const [recents, setRecents] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load once on launch. Entries added before loading finishes are kept first.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const stored = raw ? JSON.parse(raw) : [];
        if (!cancelled && Array.isArray(stored)) {
          setRecents((current) => mergeEntries(current, stored));
        }
      })
      .catch(() => {
        // Unreadable storage: start with an empty history rather than failing.
      })
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep storage in sync once the initial load has completed.
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recents)).catch(() => {});
  }, [recents, isLoaded]);

  const addRecent = useCallback((calculatorId, detail, values) => {
    setRecents((current) => mergeEntries([{ calculatorId, detail, values, usedAt: Date.now() }], current));
  }, []);

  const clearRecents = useCallback(() => setRecents([]), []);

  const value = useMemo(
    () => ({ recents, isLoaded, addRecent, clearRecents }),
    [recents, isLoaded, addRecent, clearRecents]
  );

  return <RecentsContext value={value}>{children}</RecentsContext>;
}

export function useRecents() {
  const context = useContext(RecentsContext);
  if (!context) throw new Error('useRecents must be used inside <RecentsProvider>');
  return context;
}
