"use client";
import { createContext, useContext } from "react";
import type { Locale } from "@/lib/locale";
import type { Dictionary } from "@/lib/get-dictionary";
import { AppError, ERROR_CODES } from "@/lib/error";

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
    // useDictionary must be used within a DictionaryProvider
    throw new AppError(ERROR_CODES.SYS_INTERNAL_ERR);
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
