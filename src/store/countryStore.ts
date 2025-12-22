// store/countryStore.ts
import { create } from "zustand";

export interface Country {
  _id: string;
  name: string;
  code: string;
  capital: string;
  continent: string;
  currency: string;
  language: string;
  population: string;
  about: string;
  flag?: string;
  banner?: string;
  status: "published" | "draft";
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  totalPages: number;
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface CountryState {
  countries: Country[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;

  setCountries: (countries: Country[]) => void;
  setPagination: (pagination: PaginationMeta) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addCountry: (country: Country) => void;
  updateCountry: (id: string, country: Partial<Country>) => void;
  removeCountry: (id: string) => void;
  reset: () => void;
}

const initialState = {
  countries: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const useCountryStore = create<CountryState>((set) => ({
  ...initialState,

  setCountries: (countries) => set({ countries }),

  setPagination: (pagination) => set({ pagination }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  addCountry: (country) =>
    set((state) => ({
      countries: [country, ...state.countries],
    })),

  updateCountry: (id, updatedCountry) =>
    set((state) => ({
      countries: state.countries.map((country) =>
        country._id === id ? { ...country, ...updatedCountry } : country
      ),
    })),

  removeCountry: (id) =>
    set((state) => ({
      countries: state.countries.filter((country) => country._id !== id),
    })),

  reset: () => set(initialState),
}));