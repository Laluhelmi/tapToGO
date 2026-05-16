"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const MAX = 3;
const STORAGE_KEY = "tapTo:compare";

interface CompareCtx {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  canAdd: boolean;
  count: number;
  max: number;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const CompareContext = createContext<CompareCtx>({} as CompareCtx);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setIds(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const toggle = (id: string) =>
    setIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });

  const remove = (id: string) => setIds(prev => prev.filter(x => x !== id));
  const clear = () => setIds([]);
  const isSelected = (id: string) => ids.includes(id);

  return (
    <CompareContext.Provider
      value={{
        ids,
        toggle,
        remove,
        clear,
        isSelected,
        canAdd: ids.length < MAX,
        count: ids.length,
        max: MAX,
        open,
        setOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
