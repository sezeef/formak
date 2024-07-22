"use client";
import React, { createContext, useContext } from "react";
import type { Locale } from "@/lib/locale";
import type { Dictionary } from "@/lib/get-dictionary";

type DictionaryContextType = {
  dictionary: Dictionary;
  locale: Locale;
};

const DictionaryContext = createContext<DictionaryContextType | undefined>(
  undefined
);

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (context === undefined) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
};

export const DictionaryProvider: React.FC<
  DictionaryContextType & { children: React.ReactNode }
> = ({ children, dictionary, locale }) => {
  return (
    <DictionaryContext.Provider value={{ dictionary, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
};
