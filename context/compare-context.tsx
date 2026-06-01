'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import { COMPARE_STORAGE_KEY, MAX_COMPARE_PROPERTIES } from '@/lib/compare/constants';

interface CompareContextValue {
  ids: string[];
  count: number;
  canAdd: boolean;
  isSelected: (id: string) => boolean;
  add: (id: string) => boolean;
  remove: (id: string, options?: { silent?: boolean }) => void;
  toggle: (id: string) => void;
  clear: () => void;
  /** Drop IDs that no longer exist in the database (no toast). */
  syncValidIds: (validIds: string[]) => void;
  hydrated: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

function readStoredIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string').slice(0, MAX_COMPARE_PROPERTIES);
  } catch {
    return [];
  }
}

function writeStoredIds(ids: string[]) {
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore quota errors */
  }
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(readStoredIds());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredIds(ids);
  }, [ids, hydrated]);

  const isSelected = useCallback((id: string) => ids.includes(id), [ids]);

  const add = useCallback(
    (id: string) => {
      if (ids.includes(id)) return true;
      if (ids.length >= MAX_COMPARE_PROPERTIES) {
        toast.error('Comparison limit reached', {
          description: `You can compare up to ${MAX_COMPARE_PROPERTIES} properties at once.`,
        });
        return false;
      }
      setIds((prev) => [...prev, id]);
      toast.success('Added to comparison');
      return true;
    },
    [ids]
  );

  const remove = useCallback((id: string, options?: { silent?: boolean }) => {
    setIds((prev) => prev.filter((x) => x !== id));
    if (!options?.silent) {
      toast.message('Removed from comparison');
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      if (ids.includes(id)) {
        remove(id);
      } else {
        add(id);
      }
    },
    [ids, add, remove]
  );

  const clear = useCallback(() => {
    setIds([]);
    toast.message('Comparison cleared');
  }, []);

  const syncValidIds = useCallback((validIds: string[]) => {
    const valid = new Set(validIds);
    setIds((prev) => {
      const next = prev.filter((id) => valid.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, []);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      canAdd: ids.length < MAX_COMPARE_PROPERTIES,
      isSelected,
      add,
      remove,
      toggle,
      clear,
      syncValidIds,
      hydrated,
    }),
    [ids, isSelected, add, remove, toggle, clear, syncValidIds, hydrated]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return ctx;
}
